import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Sends cookies automatically on cross-site requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token if stored in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, token might be expired or missing
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage if expired
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
