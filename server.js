import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' :
  '.env.development';
dotenv.config({ path: envFile });

const app = express();
const port = process.env.PORT || 5000;


// Running the MongoDB server.
connectDB();

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
