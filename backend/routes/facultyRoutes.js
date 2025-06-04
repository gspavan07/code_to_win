const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const bcrypt = require("bcryptjs");
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

// Add a new student (first to users, then to student_profiles)
router.post("/add-student", async (req, res) => {
  const {
    stdId,
    name,
    dept,
    year,
    section,
    batch,
    degree,
    college,
    cgpa,
    email,
  } = req.body;

  const connection = await db.getConnection(); // Use a connection from the pool

  try {
    await connection.beginTransaction();

    const hashed = await bcrypt.hash("pass123", 10);

    // 1. Insert into users table
    const [result] = await connection.query(
      `INSERT INTO users (user_id,email, password_hash, role) VALUES (?,?, ?, ?)`,
      [stdId, email, hashed, "student"]
    );
    const userId = result.insertId;

    // 2. Insert into student_profiles table
    await connection.query(
      `INSERT INTO student_profiles 
        (student_id, name, roll_number, dept, year, section, batch, degree, college, cgpa)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        roll_number,
        dept,
        year,
        section,
        batch,
        degree,
        college,
        cgpa,
      ]
    );

    await connection.commit();
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    await connection.rollback();
    // console.error(err);
    res.status(500).json({ message: "Server error", error: err.errno });
  } finally {
    connection.release();
  }
});

// GET /faculty/coding-profile-requests?dept=CSE&year=3&section=A
router.get("/coding-profile-requests", async (req, res) => {
  const { dept, year, section } = req.query;
  try {
    const [requests] = await db.query(
      `SELECT scp.*, sp.name, sp.dept, sp.year, sp.section, cp.name AS platform_name
       FROM student_coding_profiles scp
       JOIN student_profiles sp ON scp.student_id = sp.student_id
       JOIN coding_platforms cp ON scp.platform_id = cp.platform_id
       WHERE sp.dept = ? AND sp.year = ? AND sp.section = ? AND scp.verification_status = 'pending'`,
      [dept, year, section]
    );
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /faculty/verify-coding-profile
router.post("/verify-coding-profile", async (req, res) => {
  const { student_id, platform_id, action, faculty_id, comment } = req.body;
  // action: 'accept' or 'reject'
  try {
    let status = action === "accept" ? "accepted" : "rejected";
    let is_verified = action === "accept" ? 1 : 0;
    await db.query(
      `UPDATE student_coding_profiles 
       SET is_verified = ?, verification_status = ?, verified_by = ?, verification_comment = ?
       WHERE student_id = ? AND platform_id = ?`,
      [
        is_verified,
        status,
        faculty_id,
        comment || null,
        student_id,
        platform_id,
      ]
    );
    res.json({ message: `Profile ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
