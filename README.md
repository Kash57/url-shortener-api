URL Shortener API Project
This project implements a URL Shortener API using Node.js, Redis, MongoDB, and Docker. The application allows users to shorten URLs, track link analytics, and group links under specific topics. It also includes user authentication and rate limiting for secure and efficient usage.

Project Features:
URL Shortening: Create short links that redirect to original URLs.
Analytics: Track the usage and visits for each shortened URL.
User Authentication: Implemented Google Sign-In for user authentication.
Rate Limiting: Limits the number of requests a user can make to the API.
Link Grouping: Links can be grouped under specific topics for better management.
Dockerized: The application is containerized using Docker for easy deployment and scaling.
Technologies Used:
Node.js: Backend for building the API.
Redis: Used for caching data and managing sessions.
MongoDB: Database for storing URL and user data.
Docker: For containerizing the application and creating an isolated environment for the app.
Swagger: For API documentation and easy testing of the endpoints.


## Setting Up Environment Variables
1. Copy `.env.example` to `.env`.
2. Update the values in the `.env` file with your own credentials and configurations.
