// pages/VendorLoginPage/VendorLoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart } from 'lucide-react';
import { loginVendor } from '../../services/vendorAPI';
import { toast } from 'react-toastify';
import './VendorLoginPage.css';

const VendorLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('vendorToken');
    if (token) {
      navigate('/vendor-dashboard');
    }

    // Handle Google OAuth callback token
    const urlParams = new URLSearchParams(location.search);
    const token_from_oauth = urlParams.get('token');
    if (token_from_oauth) {
      localStorage.setItem('vendorToken', token_from_oauth);
      navigate('/vendor-dashboard');
    }
  }, [navigate, location]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const response = await loginVendor({
        email: formData.email,
        password: formData.password
      });

      // Store token and vendor data
      localStorage.setItem('vendorToken', response.data.token);
      localStorage.setItem('vendorData', JSON.stringify(response.data.vendor));

      toast.success('Login successful! Welcome back.');
      
      // Redirect based on registration status
      const vendor = response.data.vendor;
      if (vendor.registrationStatus === 'pending_review') {
        navigate('/vendor-dashboard?tab=status');
      } else if (vendor.registrationStatus === 'approved') {
        navigate('/vendor-dashboard');
      } else {
        navigate('/vendor-registration');
      }

    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      setErrors({
        general: error.message || 'Invalid email or password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/vendor/google`;
  };

  return (
    <div className="vendor-login-page">
      <div className="login-background">
        <div className="login-gradient"></div>
        <div className="floating-elements">
          <div className="float-element element-1"></div>
          <div className="float-element element-2"></div>
          <div className="float-element element-3"></div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-wrapper">
          {/* Header */}
          <div className="login-header">
            <Link to="/" className="logo">
              <Heart className="logo-icon" size={32} />
              <span className="logo-text">EVEA</span>
            </Link>
            <h1 className="login-title">Vendor Login</h1>
            <p className="login-subtitle">
              Access your vendor dashboard and manage your business
            </p>
          </div>

          {/* Login Form */}
          <div className="login-form-container">
            <form onSubmit={handleSubmit} className="login-form">
              {errors.general && (
                <div className="error-banner">
                  <span>{errors.general}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={20} />
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/vendor-forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="google-login-button"
                onClick={handleGoogleLogin}
              >
                <img 
                  src="/icons/google.svg" 
                  alt="Google" 
                  width="20" 
                  height="20"
                />
                <span>Continue with Google</span>
              </button>
            </form>

            <div className="login-footer">
              <p>
                Don't have a vendor account?{' '}
                <Link to="/vendor-registration" className="register-link">
                  Register here
                </Link>
              </p>
              <p>
                Customer?{' '}
                <Link to="/login" className="customer-link">
                  Customer Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLoginPage;