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
      `SELECT sp.student_id, sp.*,
              ${scoreExpr} AS score
       FROM student_profiles sp
       JOIN student_performance p ON sp.student_id = p.student_id
       ORDER BY score DESC
       LIMIT ?`,
      [limit]
    );
    // Add rank field
    rows.forEach((s, i) => (s.rank = i + 1));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /ranking/filter?department=CSE&section=A&year=3
router.get("/filter", async (req, res) => {
  const { department, section, year } = req.query;
  try {
    const scoreExpr = await getScoreExpression();
    let where = "WHERE 1=1";
    const params = [];
    if (department) {
      where += " AND sp.dept = ?";
      params.push(department);
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
      `SELECT sp.*,
              ${scoreExpr} AS score
       FROM student_profiles sp
       JOIN student_performance p ON sp.student_id = p.student_id
       ${where}
       ORDER BY score DESC
       LIMIT ?`,
      [...params, limit]
    );
    rows.forEach((s, i) => (s.rank = i + 1));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
