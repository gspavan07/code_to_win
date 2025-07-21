const express = require("express");
const router = express.Router();
const db = require("../config/db"); // MySQL connection
const { logger } = require("../utils");

// POST /api/contact - Submit a contact request
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  logger.info(`New contact request from: ${name} (${email})`);
  
  // Validate input
  if (!name || !email || !message) {
    logger.warn("Invalid contact request - missing required fields");
    return res.status(400).json({ message: "All fields are required" });
  }
  
  try {
    // Insert into database
    await db.query(
      "INSERT INTO contact_requests (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );
    
    logger.info(`Contact request from ${email} saved successfully`);
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (err) {
    logger.error(`Error saving contact request: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/contact - Get all contact requests (admin only)
router.get("/", async (req, res) => {
  logger.info("Fetching all contact requests");
  try {
    const [requests] = await db.query(
      "SELECT * FROM contact_requests ORDER BY created_at DESC"
    );
    
    logger.info(`Fetched ${requests.length} contact requests`);
    res.json(requests);
  } catch (err) {
    logger.error(`Error fetching contact requests: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/contact/:id - Update contact request status (admin only)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  logger.info(`Updating contact request ${id} status to ${status}`);
  
  try {
    await db.query(
      "UPDATE contact_requests SET status = ? WHERE id = ?",
      [status, id]
    );
    
    logger.info(`Contact request ${id} updated successfully`);
    res.json({ message: "Contact request updated successfully" });
  } catch (err) {
    logger.error(`Error updating contact request ${id}: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;