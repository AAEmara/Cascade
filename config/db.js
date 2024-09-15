import mongoose from 'mongoose';

export default async function connectDB() {
  const dbURI = process.env.NODE_ENV === 'production' ?
    process.env.MONGO_URI_PROD : process.env.MONGO_URI_DEV;

  try {
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log('MongoDB connection failed:', error.message);
  }
};
