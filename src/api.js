import axios from 'axios';

// Production-ready API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

console.log('API Base URL:', API_BASE_URL);

// Configure axios with production settings
axios.defaults.timeout = 30000; // 30 seconds for production
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor for logging in development
axios.interceptors.request.use(
  config => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    }
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => {
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response.status, response.data);
    }
    return response;
  },
  error => {
    console.error('API Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle common production errors
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

// Complete user registration (Main endpoint for production)
export const registerCompleteUser = async (userData) => {
    try {
        console.log('API: Sending complete registration request');
        const response = await axios.post(`${API_BASE_URL}/users/register-complete`, userData);
        console.log('API: Complete registration successful');
        return response.data;
    } catch (error) {
        console.error('API: Complete registration failed:', error);
        throw error.response?.data || error.message || 'Complete registration failed';
    }
};

// Check if email exists
export const checkEmailExists = async (email) => {
    try {
        console.log('API: Checking email availability');
        const response = await axios.get(`${API_BASE_URL}/users/email/${encodeURIComponent(email)}`);
        return true; // Email exists
    } catch (error) {
        if (error.response?.status === 404) {
            return false; // Email available
        }
        console.error('API: Email check error:', error);
        throw error.response?.data || error.message || 'Email check failed';
    }
};

// Get all users for data table
export const getAllUsers = async () => {
    try {
        console.log('API: Fetching all users');
        
        // Try main endpoint first
        try {
            const response = await axios.get(`${API_BASE_URL}/users`);
            console.log(`API: Successfully fetched ${response.data.length} users from /users`);
            return response.data;
        } catch (error) {
            // Fallback to data endpoint
            console.log('API: Trying fallback endpoint /data/users');
            const response = await axios.get(`${API_BASE_URL}/data/users`);
            console.log(`API: Successfully fetched ${response.data.length} users from /data/users`);
            return response.data;
        }
    } catch (error) {
        console.error('API: Failed to fetch users:', error);
        throw error.response?.data || error.message || 'Failed to load users';
    }
};

// Admin configuration endpoints
export const getAdminConfig = async () => {
    try {
        console.log('API: Fetching admin configuration');
        const response = await axios.get(`${API_BASE_URL}/admin/config`);
        console.log('API: Admin config fetched successfully');
        return response.data;
    } catch (error) {
        console.error('API: Failed to load admin config:', error);
        // Return default config for production resilience
        const defaultConfig = {
            2: ['ABOUT_ME', 'ADDRESS'],
            3: ['BIRTHDATE']
        };
        console.log('API: Using default admin config');
        return defaultConfig;
    }
};

export const updateAdminConfig = async (configData) => {
    try {
        console.log('API: Updating admin configuration');
        const response = await axios.put(`${API_BASE_URL}/admin/config`, configData);
        console.log('API: Admin config updated successfully');
        return response.data;
    } catch (error) {
        console.error('API: Failed to update admin config:', error);
        throw error.response?.data || error.message || 'Config update failed';
    }
};

// Legacy endpoints (kept for backward compatibility)
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

// Health check endpoints for production monitoring
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