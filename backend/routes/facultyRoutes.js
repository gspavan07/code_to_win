const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const { logger } = require("../utils"); // <-- Add logger
const {
  scrapeAndUpdatePerformance,
} = require("../scrapers/scrapeAndUpdatePerformance");

// GET /faculty/profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  logger.info(`Fetching faculty profile for userId: ${userId}`);
  try {
    const [profileResult] = await db.query(
      `SELECT fp.*, d.dept_name
        FROM faculty_profiles fp
        JOIN dept d ON fp.dept_code = d.dept_code
        WHERE fp.faculty_id = ?`,
      [userId]
    );
    if (profileResult.length === 0) {
      logger.warn(`Faculty profile not found for userId: ${userId}`);
      return res.status(404).json({ message: "Faculty profile not found" });
    }
    const [assignedSections] = await db.query(
      "SELECT year, section FROM faculty_section_assignment WHERE faculty_id = ?",
      [userId]
    );

    const [[{ total_students }]] = await db.query(
      "SELECT COUNT(*) AS total_students FROM student_profiles WHERE dept_code = ? AND year = ? AND section = ?",
      [
        profileResult[0].dept_code,
        assignedSections[0].year,
        assignedSections[0].section,
      ]
    );

    logger.info(`Faculty profile fetched for userId: ${userId}`);
    res.json({ ...profileResult[0], ...assignedSections[0], total_students });
  } catch (err) {
    logger.error(
      `Error fetching faculty profile for userId=${userId}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /faculty/profile
router.put("/profile", async (req, res) => {
  const { userId, name, department, section } = req.body;
  logger.info(
    `Updating faculty profile: userId=${userId}, name=${name}, department=${department}, section=${section}`
  );
  try {
    await db.query(
      "UPDATE faculty_profiles SET name = ?, department = ?, section = ? WHERE faculty_id = ?",
      [name, department, section, userId]
    );
    logger.info(`Faculty profile updated for userId: ${userId}`);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    logger.error(
      `Error updating faculty profile for userId=${userId}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

// GET /faculty/students?dept=CSE&year=3&section=A
router.get("/students", async (req, res) => {
  const { dept, year, section } = req.query;
  logger.info(
    `Fetching students: dept=${dept}, year=${year}, section=${section}`
  );
  try {
    let query = `
      SELECT 
        sp.*, 
        d.dept_name
      FROM student_profiles sp
      JOIN dept d ON sp.dept_code = d.dept_code
      WHERE 1=1
    `;
    const params = [];
    if (dept) {
      query += " AND sp.dept_code = ?";
      params.push(dept);
    }
    if (year) {
      query += " AND sp.year = ?";
      params.push(year);
    }
    if (section) {
      query += " AND sp.section = ?";
      params.push(section);
    }

    const [students] = await db.query(query, params);

    // Attach performance for each student
    for (const student of students) {
      const [perfRows] = await db.query(
        `SELECT * FROM student_performance WHERE student_id = ?`,
        [student.student_id]
      );
      if (perfRows.length > 0) {
        const p = perfRows[0];
        const totalSolved =
          p.easy_lc +
          p.medium_lc +
          p.hard_lc +
          p.school_gfg +
          p.basic_gfg +
          p.easy_gfg +
          p.medium_gfg +
          p.hard_gfg +
          p.problems_cc;

        const combined = {
          totalSolved: totalSolved,
          totalContests: p.contests_cc + p.contests_gfg,
          stars_cc: p.stars_cc,
          badges_hr: p.badges_hr,
          last_updated: p.last_updated,
        };

        const platformWise = {
          leetcode: {
            easy: p.easy_lc,
            medium: p.medium_lc,
            hard: p.hard_lc,
          },
          gfg: {
            school: p.school_gfg,
            basic: p.basic_gfg,
            easy: p.easy_gfg,
            medium: p.medium_gfg,
            hard: p.hard_gfg,
            contests: p.contests_gfg,
          },
          codechef: {
            problems: p.problems_cc,
            contests: p.contests_cc,
            stars: p.stars_cc,
          },
          hackerrank: {
            badges: p.stars_hr,
          },
        };

        student.performance = {
          combined,
          platformWise,
        };
      }
    }

    logger.info(`Fetched ${students.length} students`);
    res.json(students);
  } catch (err) {
    logger.error(`Error fetching students: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /faculty/coding-profile-requests?dept=CSE&year=3&section=A
router.get("/coding-profile-requests", async (req, res) => {
  const { dept, year, section } = req.query;
  logger.info(
    `Fetching coding profile requests: dept=${dept}, year=${year}, section=${section}`
  );
  try {
    const [requests] = await db.query(
      `SELECT 
        scp.*, 
        sp.name, 
        sp.year, 
        sp.section, 
        d.dept_name
      FROM student_coding_profiles scp
      JOIN student_profiles sp ON scp.student_id = sp.student_id
      JOIN dept d ON sp.dept_code = d.dept_code
      WHERE sp.dept_code = ? AND sp.year = ? AND sp.section = ?
        AND (
          scp.leetcode_status = 'pending'
          OR scp.codechef_status = 'pending'
          OR scp.geekforgeeks_status = 'pending'
          OR scp.hackerrank_status = 'pending'
        )`,
      [dept, year, section]
    );
    logger.info(`Fetched ${requests.length} coding profile requests`);
    res.json(requests);
  } catch (err) {
    logger.error(`Error fetching coding profile requests: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /faculty/verify-coding-profile
router.post("/verify-coding-profile", async (req, res) => {
  const { student_id, platform, action, faculty_id, comment } = req.body;
  logger.info(
    `Verify coding profile: student_id=${student_id}, platform=${platform}, action=${action}, faculty_id=${faculty_id}`
  );
  try {
    let status = action === "accept" ? "accepted" : "rejected";
    let is_verified = action === "accept" ? 1 : 0;
    const statusField = `${platform}_status`;
    const verifiedField = `${platform}_verified`;

    // Update verification status
    await db.query(
      `UPDATE student_coding_profiles
       SET ${statusField} = ?, ${verifiedField} = ?, verified_by = ?
       WHERE student_id = ?`,
      [status, is_verified, faculty_id, student_id]
    );

    logger.info(`Profile ${platform} ${status} for student_id=${student_id}`);

    // Respond immediately
    res.json({ message: `Profile ${platform} ${status}` });

    // If accepted, scrape and update performance in background
    if (action === "accept") {
      const [rows] = await db.query(
        `SELECT ${platform}_id FROM student_coding_profiles WHERE student_id = ?`,
        [student_id]
      );
      const username = rows[0] && rows[0][`${platform}_id`];
      if (username) {
        // Run in background, don't await
        scrapeAndUpdatePerformance(student_id, platform, username).catch(
          (err) =>
            logger.error(
              `Scraping error for student_id=${student_id}, platform=${platform}: ${err.message}`
            )
        );
      }
    }
  } catch (err) {
    logger.error(
      `Error verifying coding profile for student_id=${student_id}, platform=${platform}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
