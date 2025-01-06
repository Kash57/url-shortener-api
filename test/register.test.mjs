import request from 'supertest';
import app from '../server.mjs';

describe('POST /api/auth/register', () => {
  it('should return userId and name if the ID token is valid', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        id_token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFiODYxNGZmNjI4OTNiYWRjZTVhYTc5YTc3MDNiNTk2NjY1ZDI0NzgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk2NTc5MjMxOTE3MDkxNDI4MjEiLCJlbWFpbCI6IndvcmtrYXNoc29uaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImhNSkN4RXNuazRpMzEtNTJOVFhhTUEiLCJuYW1lIjoiR29vZ2xlQXV0aCBLYXNoIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0tOdS1zSEx0ajd0QWI1c3JzUXF4cURYcDNUUElNX1ZMOWMxNHJ5QmJLdkVZRl9mdz1zOTYtYyIsImdpdmVuX25hbWUiOiJHb29nbGVBdXRoIiwiZmFtaWx5X25hbWUiOiJLYXNoIiwiaWF0IjoxNzM2MDgzNTMzLCJleHAiOjE3MzYwODcxMzN9.bTCryypKeZLZMS15fYZOslaG3LJ63mnoHmAoE47JqsPJQt8fJSn4b79yVwCTk1dwhaqFT6A0X8holJWI1TDRRHBn3TJVwiA8yI8lGVmxqsAyaEnDQZfAZ9ITt7bNU76sb13NCBThDKJgZkj0kTvh2E9Pz9BPWP1Qk66W8BV1bPBf-ALb-wpwzBda8A8fflsqDLWM4j5XYZFybrcA_quSBcEyDULBynrd_Wj8N5Y59mfVxU7PkTFAPrgi5wYky1jdYF-6aoodQKbvOYjzUu0KO2hig3QS9aeDYDlIy52SAPcAkj-cMHlm0qGIU9z6YttEOouLXzI5G6LJsGVBjO-JfA'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('name');
  });

  it('should return 400 if the ID token is missing', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'ID Token is required');
  });

  it('should return 500 if there is an internal error', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        id_token: 'invalidToken'
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Error during registration or login');
  });
});
