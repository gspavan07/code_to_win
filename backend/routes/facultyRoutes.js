const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection

const bcrypt = require("bcryptjs");
const multer = require("multer");
const csv = require("csv-parse");
const fs = require("fs");
const path = require("path");

// Configure multer for CSV uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Only CSV files are allowed"));
    }
    cb(null, true);
  },
});

// GET /faculty/profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  try {
    const [profileResult] = await db.query(
      `SELECT fp.*, d.dept_name
        FROM faculty_profiles fp
        JOIN dept d ON fp.dept_code = d.dept_code
        WHERE fp.faculty_id = ?`,
      [userId]
    );
    if (profileResult.length === 0) {
      return res.status(404).json({ message: "Faculty profile not found" });
    }
    const [assignedSections] = await db.query(
      "SELECT year, section FROM faculty_section_assignment WHERE faculty_id = ?",
      [userId]
    );
    const [[{ total_students }]] = await db.query(
      "SELECT COUNT(*) AS total_students FROM student_profiles WHERE dept_code = ? AND year = ? AND section = ?",
      [
        profileResult[0].dept_code,
        assignedSections[0].year,
        assignedSections[0].section,
      ]
    );

    res.json({ ...profileResult[0], ...assignedSections[0], total_students });
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
      SELECT 
  sp.*, 
  u.email, 
  d.dept_name
FROM student_profiles sp
JOIN users u ON sp.student_id = u.user_id
JOIN dept d ON sp.dept_code = d.dept_code
WHERE 1=1
    `;
    const params = [];
    if (dept) {
      query += " AND sp.dept_code = ?";
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
  const { stdId, name, dept, year, section, degree, cgpa } = req.body;
  console.log(req.body);
  console.log(req.body.stdId);
  const connection = await db.getConnection(); // Use a connection from the pool

  try {
    await connection.beginTransaction();

    const hashed = await bcrypt.hash("pass123", 10);

    // 1. Insert into users table
    const [result] = await connection.query(
      `INSERT INTO users (user_id, email, password, role) VALUES (?,?, ?, ?)`,
      [stdId, stdId + "@aec.edu.in", hashed, "student"]
    );

    // 2. Insert into student_profiles table
    await connection.query(
      `INSERT INTO student_profiles 
        (student_id, name, dept_code, year, section, degree, cgpa)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [stdId, name, dept, year, section, degree, cgpa]
    );

    await connection.commit();
    res.status(200).json({ message: "Student added successfully" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.errno });
  } finally {
    connection.release();
  }
});
//P0ST /faculty/bulk-upload
router.post("/bulk-import", upload.single("file"), async (req, res) => {
  const { dept, year, section } = req.body;
  const connection = await db.getConnection();

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const results = [];
    const errors = [];

    // Read and parse CSV file
    const fileRows = await new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(req.file.path)
        .pipe(csv.parse({ columns: true, trim: true }))
        .on("data", (row) => rows.push(row))
        .on("error", (error) => reject(error))
        .on("end", () => resolve(rows));
    });

    // console.log(fileRows);
    await connection.beginTransaction();

    for (const row of fileRows) {
      const hashed = await bcrypt.hash("pass123", 10);
      const stdId = row["Student Id"];
      const name = row["Student Name"];
      const email = `${stdId}@aec.edu.in`;
      try {
        console.log(name, stdId, email);
        // Insert into users table
        await connection.query(
          "INSERT INTO users (user_id, email, password, role) VALUES (?, ?, ?, ?)",
          [stdId, email, hashed, "student"]
        );

        // Insert into student_profiles table
        await connection.query(
          `INSERT INTO student_profiles 
           (student_id, name, dept_code, year, section, degree, cgpa)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [stdId, name, dept, year, section, row.Degree, row.CGPA]
        );

        results.push({ stdId: row.stdId, status: "success" });
      } catch (err) {
        console.error(err);
        errors.push({
          error:
            err.code === "ER_DUP_ENTRY"
              ? `Student with ID ${stdId} already exists`
              : err.message,
        });
      }
    }

    // Delete the temporary file
    fs.unlinkSync(req.file.path);

    if (errors.length === fileRows.length) {
      // If all entries failed, rollback
      await connection.rollback();
      return res.status(400).json({
        message: "Bulk import failed",
        errors,
      });
    }

    // Commit if at least some entries succeeded
    await connection.commit();

    res.json({
      message: "Bulk import completed",
      totalProcessed: fileRows.length,
      successful: results.length,
      failed: errors.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    await connection.rollback();
    console.error(err);

    // Delete the temporary file in case of error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    connection.release();
  }
});

// GET /faculty/coding-profile-requests?dept=CSE&year=3&section=A
router.get("/coding-profile-requests", async (req, res) => {
  const { dept, year, section } = req.query;
  try {
    const [requests] = await db.query(
      `SELECT 
  scp.*, 
  sp.name, 
  sp.year, 
  sp.section, 
  d.dept_name, 
  cp.name AS platform_name
FROM student_coding_profiles scp
JOIN student_profiles sp ON scp.student_id = sp.student_id
JOIN coding_platforms cp ON scp.platform_id = cp.platform_id
JOIN dept d ON sp.dept_code = d.dept_code
WHERE sp.dept_code = ? AND sp.year = ? AND sp.section = ? 
  AND scp.verification_status = 'pending'`,
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
