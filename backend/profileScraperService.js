/**
 * Profile Scraper Service for Express.js
 *
 * This module provides a service to integrate the coding profile scraper
 * into an existing Express.js application.
 */

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const XLSX = require("xlsx");

// Import scrapers
const scrapeHackerRankProfile = require("./scrapers/hackerrank");
const scrapeCodeChefProfile = require("./scrapers/codechef");
const scrapeGeeksForGeeksProfile = require("./scrapers/geeksforgeeks");
const scrapeLeetCodeProfile = require("./scrapers/leetcode");

// Import utilities
const { logger, sleep } = require("./utils");
const config = require("./config");

class ProfileScraperService {
  constructor(options = {}) {
    this.cacheDir = options.cacheDir || path.join(process.cwd(), ".cache");
    this.cacheExpiry = options.cacheExpiry || 86400 * 7; // 7 days default
    this.useCache = options.useCache !== false;

    // Create cache directory if it doesn't exist
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Process an Excel file containing student profiles
   * @param {string} filePath - Path to the Excel file
   * @param {Function} progressCallback - Callback for progress updates
   * @returns {Promise<Object>} - Processed profiles
   */
  async processExcelFile(filePath, progressCallback = () => {}) {
    try {
      logger.info(`Processing file: ${path.basename(filePath)}`);

      // Read Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      // Prepare student data
      const students = data
        .map((row) => ({
          rollNo: String(
            row["Roll Number"] ||
              row["Roll No"] ||
              row["RollNo"] ||
              row["Roll_Number"] ||
              ""
          ).trim(),
          urls: {
            GeeksForGeeks: (
              row.GeeksforGeeks ||
              row["Geeks for Geeks"] ||
              row.GFG ||
              ""
            ).trim(),
            CodeChef: (row.CodeChef || row["Code Chef"] || "").trim(),
            HackerRank: (row.HackerRank || row["Hacker Rank"] || "").trim(),
            LeetCode: (row.LeetCode || row["Leet Code"] || "").trim(),
          },
        }))
        .filter((student) => student.rollNo);

      const totalStudents = students.length;
      progressCallback({
        type: "progress",
        total: totalStudents,
        processed: 0,
        message: `Starting to process ${totalStudents} students`,
      });

      const studentProfiles = {};
      let processedCount = 0;

      // Process students sequentially to avoid overwhelming the target sites
      for (const student of students) {
        try {
          const result = await this.processStudentProfile(student);
          studentProfiles[result.rollNo] = { Profiles: result.results };

          // Update progress
          processedCount++;
          progressCallback({
            type: "progress",
            total: totalStudents,
            processed: processedCount,
            message: `Processed ${processedCount} of ${totalStudents} students`,
          });

          // Add delay between students
          await sleep(1000);
        } catch (error) {
          logger.error(
            `Error processing student ${student.rollNo}: ${error.message}`
          );
          progressCallback({
            type: "error",
            message: `Error processing student ${student.rollNo}: ${error.message}`,
          });
        }
      }

      progressCallback({
        type: "complete",
        message: "Processing complete",
      });

      return { Profiles: studentProfiles };
    } catch (error) {
      logger.error(`Error in processing: ${error.message}`);
      throw error;
    }
  }

  /**
   * Process a single student's profile
   * @param {Object} student - Student data
   * @returns {Object} - Processed profile data
   */
  async processStudentProfile(student) {
    const { rollNo, urls } = student;
    logger.info(`Processing student: ${rollNo}`);

    // Generate cache key
    const cacheKey = this.getCacheKey(rollNo, urls);

    // Check cache first if enabled
    if (this.useCache) {
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        logger.info(`Using cached result for student: ${rollNo}`);
        return { rollNo, results: cachedResult };
      }
    }

    // Process profiles
    const results = {};

    // Process each platform sequentially to avoid rate limiting issues
    if (urls.GeeksForGeeks) {
      try {
        logger.info(`Processing GeeksForGeeks for ${rollNo}`);
        results.GeeksForGeeks = await scrapeGeeksForGeeksProfile(
          urls.GeeksForGeeks
        );
        await sleep(3000);
      } catch (error) {
        logger.error(
          `Error processing GeeksForGeeks for ${rollNo}: ${error.message}`
        );
        results.GeeksForGeeks = { Error: error.message, Total_Score: 0 };
      }
    }

    if (urls.CodeChef) {
      try {
        logger.info(`Processing CodeChef for ${rollNo}`);
        results.CodeChef = await scrapeCodeChefProfile(urls.CodeChef);
        await sleep(5000); // Longer delay for CodeChef due to rate limiting
      } catch (error) {
        logger.error(
          `Error processing CodeChef for ${rollNo}: ${error.message}`
        );
        results.CodeChef = { Error: error.message, Total_Score: 0 };
      }
    }

    if (urls.HackerRank) {
      try {
        logger.info(`Processing HackerRank for ${rollNo}`);
        results.HackerRank = await scrapeHackerRankProfile(urls.HackerRank);
        await sleep(3000);
      } catch (error) {
        logger.error(
          `Error processing HackerRank for ${rollNo}: ${error.message}`
        );
        results.HackerRank = { Error: error.message, Total_Score: 0 };
      }
    }

    if (urls.LeetCode) {
      try {
        logger.info(`Processing LeetCode for ${rollNo}`);
        results.LeetCode = await scrapeLeetCodeProfile(urls.LeetCode);
        await sleep(3000);
      } catch (error) {
        logger.error(
          `Error processing LeetCode for ${rollNo}: ${error.message}`
        );
        results.LeetCode = { Error: error.message, Total_Score: 0 };
      }
    }

    // Cache the results
    this.saveToCache(cacheKey, results);

    return { rollNo, results };
  }

