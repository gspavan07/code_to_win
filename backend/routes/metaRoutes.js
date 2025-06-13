const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /meta/grading
router.get("/grading", async (req, res) => {
  try {
    // Fetch grading system
    const [grading] = await db.query("SELECT * FROM grading_system");
    res.json({ grading });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /meta/grading/:id
router.put("/grading/:metric", async (req, res) => {
  const { metric } = req.params;
  const { points } = req.body;
  try {
    await db.query("UPDATE grading_system SET points = ? WHERE metric = ?", [
      points,
      metric,
    ]);
    res.json({ message: "Grading points updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/depts", async (req, res) => {
  try {
    const [depts] = await db.query("SELECT * FROM dept");
    res.json(depts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
