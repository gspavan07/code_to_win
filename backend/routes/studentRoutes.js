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
    const [platforms] = await db.query(
      `SELECT cp.name AS platform, scp.*
       FROM student_coding_profiles scp
       JOIN coding_platforms cp ON scp.platform_id = cp.platform_id
       WHERE scp.student_id = ?`,
      [userId]
    );

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
        badges: p.badges_hr,
      },
    };

    res.json({
      ...profile,
      rank,
      coding_profiles: platforms,
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
  const { userId, platform_id, profile_username } = req.body; // get userId from body
  console.log("Received data:", req.body);
  try {
    // Set status to 'pending' on every update
    const [existing] = await db.query(
      `SELECT * FROM student_coding_profiles WHERE student_id = ? AND platform_id = ?`,
      [userId, platform_id]
    );

    if (existing.length > 0) {
      await db.query(
        `UPDATE student_coding_profiles 
         SET profile_username = ?, is_verified = 0, verification_status = 'pending', verified_by = NULL, verification_comment = NULL
         WHERE student_id = ? AND platform_id = ?`,
        [profile_username, userId, platform_id]
      );
    } else {
      await db.query(
        `INSERT INTO student_coding_profiles (student_id, platform_id, profile_username, is_verified, verification_status) 
         VALUES (?, ?, ?, 0, 'pending')`,
        [userId, platform_id, profile_username]
      );
    }

    res.json({ message: "Profile submitted for verification" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
