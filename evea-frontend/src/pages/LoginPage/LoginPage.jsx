// src/pages/LoginPage/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart, Globe, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Auth context
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from || '/shop'; // Default to ecommerce page

  useEffect(() => {
    // Clear any existing errors when component mounts
    clearError();
  }, [clearError]);

  useEffect(() => {
    // Clear form errors when auth error changes
    if (error) {
      setFormErrors({ general: error });
    } else {
      setFormErrors({});
    }
  }, [error]);

  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general error when user makes changes
    if (formErrors.general) {
      setFormErrors(prev => ({
        ...prev,
        general: ''
      }));
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormErrors({});
    clearError();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect based on user role or intended destination
        if (result.user.role === 'vendor') {
          navigate('/vendor-dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider) => {
    // Implement social login here
    console.log(`Social login with ${provider}`);
    // For now, just show a message
    setFormErrors({ 
      general: `${provider} login will be available soon!` 
    });
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-wrapper">
          {/* Left Side - Branding */}
          <div className="login-branding">
            <Link to="/" className="login-logo">
              <div className="logo-icon">
                <Heart className="heart-icon" />
              </div>
              <span className="logo-text">Evea</span>
            </Link>
            
            <div className="branding-content">
              <h1 className="branding-title">
                Welcome Back to 
                <span className="title-highlight"> Evea</span>
              </h1>
              <p className="branding-subtitle">
                Continue planning your perfect events with India's most trusted event marketplace.
              </p>
              
              <div className="branding-features">
                <div className="feature-item">
                  <div className="feature-icon">✨</div>
                  <span>50,000+ verified vendors</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <span>Save up to 40% on services</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🚀</div>
                  <span>Plan events in minutes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="login-form-section">
            <div className="login-form-container">
              <div className="form-header">
                <h2 className="form-title">Sign In</h2>
                <p className="form-subtitle">
                  Enter your credentials to access your account
                </p>
              </div>

              {/* Error Display */}
              {formErrors.general && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{formErrors.general}</span>
                </div>
              )}

              {/* Social Login */}
              <div className="social-login">
                <button 
                  type="button"
                  className="social-btn google-btn"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                >
                  <Globe size={20} />
                  <span>Continue with Google</span>
                </button>
                <button 
                  type="button"
                  className="social-btn facebook-btn"
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={isLoading}
                >
                  <Users size={20} />
                  <span>Continue with Facebook</span>
                </button>
              </div>

              <div className="divider">
                <span>Or continue with email</span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="login-form" noValidate>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${formErrors.email ? 'error' : ''}`}
                      placeholder="Enter your email"
                      disabled={isLoading}
                      autoComplete="email"
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {formErrors.email && (
                    <span id="email-error" className="field-error">{formErrors.email}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`form-input ${formErrors.password ? 'error' : ''}`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      autoComplete="current-password"
                      aria-describedby={formErrors.password ? 'password-error' : undefined}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      disabled={isLoading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <span id="password-error" className="field-error">{formErrors.password}</span>
                  )}
                </div>

                <div className="form-options">
                  <label className="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="login-btn" 
                  disabled={isLoading}
                  aria-describedby="login-button-desc"
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
                <span id="login-button-desc" className="sr-only">
                  Click to sign in to your account
                </span>
              </form>

              <div className="form-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="signup-link">
                    Create one here
                  </Link>
                </p>
                
                {/* Help Section */}
                <div className="help-section">
                  <p className="help-text">
                    Need help? <Link to="/contact" className="help-link">Contact Support</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;