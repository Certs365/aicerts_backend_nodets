import dotenv from 'dotenv';
// Initialize environment variables
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/dbConnect'; // Adjust path if necessary
import allRoutes from './routes/index';
import { connectMailServer } from './utils/mailFetching';
import logger from './utils/logger';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Issuer module apis',
      version: '1.0.0',
      description: 'API documentation for Issuer Module API',
    },
  },
  apis: ['./src/routes/*.ts'], // Update the path to match your actual routes folder
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Initialize database connection
connectDB();

// Create Express app
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors());

// swagger
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Mount routes
app.use('/api', allRoutes);

// Start the server
const PORT = process.env.PORT || 8005;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
