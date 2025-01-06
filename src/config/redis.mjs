import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisHost = process.env.REDIS_HOST || 'localhost';

const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export default redisClient;
