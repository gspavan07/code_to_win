const db = require("../config/db");
const { logger } = require("../utils");
const scrapeHackerRankProfile = require("./hackerrank");
const scrapeCodeChefProfile = require("./codechef");
const scrapeGeeksForGeeksProfile = require("./geeksforgeeks");
const scrapeLeetCodeProfile = require("./leetcode");

async function scrapeAndUpdatePerformance(student_id, platform, username) {
  let performanceData = null;
  let attempts = 0;
  const maxAttempts = 5;
  let success = false;

  while (attempts < maxAttempts && !success) {
    try {
      attempts++;
      if (platform === "leetcode") {
        performanceData = await scrapeLeetCodeProfile(
          `https://leetcode.com/u/${username}`
        );
        if (performanceData) {
          await db.query(
            `UPDATE student_performance SET easy_lc = ?, medium_lc = ?, hard_lc = ?, contests_lc = ?,badges_lc=?, last_updated = NOW() WHERE student_id = ?`,
            [
              performanceData?.Problems?.Easy,
              performanceData?.Problems?.Medium,
              performanceData?.Problems?.Hard,
              performanceData?.Contests_Attended,
              performanceData?.Badges,
              student_id,
            ]
          );
          logger.info(
            `[SCRAPING] LeetCode performance updated for student_id=${student_id}`
          );
          success = true;
        }
      } else if (platform === "codechef") {
        performanceData = await scrapeCodeChefProfile(
          `https://www.codechef.com/users/${username}`
        );
        if (performanceData) {
          await db.query(
            `UPDATE student_performance SET contests_cc = ?, stars_cc = ?, problems_cc = ?, badges_cc = ?, last_updated = NOW() WHERE student_id = ?`,
            [
              performanceData?.Contests_Participated,
              performanceData?.Star,
              performanceData?.problemsSolved,
              performanceData?.Badges,
              student_id,
            ]
          );
          logger.info(
            `[SCRAPING] CodeChef performance updated for student_id=${student_id}`
          );
          success = true;
        }
      } else if (platform === "geekforgeeks") {
        performanceData = await scrapeGeeksForGeeksProfile(
          `https://www.geeksforgeeks.org/user/${username}`
        );
        if (performanceData) {
          await db.query(
            `UPDATE student_performance SET school_gfg = ?, basic_gfg = ?, easy_gfg = ?, medium_gfg = ?, hard_gfg = ?, last_updated = NOW() WHERE student_id = ?`,
            [
              performanceData?.School,
              performanceData?.Basic,
              performanceData?.Easy,
              performanceData?.Medium,
              performanceData?.Hard,
              student_id,
            ]
          );
          logger.info(
            `[SCRAPING] GFG performance updated for student_id=${student_id}`
          );
          success = true;
        }
      } else if (platform === "hackerrank") {
        performanceData = await scrapeHackerRankProfile(
          `https://www.hackerrank.com/profile/${username}`
        );
        if (performanceData) {
          await db.query(
            `UPDATE student_performance SET stars_hr = ?, last_updated = NOW() WHERE student_id = ?`,
            [performanceData?.Total_stars, student_id]
          );
          logger.info(
            `[SCRAPING] HackerRank performance updated for student_id=${student_id}`
          );
          success = true;
        }
      }
    } catch (err) {
      logger.error(
        `[SCRAPING] Attempt ${attempts}: Error scraping/updating performance for student_id=${student_id}, platform=${platform}: ${err.message}`
      );
      if (attempts >= maxAttempts) {
        // Mark as rejected and remove platform id
        const statusField = `${platform}_status`;
        const verifiedField = `${platform}_verified`;
        const idField = `${platform}_id`;
        try {
          await db.query(
            `UPDATE student_coding_profiles SET ${statusField} = 'rejected', ${verifiedField} = 0, ${idField} = NULL WHERE student_id = ?`,
            [student_id]
          );
          logger.warn(
            `[SCRAPING] Scraping failed after ${maxAttempts} attempts. Marked as rejected and removed ${platform} id for student_id=${student_id}`
          );
        } catch (updateErr) {
          logger.error(
            `[SCRAPING] Failed to update rejection for student_id=${student_id}, platform=${platform}: ${updateErr.message}`
          );
        }
      }
      // Wait a bit before retrying (optional, e.g., 1s)
      if (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
}

module.exports = { scrapeAndUpdatePerformance };
