import axios from 'axios';

// Production API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

console.log('API Base URL:', API_BASE_URL);

// Configure axios for production
axios.defaults.timeout = 30000;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor
axios.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    
    // Handle common errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please try again');
    }
    if (error.response?.status === 500) {
      throw new Error('Server error - please try again later');
    }
    if (error.response?.status === 0) {
      throw new Error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

// Complete user registration
export const registerCompleteUser = async (userData) => {
  try {
    console.log('API: Complete registration request');
    const response = await axios.post(`${API_BASE_URL}/users/register-complete`, userData);
    console.log('API: Registration successful');
    return response.data;
  } catch (error) {
    console.error('API: Registration failed:', error);
    throw error.response?.data || error.message || 'Registration failed';
  }
};

// Check email availability
export const checkEmailExists = async (email) => {
  try {
    console.log('API: Checking email:', email);
    const response = await axios.get(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);
    console.log('API: Email exists');
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('API: Email available');
      return false;
    }
    console.error('API: Email check error:', error);
    throw error.response?.data || error.message || 'Email check failed';
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    console.log('API: Fetching users');
    
    // Try main endpoint
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      console.log(`API: Got ${response.data.length} users from /users`);
      return response.data;
    } catch (error) {
      // Fallback endpoint
      console.log('API: Trying fallback /data/users');
      const response = await axios.get(`${API_BASE_URL}/data/users`);
      console.log(`API: Got ${response.data.length} users from /data/users`);
      return response.data;
    }
  } catch (error) {
    console.error('API: Failed to fetch users:', error);
    throw error.response?.data || error.message || 'Failed to load users';
  }
};

// Admin configuration
export const getAdminConfig = async () => {
  try {
    console.log('API: Fetching admin config');
    const response = await axios.get(`${API_BASE_URL}/admin/config`);
    console.log('API: Admin config loaded');
    return response.data;
  } catch (error) {
    console.error('API: Admin config failed, using default');
    // Return default config for resilience
    return {
      2: ['ABOUT_ME', 'ADDRESS'],
      3: ['BIRTHDATE']
    };
  }
};

export const updateAdminConfig = async (configData) => {
  try {
    console.log('API: Updating admin config');
    const response = await axios.put(`${API_BASE_URL}/admin/config`, configData);
    console.log('API: Admin config updated');
    return response.data;
  } catch (error) {
    console.error('API: Admin config update failed:', error);
    throw error.response?.data || error.message || 'Config update failed';
  }
};

// Legacy/additional endpoints
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Registration failed';
  }
};

export const updateUserStep = async (userId, step, userData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/step/${step}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Update failed';
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'User not found';
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/test`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Health check failed';
  }
};

export default {
  registerCompleteUser,
  checkEmailExists,
  getAllUsers,
  getAdminConfig,
  updateAdminConfig,
  registerUser,
  updateUserStep,
  getUserById,
  healthCheck
};