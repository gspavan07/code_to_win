const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { logger } = require("../utils"); // <-- Add logger

require("dotenv").config();

// Login a user
router.post("/login", async (req, res) => {
  const { userId, password, role } = req.body;
  logger.info(`Login attempt: userId=${userId}, role=${role}`);
  // Input validation
  if (!userId || !password || !role) {
    logger.warn("Missing userId, password, or role in login");
    return res.status(400).json({
      message: "User Id, password and role are required",
    });
  }
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_id = ? AND role = ?",
      [userId, role]
    );

    if (rows.length === 0) {
      logger.warn(
        `User not found or wrong role: userId=${userId}, role=${role}`
      );
      return res
        .status(401)
        .json({ message: "User not found or Check the role." });
    }

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn(`Invalid password for userId=${userId}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    // Check if account is active
    if (!user.is_active) {
      logger.warn(`Inactive account login attempt: userId=${userId}`);
      return res.status(403).json({
        message: "Account not active. Please contact support.",
      });
    }
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET
    );

    delete user.password;

    logger.info(`Login successful: userId=${userId}, role=${role}`);
    res.json({
      token,
      user,
    });
  } catch (err) {
    logger.error(`Login error for userId=${userId}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

//register a user
router.post("/register", async (req, res) => {
  const { stdId, name, email, gender, dept, year, section, cgpa } =
    req.body.formData;
  logger.info(`Add student request: ${JSON.stringify(req.body)}`);
  const connection = await db.getConnection(); // Use a connection from the pool

  try {
    await connection.beginTransaction();
    logger.info(
      `Adding student: ${stdId}, ${name}, ${dept}, ${year}, ${section}, ${email}, ${cgpa}`
    );

    const hashed = await bcrypt.hash("student@aditya", 10);

    // 1. Insert into users table
    const [result] = await connection.query(
      `INSERT INTO users (user_id, email, password, role) VALUES (?,?, ?, ?)`,
      [stdId, email, hashed, "student"]
    );

    // 2. Insert into student_profiles table
    await connection.query(
      `INSERT INTO student_profiles 
        (student_id, name, dept_code, year, section, gender, cgpa)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [stdId, name, dept, year, section, gender, cgpa]
    );
    await connection.query(
      `INSERT INTO student_performance 
      (student_id) 
      VALUES (?);`,
      [stdId]
    );

    await connection.commit();
    logger.info(`Student added successfully: ${stdId}`);
    res.status(200).json({ message: "Student added successfully" });
  } catch (err) {
    await connection.rollback();
    logger.error(`Error adding student: ${err.message}`);
    res.status(500).json({
      message:
        err.code === "ER_DUP_ENTRY"
          ? `Student with ID ${stdId} already exists`
          : err.message,
      error: err.errno,
    });
  } finally {
    connection.release();
  }
});

router.get("/validate", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn("No authorization header in validate");
    return res.status(401).json({ valid: false });
  }
  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      decoded.id,
    ]);
    if (rows.length === 0) {
      logger.warn(`Token valid but user not found: userId=${decoded.id}`);
      return res.status(401).json({ valid: false });
    }

    const user = rows[0];
    delete user.password;

    logger.info(`Token validated for userId=${decoded.id}`);
    res.json({
      valid: true,
      user,
    });
  } catch (err) {
    logger.warn(`Token validation failed: ${err.message}`);
    res.status(401).json({ valid: false });
  }
});

// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  logger.info(`Reset password request for email: ${email}`);
  try {
    // Check if user exists
    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      logger.warn(`Reset password: user not found for email: ${email}`);
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await db.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    logger.info(`Password reset successfully for email: ${email}`);
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    logger.error(`Reset Password Error for email=${email}: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// Update password (authenticated user)
router.put("/update-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId; // Assume you have middleware to set req.user
  logger.info(`Update password request for userId: ${userId}`);

  try {
    // Get user by ID
    const [user] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);
    if (user.length === 0) {
      logger.warn(`Update password: user not found for userId: ${userId}`);
      return res.status(400).json({ message: "User not found" });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      logger.warn(
        `Update password: incorrect current password for userId: ${userId}`
      );
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await db.execute("UPDATE users SET password = ? WHERE user_id = ?", [
      hashedPassword,
      userId,
    ]);

    logger.info(`Password updated successfully for userId: ${userId}`);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error(
      `Update Password Error for userId=${userId}: ${error.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
