import React, { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Globe, User } from 'lucide-react';

const VendorRegistrationStep1 = ({ onNext, isLoading }) => {
  const [formData, setFormData] = useState({
    businessInfo: {
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
      }
    },
    password: '',
    confirmPassword: '',
    primaryCategories: []
  });

  const [errors, setErrors] = useState({});

  const serviceCategories = [
    { id: 'photography', name: 'Photography', icon: '📸' },
    { id: 'catering', name: 'Catering', icon: '🍽️' },
    { id: 'decoration', name: 'Decoration', icon: '🎨' },
    { id: 'venue', name: 'Venue', icon: '🏛️' },
    { id: 'music_entertainment', name: 'Music & Entertainment', icon: '🎵' },
    { id: 'planning', name: 'Event Planning', icon: '📋' },
    { id: 'transport', name: 'Transportation', icon: '🚗' },
    { id: 'makeup_styling', name: 'Makeup & Styling', icon: '💄' },
    { id: 'floral', name: 'Floral Arrangements', icon: '🌸' },
    { id: 'lighting', name: 'Lighting & Sound', icon: '💡' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.businessInfo.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.businessInfo.businessType) {
      newErrors.businessType = 'Business type is required';
    }
    
    if (!formData.businessInfo.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    
    if (!formData.businessInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.businessInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.businessInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.businessInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.primaryCategories.length === 0) {
      newErrors.categories = 'Please select at least one service category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, grandchild] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field.split('.').pop()]) {
      setErrors(prev => ({ ...prev, [field.split('.').pop()]: '' }));
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      primaryCategories: prev.primaryCategories.includes(categoryId)
        ? prev.primaryCategories.filter(id => id !== categoryId)
        : [...prev.primaryCategories, categoryId]
    }));
    
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="vendor-registration-step">
      <div className="step-header">
        <h2 className="step-title">Tell Us About Your Business</h2>
        <p className="step-description">
          Provide your basic business information to get started with the registration process
        </p>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        {/* Basic Business Information */}
        <div className="form-section">
          <h3 className="section-title">
            <Building2 size={20} />
            Business Information
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Business Name *</label>
              <input
                type="text"
                className={`form-input ${errors.businessName ? 'error' : ''}`}
                placeholder="Enter your business name"
                value={formData.businessInfo.businessName}
                onChange={(e) => handleInputChange('businessInfo.businessName', e.target.value)}
              />
              {errors.businessName && <span className="error-message">{errors.businessName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Business Type *</label>
              <select
                className={`form-select ${errors.businessType ? 'error' : ''}`}
                value={formData.businessInfo.businessType}
                onChange={(e) => handleInputChange('businessInfo.businessType', e.target.value)}
              >
                <option value="">Select business type</option>
                <option value="sole_proprietorship">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="llp">Limited Liability Partnership (LLP)</option>
                <option value="private_limited">Private Limited Company</option>
                <option value="public_limited">Public Limited Company</option>
              </select>
              {errors.businessType && <span className="error-message">{errors.businessType}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Owner Name *</label>
              <input
                type="text"
                className={`form-input ${errors.ownerName ? 'error' : ''}`}
                placeholder="Enter owner's full name"
                value={formData.businessInfo.ownerName}
                onChange={(e) => handleInputChange('businessInfo.ownerName', e.target.value)}
              />
              {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter business email"
                value={formData.businessInfo.email}
                onChange={(e) => handleInputChange('businessInfo.email', e.target.value)}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="Enter business phone number"
                value={formData.businessInfo.phone}
                onChange={(e) => handleInputChange('businessInfo.phone', e.target.value)}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Alternate Phone</label>
              <input
                type="tel"
                className="form-input"
                placeholder="Alternate contact number"
                value={formData.businessInfo.alternatePhone}
                onChange={(e) => handleInputChange('businessInfo.alternatePhone', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="form-section">
          <h3 className="section-title">
            <MapPin size={20} />
            Business Address
          </h3>
          
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter street address"
                value={formData.businessInfo.businessAddress.street}
                onChange={(e) => handleInputChange('businessInfo.businessAddress.street', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter city"
                value={formData.businessInfo.businessAddress.city}
                onChange={(e) => handleInputChange('businessInfo.businessAddress.city', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter state"
                value={formData.businessInfo.businessAddress.state}
                onChange={(e) => handleInputChange('businessInfo.businessAddress.state', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">PIN Code</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter PIN code"
                value={formData.businessInfo.businessAddress.pincode}
                onChange={(e) => handleInputChange('businessInfo.businessAddress.pincode', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className="form-section">
          <h3 className="section-title">
            <User size={20} />
            Service Categories *
          </h3>
          
          <p className="section-description">
            Select the primary categories of services your business provides
          </p>
          
          <div className="categories-grid">
            {serviceCategories.map((category) => (
              <div
                key={category.id}
                className={`category-card ${formData.primaryCategories.includes(category.id) ? 'selected' : ''}`}
                onClick={() => handleCategoryToggle(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <span className="category-name">{category.name}</span>
              </div>
            ))}
          </div>
          {errors.categories && <span className="error-message">{errors.categories}</span>}
        </div>

        {/* Account Setup */}
        <div className="form-section">
          <h3 className="section-title">
            <User size={20} />
            Account Setup
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue to Next Step'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorRegistrationStep1;