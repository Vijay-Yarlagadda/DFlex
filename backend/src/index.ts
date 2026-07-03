import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { clerkAuth } from './middlewares/auth';
import dietRoutes from './routes/dietRoutes';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check (before auth)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Apply Clerk middleware globally so we can access req.auth in protected routes
app.use(clerkAuth);

// Routes
app.use('/api', dietRoutes);



// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
