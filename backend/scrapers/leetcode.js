/**
 * LeetCode profile scraper
 */

const axios = require("axios");
const { logger, extractUsername } = require("../utils");
const config = require("../config");

/**
 * Fetch data from LeetCode GraphQL API
 * @param {string} username - LeetCode username
 * @returns {Object|null} - API response data or null if failed
 */
async function fetchLeetCodeData(username) {
  if (!username || username === "N/A") {
    return null;
  }

  const query = `
  {
    matchedUser(username: "${username}") {
      submitStats {
        acSubmissionNum {
          difficulty
          count
        }
      }
      profile {
        ranking
      }
        badges{
          id        
        }
    }
    userContestRanking(username: "${username}") {
      attendedContestsCount
      rating
    }
  }
  `;

  const headers = {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    Referer: "https://leetcode.com/",
    Origin: "https://leetcode.com",
    Accept: "*/*",
  };

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      { query },
      {
        headers,
        timeout: config.REQUEST_TIMEOUT,
      }
    );

    if (response.status === 200) {
      const data = response.data;
      if (data.errors) {
        return null;
      }
      return data.data;
    } else {
      logger.error(`LeetCode API returned status code: ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error(`Error fetching LeetCode data: ${error.message}`);
    return null;
  }
}

/**
 * Scrape LeetCode profile
 * @param {string} url - Profile URL
 * @returns {Object} - Profile data
 */
async function scrapeLeetCodeProfile(url) {
  if (!url || url.trim() === "") {
    return { Total_Score: 0 };
  }

  const username = extractUsername(url);

  if (username === "N/A") {
    return {
      Username: "N/A",
      Total_Score: 0,
    };
  }

  try {
    const data = await fetchLeetCodeData(username);

    // If API fails, return default values
    if (!data) {
      return {
        Username: username,
        Problems: {
          Easy: 0,
          Medium: 0,
          Hard: 0,
          Total: 0,
        },
        Contests_Attended: 0,
      };
    }

    const user = data.matchedUser || {};
    const contest = data.userContestRanking || {};

    if (!user && !contest) {
      return {
        Username: username,
        Problems: {
          Easy: 0,
          Medium: 0,
          Hard: 0,
          Total: 0,
        },
        Contests_Attended: 0,
      };
    }

    // Extract problem counts
    const submitStats = user.submitStats || {};
    const acSubmissionNum = submitStats.acSubmissionNum || [];

    const totalProblems = {};
    acSubmissionNum.forEach((submission) => {
      if (submission) {
        totalProblems[submission.difficulty] = submission.count;
      }
    });

    const problems = {
      Easy: totalProblems.Easy || 0,
      Medium: totalProblems.Medium || 0,
      Hard: totalProblems.Hard || 0,
    };

    // Extract contest data
    const contestsAttended = contest.attendedContestsCount || 0;
    const badges = user.badges || 0;
    return {
      Username: username,
      Problems: problems,
      Contests_Attended: contestsAttended,
      badges: badges.length,
    };
  } catch (error) {
    logger.error(`Error in get_leetcode_profile: ${error.message}`);
    return {
      Username: username,
      Total_Score: 0,
    };
  }
}

module.exports = scrapeLeetCodeProfile;
