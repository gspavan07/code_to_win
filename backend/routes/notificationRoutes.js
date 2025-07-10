const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { logger } = require("../utils");

// PUT /notifications/:id/read - Mark notification as read
router.put("/:id/read", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE notifications SET read_status = 1 WHERE id = ?", [id]);
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    logger.error(`Error marking notification as read: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /notifications/clear - Clear all notifications for user
router.delete("/clear", async (req, res) => {
  const { userId } = req.query;
  try {
    await db.query("DELETE FROM notifications WHERE user_id = ?", [userId]);
    res.json({ message: "All notifications cleared" });
  } catch (err) {
    logger.error(`Error clearing notifications: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;