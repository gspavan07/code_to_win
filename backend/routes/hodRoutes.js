const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection

// GET /hod/profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  try {
    // Get HOD profile
    const [profileResult] = await db.query(
      `SELECT hp.*, d.dept_name
        FROM hod_profiles hp
        JOIN dept d ON hp.dept_code = d.dept_code
        WHERE hp.hod_id = ?`,
      [userId]
    );
    if (profileResult.length === 0) {
      return res.status(404).json({ message: "HOD profile not found" });
    }
    const profile = profileResult[0];
    // Get department from profile
    const dept = profile.dept_code;

    // Get total students in dept
    const [[{ total_students }]] = await db.query(
      "SELECT COUNT(*) AS total_students FROM student_profiles WHERE dept_code = ?",
      [dept]
    );

    // Get total faculty in dept
    const [[{ total_faculty }]] = await db.query(
      "SELECT COUNT(*) AS total_faculty FROM faculty_profiles WHERE dept_code = ?",
      [dept]
    );

    // Get total unique sections in dept (across all years)
    const [[{ total_sections }]] = await db.query(
      "SELECT COUNT(DISTINCT section) AS total_sections FROM student_profiles WHERE dept_code = ?",
      [dept]
    );

    res.json({
      ...profile,
      total_students,
      total_faculty,
      total_sections,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /hod/profile
router.put("/profile", async (req, res) => {
  const { userId, name, department, section } = req.body;
  try {
    await db.query(
      "UPDATE hod_profiles SET name = ?, dept = ? WHERE hod_id = ?",
      [name, department, section, userId]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /hod/students?dept=CSE&year=3&section=A
router.get("/students", async (req, res) => {
  const { dept, year, section } = req.query;
  try {
    let query = `
      SELECT 
        sp.*, 
        u.email, 
        d.dept_name
      FROM student_profiles sp
      JOIN users u ON sp.student_id = u.user_id
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

    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /hod/faculty?dept=CSE
router.get("/faculty", async (req, res) => {
  const { dept } = req.query;
  try {
    let query = `
      SELECT fp.*,
             fsa.year, fsa.section
      FROM faculty_profiles fp
      JOIN faculty_section_assignment fsa ON fp.faculty_id = fsa.faculty_id
      WHERE 1=1
    `;

    const params = [];

    if (dept) {
      query += " AND fp.dept_code = ?";
      params.push(dept);
    }

    const [faculty] = await db.query(query, params);
    res.json(faculty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /hod/assign-faculty
router.post("/assign-faculty", async (req, res) => {
  const { faculty_id, dept_code, year, section } = req.body;
  if (!faculty_id || !dept_code || !year || !section) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    // Insert assignment
    await db.query(
      "UPDATE faculty_section_assignment SET year=?, section=? WHERE faculty_id=?",
      [year, section, faculty_id]
    );
    res.json({ message: "Faculty assigned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
