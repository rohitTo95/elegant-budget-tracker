import axios from 'axios';

// Configure axios base URL from environment variables
const baseURL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
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
      
      // Clear any local token cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
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
