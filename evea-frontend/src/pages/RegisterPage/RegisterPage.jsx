// src/pages/RegisterPage/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Heart, Globe, Users, CheckCircle } from 'lucide-react';
import './RegisterPage.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

              {/* Social Registration */}
              <div className="social-register">
                <button className="social-btn google-btn">
                  <Globe size={20} />
                  <span>Sign up with Google</span>
                </button>
                <button className="social-btn facebook-btn">
                  <Users size={20} />
                  <span>Sign up with Facebook</span>
                </button>
              </div>

              <div className="divider">
                <span>Or create account with email</span>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="register-form">
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
                        className="form-input"
                        placeholder="Enter first name"
                        required
                      />
                    </div>
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
                        className="form-input"
                        placeholder="Enter last name"
                        required
                      />
                    </div>
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
                      className="form-input"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
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
                      className="form-input"
                      placeholder="Enter phone number"
                      required
                    />
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
                      className="form-input"
                      placeholder="Create a strong password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
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
                      className="form-input"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleConfirmPasswordVisibility}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="terms-agreement">
                  <label className="checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    <span className="terms-text">
                      I agree to the{' '}
                      <Link to="/terms" className="terms-link">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <button type="submit" className="register-btn" disabled={isLoading}>
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
              </form>

              <div className="form-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="signin-link">
                    Sign in here
                  </Link>
                </p>
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