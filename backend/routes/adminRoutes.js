const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const bcrypt = require("bcryptjs");

// GET /admin/profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  try {
    // Get admin profile
    const [profileResult] = await db.query(
      "SELECT * FROM admin_profiles WHERE admin_id = ?",
      [userId]
    );
    if (profileResult.length === 0) {
      return res.status(404).json({ message: "Admin profile not found" });
    }
    const profile = profileResult[0];

    // Get department from profile
    const dept = profile.dept;

    // Get total students in dept
    const [[{ total_students }]] = await db.query(
      "SELECT COUNT(*) AS total_students FROM student_profiles",
      [dept]
    );

    // Get total faculty in dept
    const [[{ total_faculty }]] = await db.query(
      "SELECT COUNT(*) AS total_faculty FROM faculty_profiles",
      [dept]
    );

    // Get total HODs in dept
    const [[{ total_hod }]] = await db.query(
      "SELECT COUNT(*) AS total_hod FROM hod_profiles",
      [dept]
    );

    res.json({
      ...profile,
      total_students,
      total_faculty,
      total_hod,
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

// GET /hod/faculty?dept=CSE
router.get("/faculty", async (req, res) => {
  const { dept } = req.query;
  try {
    let query = `
      SELECT fp.*, u.email 
      FROM faculty_profiles fp
      JOIN users u ON fp.faculty_id = u.user_id
      WHERE 1=1
    `;
    const params = [];
    if (dept) {
      query += " AND fp.dept = ?";
      params.push(dept);
    }
    const [faculty] = await db.query(query, params);
    res.json(faculty);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
