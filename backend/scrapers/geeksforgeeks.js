/**
 * GeeksForGeeks profile scraper
 */

const cheerio = require("cheerio");
const axios = require("axios");
const { logger } = require("../utils");
const config = require("../config");

/**
 * Scrape GeeksForGeeks profile
 * @param {string} url - Profile URL
 * @returns {Object} - Profile data
 */
async function scrapeGeeksForGeeksProfile(url) {
  if (!url || url.trim() === "") {
    return { Total_Score: 0 };
  }

  try {
    // Clean URL - remove any non-breaking spaces or other special characters
    url = url.trim();

    const response = await axios.get(url, {
      timeout: config.REQUEST_TIMEOUT,
    });

    if (response.status !== 200) {
      return { Error: "Invalid or inaccessible URL", Total_Score: 0 };
    }

    const $ = cheerio.load(response.data);

    // Extract username
    const usernameTag = $(".profilePicSection_head_userHandle__oOfFy");
    if (!usernameTag.length) {
      throw new Error("Username not found in profile");
    }

    const username = usernameTag.text().trim();

    // Extract coding score and problems solved
    const scores = $(".scoreCard_head_left--score__oSi_x");
    const codingScore = scores.length > 0 ? scores.eq(0).text().trim() : "N/A";
    const problemsSolved =
      scores.length > 1 ? scores.eq(1).text().trim() : "N/A";

    // Extract problem counts
    const problemsDict = {
      School: 0,
      Basic: 0,
      Easy: 0,
      Medium: 0,
      Hard: 0,
      Total: 0,
    };

    $(".problemNavbar_head_nav--text__UaGCx").each((_, element) => {
      const text = $(element).text().trim();
      if (text.includes("(") && text.includes(")")) {
        const parts = text.split("(");
        const category = parts[0].trim().toUpperCase();
        const count = parseInt(parts[1].replace(")", ""));

        if (category === "SCHOOL") problemsDict.School = count;
        else if (category === "BASIC") problemsDict.Basic = count;
        else if (category === "EASY") problemsDict.Easy = count;
        else if (category === "MEDIUM") problemsDict.Medium = count;
        else if (category === "HARD") problemsDict.Hard = count;
      }
    });

    return {
      Username: username,
      School: problemsDict.School,
      Basic: problemsDict.Basic,
      Easy: problemsDict.Easy,
      Medium: problemsDict.Medium,
      Hard: problemsDict.Hard,
    };
  } catch (error) {
    logger.error(`Error scraping GeeksForGeeks profile: ${error.message}`);
    return { Error: error.message };
  }
}

module.exports = scrapeGeeksForGeeksProfile;
