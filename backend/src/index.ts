import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import dietRoutes from './routes/dietRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});
app.get('/favicon.ico', (req, res) => res.status(204).end());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', dietRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
