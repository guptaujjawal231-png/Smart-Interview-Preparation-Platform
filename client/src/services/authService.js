import api from './api';

export const authService = {
  // Register new student
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login existing student
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Logout student
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Get current logged-in user profile
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile settings
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  },
};

export default authService;
