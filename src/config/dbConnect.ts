import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async () => {
  try {
    const dbURI =
      process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
    await mongoose.connect(dbURI);
    logger.info('MongoDB connected successfully');
  } catch (error: any) {
    logger.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
