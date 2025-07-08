import axios from 'axios';

// Configure axios base URL from environment variables
const baseURL = import.meta.env.VITE_BACKEND_URL || import.meta.env.production.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // No longer need credentials for localStorage approach
  timeout: 10000,
});

// Add request interceptor to include Authorization header with token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);

    // Get token from localStorage and add to Authorization header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(baseURL)
      console.log('Authorization header added with token');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token validation and error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token is invalid, expired, or missing
      console.error('Authentication failed - token invalid or expired');

      // Clear token and username from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('username');

      // Only redirect if we're not already on login/signup pages
      const currentPath = window.location.pathname;
      if (!['/login', '/signup', '/'].includes(currentPath)) {
        console.log('Redirecting to login due to authentication failure');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
