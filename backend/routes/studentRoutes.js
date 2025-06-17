const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const { logger } = require("../utils"); // <-- Add logger

// Profile routes
router.get("/profile", async (req, res) => {
  const userId = req.query.userId;
  logger.info(`Fetching student profile for userId: ${userId}`);
  try {
    // 1. Get student profile
    const [profileResult] = await db.query(
      `SELECT sp.*, d.dept_name
        FROM student_profiles sp
        JOIN dept d ON sp.dept_code = d.dept_code
        WHERE sp.student_id = ?`,
      [userId]
    );
    if (profileResult.length === 0) {
      logger.warn(`Profile not found for userId: ${userId}`);
      return res.status(404).json({ message: "Profile not found" });
    }
    const profile = profileResult[0];

    // 2. Get coding platform usernames
    const [codingProfileRows] = await db.query(
      `SELECT 
    leetcode_id, leetcode_status, leetcode_verified,
    codechef_id, codechef_status, codechef_verified,
    geekforgeeks_id, geekforgeeks_status, geekforgeeks_verified,
    hackerrank_id, hackerrank_status, hackerrank_verified,
    verified_by
   FROM student_coding_profiles
   WHERE student_id = ?`,
      [userId]
    );
    const coding_profiles =
      codingProfileRows.length > 0 ? codingProfileRows[0] : null;

    // 3. Get performance data
    const [data] = await db.query(
      `SELECT * FROM student_performance WHERE student_id = ?`,
      [userId]
    );
    if (data.length === 0) {
      logger.warn(`No performance data found for userId: ${userId}`);
      return res.status(404).json({ message: "No performance data found" });
    }

    const p = data[0];
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
        contests: p.contests_lc,
        badges: p.badges_lc,
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
        badges: p.badges_cc,
      },
      hackerrank: {
        badges: p.stars_hr,
      },
    };
    logger.info(`Student profile fetched for userId: ${userId}`);
    res.json({
      ...profile,
      coding_profiles,
      performance: {
        combined,
        platformWise,
      },
    });
  } catch (err) {
    logger.error(
      `Error fetching student profile for userId=${userId}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update-profile", async (req, res) => {
  const { userId, name } = req.body;
  logger.info(`Updating student profile: userId=${userId}, name=${name}`);
  try {
    await db.promise().query(
      `UPDATE student_profiles 
             SET name = ?
             WHERE student_id = ?`,
      [name, userId]
    );
    logger.info(`Student profile updated for userId: ${userId}`);
    res.json({ message: "Profile updated" });
  } catch (err) {
    logger.error(
      `Error updating student profile for userId=${userId}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

// POST /student/coding-profile
router.post("/coding-profile", async (req, res) => {
  const { userId, leetcode_id, codechef_id, geekforgeeks_id, hackerrank_id } =
    req.body;
  logger.info(`Submitting coding profiles for verification: userId=${userId}`);
  try {
    // Check if the student already has a coding profile row
    const [existing] = await db.query(
      `SELECT * FROM student_coding_profiles WHERE student_id = ?`,
      [userId]
    );

    // Build dynamic update fields
    const fields = [];
    const values = [];

    if (leetcode_id !== undefined) {
      fields.push(
        "leetcode_id = ?",
        "leetcode_status = 'pending'",
        "leetcode_verified = 0"
      );
      values.push(leetcode_id);
    }
    if (codechef_id !== undefined) {
      fields.push(
        "codechef_id = ?",
        "codechef_status = 'pending'",
        "codechef_verified = 0"
      );
      values.push(codechef_id);
    }
    if (geekforgeeks_id !== undefined) {
      fields.push(
        "geekforgeeks_id = ?",
        "geekforgeeks_status = 'pending'",
        "geekforgeeks_verified = 0"
      );
      values.push(geekforgeeks_id);
    }
    if (hackerrank_id !== undefined) {
      fields.push(
        "hackerrank_id = ?",
        "hackerrank_status = 'pending'",
        "hackerrank_verified = 0"
      );
      values.push(hackerrank_id);
    }

    if (existing.length > 0) {
      if (fields.length > 0) {
        await db.query(
          `UPDATE student_coding_profiles SET ${fields.join(
            ", "
          )} WHERE student_id = ?`,
          [...values, userId]
        );
        logger.info(`Updated coding profiles for userId: ${userId}`);
      }
    } else {
      // Insert all fields, missing ones as null
      await db.query(
        `INSERT INTO student_coding_profiles 
         (student_id, leetcode_id, leetcode_status, leetcode_verified,
          codechef_id, codechef_status, codechef_verified,
          geekforgeeks_id, geekforgeeks_status, geekforgeeks_verified,
          hackerrank_id, hackerrank_status, hackerrank_verified)
         VALUES (?, ?, 'pending', 0, ?, 'pending', 0, ?, 'pending', 0, ?, 'pending', 0)`,
        [
          userId,
          leetcode_id || null,
          codechef_id || null,
          geekforgeeks_id || null,
          hackerrank_id || null,
        ]
      );
      logger.info(`Inserted coding profiles for userId: ${userId}`);
    }

    res.json({ message: "Coding profiles submitted for verification" });
  } catch (err) {
    logger.error(
      `Error submitting coding profiles for userId=${userId}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
