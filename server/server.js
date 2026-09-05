import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initDatabase } from './config/db.js';
import analysisRoutes from './routes/analysis.routes.js';
import interviewRoutes from './routes/interview.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (required for Render / Vercel / reverse proxies to calculate rate limits accurately)
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      const cleanOrigin = origin ? origin.replace(/\/+$/, '') : origin;
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy does not allow access from ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate Limiters
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 15, // max 15 analysis requests per hour per IP
  message: { error: 'Too many analysis requests. Please try again in an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const interviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 60, // max 60 messages per 15 minutes per IP
  message: { error: 'Rate limit exceeded for interview messages. Please slow down.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Vercel Serverless Route Normalizer
app.use((req, res, next) => {
  if (req.url === '/api/index.js' || req.url === '/api/index' || req.url === '/api' || req.url === '/api/') {
    req.url = '/api/health';
  }
  next();
});

// Initialize DB on cold start
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (err) {
      console.error('Database connection error on request:', err.message);
    }
  }
  next();
});

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get(['/', '/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', message: 'AI Career Assistant API is running' });
});

// Routes
app.use('/api/analysis', analysisLimiter, analysisRoutes);
app.use('/api/interview', interviewLimiter, interviewRoutes);

// Start server locally (if not running in Vercel serverless environment)
if (!process.env.VERCEL) {
  initDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }).catch((error) => {
    console.error('Failed to start server:', error);
  });
}

export default app;
