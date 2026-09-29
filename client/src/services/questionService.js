import api from './api';

export const questionService = {
  // Fetch questions with optional filters and search query
  getQuestions: async (params = {}) => {
    const response = await api.get('/questions', { params });
    return response.data;
  },

  // Get distinct topics for a specific role
  getTopics: async (role) => {
    const response = await api.get('/questions/topics', {
      params: role && role !== 'All' ? { role } : {},
    });
    return response.data;
  },

  // Get single question by ID
  getQuestionById: async (id) => {
    const response = await api.get(`/questions/${id}`);
    return response.data;
  },

  // Toggle bookmark on question
  toggleBookmark: async (id) => {
    const response = await api.post(`/questions/${id}/bookmark`);
    return response.data;
  },

  // Get all bookmarked questions for current user
  getBookmarks: async () => {
    const response = await api.get('/questions/bookmarks');
    return response.data;
  },
};

export default questionService;
