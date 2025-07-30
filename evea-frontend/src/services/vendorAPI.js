import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const vendorAPI = axios.create({
  baseURL: `${API_BASE_URL}/vendors`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
vendorAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('vendorToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
vendorAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorData');
      window.location.href = '/vendor-login';
    }
    return Promise.reject(error);
  }
);

// ==================== REGISTRATION API CALLS ====================

export const registerVendorStep1 = async (formData) => {
  try {
    const response = await vendorAPI.post('/register/step1', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const uploadVendorDocuments = async (vendorId, formData) => {
  try {
    const response = await vendorAPI.post(`/register/step2/${vendorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Document upload failed' };
  }
};

export const registerVendorStep3 = async (vendorId, servicesData) => {
  try {
    const response = await vendorAPI.post(`/register/step3/${vendorId}`, servicesData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Service registration failed' };
  }
};

export const getRegistrationStatus = async (vendorId) => {
  try {
    const response = await vendorAPI.get(`/register/status/${vendorId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch registration status' };
  }
};

// ==================== AUTHENTICATION API CALLS ====================

export const loginVendor = async (credentials) => {
  try {
    const response = await vendorAPI.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logoutVendor = async () => {
  try {
    const response = await vendorAPI.post('/logout');
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    return response.data;
  } catch (error) {
    // Clear local storage even if logout request fails
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorData');
    throw error.response?.data || { message: 'Logout failed' };
  }
};

// ==================== DASHBOARD API CALLS ====================

export const getVendorProfile = async () => {
  try {
    const response = await vendorAPI.get('/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await vendorAPI.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
  }
};

export const getVendorServices = async () => {
  try {
    const response = await vendorAPI.get('/services');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch services' };
  }
};

export const createVendorService = async (serviceData) => {
  try {
    const response = await vendorAPI.post('/services', serviceData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create service' };
  }
};