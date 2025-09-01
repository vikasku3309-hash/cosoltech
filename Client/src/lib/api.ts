import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (window.location.hostname === 'cosoltech.in' || window.location.hostname === 'www.cosoltech.in') 
    ? 'https://backend.cosoltech.in' 
    : 'http://localhost:5001';

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
    getById: (id: string) => `/contact/${id}`,
    updateStatus: (id: string) => `/contact/${id}/status`,
    reply: (id: string) => `/contact/${id}/reply`,
    delete: (id: string) => `/contact/${id}`,
    deleteMultiple: '/contact/delete-multiple',
  },
  // Job application endpoints
  jobApplications: {
    submit: '/job-applications/submit',
    getAll: '/job-applications/all',
    getById: (id: string) => `/job-applications/${id}`,
    updateStatus: (id: string) => `/job-applications/${id}/status`,
    reply: (id: string) => `/job-applications/${id}/reply`,
    delete: (id: string) => `/job-applications/${id}`,
    deleteMultiple: '/job-applications/delete-multiple',
  },
  // Files and resumes
  files: {
    getAll: '/files/my-files',
    resumes: '/files/resumes',
    download: (id: string) => `/files/download/${id}`,
    downloadResume: (applicationId: string) => `/files/resume/${applicationId}`,
    delete: (id: string) => `/files/${id}`,
    bulkDelete: '/files/bulk-delete',
    stats: '/files/stats/storage',
  },
  // Admin endpoints
  admin: {
    dashboard: '/admin/dashboard',
    dashboardStats: '/admin/dashboard/stats',
    contacts: '/admin/contacts',
    applications: '/admin/applications',
    files: '/admin/files',
    fileStats: '/admin/files/stats',
  },
};

export default api;