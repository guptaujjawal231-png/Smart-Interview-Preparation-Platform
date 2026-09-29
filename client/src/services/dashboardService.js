import api from './api';

export const dashboardService = {
  // Get aggregated dashboard analytics from real saved data
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

export default dashboardService;
