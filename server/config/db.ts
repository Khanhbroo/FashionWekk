import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cachedConn: typeof mongoose | null = null;

export const connectDB = async (): Promise<typeof mongoose | null> => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  if (cachedConn) {
    return cachedConn;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI is not defined. Backend will operate in mock mode.');
    return null;
  }

  try {
    cachedConn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${cachedConn.connection.host}/${cachedConn.connection.name}`);
    return cachedConn;
  } catch (error: any) {
    console.error(`MongoDB connection error: ${error.message}`);
    return null;
  }
};
