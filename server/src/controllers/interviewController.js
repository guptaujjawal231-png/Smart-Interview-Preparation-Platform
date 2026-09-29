import InterviewSession from '../models/InterviewSession.js';
import Question from '../models/Question.js';
import { evaluateAnswer } from '../services/aiService.js';

/**
 * @desc    Start a new mock interview session
 * @route   POST /api/interviews/create
 * @access  Private
 */
export const createSession = async (req, res, next) => {
  try {
    const {
      role = 'Software Developer',
      difficulty = 'Intermediate',
      questionCount = 5,
      timerMinutes = 15,
      topics = [],
    } = req.body;

    const query = { role };

    // Apply difficulty filter unless Mixed is selected
    if (difficulty && difficulty !== 'Mixed' && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    // Apply topics filter if specific topics chosen
    if (topics && topics.length > 0) {
      query.topic = { $in: topics };
    }

    // Fetch candidate questions
    let candidateQuestions = await Question.find(query);

    // Fallback: If not enough questions match strict criteria, broaden to all role questions
    if (candidateQuestions.length < questionCount) {
      candidateQuestions = await Question.find({ role });
    }

    if (candidateQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No questions found for ${role}. Please seed the database first.`,
      });
    }

    // Shuffle and pick unique questions (Fisher-Yates shuffle algorithm)
    const shuffled = [...candidateQuestions].sort(() => 0.5 - Math.random());
    const countToTake = Math.min(parseInt(questionCount, 10), shuffled.length);
    const selectedQuestions = shuffled.slice(0, countToTake);

    // Map questions into session subdocuments
    const sessionQuestions = selectedQuestions.map((q) => ({
      question: q._id,
      questionText: q.questionText,
      topic: q.topic,
      difficulty: q.difficulty,
      hints: q.hints || [],
      userAnswer: '',
      isAnswered: false,
      evaluation: null,
    }));

    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      difficulty,
      status: 'in_progress',
      questions: sessionQuestions,
      currentQuestionIndex: 0,
      totalQuestions: sessionQuestions.length,
      timerMinutes: parseInt(timerMinutes, 10),
      timeRemainingSeconds: parseInt(timerMinutes, 10) * 60,
      startTime: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Mock interview session initialized successfully',
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get interview session by ID
 * @route   GET /api/interviews/:id
 * @access  Private
 */
export const getSessionById = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found',
      });
    }

    // Enforce data ownership security
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this interview session',
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Save an answer for a specific question in the session
 * @route   POST /api/interviews/:id/answer
 * @access  Private
 */
export const saveAnswer = async (req, res, next) => {
  try {
    const { questionIndex, answer, timeRemainingSeconds } = req.body;
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const qIndex = parseInt(questionIndex, 10);
    if (qIndex < 0 || qIndex >= session.questions.length) {
      return res.status(400).json({ success: false, message: 'Invalid question index' });
    }

    session.questions[qIndex].userAnswer = answer || '';
    session.questions[qIndex].isAnswered = !!(answer && answer.trim().length > 0);
    session.currentQuestionIndex = qIndex;

    if (typeof timeRemainingSeconds === 'number') {
      session.timeRemainingSeconds = timeRemainingSeconds;
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Answer saved',
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Conclude interview session
 * @route   POST /api/interviews/:id/finish
 * @access  Private
 */
export const finishSession = async (req, res, next) => {
  try {
    const { timeRemainingSeconds } = req.body;
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    session.status = 'completed';
    session.endTime = new Date();
    session.durationSeconds = Math.max(
      1,
      Math.round((session.endTime - session.startTime) / 1000)
    );

    if (typeof timeRemainingSeconds === 'number') {
      session.timeRemainingSeconds = timeRemainingSeconds;
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Interview session completed',
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Evaluate all answers in session using AI Rubric Engine
 * @route   POST /api/interviews/:id/evaluate
 * @access  Private
 */
export const evaluateSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Evaluate each question using AI Engine (or mock fallback)
    for (let i = 0; i < session.questions.length; i++) {
      const q = session.questions[i];

      if (q.isAnswered && q.userAnswer && q.userAnswer.trim().length > 0) {
        // Fetch original question for keyConcepts & sampleAnswer
        const originalQuestion = await Question.findById(q.question);
        const evalResult = await evaluateAnswer(originalQuestion || q, q.userAnswer);
        q.evaluation = evalResult;
      } else {
        q.evaluation = {
          score: 0,
          technicalCorrectness: 0,
          clarity: 0,
          feedback: 'Question was skipped by candidate without submitting an answer.',
          missingConcepts: q.hints || ['Core Technical Concept'],
          strengths: [],
          suggestedImprovements: [
            'In placement interviews, always attempt an initial conceptual explanation rather than skipping.',
          ],
          modelAnswer: q.questionText,
          evaluatedAt: new Date(),
        };
      }
    }

    // Calculate overall average score
    const totalScore = session.questions.reduce(
      (sum, q) => sum + (q.evaluation?.score || 0),
      0
    );
    session.overallScore =
      Math.round((totalScore / Math.max(1, session.questions.length)) * 10) / 10;
    
    if (session.overallScore >= 8.0) {
      session.overallFeedback = 'Excellent technical performance! You demonstrated deep conceptual understanding, strong analytical clarity, and effectively covered key placement expectations.';
    } else if (session.overallScore >= 6.0) {
      session.overallFeedback = 'Good interview attempt. You showed solid foundational knowledge across core concepts. Focus on revising missing technical keywords and edge cases to push your score above 8.0.';
    } else {
      session.overallFeedback = 'Needs improvement. Practice articulating core definitions, underlying architecture, and concrete examples to meet campus placement standards.';
    }

    session.status = 'completed';

    if (!session.endTime) {
      session.endTime = new Date();
      session.durationSeconds = Math.max(
        1,
        Math.round((session.endTime - session.startTime) / 1000)
      );
    }

    await session.save();

    res.status(200).json({
      success: true,
      message: 'Interview session evaluated by AI engine',
      session,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get student's interview history
 * @route   GET /api/interviews/history
 * @access  Private
 */
export const getUserSessions = async (req, res, next) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('role difficulty status totalQuestions overallScore startTime endTime durationSeconds');

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an interview session from history
 * @route   DELETE /api/interviews/:id
 * @access  Private
 */
export const deleteSession = async (req, res, next) => {
  try {
    const session = await InterviewSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await session.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Interview session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
