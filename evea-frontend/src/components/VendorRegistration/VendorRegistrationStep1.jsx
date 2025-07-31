// evea-frontend/src/components/VendorRegistration/VendorRegistrationStep1.jsx
import React, { useState } from 'react';
import { ArrowRight, Building, User, Mail, Phone, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import './VendorRegistrationStep1.css';

const VendorRegistrationStep1 = ({ onNext }) => {
  const [formData, setFormData] = useState({
    // businessInfo structure - matches Vendor model exactly
    businessName: '',
    businessType: '',
    ownerName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    businessAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    businessDescription: '',
    establishedYear: '',
    website: '',
    socialMedia: {
      instagram: '',
      facebook: '',
      youtube: '',
      linkedin: ''
    },
    // verification structure - matches Vendor model exactly  
    gstNumber: '',
    panNumber: '',
    // authentication
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    const errorKey = field.split('.').pop();
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.panNumber.trim()) newErrors.panNumber = 'PAN number is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.panNumber && !panRegex.test(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Prepare data exactly matching Vendor model structure
      const submitData = {
        // businessInfo fields
        businessName: formData.businessName.trim(),
        businessType: formData.businessType,
        ownerName: formData.ownerName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        alternatePhone: formData.alternatePhone?.trim() || '',
        businessAddress: {
          street: formData.businessAddress.street || '',
          city: formData.businessAddress.city || '',
          state: formData.businessAddress.state || '',
          pincode: formData.businessAddress.pincode || '',
          country: 'India'
        },
        businessDescription: formData.businessDescription?.trim() || '',
        establishedYear: formData.establishedYear ? parseInt(formData.establishedYear) : null,
        website: formData.website?.trim() || '',
        socialMedia: {
          instagram: formData.socialMedia.instagram || '',
          facebook: formData.socialMedia.facebook || '',
          youtube: formData.socialMedia.youtube || '',
          linkedin: formData.socialMedia.linkedin || ''
        },
        // verification fields
        gstNumber: formData.gstNumber?.trim().toUpperCase() || '',
        panNumber: formData.panNumber.trim().toUpperCase(),
        // authentication
        password: formData.password
      };

      console.log('🚀 Submitting Step 1 data:', { ...submitData, password: '[HIDDEN]' });

      // Direct API call
      const response = await fetch('http://localhost:5000/api/vendors/register/step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      console.log('📡 API Response:', result);

      if (result.success) {
        console.log('✅ Step 1 completed successfully');
        console.log('📋 Full API Response:', result);
        
        // Extract vendor ID from response - try all possible locations
        let vendorId = null;
        
        if (result.data && result.data.vendorId) {
          vendorId = result.data.vendorId;
        } else if (result.data && result.data._id) {
          vendorId = result.data._id;
        } else if (result.vendorId) {
          vendorId = result.vendorId;
        } else if (result._id) {
          vendorId = result._id;
        }
        
        console.log('🔍 Extracted vendor ID:', vendorId);
        
        if (vendorId) {
          // Store in multiple places to ensure it persists
          localStorage.setItem('registrationVendorId', vendorId);
          sessionStorage.setItem('registrationVendorId', vendorId);
          
          console.log('💾 Stored vendor ID:', vendorId);
          
          setSuccessMessage(result.message || 'Registration successful!');
          
          // Navigate immediately
          if (onNext && typeof onNext === 'function') {
            console.log('🔄 Calling onNext with vendor ID:', vendorId);
            onNext(vendorId);
          } else {
            console.error('⚠️ onNext function not provided');
            // Fallback navigation
            setTimeout(() => {
              window.location.href = '/vendor/register?step=2';
            }, 1000);
          }
        } else {
          console.error('❌ Could not extract vendor ID from response');
          setErrors({ submit: 'Registration succeeded but vendor ID missing. Please try again.' });
        }
      } else {
        console.log('❌ Registration failed:', result.message);
        setErrors({ submit: result.message || 'Registration failed' });
      }

    } catch (error) {
      console.error('❌ Network/API error:', error);
      setErrors({ 
        submit: error.message || 'Network error. Please check if backend server is running.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-registration-step1">
      <div className="registration-container">
        <div className="registration-header">
          <h1>Vendor Registration</h1>
          <p>Step 1 of 3: Business Information</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '33%' }}></div>
          </div>
        </div>

        {successMessage && (
          <div className="success-banner">
            <CheckCircle size={20} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Business Information */}
          <div className="form-section">
            <h3><Building size={20} /> Business Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Business Name *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className={errors.businessName ? 'error' : ''}
                  placeholder="Enter your business name"
                  disabled={loading}
                />
                {errors.businessName && <span className="error-text">{errors.businessName}</span>}
              </div>
              
              <div className="form-group">
                <label>Business Type *</label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className={errors.businessType ? 'error' : ''}
                  disabled={loading}
                >
                  <option value="">Select business type</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="llp">Limited Liability Partnership (LLP)</option>
                  <option value="private_limited">Private Limited Company</option>
                  <option value="public_limited">Public Limited Company</option>
                </select>
                {errors.businessType && <span className="error-text">{errors.businessType}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>GST Number</label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => handleInputChange('gstNumber', e.target.value.toUpperCase())}
                  placeholder="Enter GST number (optional)"
                  maxLength="15"
                  disabled={loading}
                />
                <small className="field-help">GST registration is optional</small>
              </div>
              
              <div className="form-group">
                <label>PAN Number *</label>
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  className={errors.panNumber ? 'error' : ''}
                  placeholder="Enter PAN number"
                  maxLength="10"
                  disabled={loading}
                />
                {errors.panNumber && <span className="error-text">{errors.panNumber}</span>}
                <small className="field-help">Format: ABCDE1234F</small>
              </div>
            </div>

            <div className="form-group">
              <label>Business Description</label>
              <textarea
                value={formData.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                placeholder="Briefly describe your business and services"
                rows="3"
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Established Year</label>
                <input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                  placeholder="Year business was established"
                  min="1900"
                  max={new Date().getFullYear()}
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="form-section">
            <h3><User size={20} /> Owner Information</h3>
            
            <div className="form-group">
              <label>Owner Name *</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className={errors.ownerName ? 'error' : ''}
                placeholder="Enter owner's full name"
                disabled={loading}
              />
              {errors.ownerName && <span className="error-text">{errors.ownerName}</span>}
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3><Mail size={20} /> Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter business email"
                  disabled={loading}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'error' : ''}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  disabled={loading}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Alternate Phone</label>
              <input
                type="tel"
                value={formData.alternatePhone}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                placeholder="Enter alternate number (optional)"
                maxLength="10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Business Address */}
          <div className="form-section">
            <h3>Business Address</h3>
            
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                value={formData.businessAddress.street}
                onChange={(e) => handleInputChange('businessAddress.street', e.target.value)}
                placeholder="Enter street address"
                disabled={loading}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={formData.businessAddress.city}
                  onChange={(e) => handleInputChange('businessAddress.city', e.target.value)}
                  placeholder="Enter city"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={formData.businessAddress.state}
                  onChange={(e) => handleInputChange('businessAddress.state', e.target.value)}
                  placeholder="Enter state"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={formData.businessAddress.pincode}
                  onChange={(e) => handleInputChange('businessAddress.pincode', e.target.value)}
                  placeholder="Enter pincode"
                  maxLength="6"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="form-section">
            <h3>Social Media (Optional)</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Instagram</label>
                <input
                  type="text"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                  placeholder="Instagram handle or URL"
                  disabled={loading}
                />
              </div>
              
              <div className="form-group">
                <label>Facebook</label>
                <input
                  type="text"
                  value={formData.socialMedia.facebook}
                  onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                  placeholder="Facebook page URL"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Account Setup */}
          <div className="form-section">
            <h3><Lock size={20} /> Account Setup</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'error' : ''}
                  placeholder="Create a secure password"
                  disabled={loading}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
              
              <div className="form-group">
                <label>Confirm Password *</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="error-banner">
              <AlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="next-step-btn"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-content">
                  <div className="spinner"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="button-content">
                  <span>Continue to Document Upload</span>
                  <ArrowRight size={20} />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistrationStep1;