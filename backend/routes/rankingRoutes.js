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

// GET /ranking/overall
router.get("/overall", async (req, res) => {
  try {
    const scoreExpr = await getScoreExpression();
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 100, 1000)); // max 1000
    const [rows] = await db.query(
      `SELECT 
  sp.student_id, 
  sp.*, 
  d.dept_name, 
  ${scoreExpr} AS score
FROM student_profiles sp
JOIN student_performance p ON sp.student_id = p.student_id
JOIN dept d ON sp.dept_code = d.dept_code
ORDER BY score DESC
LIMIT ?`,
      [limit]
    );
    // Add rank field
    rows.forEach((s, i) => (s.rank = i + 1));

    // Fetch and attach performance data for each student
    for (const student of rows) {
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

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /ranking/filter?department=CSE&section=A&year=3
router.get("/filter", async (req, res) => {
  const { dept, section, year } = req.query;
  try {
    const scoreExpr = await getScoreExpression();
    let where = "WHERE 1=1";
    const params = [];
    if (dept) {
      where += " AND sp.dept_code = ?";
      params.push(dept);
    }
    if (section) {
      where += " AND sp.section = ?";
      params.push(section);
    }
    if (year) {
      where += " AND sp.year = ?";
      params.push(year);
    }
    if (req.query.search) {
      where += " AND (sp.name LIKE ? OR sp.roll_number LIKE ?)";
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    const limit = Math.max(1, Math.min(parseInt(req.query.limit) || 100, 1000)); // max 1000
    const [rows] = await db.query(
      `SELECT 
  sp.*, 
  d.dept_name, 
  ${scoreExpr} AS score
FROM student_profiles sp
JOIN student_performance p ON sp.student_id = p.student_id
JOIN dept d ON sp.dept_code = d.dept_code
${where}
ORDER BY score DESC
LIMIT ?`,
      [...params, limit]
    );
    rows.forEach((s, i) => (s.rank = i + 1));
    // Attach performance for each student
    for (const student of rows) {
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
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
