import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import setupSwagger from './swagger/swagger.js';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); 
app.use(morgan('dev'));
app.use(express.json());
setupSwagger(app);

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', companyRoutes);
app.use('/api', departmentRoutes);
app.use('/api', roleRoutes);

app.listen(PORT, () => {
  console.log(`Server started and listening on port ${PORT}`);
});

export default app;
