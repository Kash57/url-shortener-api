import rateLimit from 'express-rate-limit';

// Limit to 100 requests per hour per IP
export const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per window
  message: {
    error: 'Too many requests, please try again later.',
  },
});
