// evea-frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log('🌐 Backend URL:', API_BASE_URL);

  // API call helper with proper error handling and logging
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);
    
    const token = localStorage.getItem('vendorToken');
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    const config = { ...defaultOptions, ...options };
    
    try {
      const response = await fetch(url, config);
      console.log(`📡 API Response [${response.status}]:`, response.ok ? response.statusText : 'Error');
      
      const responseData = await response.json().catch(() => ({ 
        success: false, 
        message: 'Invalid server response' 
      }));

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return responseData;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  };

  // Check authentication status on app load
  const checkAuthStatus = async () => {
    console.log('🔍 Checking authentication status...');
    console.log(`🌐 Backend URL: ${API_BASE_URL}`);

    try {
      const token = localStorage.getItem('vendorToken');
      if (!token) {
        console.log('❌ No token found');
        setLoading(false);
        return;
      }

      console.log('🔑 Token found, verifying with server...');
      
      const response = await apiCall('/auth/me');
      console.log('📡 Auth check response:', response);
      
      if (response.success && response.data?.vendor) {
        setUser(response.data.vendor);
        setIsAuthenticated(true);
        console.log('✅ User authenticated:', response.data.vendor.businessName || response.data.vendor.email);
      } else {
        console.log('❌ Auth verification failed, removing token');
        localStorage.removeItem('vendorToken');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Auth check failed:', error.message);
      localStorage.removeItem('vendorToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    console.log('🔐 Login attempt for:', email);
    
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      console.log('📡 Login response:', response);

      if (response.success && response.data?.token) {
        localStorage.setItem('vendorToken', response.data.token);
        setUser(response.data.vendor);
        setIsAuthenticated(true);
        console.log('✅ Login successful for:', response.data.vendor.businessName);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    console.log('🚪 Logging out...');
    
    try {
      // Call logout endpoint if authenticated
      if (isAuthenticated) {
        await apiCall('/auth/logout', { method: 'POST' });
      }
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('vendorToken');
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Logged out successfully');
    }
  };

  // Registration Step 1 - Business Information
  const registerStep1 = async (formData) => {
    console.log('📝 Starting Step 1 Registration');
    console.log('📦 Form Data:', { ...formData, password: '[HIDDEN]' });
    
    try {
      const response = await apiCall('/api/vendors/register/step1', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      console.log('📡 Step 1 Response:', response);

      if (response.success) {
        // Store token and vendor info
        if (response.data?.token) {
          localStorage.setItem('vendorToken', response.data.token);
          setUser(response.data.vendor);
          setIsAuthenticated(true);
          console.log('🔑 Token stored and user authenticated');
        }
        
        console.log('✅ Step 1 Registration successful');
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Step 1 Registration failed:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // Registration Step 2 - Document Upload
  const registerStep2 = async (vendorId, files) => {
    console.log('📄 Starting Step 2 Document Upload');
    console.log('👥 Vendor ID:', vendorId);
    console.log('📁 Files to upload:', Object.keys(files || {}));
    
    try {
      const formData = new FormData();
      
      // Append files to FormData
      Object.entries(files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
          console.log(`📎 Added file: ${key} - ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        }
      });

      console.log('🚀 Uploading documents...');

      const token = localStorage.getItem('vendorToken');
      const response = await fetch(`${API_BASE_URL}/api/vendors/register/step2/${vendorId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      console.log('📡 Step 2 Response:', result);
      
      if (result.success) {
        console.log('✅ Step 2 Documents uploaded successfully');
        return { success: true, data: result.data };
      } else {
        throw new Error(result.message || 'Document upload failed');
      }
    } catch (error) {
      console.error('❌ Step 2 Upload failed:', error);
      return { 
        success: false, 
        message: error.message || 'Document upload failed. Please try again.' 
      };
    }
  };

  // Registration Step 3 - Services & Completion
  const registerStep3 = async (vendorId, serviceData) => {
    console.log('🎯 Starting Step 3 Service Registration');
    console.log('👥 Vendor ID:', vendorId);
    console.log('🎪 Service Data:', serviceData);
    
    try {
      const response = await apiCall(`/api/vendors/register/step3/${vendorId}`, {
        method: 'POST',
        body: JSON.stringify(serviceData)
      });

      console.log('📡 Step 3 Response:', response);

      if (response.success) {
        console.log('✅ Step 3 Registration completed successfully');
        
        // Update user data if needed
        if (user) {
          setUser(prev => ({
            ...prev,
            registrationStatus: 'pending_approval',
            profileCompletion: 100
          }));
        }
        
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Service registration failed');
      }
    } catch (error) {
      console.error('❌ Step 3 Registration failed:', error);
      return { 
        success: false, 
        message: error.message || 'Service registration failed. Please try again.' 
      };
    }
  };

  // Get vendor profile
  const getVendorProfile = async () => {
    try {
      const response = await apiCall('/api/vendors/profile');
      
      if (response.success) {
        setUser(response.data.vendor);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('❌ Get profile failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Update vendor profile
  const updateVendorProfile = async (updates) => {
    try {
      const response = await apiCall('/api/vendors/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      if (response.success) {
        setUser(response.data.vendor);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('❌ Update profile failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Get vendor services
  const getVendorServices = async () => {
    try {
      const response = await apiCall('/api/vendors/services');
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch services');
      }
    } catch (error) {
      console.error('❌ Get services failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Get dashboard stats
  const getDashboardStats = async () => {
    try {
      const response = await apiCall('/api/vendors/dashboard/stats');
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('❌ Get dashboard stats failed:', error);
      return { success: false, message: error.message };
    }
  };

  // Check if user needs to complete registration
  const needsRegistrationCompletion = () => {
    if (!user) return false;
    return user.registrationStatus !== 'approved' && user.registrationStatus !== 'pending_approval';
  };

  // Get registration step URL
  const getRegistrationStepUrl = () => {
    if (!user) return '/vendor/register';
    
    switch (user.registrationStep) {
      case 1:
        return '/vendor/register/step2';
      case 2:
        return '/vendor/register/step3';
      default:
        return '/vendor/dashboard';
    }
  };

  // Initialize auth check on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Context value
  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    
    // Authentication methods
    login,
    logout,
    checkAuthStatus,
    
    // Registration methods
    registerStep1,
    registerStep2,
    registerStep3,
    
    // Profile methods
    getVendorProfile,
    updateVendorProfile,
    
    // Service methods
    getVendorServices,
    
    // Dashboard methods
    getDashboardStats,
    
    // Utility methods
    needsRegistrationCompletion,
    getRegistrationStepUrl,
    
    // Direct API access
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};