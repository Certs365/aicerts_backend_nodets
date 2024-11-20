import dotenv from 'dotenv';
// Initialize environment variables
dotenv.config();
import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors"
import adsRoutes from './src/routes/ads';
import connectDB from "./src/config/dbConnect"; // Adjust path if necessary


// Initialize database connection
connectDB();



// Create Express app
const app = express();
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors())
// Mount routes
app.use('/api', adsRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
