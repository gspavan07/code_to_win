const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection

// GET /faculty/profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  try {
    const [profileResult] = await db.query(
      "SELECT * FROM faculty_profiles WHERE faculty_id = ?",
      [userId]
    );
    if (profileResult.length === 0) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }
    const [assignedSections] = await db.query(
      "SELECT year, section FROM faculty_section_assignment WHERE faculty_id = ?",
      [userId]
    );

    res.json({ ...profileResult[0], ...assignedSections[0] });
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

// POST /faculty/verify-profile
router.post("/verify-profile", async (req, res) => {
  const { studentId, platformName, verifiedBy } = req.body;
  try {
    const [platformResult] = await db.query(
      "SELECT platform_id FROM coding_platforms WHERE name = ?",
      [platformName]
    );
    if (platformResult.length === 0) {
      return res.status(404).json({ message: "Invalid platform" });
    }

    const platformId = platformResult[0].platform_id;

    const [existing] = await db.query(
      "SELECT * FROM student_coding_profiles WHERE student_id = ? AND platform_id = ?",
      [studentId, platformId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: "Profile not found for student" });
    }

    await db.query(
      `UPDATE student_coding_profiles 
       SET is_verified = true, verified_by = ?
       WHERE student_id = ? AND platform_id = ?`,
      [verifiedBy, studentId, platformId]
    );

    res.json({ message: "Profile verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
