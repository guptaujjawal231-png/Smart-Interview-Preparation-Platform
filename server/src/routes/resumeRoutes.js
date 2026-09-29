import express from 'express';
import {
  analyzeResume,
  getRecentAnalysis,
  deleteAnalysis,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Protected routes
router.use(protect);

router.post('/analyze', uploadResume.single('resume'), analyzeResume);
router.get('/latest', getRecentAnalysis);
router.delete('/:id', deleteAnalysis);

export default router;
