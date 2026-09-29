import express from 'express';
import {
  createSession,
  getSessionById,
  saveAnswer,
  finishSession,
  evaluateSession,
  getUserSessions,
  deleteSession,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

// All interview routes require student authentication
router.use(protect);

router.post('/create', createSession);
router.get('/history', getUserSessions);
router.get('/:id', getSessionById);
router.post('/:id/answer', saveAnswer);
router.post('/:id/finish', finishSession);
router.post('/:id/evaluate', aiLimiter, evaluateSession);
router.delete('/:id', deleteSession);

export default router;
