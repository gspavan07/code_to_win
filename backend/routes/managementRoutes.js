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

// Add a new student (first to users, then to student_profiles)
router.post("/add-student", async (req, res) => {
  const { stdId, name, dept, year, section, degree, cgpa } = req.body;
  console.log(req.body);
  console.log(req.body.stdId);
  const connection = await db.getConnection(); // Use a connection from the pool

  try {
    await connection.beginTransaction();

    const hashed = await bcrypt.hash("student@aditya", 10);

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
    res.status(500).json({
      message:
        err.code === "ER_DUP_ENTRY"
          ? `Student with ID ${facultyId} already exists`
          : err.message,
      error: err.errno,
    });
  } finally {
    connection.release();
  }
});
// Add a new faculty
router.post("/add-faculty", async (req, res) => {
  const { facultyId, name, dept, email } = req.body;

  const connection = await db.getConnection(); // Use a connection from the pool

  try {
    await connection.beginTransaction();

    const hashed = await bcrypt.hash("faculty@aditya", 10);

    // 1. Insert into users table
    const [result] = await connection.query(
      `INSERT INTO users (user_id, email, password, role) VALUES (?,?, ?, ?)`,
      [facultyId, email, hashed, "faculty"]
    );

    // 2. Insert into student_profiles table
    await connection.query(
      `INSERT INTO faculty_profiles 
        (faculty_id, name, dept_code)
        VALUES (?, ?, ?)`,
      [facultyId, name, dept]
    );

    await connection.commit();
    res.status(200).json({ message: "Faculty added successfully" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({
      message:
        err.code === "ER_DUP_ENTRY"
          ? `Faculty with ID ${facultyId} already exists`
          : err.message,
      error: err.errno,
    });
  } finally {
    connection.release();
  }
});

// Add a new hod
router.post("/add-hod", async (req, res) => {
  const { hodId, name, dept, email } = req.body;

  const connection = await db.getConnection(); // Use a connection from the pool

  try {
    await connection.beginTransaction();

    const hashed = await bcrypt.hash("hod@aditya", 10);

    // 1. Insert into users table
    const [result] = await connection.query(
      `INSERT INTO users (user_id, email, password, role) VALUES (?,?, ?, ?)`,
      [hodId, email, hashed, "hod"]
    );

    // 2. Insert into student_profiles table
    await connection.query(
      `INSERT INTO hod_profiles 
        (hod_id, name, dept_code)
        VALUES (?, ?, ?)`,
      [hodId, name, dept]
    );

    await connection.commit();
    res.status(200).json({ message: "HOD added successfully" });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({
      message:
        err.code === "ER_DUP_ENTRY"
          ? `HOD with ID ${hodId} already exists`
          : err.message,
      error: err.errno,
    });
  } finally {
    connection.release();
  }
});

//P0ST /api/bulk-import-student
router.post("/bulk-import-student", upload.single("file"), async (req, res) => {
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
      const hashed = await bcrypt.hash("student@aditya", 10);
      const stdId = row["Student Id"];
      const name = row["Student Name"];
      const email = `${stdId}@aec.edu.in`;
      try {
        // Insert into users table
        await connection.query(
          "INSERT INTO users (user_id, email, password, role) VALUES (?, ?, ?, ?)",
          [stdId, email, hashed, "student"]
        );
        if (stdId === "" || name == "" || row.Degree == "" || row.CGPA == "") {
          errors.push({
            error: `Check the fields in CSV and upload.`,
          });
        }
        // Insert into student_profiles table
        await connection.query(
          `INSERT INTO student_profiles 
           (student_id, name, dept_code, year, section, degree, cgpa)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [stdId, name, dept, year, section, row.Degree, row.CGPA]
        );

        results.push({ stdId: stdId, status: "success" });
      } catch (err) {
        console.error(err);
        errors.push({
          error:
            err.code === "ER_DUP_ENTRY"
              ? `Student with ID ${stdId} already exists`
              : err.code === "ER_BAD_NULL_ERROR"
              ? `Check fields in CSV and upload again`
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

//P0ST /api/bulk-import-faculty
router.post("/bulk-import-faculty", upload.single("file"), async (req, res) => {
  const { dept } = req.body;
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
      const hashed = await bcrypt.hash("faculty@aditya", 10);
      const facultyId = row["Faculty Id"];
      const name = row["Faculty Name"];
      const email = `${name}@aec.edu.in`;
      try {
        // Insert into users table
        await connection.query(
          "INSERT INTO users (user_id, email, password, role) VALUES (?, ?, ?, ?)",
          [facultyId, email, hashed, "faculty"]
        );

        // Insert into student_profiles table
        await connection.query(
          `INSERT INTO faculty_profiles 
           (faculty_id, name, dept_code)
           VALUES (?, ?, ?)`,
          [facultyId, name, dept]
        );

        results.push({ facultyId: facultyId, status: "success" });
      } catch (err) {
        console.error(err);
        errors.push({
          error:
            err.code === "ER_DUP_ENTRY"
              ? `Faculty with ID ${facultyId} already exists`
              : err.code === "ER_BAD_NULL_ERROR"
              ? `Check fields in CSV and upload again`
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

//P0ST /api/reset-password
router.post("/reset-password", async (req, res) => {
  const { userId, role, password } = req.body;
  if (!userId || !role || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const connection = await db.getConnection();
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await connection.query(
      "UPDATE users SET password = ? WHERE user_id = ? AND role = ?",
      [hashed, userId, role]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  } finally {
    connection.release();
  }
});
module.exports = router;
