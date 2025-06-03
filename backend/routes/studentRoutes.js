const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection

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
      `SELECT cp.name AS platform, scp.profile_username, scp.is_verified
       FROM student_coding_profiles scp
       JOIN coding_platforms cp ON scp.platform_id = cp.platform_id
       WHERE scp.student_id = ?`,
      [userId]
    );

    // 3. Get performance data
    const [perfResult] = await db.query(
      `SELECT * FROM student_performance WHERE student_id = ?`,
      [userId]
    );
    const performance = perfResult.length > 0 ? perfResult[0] : null;

    // 4. Compute score and rank using SQL
    const [rankRow] = await db.query(
      `
  SELECT score, overall_rank, department_rank, year_rank, section_rank
  FROM student_ranks WHERE student_id = ?`,
      [userId]
    );
    const { score, overall_rank, department_rank, year_rank, section_rank } =
      rankRow[0];

    res.json({
      ...profile,
      coding_profiles: platforms,
      performance,
      score,
      overall_rank,
      department_rank,
      year_rank,
      section_rank,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/profile", async (req, res) => {
  const {
    userId,
    name,
    batch,
    college,
    degree,
    cgpa,
    skills,
    experience,
    achievements,
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE student_profiles 
             SET name = ?, batch = ?, college = ?, degree = ?, cgpa = ?, skills = ?, experience = ?, achievements = ?
             WHERE student_id = ?`,
      [
        name,
        batch,
        college,
        degree,
        cgpa,
        skills,
        experience,
        achievements,
        userId,
      ]
    );
    res.json({ message: "Profile updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Coding platform profile submission
router.post("/coding-profile", async (req, res) => {
  const userId = req.user.userId;
  const { platform_id, profile_username } = req.body;

  try {
    const [existing] = await db
      .promise()
      .query(
        `SELECT * FROM student_coding_profiles WHERE student_id = ? AND platform_id = ?`,
        [userId, platform_id]
      );

    if (existing.length > 0) {
      await db.promise().query(
        `UPDATE student_coding_profiles 
                 SET profile_username = ?, is_verified = 0 
                 WHERE student_id = ? AND platform_id = ?`,
        [profile_username, userId, platform_id]
      );
    } else {
      await db.promise().query(
        `INSERT INTO student_coding_profiles (student_id, platform_id, profile_username) 
                 VALUES (?, ?, ?)`,
        [userId, platform_id, profile_username]
      );
    }

    res.json({ message: "Profile submitted for verification" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Performance data
router.get("/performance/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [data] = await db.query(
      `SELECT * FROM student_performance WHERE student_id = ?`,
      [userId]
    );

    if (data.length === 0)
      return res.status(404).json({ message: "No performance data found" });

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
      p.problems_cf;

    const combined = {
      totalSolved,
      totalContests: p.contests_cf + p.contests_gfg,
      stars_cf: p.stars_cf,
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
      codeforces: {
        problems: p.problems_cf,
        contests: p.contests_cf,
        stars: p.stars_cf,
      },
      hackerrank: {
        badges: p.badges_hr,
      },
    };

    res.json({ combined, platformWise });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
