import express from 'express';
import {
  getQuestions,
  getTopics,
  getQuestionById,
  toggleBookmark,
  getBookmarkedQuestions,
} from '../controllers/questionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getQuestions);
router.get('/topics', getTopics);
router.get('/bookmarks', protect, getBookmarkedQuestions);
router.get('/:id', getQuestionById);
router.post('/:id/bookmark', protect, toggleBookmark);

export default router;