  /**
   * Get cache key for a student profile
   * @param {string} rollNo - Student roll number
   * @param {Object} urls - Profile URLs
   * @returns {string} - Cache key
   */
  getCacheKey(rollNo, urls) {
    return `student_${rollNo}_${Object.values(urls).join("_")}`;
  }

  /**
   * Check if profile is cached
   * @param {string} cacheKey - Cache key
   * @returns {Object|null} - Cached data or null
   */
  getFromCache(cacheKey) {
    try {
      const cacheFile = path.join(
        this.cacheDir,
        `${crypto.createHash("md5").update(cacheKey).digest("hex")}.json`
      );
      if (fs.existsSync(cacheFile)) {
        const cacheData = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
        if (cacheData.expiry > Date.now()) {
          return cacheData.value;
        } else {
          // Remove expired cache
          fs.unlinkSync(cacheFile);
        }
      }
    } catch (error) {
      logger.error(`Cache read error: ${error.message}`);
    }
    return null;
  }

  /**
   * Save profile to cache
   * @param {string} cacheKey - Cache key
   * @param {Object} data - Data to cache
   */
  saveToCache(cacheKey, data) {
    try {
      const cacheFile = path.join(
        this.cacheDir,
        `${crypto.createHash("md5").update(cacheKey).digest("hex")}.json`
      );
      const cacheData = {
        value: data,
        expiry: Date.now() + this.cacheExpiry * 1000,
      };
      fs.writeFileSync(cacheFile, JSON.stringify(cacheData));
    } catch (error) {
      logger.error(`Cache write error: ${error.message}`);
    }
  }

  /**
   * Clear the cache
   * @returns {number} - Number of files cleared
   */
  clearCache() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let count = 0;

      for (const file of files) {
        if (file.endsWith(".json")) {
          fs.unlinkSync(path.join(this.cacheDir, file));
          count++;
        }
      }

      logger.info(`Cleared ${count} cache files`);
      return count;
    } catch (error) {
      logger.error(`Error clearing cache: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ProfileScraperService;
