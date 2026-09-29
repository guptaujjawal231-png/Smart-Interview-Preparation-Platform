import ResumeAnalysis from '../models/ResumeAnalysis.js';
import { extractPdfText, analyzeResumeAndJD } from '../services/pdfParserService.js';

/**
 * @desc    Upload PDF resume and analyze against job description
 * @route   POST /api/resume/analyze
 * @access  Private
 */
export const analyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF resume file.',
      });
    }

    const { jobDescription, jobTitle = 'Software Engineer' } = req.body;

    if (!jobDescription || jobDescription.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the target Job Description to compare against.',
      });
    }

    // Extract text from memory buffer
    const resumeText = await extractPdfText(req.file.buffer);

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message:
          'Could not extract text from the PDF. The file may be image-only (scanned) or empty.',
      });
    }

    // Execute skill-matching algorithm
    const analysis = analyzeResumeAndJD(resumeText, jobDescription);

    // Save record to database
    const savedRecord = await ResumeAnalysis.create({
      user: req.user._id,
      fileName: req.file.originalname,
      jobTitle,
      jobDescription,
      matchScore: analysis.matchScore,
      matchedSkills: analysis.matchedSkills,
      missingSkills: analysis.missingSkills,
      allResumeSkills: analysis.allResumeSkills,
      recommendations: analysis.recommendations,
      suggestedTopics: analysis.suggestedTopics,
    });

    res.status(200).json({
      success: true,
      message: 'Resume analyzed successfully',
      analysis: savedRecord,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get latest resume analysis for current student
 * @route   GET /api/resume/latest
 * @access  Private
 */
export const getRecentAnalysis = async (req, res, next) => {
  try {
    const latest = await ResumeAnalysis.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      analysis: latest || null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a resume analysis record
 * @route   DELETE /api/resume/:id
 * @access  Private
 */
export const deleteAnalysis = async (req, res, next) => {
  try {
    const record = await ResumeAnalysis.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    if (record.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    await record.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Analysis record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
