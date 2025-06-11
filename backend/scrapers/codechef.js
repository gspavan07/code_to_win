/**
 * CodeChef profile scraper
 */

const cheerio = require("cheerio");
const axios = require("axios");
const { logger, sleep, extractUsername } = require("../utils");
const config = require("../config");

/**
 * Scrape CodeChef profile
 * @param {string} url - Profile URL
 * @returns {Object} - Profile data
 */
async function scrapeCodeChefProfile(url) {
  if (!url || url.trim() === "") {
    return { Total_Score: 0 };
  }

  try {
    // Add extra delay for CodeChef to avoid rate limiting
    await sleep(5000);

    // Use rotating user agents and add more headers to avoid detection
    const headers = {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${
        Math.floor(Math.random() * 10) + 90
      }.0.${Math.floor(Math.random() * 1000) + 4000}.${Math.floor(
        Math.random() * 100
      )} Safari/537.36`,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Cache-Control": "max-age=0",
      "Sec-Ch-Ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "Sec-Ch-Ua-Mobile": "?0",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
    };

    logger.info(`Fetching CodeChef profile: ${url}`);

    const response = await axios.get(url, {
      headers,
      timeout: config.REQUEST_TIMEOUT * 2, // Double timeout for CodeChef
    });

    if (response.status !== 200) {
      logger.error(`CodeChef returned status code: ${response.status}`);
      return { error: "Failed to fetch profile", Total_Score: 0 };
    }

    const $ = cheerio.load(response.data);

    const username =
      $(".m-username--link").text().trim() || extractUsername(url);
    const starText = $(".rating").text().trim();
    const ratingText = $(".rating-number").text().trim();
    const totalProblemsSolvedText = $("h3").last().text().trim();

    // Extract only the first numeric value (ignoring extra characters)
    const star = parseInt(starText.match(/\d+/)?.[0]) || 0;
    const rating = parseInt(ratingText.match(/\d+/)?.[0]) || 0;

    let problemsSolved = 0;
    const match = totalProblemsSolvedText.match(
      /Total Problems Solved:\s*(\d+)/i
    );
    if (match) {
      problemsSolved = parseInt(match[1], 10);
    }

    // Try different selectors for contests participated
    let contestsParticipated = 0;
    const contestText = $(".contest-participated-count b").text().trim();
    if (contestText) {
      contestsParticipated = parseInt(contestText) || 0;
    } else {
      // Alternative selector
      const contestSection = $('section:contains("Contest")');
      if (contestSection.length) {
        const contestCountText = contestSection.find("b").text().trim();
        contestsParticipated = parseInt(contestCountText) || 0;
      }
    }

    const totalScore =
      contestsParticipated * config.SCORE_WEIGHTS.codechef.contest;

    logger.info(`Successfully scraped CodeChef profile for ${username}`);
    console.log(
      username,
      star,
      rating,
      contestsParticipated,
      totalScore,
      problemsSolved
    );
    return {
      Username: username,
      Star: star,
      Rating: rating,
      Contests_Participated: contestsParticipated,
      problemsSolved: problemsSolved,
      Total_Score: totalScore,
    };
  } catch (error) {
    logger.error(`Error scraping CodeChef profile: ${error.message}`);
    return {
      Username: extractUsername(url),
      Total_Score: 0,
      Error: error.message,
    };
  }
}

module.exports = scrapeCodeChefProfile;
