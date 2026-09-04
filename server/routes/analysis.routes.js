import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { analyze, getAnalysis, getHistory, createCoverLetter } from '../controllers/analysis.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 4.5 * 1024 * 1024 }, // 4.5MB Vercel limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Routes
router.post('/analyze', upload.single('cv'), analyze);
router.get('/history/:sessionId', getHistory);
router.get('/:id', getAnalysis);
router.post('/:id/cover-letter', createCoverLetter);

export default router;
