import api from './api';

export const interviewService = {
  // Start a new mock interview session
  createSession: async (sessionConfig) => {
    const response = await api.post('/interviews/create', sessionConfig);
    return response.data;
  },

  // Retrieve an active or completed interview session
  getSession: async (sessionId) => {
    const response = await api.get(`/interviews/${sessionId}`);
    return response.data;
  },

  // Save student's answer for a specific question index
  saveAnswer: async (sessionId, { questionIndex, answer, timeRemainingSeconds }) => {
    const response = await api.post(`/interviews/${sessionId}/answer`, {
      questionIndex,
      answer,
      timeRemainingSeconds,
    });
    return response.data;
  },

  // Conclude the interview session
  finishSession: async (sessionId, { timeRemainingSeconds } = {}) => {
    const response = await api.post(`/interviews/${sessionId}/finish`, {
      timeRemainingSeconds,
    });
    return response.data;
  },

  // Evaluate all answers in session with AI rubric
  evaluateSession: async (sessionId) => {
    const response = await api.post(`/interviews/${sessionId}/evaluate`);
    return response.data;
  },

  // Get user's past interview session history
  getHistory: async () => {
    const response = await api.get('/interviews/history');
    return response.data;
  },

  // Delete a session from history
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/interviews/${sessionId}`);
    return response.data;
  },
};

export default interviewService;
