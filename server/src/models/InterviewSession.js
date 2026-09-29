import mongoose from 'mongoose';

const answerEvaluationSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    technicalCorrectness: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    clarity: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    feedback: {
      type: String,
      default: '',
    },
    missingConcepts: [
      {
        type: String,
      },
    ],
    strengths: [
      {
        type: String,
      },
    ],
    suggestedImprovements: [
      {
        type: String,
      },
    ],
    modelAnswer: {
      type: String,
      default: '',
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const sessionQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      default: 'Intermediate',
    },
    hints: [String],
    userAnswer: {
      type: String,
      default: '',
      trim: true,
    },
    isAnswered: {
      type: Boolean,
      default: false,
    },
    evaluation: {
      type: answerEvaluationSchema,
      default: null,
    },
  },
  { _id: true }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Software Developer', 'Data Analyst', 'ECE / Core Electronics'],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Mixed'],
      default: 'Intermediate',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    questions: [sessionQuestionSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    timerMinutes: {
      type: Number,
      default: 15,
    },
    timeRemainingSeconds: {
      type: Number,
      default: 900,
    },
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    durationSeconds: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
