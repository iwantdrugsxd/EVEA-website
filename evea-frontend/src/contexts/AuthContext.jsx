// evea-frontend/src/contexts/AuthContext.jsx - Enhanced with better error handling
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Enhanced API helper function with better error handling
  const apiCall = async (endpoint, options = {}) => {
    const url = `${API_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for Passport sessions
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🌐 API Call: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, config);
      
      // Reset connection error on successful request
      setConnectionError(false);
      
      const data = await response.json();
      console.log(`📡 API Response [${response.status}]:`, data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      
      // Check for network/connection errors
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('🔥 NETWORK ERROR: Backend server is not reachable!');
        console.error('🔧 Troubleshooting:');
        console.error('1. Check if backend server is running on', API_URL);
        console.error('2. Verify REACT_APP_API_URL in .env file');
        console.error('3. Check for CORS issues');
        setConnectionError(true);
      }
      
      throw error;
    }
  };

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking authentication status...');
      console.log('🌐 Backend URL:', API_URL);
      
      const response = await apiCall('/auth/me');
      
      if (response.success && response.data.user) {
        console.log('✅ User authenticated:', response.data.user.email);
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        console.log('❌ User not authenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // 401 Unauthorized is expected for non-authenticated users
      if (error.message === 'No authentication token provided' || 
          error.message.includes('401') || 
          error.message.includes('Unauthorized')) {
        console.log('ℹ️ User not authenticated (expected behavior)');
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
      } 
      // Network errors
      else if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.error('🔥 NETWORK ERROR: Backend server is not reachable!');
        console.error('🔧 Troubleshooting:');
        console.error('1. Check if backend server is running on', API_URL);
        console.error('2. Verify REACT_APP_API_URL in .env file');
        console.error('3. Check for CORS issues');
        setConnectionError(true);
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
      }
      // Other errors
      else {
        console.log('❌ Auth check failed:', error.message);
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      console.log('📝 Registering user:', userData.email);
      setIsLoading(true);

      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (response.success) {
        console.log('✅ Registration successful:', response.data.user.email);
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user with email/password
  const login = async (email, password) => {
    try {
      console.log('🔑 Logging in user:', email);
      setIsLoading(true);

      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        console.log('✅ Login successful:', response.data.user.email);
        setUser(response.data.user);
        setToken(response.data.token);
        setIsAuthenticated(true);
        
        return response.data;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      console.log('👋 Logging out user...');
      setIsLoading(true);

      // Call logout endpoint to clear server-side session
      await apiCall('/auth/logout', {
        method: 'POST',
      });

      console.log('✅ Logout successful');
      
      // Clear client-side state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // Optional: Clear any local storage if used
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if server logout fails, clear client state
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if user has specific role
  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
  };

  // Helper function to check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return user?.role && roles.includes(user.role);
  };

  // Helper function to get user's full name
  const getUserFullName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  };

  // Helper function to get user's initials
  const getUserInitials = () => {
    if (!user) return '';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const value = {
    // State
    user,
    isAuthenticated,
    isLoading,
    token,
    connectionError, // Add this to expose connection status
    
    // Authentication methods
    register,
    login,
    logout,
    checkAuthStatus,
    
    // Helper functions
    hasRole,
    hasAnyRole,
    getUserFullName,
    getUserInitials,
    
    // API helper
    apiCall
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};