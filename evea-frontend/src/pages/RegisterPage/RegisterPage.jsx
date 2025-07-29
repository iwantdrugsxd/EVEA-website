// src/pages/RegisterPage/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Heart, 
  Globe, Users, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './RegisterPage.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  // Auth context
  const { register, isLoading, error, clearError } = useAuth();
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

    // First name validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!agreedToTerms) {
      errors.terms = 'You must agree to the terms and conditions';
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
      // Prepare user data for registration
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role
      };

      const result = await register(userData);
      
      if (result.success) {
        // Show success message and redirect
        // For now, redirect based on user role
        if (result.user.role === 'vendor') {
          navigate('/vendor-dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSocialRegister = (provider) => {
    // Implement social registration here
    console.log(`Social registration with ${provider}`);
    // For now, just show a message
    setFormErrors({ 
      general: `${provider} registration will be available soon!` 
    });
  };

  const benefits = [
    "Free account setup with no hidden fees",
    "Access to 50,000+ verified vendors",
    "Save up to 40% on event services",
    "Professional event planning tools",
    "24/7 customer support",
    "Money-back guarantee"
  ];

  return (
    <div className="register-page">
      <div className="register-background">
        <div className="register-gradient"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>

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
                  <span className="logo-text">Evea</span>
                </Link>
                
                <h2 className="form-title">Create Your Account</h2>
                <p className="form-subtitle">
                  Join thousands of happy customers planning amazing events
                </p>
              </div>

              {/* Error Display */}
              {formErrors.general && (
                <div className="error-banner">
                  <AlertCircle size={20} />
                  <span>{formErrors.general}</span>
                </div>
              )}

              {/* Social Registration */}
              <div className="social-register">
                <button 
                  type="button"
                  className="social-btn google-btn"
                  onClick={() => handleSocialRegister('Google')}
                  disabled={isLoading}
                >
                  <Globe size={20} />
                  <span>Sign up with Google</span>
                </button>
                <button 
                  type="button"
                  className="social-btn facebook-btn"
                  onClick={() => handleSocialRegister('Facebook')}
                  disabled={isLoading}
                >
                  <Users size={20} />
                  <span>Sign up with Facebook</span>
                </button>
              </div>

              <div className="divider">
                <span>Or create account with email</span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="register-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                        placeholder="Enter first name"
                        disabled={isLoading}
                        autoComplete="given-name"
                        aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
                      />
                    </div>
                    {formErrors.firstName && (
                      <span id="firstName-error" className="field-error">{formErrors.firstName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={20} />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                        placeholder="Enter last name"
                        disabled={isLoading}
                        autoComplete="family-name"
                        aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
                      />
                    </div>
                    {formErrors.lastName && (
                      <span id="lastName-error" className="field-error">{formErrors.lastName}</span>
                    )}
                  </div>
                </div>

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
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                      placeholder="Enter phone number"
                      disabled={isLoading}
                      autoComplete="tel"
                      aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {formErrors.phone && (
                    <span id="phone-error" className="field-error">{formErrors.phone}</span>
                  )}
                </div>

                {/* Account Type Selection */}
                <div className="form-group">
                  <label className="form-label">Account Type</label>
                  <div className="role-selection">
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        checked={formData.role === 'customer'}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <span className="role-label">
                        <strong>Customer</strong>
                        <span>Plan and book events</span>
                      </span>
                    </label>
                    <label className="role-option">
                      <input
                        type="radio"
                        name="role"
                        value="vendor"
                        checked={formData.role === 'vendor'}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                      <span className="role-label">
                        <strong>Vendor</strong>
                        <span>Offer event services</span>
                      </span>
                    </label>
                  </div>
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
                      placeholder="Create a strong password"
                      disabled={isLoading}
                      autoComplete="new-password"
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

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <Lock className="input-icon" size={20} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                      autoComplete="new-password"
                      aria-describedby={formErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                      disabled={isLoading}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <span id="confirmPassword-error" className="field-error">{formErrors.confirmPassword}</span>
                  )}
                </div>

                <div className="terms-agreement">
                  <label className="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      disabled={isLoading}
                      aria-describedby={formErrors.terms ? 'terms-error' : undefined}
                    />
                    <span className="checkmark"></span>
                    <span className="terms-text">
                      I agree to the{' '}
                      <Link to="/terms" className="terms-link" target="_blank" rel="noopener noreferrer">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="terms-link" target="_blank" rel="noopener noreferrer">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {formErrors.terms && (
                    <span id="terms-error" className="field-error">{formErrors.terms}</span>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="register-btn" 
                  disabled={isLoading}
                  aria-describedby="register-button-desc"
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
                <span id="register-button-desc" className="sr-only">
                  Click to create your new account
                </span>
              </form>

              <div className="form-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="signin-link">
                    Sign in here
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

          {/* Right Side - Benefits */}
          <div className="register-benefits">
            <div className="benefits-content">
              <h3 className="benefits-title">
                Join the
                <span className="title-highlight"> EVEA </span>
                Community
              </h3>
              <p className="benefits-subtitle">
                Experience the future of event planning with our premium platform
              </p>
              
              <div className="benefits-list">
                {benefits.map((benefit, index) => (
                  <div key={index} className="benefit-item">
                    <CheckCircle className="benefit-icon" size={20} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="success-stories">
                <div className="story-stats">
                  <div className="stat-item">
                    <div className="stat-value">50K+</div>
                    <div className="stat-label">Happy Customers</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">1M+</div>
                    <div className="stat-label">Events Planned</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">98%</div>
                    <div className="stat-label">Satisfaction Rate</div>
                  </div>
                </div>
              </div>

              <div className="testimonial">
                <div className="testimonial-content">
                  <p>"EVEA made planning my wedding so easy and stress-free. The vendors were amazing and everything was perfect!"</p>
                  <div className="testimonial-author">
                    <strong>Priya Sharma</strong>
                    <span>Mumbai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;