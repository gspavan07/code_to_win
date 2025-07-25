const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const bcrypt = require("bcryptjs");
const { logger } = require("../utils"); // <-- Add logger

// GET /admin/profile
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  logger.info(`Fetching admin profile for userId: ${userId}`);
  try {
    // Get admin profile
    const [profileResult] = await db.query(
      "SELECT * FROM admin_profiles WHERE admin_id = ?",
      [userId]
    );
    if (profileResult.length === 0) {
      logger.warn(`Admin profile not found for userId: ${userId}`);
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

    logger.info(`Admin profile fetched for userId: ${userId}`);
    res.json({
      ...profile,
      total_students,
      total_faculty,
      total_hod,
    });
  } catch (err) {
    logger.error(
      `Error fetching admin profile for userId ${userId}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /hod/profile
router.put("/profile", async (req, res) => {
  const { userId, name, department, section } = req.body;
  logger.info(
    `Updating HOD profile: userId=${userId}, name=${name}, department=${department}, section=${section}`
  );
  try {
    await db.query(
      "UPDATE hod_profiles SET name = ?, dept = ? WHERE hod_id = ?",
      [name, department, section, userId]
    );
    logger.info(`HOD profile updated for userId: ${userId}`);
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    logger.error(
      `Error updating HOD profile for userId ${userId}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

// GET /hod/students?dept=CSE&year=3&section=A
router.get("/students", async (req, res) => {
  const { dept, year, section } = req.query;
  logger.info(
    `Fetching students: dept=${dept}, year=${year}, section=${section}`
  );
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
    logger.info(`Fetched ${students.length} students`);
    res.json(students);
  } catch (err) {
    logger.error(`Error fetching students: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /hod/faculty?dept=CSE
router.get("/faculty", async (req, res) => {
  const { dept } = req.query;
  logger.info(`Fetching faculty: dept=${dept}`);
  try {
    let query = `
      SELECT fp.*, u.email 
      FROM faculty_profiles fp
      JOIN users u ON fp.faculty_id = u.user_id
      WHERE 1=1
    `;
    const params = [];
    if (dept) {
      query += " AND fp.dept_code = ?";
      params.push(dept);
    }
    const [faculty] = await db.query(query, params);
    logger.info(`Fetched ${faculty.length} faculty`);
    res.json(faculty);
  } catch (err) {
    logger.error(`Error fetching faculty: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /admin/hods?dept=CSE
router.get("/hods", async (req, res) => {
  const { dept } = req.query;
  logger.info(`Fetching HODs: dept=${dept}`);
  try {
    let query = `
      SELECT hp.*, u.email 
      FROM hod_profiles hp
      JOIN users u ON hp.hod_id = u.user_id
      WHERE 1=1
    `;
    const params = [];
    if (dept) {
      query += " AND hp.dept_code = ?";
      params.push(dept);
    }
    const [hods] = await db.query(query, params);
    logger.info(`Fetched ${hods.length} HODs`);
    res.json(hods);
  } catch (err) {
    logger.error(`Error fetching HODs: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /admin/faculty/:id - Update faculty
router.put("/faculty/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, dept_code } = req.body;
  logger.info(
    `Updating faculty ${id}: name=${name}, email=${email}, dept_code=${dept_code}`
  );

  try {
    // Update faculty profile
    await db.query(
      "UPDATE faculty_profiles SET name = ?, dept_code = ? WHERE faculty_id = ?",
      [name, dept_code, id]
    );

    // Update email in users table
    await db.query("UPDATE users SET email = ? WHERE user_id = ?", [email, id]);

    logger.info(`Faculty ${id} updated successfully`);
    res.json({ message: "Faculty updated successfully" });
  } catch (err) {
    logger.error(`Error updating faculty ${id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /admin/faculty/:id - Delete faculty
router.delete("/faculty/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`Deleting faculty ${id}`);

  try {
    // Start a transaction
    await db.query("START TRANSACTION");

    // Delete from faculty_profiles
    await db.query(
      "DELETE FROM faculty_section_assignment WHERE faculty_id = ?",
      [id]
    );
    await db.query("DELETE FROM faculty_profiles WHERE faculty_id = ?", [id]);

    // Delete from users table
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);

    // Commit the transaction
    await db.query("COMMIT");

    logger.info(`Faculty ${id} deleted successfully`);
    res.json({ message: "Faculty deleted successfully" });
  } catch (err) {
    // Rollback on error
    await db.query("ROLLBACK");
    logger.error(`Error deleting faculty ${id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /admin/hods/:id - Update HOD
router.put("/hods/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, dept_code } = req.body;
  logger.info(
    `Updating HOD ${id}: name=${name}, email=${email}, dept_code=${dept_code}`
  );

  try {
    // Update HOD profile
    await db.query(
      "UPDATE hod_profiles SET name = ?, dept_code = ? WHERE hod_id = ?",
      [name, dept_code, id]
    );

    // Update email in users table
    await db.query("UPDATE users SET email = ? WHERE user_id = ?", [email, id]);

    logger.info(`HOD ${id} updated successfully`);
    res.json({ message: "HOD updated successfully" });
  } catch (err) {
    logger.error(`Error updating HOD ${id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /admin/hods/:id - Delete HOD
router.delete("/hods/:id", async (req, res) => {
  const { id } = req.params;
  logger.info(`Deleting HOD ${id}`);

  try {
    // Start a transaction
    await db.query("START TRANSACTION");

    // Delete from hod_profiles
    await db.query("DELETE FROM hod_profiles WHERE hod_id = ?", [id]);

    // Delete from users table
    await db.query("DELETE FROM users WHERE user_id = ?", [id]);

    // Commit the transaction
    await db.query("COMMIT");

    logger.info(`HOD ${id} deleted successfully`);
    res.json({ message: "HOD deleted successfully" });
  } catch (err) {
    // Rollback on error
    await db.query("ROLLBACK");
    logger.error(`Error deleting HOD ${id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
