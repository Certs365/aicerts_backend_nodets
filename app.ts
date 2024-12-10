import dotenv from 'dotenv';
// Initialize environment variables
dotenv.config();

import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import connectDB from "./src/config/dbConnect"; // Adjust path if necessary
import allRoutes from './src/routes/index';

// Initialize database connection
connectDB();

// Create Express app
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors());

// Mount routes
app.use('/api', allRoutes);

// Start the server
const PORT = process.env.PORT || 8005;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});