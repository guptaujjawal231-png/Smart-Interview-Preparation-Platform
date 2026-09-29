import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      default: 'Placement Candidate',
    },
    jobDescription: {
      type: String,
      required: [true, 'Job description text is required'],
    },
    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    matchedSkills: [String],
    missingSkills: [String],
    allResumeSkills: [String],
    recommendations: [String],
    suggestedTopics: [String],
  },
  {
    timestamps: true,
  }
);

const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
export default ResumeAnalysis;
