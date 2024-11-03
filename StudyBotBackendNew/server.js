import express from 'express';
import connectDB from './db.js';
import authRoutes from './routes/auth.js';

const app = express();
connectDB(); // Initialize MongoDB connection

app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
