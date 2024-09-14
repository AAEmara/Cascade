#!/usr/bin/node

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  const dbURI = process.env.NODE_ENV === 'production' ?
    process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
  }
};

export default connectDB;
