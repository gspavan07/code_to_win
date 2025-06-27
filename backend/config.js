/**
 * Configuration settings for web scraping
 */

module.exports = {
  // Request settings
  REQUEST_TIMEOUT: 15000, // milliseconds
  REQUEST_HEADERS: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    Referer: "https://www.google.com/",
  },

  // Rate limiting settings
  RATE_LIMIT_DELAY: 3000, // milliseconds between requests

  // Cache settings
  CACHE_ENABLED: true,
  CACHE_EXPIRY: 86400, // seconds (24 hours)
};
