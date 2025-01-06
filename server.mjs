import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.mjs';
import authRoutes from './src/routes/authRoutes.mjs';
import urlRoutes from './src/routes/urlRoutes.mjs';
import redisClient from './src/config/redis.mjs';
import { swaggerUi, swaggerSpec } from './src/config/swagger.mjs';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/shorten', urlRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    try {
      if (!redisClient.isOpen) await redisClient.connect();
      console.log('Redis connected');
    } catch (err) {
      console.error('Error connecting to Redis:', err);
    }
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (redisClient.isOpen) await redisClient.disconnect();
  process.exit(0);
});

export default app;
