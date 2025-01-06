import { Url } from '../models/urlModel.mjs';
import redisClient from '../config/redis.mjs';
import { generateShortAlias } from '../utils/analytics.mjs';
import { getAnalytics, getTopicAnalytics, getOverallAnalytics } from '../utils/analytics.mjs';

export const shortenUrl = async (req, res) => {
  try {
    const { longUrl, customAlias, topic } = req.body;

    // Extract the base URL (domain) from the long URL
    const baseUrl = new URL(longUrl).hostname;

    let alias = customAlias || generateShortAlias();

    let aliasExists = await Url.findOne({ shortAlias: alias });
    while (aliasExists) {
      alias = generateShortAlias();
      aliasExists = await Url.findOne({ shortAlias: alias });
    }

    const url = await Url.create({
      originalUrl: longUrl,
      shortAlias: alias,
      topic,
    });

    redisClient.set(alias, longUrl);

    res.status(201).json({
      shortUrl: `${baseUrl}/${alias}`,  // Short URL: base domain + alias (e.g., www.helloworld.com/jwiqge)
      createdAt: url.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: 'Error in creating short URL' });
  }
};

export const 
redirectUrl = async (req, res) => {
  try {
    const { alias } = req.params;
    
    const longUrl = await redisClient.get(alias);

    if (!longUrl) {
      const urlRecord = await Url.findOne({ shortAlias: alias });
      if (urlRecord) {
        redisClient.set(alias, urlRecord.originalUrl);
        return res.redirect(urlRecord.originalUrl); 
      } else {
        return res.status(404).json({ error: 'Short URL not found' });
      }
    }

    // If URL found in Redis, redirect the user
    return res.redirect(longUrl);

  } catch (err) {
    res.status(500).json({ error: 'Error in redirecting to the URL' });
  }
};


export const getUrlAnalytics = async (req, res) => {
  try {
    const { alias } = req.params;
    const analytics = await getAnalytics(alias);
    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ error: 'Error in fetching URL analytics', details: err.message });
  }
};


export const getTopicAnalyticsApi = async (req, res) => {
  try {
    const { topic } = req.params;
    const analytics = await getTopicAnalytics(topic);
    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOverallAnalyticsApi = async (req, res) => {
  try {
    const {shortAlias} = req.params;
    const analytics = await getOverallAnalytics(shortAlias);
    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};