import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Target role is required'],
      enum: ['Software Developer', 'Data Analyst', 'ECE / Core Electronics'],
      index: true,
    },
    topic: {
      type: String,
      required: [true, 'Topic is required'],
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
      index: true,
    },
    keyConcepts: [
      {
        type: String,
        trim: true,
      },
    ],
    hints: [
      {
        type: String,
        trim: true,
      },
    ],
    explanation: {
      type: String,
      required: [true, 'Technical explanation is required'],
      trim: true,
    },
    sampleAnswer: {
      type: String,
      required: [true, 'Sample model answer is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fuzzy keyword search across questions, topics, and key concepts
questionSchema.index({
  questionText: 'text',
  topic: 'text',
  keyConcepts: 'text',
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
