import request from 'supertest';
import app from '../server.mjs';
import { Url } from '../src/models/urlModel.mjs';
import redisClient from '../src/config/redis.mjs';
import connectDB from '../src/config/db.mjs';

// Mock Redis client
jest.mock('../src/config/redis.mjs');
jest.mock('../src/utils/analytics.mjs');

describe('URL Shortener APIs', () => {
  beforeAll(async () => {
    await connectDB();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/shorten', () => {
    it('should create a shortened URL with custom alias', async () => {
      const longUrl = 'https://example.com';
      const customAlias = 'myAlias';
      const topic = 'Tech';

      Url.create = jest.fn().mockResolvedValue({
        originalUrl: longUrl,
        shortAlias: customAlias,
        topic,
        createdAt: new Date(),
      });

      redisClient.set.mockResolvedValue(true);

      const res = await request(app).post('/api/shorten').send({ longUrl, customAlias, topic });

      expect(res.statusCode).toBe(200);
      expect(res.body.shortUrl).toContain(customAlias);
      expect(Url.create).toHaveBeenCalledWith({
        originalUrl: longUrl,
        shortAlias: customAlias,
        topic,
      });
      expect(redisClient.set).toHaveBeenCalledWith(customAlias, longUrl);
    });

    it('should return 500 on failure', async () => {
      Url.create = jest.fn().mockRejectedValue(new Error('Database Error'));

      const res = await request(app).post('/api/shorten').send({ longUrl: 'https://example.com' });

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Error in creating short URL');
    });
  });

  describe('GET /api/shorten/:alias', () => {
    it('should redirect to the original URL if alias exists in Redis', async () => {
      const alias = 'myAlias';
      const longUrl = 'https://example.com';

      redisClient.get.mockResolvedValue(longUrl);

      const res = await request(app).get(`/api/shorten/${alias}`).expect(302);

      expect(redisClient.get).toHaveBeenCalledWith(alias);
      expect(res.header.location).toBe(longUrl);
    });

    it('should return 404 if alias does not exist', async () => {
      redisClient.get.mockResolvedValue(null);
      Url.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app).get('/api/shorten/unknownAlias');

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Short URL not found');
    });
  });

  describe('GET /api/shorten/analytics/:alias', () => {
    it('should return analytics for a short URL', async () => {
      const alias = 'myAlias';
      const analytics = {
        totalClicks: 10,
        uniqueUsersCount: 8,
        recentActivity: [],
      };

      jest.mock('../src/utils/analytics.mjs', () => ({
        getAnalytics: jest.fn().mockResolvedValue(analytics),
      }));

      const res = await request(app).get(`/api/shorten/analytics/${alias}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(analytics);
    });

    it('should return 500 on error', async () => {
      jest.mock('../src/utils/analytics.mjs', () => ({
        getAnalytics: jest.fn().mockRejectedValue(new Error('Analytics Error')),
      }));

      const res = await request(app).get('/api/shorten/analytics/myAlias');

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Error in fetching URL analytics');
    });
  });

  describe('GET /api/shorten/topic/:topic', () => {
    it('should return analytics for a topic', async () => {
      const topic = 'Tech';
      const analytics = {
        totalClicks: 350,
        uniqueUsers: 150,
        urls: [],
      };

      jest.mock('../src/utils/analytics.mjs', () => ({
        getTopicAnalytics: jest.fn().mockResolvedValue(analytics),
      }));

      const res = await request(app).get(`/api/shorten/topic/${topic}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(analytics);
    });

    it('should return 500 on error', async () => {
      jest.mock('../src/utils/analytics.mjs', () => ({
        getTopicAnalytics: jest.fn().mockRejectedValue(new Error('Topic Analytics Error')),
      }));

      const res = await request(app).get('/api/shorten/topic/unknown');

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Topic Analytics Error');
    });
  });

  describe('GET /api/shorten/overall/:shortAlias', () => {
    it('should return overall analytics for a short URL', async () => {
      const shortAlias = 'myAlias';
      const analytics = {
        totalClicks: 100,
        uniqueUsers: 50,
        clicksByDate: [],
      };

      jest.mock('../src/utils/analytics.mjs', () => ({
        getOverallAnalytics: jest.fn().mockResolvedValue(analytics),
      }));

      const res = await request(app).get(`/api/shorten/overall/${shortAlias}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(analytics);
    });

    it('should return 500 on error', async () => {
      jest.mock('../src/utils/analytics.mjs', () => ({
        getOverallAnalytics: jest.fn().mockRejectedValue(new Error('Overall Analytics Error')),
      }));

      const res = await request(app).get('/api/shorten/overall/myAlias');

      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Overall Analytics Error');
    });
  });
});
