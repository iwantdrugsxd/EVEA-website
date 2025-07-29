// src/components/common/ProtectedRoute/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login', 
  requireAuth = true,
  allowedRoles = null // ['customer', 'vendor', 'admin']
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return path
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // If user is authenticated but we don't want authenticated users (like login/register pages)
  if (!requireAuth && isAuthenticated) {
    // Get the intended destination from state or default based on user role
    const from = location.state?.from;
    
    if (from) {
      return <Navigate to={from} replace />;
    }
    
    // Default redirect based on user role
    if (user?.role === 'vendor') {
      return <Navigate to="/vendor-dashboard" replace />;
    } else {
      return <Navigate to="/shop" replace />; // Redirect to ecommerce page
    }
  }

  // Check role-based access
  if (requireAuth && allowedRoles && user) {
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user role if they don't have access
      if (user.role === 'vendor') {
        return <Navigate to="/vendor-dashboard" replace />;
      } else {
        return <Navigate to="/shop" replace />;
      }
    }
  }

  // All checks passed, render the protected component
  return <>{children}</>;
};

export default ProtectedRoute;