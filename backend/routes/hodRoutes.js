const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const bcrypt = require("bcryptjs");
// GET /faculty/profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  try {
    const [profileResult] = await db.query(
      "SELECT * FROM hod_profiles WHERE hod_id = ?",
      [userId]
    );
    if (profileResult.length === 0) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }

    res.json({ ...profileResult[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /faculty/profile
router.put("/profile", async (req, res) => {
  const { userId, name, department, section } = req.body;
  try {
    await db.query(
      "UPDATE faculty_profiles SET name = ?, department = ?, section = ? WHERE faculty_id = ?",
      [name, department, section, userId]
    );
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /faculty/students?dept=CSE&year=3&section=A
router.get("/students", async (req, res) => {
  const { dept, year, section } = req.query;
  try {
    let query = `
      SELECT sp.*, u.email 
      FROM student_profiles sp
      JOIN users u ON sp.student_id = u.user_id
      WHERE 1=1
    `;
    const params = [];
    if (dept) {
      query += " AND sp.dept = ?";
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
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
