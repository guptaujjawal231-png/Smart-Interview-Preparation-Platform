import api from './api';

export const resumeService = {
  // Upload PDF resume and analyze against job description
  analyzeResume: async (formData) => {
    const response = await api.post('/resume/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get most recent analysis for student
  getLatestAnalysis: async () => {
    const response = await api.get('/resume/latest');
    return response.data;
  },

  // Delete an analysis record
  deleteAnalysis: async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  },
};

export default resumeService;
