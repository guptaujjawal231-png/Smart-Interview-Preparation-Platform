import InterviewSession from '../models/InterviewSession.js';
import User from '../models/User.js';

/**
 * @desc    Get aggregated student dashboard statistics computed from real database data
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Fetch all completed sessions for this student
    const completedSessions = await InterviewSession.find({
      user: userId,
      status: 'completed',
    }).sort({ createdAt: -1 });

    const totalSessions = completedSessions.length;

    // Calculate total questions attempted and accumulate topic scores
    let totalQuestionsAttempted = 0;
    let totalScoreSum = 0;
    const topicScoresMap = {}; // { [topic]: { totalScore: number, count: number } }

    completedSessions.forEach((session) => {
      totalScoreSum += session.overallScore || 0;

      session.questions.forEach((q) => {
        if (q.isAnswered) {
          totalQuestionsAttempted++;
        }

        const score = q.evaluation ? q.evaluation.score : 0;
        const topic = q.topic || 'General';

        if (!topicScoresMap[topic]) {
          topicScoresMap[topic] = { totalScore: 0, count: 0 };
        }

        if (q.isAnswered && q.evaluation) {
          topicScoresMap[topic].totalScore += score;
          topicScoresMap[topic].count += 1;
        }
      });
    });

    const avgScore =
      totalSessions > 0
        ? Math.round((totalScoreSum / totalSessions) * 10) / 10
        : 0;

    // Convert topic map into array formatted for Recharts
    let topicProficiencyData = Object.keys(topicScoresMap).map((topic) => {
      const { totalScore, count } = topicScoresMap[topic];
      const avg = count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0;

      return {
        topic,
        score: avg,
        status: avg >= 8.0 ? 'Strong' : avg >= 6.5 ? 'Good' : 'Needs Review',
      };
    });

    // Baseline fallback if student has not taken any mock interviews yet
    if (topicProficiencyData.length === 0) {
      const isEce = req.user.targetRole === 'ECE / Core Electronics';
      const isData = req.user.targetRole === 'Data Analyst';

      if (isEce) {
        topicProficiencyData = [
          { topic: 'Digital Electronics', score: 0, status: 'Not Practiced' },
          { topic: 'Embedded C', score: 0, status: 'Not Practiced' },
          { topic: 'Microcontrollers (ARM/8051)', score: 0, status: 'Not Practiced' },
          { topic: 'Analog Electronics', score: 0, status: 'Not Practiced' },
          { topic: 'VLSI Fundamentals', score: 0, status: 'Not Practiced' },
        ];
      } else if (isData) {
        topicProficiencyData = [
          { topic: 'SQL & Joins', score: 0, status: 'Not Practiced' },
          { topic: 'Python & Pandas', score: 0, status: 'Not Practiced' },
          { topic: 'Statistics & Probability', score: 0, status: 'Not Practiced' },
          { topic: 'Data Visualization', score: 0, status: 'Not Practiced' },
        ];
      } else {
        topicProficiencyData = [
          { topic: 'Data Structures & Algorithms', score: 0, status: 'Not Practiced' },
          { topic: 'Operating Systems', score: 0, status: 'Not Practiced' },
          { topic: 'DBMS & SQL', score: 0, status: 'Not Practiced' },
          { topic: 'Computer Networks', score: 0, status: 'Not Practiced' },
        ];
      }
    }

    // Identify weak topics (score < 6.5 among practiced topics)
    const weakTopics = topicProficiencyData
      .filter((t) => t.score > 0 && t.score < 6.5)
      .map((t) => ({
        name: t.topic,
        score: `${t.score}/10`,
        priority: t.score < 5.0 ? 'High' : 'Medium',
      }));

    // Recent 3 sessions for quick overview
    const recentSessions = completedSessions.slice(0, 3).map((s) => ({
      id: s._id,
      role: s.role,
      difficulty: s.difficulty,
      date: new Date(s.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score: s.overallScore,
      questions: s.questions.length,
    }));

    res.status(200).json({
      success: true,
      stats: {
        totalSessions,
        questionsAttempted: totalQuestionsAttempted,
        avgScore,
        weakTopics,
        topicProficiencyData,
        recentSessions,
      },
    });
  } catch (error) {
    next(error);
  }
};
