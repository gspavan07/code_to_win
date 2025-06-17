const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { logger } = require("../utils");

// GET /meta/grading
router.get("/grading", async (req, res) => {
  logger.info("Fetching grading system");
  try {
    // Fetch grading system
    const [grading] = await db.query("SELECT * FROM grading_system");
    logger.info("Fetched grading system");
    res.json({ grading });
  } catch (err) {
    logger.error(`Error fetching grading system: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /meta/grading/:metric
router.put("/grading/:metric", async (req, res) => {
  const { metric } = req.params;
  const { points } = req.body;
  logger.info(`Updating grading points: metric=${metric}, points=${points}`);
  try {
    await db.query("UPDATE grading_system SET points = ? WHERE metric = ?", [
      points,
      metric,
    ]);
    logger.info(`Grading points updated for metric=${metric}`);
    res.json({ message: "Grading points updated successfully" });
  } catch (err) {
    logger.error(
      `Error updating grading points for metric=${metric}: ${err.message}`
    );
    res.status(500).json({ message: "Server error" });
  }
});

// GET /meta/depts
router.get("/depts", async (req, res) => {
  logger.info("Fetching departments");
  try {
    const [depts] = await db.query("SELECT * FROM dept");
    logger.info(`Fetched ${depts.length} departments`);
    res.json(depts);
  } catch (err) {
    logger.error(`Error fetching departments: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
