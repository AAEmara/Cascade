import mongoose from 'mongoose';

async function connectDB() {
  const dbURI = process.env.NODE_ENV === 'test' ?
    process.env.MONGO_URI_TEST : process.env.MONGO_URI;

  try {
    const conn = await mongoose.connect(dbURI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch(error) {
    console.error('MongoDB connection failed:', error);
  }
}

export default connectDB;
