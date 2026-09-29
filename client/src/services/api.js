import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Sends cookies automatically on cross-site requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling 401 unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, token might be expired or missing
    if (error.response && error.response.status === 401) {
      // Allow caller to handle or redirect gracefully
    }
    return Promise.reject(error);
  }
);

export default api;
