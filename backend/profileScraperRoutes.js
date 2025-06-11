/**
 * Express routes for the Profile Scraper
 */

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ProfileScraperService = require("./profileScraperService");

// Create router
const router = express.Router();

// Set up WebSocket connections
const setupWebSocket = (io) => {
  // Store active jobs
  const activeJobs = new Map();

  // Set up file upload
  const upload = multer({
    dest: "uploads/",
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== ".xlsx" && ext !== ".xls") {
        return cb(new Error("Only Excel files are allowed"));
      }
      cb(null, true);
    },
  });

  // Create scraper service
  const scraperService = new ProfileScraperService({
    cacheDir: path.join(process.cwd(), ".cache"),
    cacheExpiry: 86400 * 7, // 7 days
  });

  // WebSocket connection handler
  io.of("/profile-scraper").on("connection", (socket) => {
    console.log("Client connected to profile scraper namespace");

    // Handle job status requests
    socket.on("job-status", (jobId) => {
      const job = activeJobs.get(jobId);
      if (job) {
        socket.emit("job-update", job.lastStatus);
      } else {
        socket.emit("job-update", { type: "error", message: "Job not found" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected from profile scraper namespace");
    });
  });

  // Process Excel file
  router.post("/process", upload.single("excelFile"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    try {
      // Generate job ID
      const jobId = Date.now().toString();

      // Get cache preference
      const useCache = req.body.useCache !== "false";

      // Create job entry
      activeJobs.set(jobId, {
        file: req.file.path,
        status: "processing",
        startTime: Date.now(),
        lastStatus: {
          type: "progress",
          processed: 0,
          total: 0,
          message: "Starting processing",
        },
      });

      // Send immediate response
      res.json({
        success: true,
        message: "Processing started",
        jobId,
      });

      // Process file in background
      scraperService.useCache = useCache;

      // Process the file with progress updates
      scraperService
        .processExcelFile(req.file.path, (status) => {
          // Update job status
          const job = activeJobs.get(jobId);
          if (job) {
            job.lastStatus = status;

            // If complete, update job status
            if (status.type === "complete") {
              job.status = "completed";
              job.endTime = Date.now();
            }
          }

          // Broadcast status to all clients in the namespace
          io.of("/profile-scraper").emit(`job-update-${jobId}`, status);
        })
        .then((result) => {
          // Save result to file
          const outputFile = `results_${jobId}.json`;
          fs.writeFileSync(outputFile, JSON.stringify(result, null, 4));

          // Update job with result file
          const job = activeJobs.get(jobId);
          if (job) {
            job.resultFile = outputFile;
          }

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          // Broadcast completion
          io.of("/profile-scraper").emit(`job-update-${jobId}`, {
            type: "complete",
            message: "Processing complete",
            resultFile: outputFile,
          });

          // Remove job after 1 hour
          setTimeout(() => {
            activeJobs.delete(jobId);
          }, 3600000);
        })
        .catch((error) => {
          // Update job with error
          const job = activeJobs.get(jobId);
          if (job) {
            job.status = "error";
            job.error = error.message;
          }

          // Broadcast error
          io.of("/profile-scraper").emit(`job-update-${jobId}`, {
            type: "error",
            message: error.message,
          });
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get job status
  router.get("/job/:jobId", (req, res) => {
    const jobId = req.params.jobId;
    const job = activeJobs.get(jobId);

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      jobId,
      status: job.status,
      startTime: job.startTime,
      endTime: job.endTime,
      lastStatus: job.lastStatus,
      resultFile: job.resultFile,
    });
  });

  // Download results
  router.get("/download/:jobId", (req, res) => {
    const jobId = req.params.jobId;
    const job = activeJobs.get(jobId);

    if (!job || !job.resultFile) {
      return res.status(404).json({ error: "Results not found" });
    }

    res.download(job.resultFile);
  });

  // Clear cache
  router.post("/clear-cache", (req, res) => {
    try {
      const count = scraperService.clearCache();
      res.json({ success: true, message: `Cleared ${count} cache files` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

module.exports = setupWebSocket;
