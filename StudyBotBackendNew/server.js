import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';

const app = express();
// connectDB(); // Initialize MongoDB connection

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
