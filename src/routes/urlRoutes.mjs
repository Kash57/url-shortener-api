import express from 'express';
import { shortenUrl, redirectUrl, getUrlAnalytics, getTopicAnalyticsApi, getOverallAnalyticsApi } from '../controllers/urlController.mjs';
import { rateLimiter } from '../utils/rateLimit.mjs';

const router = express.Router();


/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a shortened URL
 *     description: Generate a shortened URL for the provided long URL.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original long URL to be shortened.
 *                 example: "https://example.com"
 *               customAlias:
 *                 type: string
 *                 description: Custom alias for the shortened URL (optional).
 *                 example: "myAlias123"
 *               topic:
 *                 type: string
 *                 description: Topic/category for the URL (optional).
 *                 example: "Tech"
 *     responses:
 *       201:
 *         description: Shortened URL created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL.
 *                   example: "https://short.ly/myAlias123"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation timestamp.
 *       500:
 *         description: Server error.
 */
router.post('/', shortenUrl);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to the original URL
 *     description: Retrieve and redirect to the original URL based on the provided alias.
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: The short alias for the URL.
 *         schema:
 *           type: string
 *           example: "myAlias123"
 *     responses:
 *       302:
 *         description: Redirect to the original URL.
 *       404:
 *         description: Short URL not found.
 *       500:
 *         description: Server error.
 */
router.get('/:alias', redirectUrl);

/**
 * @swagger
 * /api/shorten/analytics/{alias}:
 *   get:
 *     summary: Get Analytics for Short URL
 *     description: Retrieves detailed analytics for a short URL.
 *     parameters:
 *       - name: alias
 *         in: path
 *         description: The alias of the short URL.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Analytics data for the short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks for the short URL.
 *                   example: 0
 *                 uniqueUsersCount:
 *                   type: integer
 *                   description: Number of unique users who accessed the short URL.
 *                   example: 0
 *                 recentActivity:
 *                   type: array
 *                   description: An array of recent activities (clicks) in the last 7 days.
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of the activity (YYYY-MM-DD).
 *                       count:
 *                         type: integer
 *                         description: The number of clicks for that date.
 *                         example: 0
 *                 mostActiveDay:
 *                   type: object
 *                   description: The day with the most clicks.
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: The most active day (YYYY-MM-DD).
 *                       example: null
 *                     count:
 *                       type: integer
 *                       description: The total clicks for that day.
 *                       example: 0
 *                 percentageGrowth:
 *                   type: string
 *                   description: The percentage growth in clicks compared to the previous day.
 *                   example: "0.00"
 *       '400':
 *         description: Invalid alias provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Invalid short URL alias.'
 *       '500':
 *         description: Error in fetching URL analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Error in fetching URL analytics'
 */
router.get('/analytics/:alias', getUrlAnalytics);

/**
 * @swagger
 * /api/shorten/topic/{topic}:
 *   get:
 *     summary: Get analytics for URLs grouped by a topic
 *     description: Retrieve analytics for all URLs under a specific topic.
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic/category for the URLs.
 *         schema:
 *           type: string
 *           example: "Tech"
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: number
 *                   description: Total number of clicks across all URLs in the topic.
 *                   example: 350
 *                 uniqueUsers:
 *                   type: number
 *                   description: Unique users who accessed URLs in the topic.
 *                   example: 150
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-05"
 *                       count:
 *                         type: number
 *                         description: Clicks on this date.
 *                         example: 20
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         description: The short URL.
 *                         example: "https://short.ly/myAlias123"
 *                       totalClicks:
 *                         type: number
 *                         description: Total clicks for this URL.
 *                         example: 120
 *                       uniqueUsers:
 *                         type: number
 *                         description: Unique users who accessed this URL.
 *                         example: 85
 *       404:
 *         description: Topic not found.
 *       500:
 *         description: Server error.
 */
router.get('/topic/:topic', rateLimiter, getTopicAnalyticsApi);

/**
 * @swagger
 * /api/shorten/overall/{shortAlias}:
 *   get:
 *     summary: Get overall analytics for a short URL
 *     description: Retrieve overall analytics for a specific short URL, including total clicks, unique users, and other performance data.
 *     parameters:
 *       - name: shortAlias
 *         in: path
 *         description: The unique short alias for the URL
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved overall analytics for the short URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks across all URLs created by the user.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users who accessed the short URL.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         description: Date when the clicks occurred (YYYY-MM-DD).
 *                       count:
 *                         type: integer
 *                         description: Number of clicks on that date.
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: The operating system name (e.g., Windows, Linux, iOS).
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks for that OS.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users who accessed the short URL from that OS.
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: The type of device used (e.g., mobile, desktop).
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks for that device.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users for that device type.
 *       404:
 *         description: Short URL not found
 *       500:
 *         description: Internal server error
 */
router.get('/overall/:shortAlias', rateLimiter, getOverallAnalyticsApi);

export default router;
