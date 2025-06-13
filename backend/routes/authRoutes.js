const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

require("dotenv").config();
// Login a user
router.post("/login", async (req, res) => {
  const { userId, password, role } = req.body;
  // Input validation
  if (!userId || !password || !role) {
    return res.status(400).json({
      message: "User Id, password and role are required",
    });
  }
  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE user_id = ? AND role = ?",
      [userId, role]
    );

    if (rows.length === 0)
      return res
        .status(401)
        .json({ message: "User not found or Check the role." });

    const user = rows[0];

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid password" });

    // Check if account is active
    if (!user.is_active) {
      return res.status(403).json({
        message: "Account not active. Please contact support.",
      });
    }
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET
    );

    delete user.password;

    res.json({
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/validate", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ valid: false });
  try {
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      decoded.id,
    ]);
    if (rows.length === 0) return res.status(401).json({ valid: false });

    const user = rows[0];
    delete user.password;

    res.json({
      valid: true,
      user,
    });
  } catch (err) {
    res.status(401).json({ valid: false });
  }
});
// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    // Check if user exists
    const [user] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await db.execute("UPDATE users SET password = ? WHERE email = ?", [
      hashedPassword,
      email,
    ]);

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update password (authenticated user)
router.put("/update-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId; // Assume you have middleware to set req.user

  try {
    // Get user by ID
    const [user] = await db.execute("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);
    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await db.execute("UPDATE users SET password = ? WHERE user_id = ?", [
      hashedPassword,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
