import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for the URL Shortener service',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/routes/*.mjs'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export { swaggerUi, swaggerSpec };
