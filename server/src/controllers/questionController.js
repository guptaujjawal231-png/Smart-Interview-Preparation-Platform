import Question from '../models/Question.js';
import User from '../models/User.js';

/**
 * @desc    Get questions with search, filter, and pagination
 * @route   GET /api/questions
 * @access  Public
 */
export const getQuestions = async (req, res, next) => {
  try {
    const { role, topic, difficulty, search, page = 1, limit = 9 } = req.query;

    const query = {};

    // Filter by role
    if (role && role !== 'All') {
      query.role = role;
    }

    // Filter by topic
    if (topic && topic !== 'All') {
      query.topic = topic;
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    // Search keyword in question text, topic, or key concepts
    if (search && search.trim() !== '') {
      query.$or = [
        { questionText: { $regex: search.trim(), $options: 'i' } },
        { topic: { $regex: search.trim(), $options: 'i' } },
        { keyConcepts: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get unique topics for a role
 * @route   GET /api/questions/topics
 * @access  Public
 */
export const getTopics = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role && role !== 'All' ? { role } : {};
    const topics = await Question.distinct('topic', filter);

    res.status(200).json({
      success: true,
      topics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single question details by ID
 * @route   GET /api/questions/:id
 * @access  Public
 */
export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle question bookmark for logged-in student
 * @route   POST /api/questions/:id/bookmark
 * @access  Private
 */
export const toggleBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const questionId = req.params.id;

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isBookmarked = user.bookmarkedQuestions.includes(questionId);

    if (isBookmarked) {
      user.bookmarkedQuestions = user.bookmarkedQuestions.filter(
        (id) => id.toString() !== questionId
      );
    } else {
      user.bookmarkedQuestions.push(questionId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      bookmarked: !isBookmarked,
      message: !isBookmarked ? 'Question bookmarked' : 'Bookmark removed',
      bookmarkedQuestions: user.bookmarkedQuestions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookmarked questions for current student
 * @route   GET /api/questions/bookmarks
 * @access  Private
 */
export const getBookmarkedQuestions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarkedQuestions');

    res.status(200).json({
      success: true,
      bookmarks: user.bookmarkedQuestions || [],
    });
  } catch (error) {
    next(error);
  }
};
