// src/components/admin/settings/platform-config/PlatformConfig.jsx
import React, { useState, useEffect } from 'react';
import { 
  Globe, MapPin, DollarSign, Percent, Clock, 
  Image, FileText, Upload, Eye, EyeOff, Save,
  RefreshCw, AlertTriangle, CheckCircle, Info
} from 'lucide-react';
import './PlatformConfig.css';

const PlatformConfig = ({ onChange, isSaving }) => {
  const [config, setConfig] = useState({
    // General Settings
    platformName: 'EVEA - Event Planning Platform',
    platformDescription: 'Your trusted partner for seamless event planning and vendor management',
    platformUrl: 'https://evea.com',
    supportEmail: 'support@evea.com',
    contactPhone: '+91 98765 43210',
    
    // Business Settings
    defaultCurrency: 'INR',
    currencySymbol: '₹',
    taxRate: 18,
    commissionRate: 15,
    
    // Regional Settings
    defaultCountry: 'India',
    defaultCity: 'Mumbai',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    
    // Platform Features
    enableGuestRegistration: true,
    enableVendorRegistration: true,
    enableReviews: true,
    enableRatings: true,
    requireEmailVerification: true,
    enableSocialLogin: true,
    enableMultiLanguage: false,
    
    // Content Settings
    enableBlog: true,
    enableFAQ: true,
    enableTestimonials: true,
    enableNewsletters: true,
    
    // Upload Settings
    maxFileSize: 10, // MB
    allowedFileTypes: 'jpg,jpeg,png,pdf,doc,docx',
    maxImagesPerVendor: 20,
    enableImageCompression: true,
    
    // SEO Settings
    metaTitle: 'EVEA - Event Planning Made Easy',
    metaDescription: 'Plan your perfect event with trusted vendors, seamless booking, and professional management.',
    metaKeywords: 'event planning, vendors, booking, weddings, parties',
    enableSitemap: true,
    enableRobotsTxt: true
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Load current configuration
    // This would typically fetch from an API
    console.log('Loading platform configuration...');
  }, []);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    onChange && onChange();
  };

  const handleFileUpload = (field, file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'logo') {
          setLogoPreview(e.target.result);
        } else if (field === 'favicon') {
          setFaviconPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      onChange && onChange();
    }
  };

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' }
  ];

  const countries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia'
  ];

  const timezones = [
    'Asia/Kolkata', 'America/New_York', 'Europe/London', 
    'America/Toronto', 'Australia/Sydney'
  ];

  return (
    <div className="platform-config">
      <div className="config-header">
        <h2>Platform Configuration</h2>
        <p>Configure general platform settings and business rules</p>
      </div>

      <div className="config-sections">
        {/* General Settings */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-title">
              <Globe size={20} />
              <h3>General Settings</h3>
            </div>
          </div>
          
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label>Platform Name</label>
                <input
                  type="text"
                  value={config.platformName}
                  onChange={(e) => handleInputChange('platformName', e.target.value)}
                  placeholder="Enter platform name"
                />
              </div>
              
              <div className="form-group">
                <label>Platform URL</label>
                <input
                  type="url"
                  value={config.platformUrl}
                  onChange={(e) => handleInputChange('platformUrl', e.target.value)}
                  placeholder="https://your-platform.com"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Platform Description</label>
                <textarea
                  value={config.platformDescription}
                  onChange={(e) => handleInputChange('platformDescription', e.target.value)}
                  placeholder="Brief description of your platform"
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label>Support Email</label>
                <input
                  type="email"
                  value={config.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  placeholder="support@your-platform.com"
                />
              </div>
              
              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="tel"
                  value={config.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-title">
              <DollarSign size={20} />
              <h3>Business Settings</h3>
            </div>
          </div>
          
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label>Default Currency</label>
                <select
                  value={config.defaultCurrency}
                  onChange={(e) => {
                    const currency = currencies.find(c => c.code === e.target.value);
                    handleInputChange('defaultCurrency', e.target.value);
                    handleInputChange('currencySymbol', currency?.symbol || '');
                  }}
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Tax Rate (%)</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={config.taxRate}
                    onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                  />
                  <Percent size={16} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Platform Commission Rate (%)</label>
                <div className="input-with-icon">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={config.commissionRate}
                    onChange={(e) => handleInputChange('commissionRate', parseFloat(e.target.value))}
                  />
                  <Percent size={16} />
                </div>
                <span className="form-hint">
                  Commission charged to vendors per transaction
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Settings */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-title">
              <MapPin size={20} />
              <h3>Regional Settings</h3>
            </div>
          </div>
          
          <div className="section-content">
            <div className="form-grid">
              <div className="form-group">
                <label>Default Country</label>
                <select
                  value={config.defaultCountry}
                  onChange={(e) => handleInputChange('defaultCountry', e.target.value)}
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Default City</label>
                <input
                  type="text"
                  value={config.defaultCity}
                  onChange={(e) => handleInputChange('defaultCity', e.target.value)}
                  placeholder="Enter default city"
                />
              </div>
              
              <div className="form-group">
                <label>Timezone</label>
                <select
                  value={config.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Date Format</label>
                <select
                  value={config.dateFormat}
                  onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Time Format</label>
                <select
                  value={config.timeFormat}
                  onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                >
                  <option value="12h">12 Hour (AM/PM)</option>
                  <option value="24h">24 Hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-title">
              <CheckCircle size={20} />
              <h3>Platform Features</h3>
            </div>
          </div>
          
          <div className="section-content">
            <div className="features-grid">
              <div className="feature-toggle">
                <div className="feature-info">
                  <h4>Guest Registration</h4>
                  <p>Allow guests to register and create accounts</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={config.enableGuestRegistration}
                    onChange={(e) => handleInputChange('enableGuestRegistration', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="feature-toggle">
                <div className="feature-info">
                  <h4>Vendor Registration</h4>
                  <p>Allow vendors to register and list services</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={config.enableVendorRegistration}
                    onChange={(e) => handleInputChange('enableVendorRegistration', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="feature-toggle">
                <div className="feature-info">
                  <h4>Reviews & Ratings</h4>
                  <p>Enable customer reviews and ratings system</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={config.enableReviews}
                    onChange={(e) => handleInputChange('enableReviews', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="feature-toggle">
                <div className="feature-info">
                  <h4>Email Verification</h4>
                  <p>Require email verification for new accounts</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={config.requireEmailVerification}
                    onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="feature-toggle">
                <div className="feature-info">
                  <h4>Social Login</h4>
                  <p>Enable login with Google, Facebook, etc.</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={config.enableSocialLogin}
                    onChange={(e) => handleInputChange('enableSocialLogin', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="feature-toggle">
                <div className="feature-info">
                  <h4>Multi-Language Support</h4>
                  <p>Enable multiple language support</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={config.enableMultiLanguage}
                    onChange={(e) => handleInputChange('enableMultiLanguage', e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="config-section">
          <div className="section-header">
            <div className="section-title">
              <Info size={20} />
              <h3>Advanced Settings</h3>
            </div>
            <button 
              className="toggle-advanced"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? <EyeOff size={16} /> : <Eye size={16} />}
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </button>
          </div>
          
          {showAdvanced && (
            <div className="section-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Max File Size (MB)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.maxFileSize}
                    onChange={(e) => handleInputChange('maxFileSize', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="form-group">
                  <label>Max Images per Vendor</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={config.maxImagesPerVendor}
                    onChange={(e) => handleInputChange('maxImagesPerVendor', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Allowed File Types</label>
                  <input
                    type="text"
                    value={config.allowedFileTypes}
                    onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                    placeholder="jpg,jpeg,png,pdf,doc,docx"
                  />
                  <span className="form-hint">
                    Comma-separated list of allowed file extensions
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformConfig;