import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminInfo');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  // Contact endpoints
  contact: {
    submit: '/contact/submit',
    getAll: '/contact/all',
    updateStatus: (id: string) => `/contact/${id}/status`,
  },
  // Job application endpoints
  jobApplications: {
    submit: '/job-applications/submit',
    getAll: '/job-applications/all',
    getById: (id: string) => `/job-applications/${id}`,
    updateStatus: (id: string) => `/job-applications/${id}/status`,
  },
  // Admin endpoints
  admin: {
    dashboard: '/admin/dashboard',
  },
};

export default api;