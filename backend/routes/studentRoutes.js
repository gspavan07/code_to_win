const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection

// Calculate score expression for ranking
async function getScoreExpression() {
  const [gradingData] = await db.query("SELECT * FROM grading_system");
  // Example: (p.badges_hr * 5) + (p.basic_gfg * 1) + ...
  return gradingData
    .map((row) => `(p.${row.metric} * ${row.points})`)
    .join(" + ");
}

// Profile routes
router.get("/profile", async (req, res) => {
  const userId = req.query.userId;

  try {
    // 1. Get student profile
    const [profileResult] = await db.query(
      "SELECT * FROM student_profiles WHERE student_id = ?",
      [userId]
    );
    if (profileResult.length === 0) {
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
    if (data.length === 0)
      return res.status(404).json({ message: "No performance data found" });
    const scoreExpr = await getScoreExpression();
    // Get all students ordered by score
    const [rows] = await db.query(
      `SELECT sp.student_id, sp.*,
              ${scoreExpr} AS score
       FROM student_profiles sp
       JOIN student_performance p ON sp.student_id = p.student_id
       ORDER BY score DESC`
    );
    // Find the rank of the requested student
    let rank = null;
    let student = null;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].student_id == userId) {
        rank = i + 1;
        student = rows[i];
        break;
      }
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

    res.json({
      ...profile,
      rank,
      coding_profiles,
      performance: {
        combined,
        platformWise,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile-update", async (req, res) => {
  const { userId, name } = req.body;

  try {
    await db.promise().query(
      `UPDATE student_profiles 
             SET name = ?
             WHERE student_id = ?`,
      [name, userId]
    );
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Coding platform profile submission
// POST /student/coding-profile
router.post("/coding-profile", async (req, res) => {
  const { userId, leetcode_id, codechef_id, geekforgeeks_id, hackerrank_id } =
    req.body;
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
    }

    res.json({ message: "Coding profiles submitted for verification" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
