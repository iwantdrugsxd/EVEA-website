// evea-frontend/src/pages/RegisterPage/RegisterPage.jsx - Updated with Google OAuth
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  AlertCircle, 
  Heart,
  CheckCircle,
  Shield,
  Zap,
  Users,
  UserCheck
} from 'lucide-react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for auth success or error in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const authSuccess = urlParams.get('auth');
    const error = urlParams.get('error');
    
    if (authSuccess === 'success') {
      // User was successfully authenticated via Google OAuth
      navigate('/shop', { replace: true });
    }
    
    if (error) {
      if (error === 'google_auth_failed') {
        setAuthError('Google authentication failed. Please try again.');
      } else if (error === 'callback_failed') {
        setAuthError('Authentication callback failed. Please try again.');
      }
    }
  }, [location, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

     if (formData.phone) {
    // Remove all non-digit characters except +
    const cleanPhone = formData.phone.replace(/[^\d+]/g, '');
    
    // Check various valid formats for Indian phone numbers
    const indianPhonePatterns = [
      /^[6-9]\d{9}$/,           // 10-digit starting with 6-9 (7057379190)
      /^\+91[6-9]\d{9}$/,       // +91 followed by 10-digit (+917057379190)
      /^91[6-9]\d{9}$/,         // 91 followed by 10-digit (917057379190)
      /^0[6-9]\d{9}$/           // 0 followed by 10-digit (07057379190)
    ];
    
    const isValidIndianPhone = indianPhonePatterns.some(pattern => 
      pattern.test(cleanPhone)
    );
    
    if (!isValidIndianPhone) {
      newErrors.phone = 'Please enter a valid Indian phone number (10 digits starting with 6-9)';
    }
  }


    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        role: formData.role
      };

      await register(userData);
      const from = location.state?.from || '/shop';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/auth/google`;
  };

  return (
    <div className="register-page">
      {/* Background */}
      <div className="register-background">
        <div className="register-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="register-container">
        <div className="register-wrapper">
          
          {/* Left Side - Form */}
          <div className="register-form-section">
            <div className="register-form-container">
              <div className="form-header">
                <Link to="/" className="register-logo">
                  <div className="logo-icon">
                    <Heart className="heart-icon" />
                  </div>
                  <span className="logo-text">EVEA</span>
                </Link>
                <h2 className="form-title">Create Account</h2>
                <p className="form-subtitle">Join EVEA and start planning extraordinary events</p>
              </div>

              {/* Error Banner */}
              {authError && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{authError}</span>
                </div>
              )}

              {/* Social Login */}
              <div className="social-login">
                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  className="social-btn google-btn"
                  disabled={isLoading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </button>
              </div>

              <div className="divider">
                <span>or create account with email</span>
              </div>

              {/* Registration Form */}
              <form className="register-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                        placeholder="Enter your first name"
                        disabled={isLoading}
                        autoComplete="given-name"
                        required
                      />
                    </div>
                    {errors.firstName && (
                      <span className="field-error">
                        <AlertCircle size={14} />
                        {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                        placeholder="Enter your last name"
                        disabled={isLoading}
                        autoComplete="family-name"
                        required
                      />
                    </div>
                    {errors.lastName && (
                      <span className="field-error">
                        <AlertCircle size={14} />
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

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
                      placeholder="Enter your email"
                      disabled={isLoading}
                      autoComplete="email"
                      required
                    />
                  </div>
                  {errors.email && (
                    <span className="field-error">
                      <AlertCircle size={14} />
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number <span className="optional">(Optional)</span>
                  </label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" size={20} />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="Enter your phone number"
                      disabled={isLoading}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone && (
                    <span className="field-error">
                      <AlertCircle size={14} />
                      {errors.phone}
                    </span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        placeholder="Create a password"
                        disabled={isLoading}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                        disabled={isLoading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="field-error">
                        <AlertCircle size={14} />
                        {errors.password}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Confirm your password"
                        disabled={isLoading}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="password-toggle"
                        disabled={isLoading}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <span className="field-error">
                        <AlertCircle size={14} />
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                {/* Role Selection */}
                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <div className="role-selection">
                    <div className="role-option">
                      <input
                        type="radio"
                        id="customer"
                        name="role"
                        value="customer"
                        checked={formData.role === 'customer'}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <div className="role-label">
                        <strong>Customer</strong>
                        <span>Plan events and book services</span>
                      </div>
                    </div>
                    <div className="role-option">
                      <input
                        type="radio"
                        id="vendor"
                        name="role"
                        value="vendor"
                        checked={formData.role === 'vendor'}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <div className="role-label">
                        <strong>Vendor</strong>
                        <span>Offer event services and manage bookings</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="terms-agreement">
                  <div className="checkbox-wrapper">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className={`checkbox ${errors.agreeToTerms ? 'error' : ''}`}
                      disabled={isLoading}
                      required
                    />
                    <label htmlFor="agreeToTerms" className="checkbox-label">
                      I agree to the{' '}
                      <Link to="/terms" className="terms-link" target="_blank">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="terms-link" target="_blank">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <span className="field-error">
                      <AlertCircle size={14} />
                      {errors.agreeToTerms}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="register-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserCheck size={20} />
                      Create Account
                    </>
                  )}
                </button>
              </form>

              {/* Form Footer */}
              <div className="form-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="signin-link">
                    Sign in here
                  </Link>
                </p>
                
                <div className="help-section">
                  <p className="help-text">
                    Need help? <Link to="/support" className="help-link">Contact Support</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Branding */}
          <div className="register-branding">
            <div className="branding-content">
              <h1 className="branding-title">
                Join the <span className="title-highlight">EVEA</span> community
              </h1>
              <p className="branding-subtitle">
                Connect with top vendors, plan stunning events, and create memories that last a lifetime. Your perfect event starts here.
              </p>

              <div className="branding-features">
                <div className="feature-item">
                  <div className="feature-icon">
                    <Shield />
                  </div>
                  <span>Secure & Protected</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Zap />
                  </div>
                  <span>Quick Setup</span>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Users />
                  </div>
                  <span>Join 10K+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;