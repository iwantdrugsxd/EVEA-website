// evea-frontend/src/pages/LoginPage/LoginPage.jsx - Updated with Google OAuth
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Heart, AlertCircle, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Check for URL errors (from OAuth redirects)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      switch (errorParam) {
        case 'google_auth_failed':
          setUrlError('Google authentication failed. Please try again.');
          break;
        case 'oauth_error':
          setUrlError('OAuth authentication error. Please try again.');
          break;
        case 'oauth_failed':
          setUrlError('OAuth authentication was cancelled or failed.');
          break;
        case 'login_failed':
          setUrlError('Login failed after OAuth. Please try again.');
          break;
        case 'callback_failed':
          setUrlError('Authentication callback failed. Please try again.');
          break;
        default:
          setUrlError('Authentication failed. Please try again.');
      }
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setUrlError('');

    try {
      await login(formData.email, formData.password);
      
      // Get intended destination from state or default based on user role
      const from = location.state?.from || '/shop';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by the Auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    // Clear any existing errors
    setUrlError('');
    
    // Redirect to Google OAuth endpoint
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/google`;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      {/* Background */}
      <div className="login-background">
        <div className="login-gradient" />
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="login-container">
        <div className="login-wrapper">
          {/* Left Side - Branding */}
          <div className="login-branding">
            <Link to="/" className="login-logo">
              <div className="logo-icon">
                <Heart className="heart-icon" size={20} />
              </div>
              <span className="logo-text">EVEA</span>
            </Link>

            <div className="branding-content">
              <h1 className="branding-title">
                Welcome back to your 
                <span className="title-highlight"> dream wedding</span>
              </h1>
              <p className="branding-subtitle">
                Continue planning your perfect celebration with our comprehensive 
                wedding services and trusted vendors.
              </p>

              <div className="branding-features">
                <div className="feature-item">
                  <div className="feature-icon">💕</div>
                  <span>Personalized planning tools</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎯</div>
                  <span>Curated vendor marketplace</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">✨</div>
                  <span>Seamless event coordination</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="login-form-section">
            <div className="login-form-container">
              <div className="form-header">
                <h2 className="form-title">Sign In</h2>
                <p className="form-subtitle">
                  Access your wedding planning dashboard
                </p>
              </div>

              {/* Error Display */}
              {(authError || urlError) && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{authError || urlError}</span>
                </div>
              )}

              {/* Social Login */}
              <div className="social-login">
                <button 
                  type="button" 
                  className="social-btn google-btn"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                >
                  <Chrome size={20} />
                  Continue with Google
                </button>
              </div>

              <div className="divider">
                <span>or continue with email</span>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={20} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="you@example.com"
                      disabled={isSubmitting}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <div className="field-error">
                      <AlertCircle size={14} />
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      placeholder="Enter your password"
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      disabled={isSubmitting}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <div className="field-error">
                      <AlertCircle size={14} />
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="form-options">
                  <Link to="/forgot-password" className="forgot-link">
                    Forgot your password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="login-btn"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="form-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="signup-link">
                    Create one here
                  </Link>
                </p>

                <div className="help-section">
                  <p className="help-text">
                    Need help? {' '}
                    <Link to="/support" className="help-link">
                      Contact Support
                    </Link>
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

export default LoginPage;