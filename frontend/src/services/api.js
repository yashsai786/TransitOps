import axios from 'axios';

// Default to relative '/api' so Vite proxy routes it automatically in dev,
// or fallback to VITE_API_BASE_URL if set in production.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach request start time for latency calculation & token placeholder
apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date().getTime() };
    
    // JWT token placeholder for subsequent auth phases
    const token = localStorage.getItem('transitops_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Calculate latency and handle global errors
apiClient.interceptors.response.use(
  (response) => {
    if (response.config?.metadata) {
      response.latencyMs = new Date().getTime() - response.config.metadata.startTime;
    }
    return response;
  },
  (error) => {
    const errorDetails = {
      message: error.response?.data?.error?.message || error.message || 'Network Error',
      status: error.response?.status || 0,
      code: error.response?.data?.error?.code || error.code || 'UNKNOWN_ERROR',
      isNetworkError: !error.response
    };
    return Promise.reject(errorDetails);
  }
);

export default apiClient;

