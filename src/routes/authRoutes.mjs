import express from 'express';
import { register } from '../controllers/authController.mjs';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication and registration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user via Google OAuth2
 *     description: Registers a new user by verifying their Google ID token and creating a user account if it doesn't exist.
 *     operationId: registerUser
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: The ID token received from the Google OAuth2 flow.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_token:
 *                 type: string
 *                 description: Google ID token that is used for authenticating the user.
 *                 example: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFiODYxNGZmNjI4OTNiYWRjZTVhYTc5YTc3MDNiNTk2NjY1ZDI0NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk2NTc5MjMxOTE3MDkxNDI4MjEiLCJlbWFpbCI6IndvcmtrYXNoc29uaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImhNSkN4RXNuazRpMzEtNTJOVFhhTUEiLCJuYW1lIjoiR29vZ2xlQXV0aCBLYXNoIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tOdS1zSEx0ajd0QWI1c3JzUXF4cURYcDNUUElNX1ZMOWMxNHJ5QmJLdkVZRl9mdz1zOTYtYyIsImdpdmVuX25hbWUiOiJHb29nbGVBdXRoIiwiZmFtaWx5X25hbWUiOiJLYXNoIiwiaWF0IjoxNzM2MDgzNTMzLCJleHAiOjE3MzYwODcxMzN9.bTCryypKeZLZMS15fYZOslaG3LJ63mnoHmAoE47JqsPJQt8fJSn4b79yVwCTk1dwhaqFT6A0X8holJWI1TDRRHBn3TJVwiA8yI8lGVmxqsAyaEnDQZfAZ9ITt7bNU76sb13NCBThDKJgZkj0kTvh2E9Pz9BPWP1Qk66W8BV1bPBf-ALb-wpwzBda8A8fflsqDLWM4j5XYZFybrcA_quSBcEyDULBynrd_Wj8N5Y59mfVxU7PkTFAPrgi5wYky1jdYF-6aoodQKbvOYjzUu0KO2hig3QS9aeDYDlIy52SAPcAkj-cMHlm0qGIU9z6YttEOouLXzI5G6LJsGVBjO-JfA"
 *     responses:
 *       '200':
 *         description: Successfully registered or logged in user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The unique user ID.
 *                   example: "67712da406c0475068c195c5"
 *                 name:
 *                   type: string
 *                   description: The name of the registered user.
 *                   example: "GoogleAuth Kash"
 *       '400':
 *         description: ID token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "ID Token is required"
 *       '500':
 *         description: Internal server error, failed to register or login.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error during registration or login"
 *                 message:
 *                   type: string
 *                   example: "JWT verification failed"
 */
router.post('/register', register);

export default router;
