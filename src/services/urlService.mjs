import { Url } from '../models/urlModel.mjs';
import redisClient from '../config/redis.mjs';
import { generateShortAlias } from '../utils/analytics.mjs';
import { getAnalytics } from '../utils/analytics.mjs';

/**
 * Shorten a long URL
 * @param {string} longUrl - Original URL
 * @param {string} [customAlias] - Custom alias (optional)
 * @param {string} [topic] - Topic/category for grouping URLs
 * @returns {Promise<object>} - Shortened URL details
 */
export const shortenUrl = async (longUrl, customAlias, topic) => {
  try {
    const alias = customAlias || generateShortAlias();

    const url = await Url.create({
      originalUrl: longUrl,
      shortAlias: alias,
      topic,
    });

    // Store in Redis cache
    await redisClient.set(alias, longUrl);

    return {
      shortUrl: `http://localhost:5000/api/shorten/${alias}`,
      createdAt: url.createdAt,
    };
  } catch (error) {
    console.error('Error in shortenUrl:', error);
    throw new Error('Failed to shorten the URL.');
  }
};

/**
 * Redirect to the original URL
 * @param {string} alias - Short alias
 * @returns {Promise<string>} - Original URL
 */
export const redirectUrl = async (alias) => {
  try {
    // Check in Redis cache first
    const cachedUrl = await redisClient.get(alias);

    if (cachedUrl) {
      return cachedUrl;
    }

    // If not in cache, look in the database
    const urlRecord = await Url.findOne({ shortAlias: alias });

    if (!urlRecord) {
      throw new Error('Alias not found.');
    }

    // Cache the result for future requests
    await redisClient.set(alias, urlRecord.originalUrl);

    return urlRecord.originalUrl;
  } catch (error) {
    console.error('Error in redirectUrl:', error);
    throw new Error('Failed to retrieve the original URL.');
  }
};

/**
 * Get analytics for a short URL
 * @param {string} alias - Short alias
 * @returns {Promise<object>} - Analytics data
 */
export const getUrlAnalytics = async (alias) => {
  try {
    const analytics = await getAnalytics(alias);
    return analytics;
  } catch (error) {
    console.error('Error in getUrlAnalytics:', error);
    throw new Error('Failed to fetch analytics.');
  }
};
