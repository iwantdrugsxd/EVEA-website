// src/pages/VendorDashboard/pages/BusinessProfilePage.jsx
import React, { useState } from 'react';
import { 
  User, Mail, Phone, MapPin, Globe, Camera, Upload, X,
  Edit, Save, Star, CheckCircle, AlertTriangle, Eye,
  Clock, Calendar, IndianRupee, Package, Image, FileText,
  Shield, Award, Briefcase, Tag, Link, Facebook, Instagram, Twitter
} from 'lucide-react';
import './BusinessProfilePage.css';

const BusinessProfilePage = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    basic: {
      businessName: 'Rajesh Photography',
      tagline: 'Capturing Life\'s Beautiful Moments',
      email: 'rajesh@rajeshphotography.com',
      phone: '+91 98765 43210',
      alternatePhone: '+91 98765 43211',
      website: 'www.rajeshphotography.com',
      description: 'Professional wedding and event photographer with over 8 years of experience in capturing beautiful moments. Specializing in candid photography, traditional ceremonies, and destination weddings.',
      logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    business: {
      businessType: 'Photography Studio',
      category: 'photography',
      subcategories: ['wedding', 'corporate', 'party'],
      yearsInBusiness: 8,
      teamSize: 5,
      registrationNumber: 'REG123456789',
      gstNumber: 'GST123456789',
      panNumber: 'ABCDE1234F'
    },
    location: {
      address: '123, MG Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
      serviceAreas: ['Mumbai', 'Pune', 'Nashik', 'Goa'],
      deliveryCharges: {
        local: 0,
        state: 2000,
        outstation: 5000
      }
    },
    social: {
      facebook: 'facebook.com/rajeshphotography',
      instagram: 'instagram.com/rajeshphotography',
      twitter: 'twitter.com/rajeshphoto',
      youtube: 'youtube.com/rajeshphotography'
    },
    documents: {
      businessLicense: { status: 'verified', expiryDate: '2025-12-31' },
      gstCertificate: { status: 'verified', expiryDate: '2025-03-31' },
      panCard: { status: 'verified', expiryDate: null },
      insurance: { status: 'pending', expiryDate: '2024-12-31' },
      bankDetails: { status: 'verified', expiryDate: null }
    }
  });

  // Portfolio data
  const [portfolioImages, setPortfolioImages] = useState([
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  ]);

  const [workingHours, setWorkingHours] = useState({
    monday: { open: '09:00', close: '18:00', working: true },
    tuesday: { open: '09:00', close: '18:00', working: true },
    wednesday: { open: '09:00', close: '18:00', working: true },
    thursday: { open: '09:00', close: '18:00', working: true },
    friday: { open: '09:00', close: '18:00', working: true },
    saturday: { open: '10:00', close: '16:00', working: true },
    sunday: { open: '10:00', close: '16:00', working: false }
  });

  // Profile tabs
  const tabs = [
    { id: 'basic', name: 'Basic Information', icon: <User size={16} /> },
    { id: 'business', name: 'Business Details', icon: <Briefcase size={16} /> },
    { id: 'portfolio', name: 'Portfolio & Gallery', icon: <Image size={16} /> },
    { id: 'availability', name: 'Availability & Hours', icon: <Clock size={16} /> },
    { id: 'documents', name: 'Documents & Verification', icon: <Shield size={16} /> }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic here
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset changes logic here
  };

  const renderBasicInfo = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Basic Information</h3>
        <button 
          className={`edit-btn ${isEditing ? 'save-btn' : ''}`}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? <Save size={16} /> : <Edit size={16} />}
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Business Logo */}
      <div className="logo-section">
        <div className="logo-container">
          <div className="business-logo">
            <img src={profileData.basic.logo} alt="Business Logo" />
            {isEditing && (
              <div className="logo-overlay">
                <button className="upload-logo-btn">
                  <Upload size={16} />
                  Change Logo
                </button>
              </div>
            )}
          </div>
          <div className="logo-info">
            <h2 className="business-name">{profileData.basic.businessName}</h2>
            <p className="business-tagline">{profileData.basic.tagline}</p>
            <div className="verification-status">
              <CheckCircle size={16} />
              <span>Verified Business</span>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information Form */}
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Business Name</label>
          {isEditing ? (
            <input 
              type="text" 
              className="form-input" 
              value={profileData.basic.businessName}
              onChange={(e) => setProfileData({
                ...profileData,
                basic: { ...profileData.basic, businessName: e.target.value }
              })}
            />
          ) : (
            <div className="form-display">{profileData.basic.businessName}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Business Tagline</label>
          {isEditing ? (
            <input 
              type="text" 
              className="form-input" 
              value={profileData.basic.tagline}
              onChange={(e) => setProfileData({
                ...profileData,
                basic: { ...profileData.basic, tagline: e.target.value }
              })}
            />
          ) : (
            <div className="form-display">{profileData.basic.tagline}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          {isEditing ? (
            <input 
              type="email" 
              className="form-input" 
              value={profileData.basic.email}
              onChange={(e) => setProfileData({
                ...profileData,
                basic: { ...profileData.basic, email: e.target.value }
              })}
            />
          ) : (
            <div className="form-display">
              <Mail size={16} />
              {profileData.basic.email}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          {isEditing ? (
            <input 
              type="tel" 
              className="form-input" 
              value={profileData.basic.phone}
              onChange={(e) => setProfileData({
                ...profileData,
                basic: { ...profileData.basic, phone: e.target.value }
              })}
            />
          ) : (
            <div className="form-display">
              <Phone size={16} />
              {profileData.basic.phone}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Alternate Phone</label>
          {isEditing ? (
            <input 
              type="tel" 
              className="form-input" 
              value={profileData.basic.alternatePhone}
              onChange={(e) => setProfileData({
                ...profileData,
                basic: { ...profileData.basic, alternatePhone: e.target.value }
              })}
            />
          ) : (
            <div className="form-display">
              <Phone size={16} />
              {profileData.basic.alternatePhone || 'Not provided'}
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Website URL</label>
          {isEditing ? (
            <input 
              type="url" 
              className="form-input" 
              value={profileData.basic.website}
              onChange={(e) => setProfileData({
                ...profileData,
                basic: { ...profileData.basic, website: e.target.value }
              })}
            />
          ) : (
            <div className="form-display">
              <Globe size={16} />
              <a href={`https://${profileData.basic.website}`} target="_blank" rel="noopener noreferrer">
                {profileData.basic.website}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Business Description */}
      <div className="form-group full-width">
        <label className="form-label">Business Description</label>
        {isEditing ? (
          <textarea 
            className="form-textarea" 
            rows="4"
            value={profileData.basic.description}
            onChange={(e) => setProfileData({
              ...profileData,
              basic: { ...profileData.basic, description: e.target.value }
            })}
          />
        ) : (
          <div className="form-display description">{profileData.basic.description}</div>
        )}
      </div>

      {/* Social Media Links */}
      <div className="social-media-section">
        <h4>Social Media Profiles</h4>
        <div className="social-links-grid">
          <div className="social-link-item">
            <Facebook size={20} />
            <span>Facebook</span>
            {isEditing ? (
              <input 
                type="url" 
                className="social-input"
                value={profileData.social.facebook}
                placeholder="facebook.com/yourpage"
              />
            ) : (
              <a href={`https://${profileData.social.facebook}`} target="_blank" rel="noopener noreferrer">
                {profileData.social.facebook}
              </a>
            )}
          </div>

          <div className="social-link-item">
            <Instagram size={20} />
            <span>Instagram</span>
            {isEditing ? (
              <input 
                type="url" 
                className="social-input"
                value={profileData.social.instagram}
                placeholder="instagram.com/yourprofile"
              />
            ) : (
              <a href={`https://${profileData.social.instagram}`} target="_blank" rel="noopener noreferrer">
                {profileData.social.instagram}
              </a>
            )}
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="form-actions">
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderBusinessDetails = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Business Details</h3>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Business Type</label>
          <div className="form-display">
            <Briefcase size={16} />
            {profileData.business.businessType}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Primary Category</label>
          <div className="form-display">
            <Tag size={16} />
            {profileData.business.category}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Years in Business</label>
          <div className="form-display">
            <Calendar size={16} />
            {profileData.business.yearsInBusiness} years
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Team Size</label>
          <div className="form-display">
            <User size={16} />
            {profileData.business.teamSize} members
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">GST Number</label>
          <div className="form-display">{profileData.business.gstNumber}</div>
        </div>

        <div className="form-group">
          <label className="form-label">PAN Number</label>
          <div className="form-display">{profileData.business.panNumber}</div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="categories-section">
        <h4>Service Categories</h4>
        <div className="categories-list">
          {profileData.business.subcategories.map((category, index) => (
            <span key={index} className="category-tag">
              {category}
            </span>
          ))}
        </div>
      </div>

      {/* Business Address */}
      <div className="address-section">
        <h4>Business Address</h4>
        <div className="address-display">
          <MapPin size={16} />
          <div className="address-text">
            {profileData.location.address}<br/>
            {profileData.location.city}, {profileData.location.state} - {profileData.location.pincode}<br/>
            {profileData.location.country}
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="service-areas-section">
        <h4>Service Coverage Areas</h4>
        <div className="service-areas-list">
          {profileData.location.serviceAreas.map((area, index) => (
            <span key={index} className="area-tag">
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Portfolio & Gallery</h3>
        <button className="btn-primary">
          <Upload size={16} />
          Add Images
        </button>
      </div>

      <div className="portfolio-grid">
        {portfolioImages.map((image, index) => (
          <div key={index} className="portfolio-item">
            <img src={image} alt={`Portfolio ${index + 1}`} />
            <div className="portfolio-overlay">
              <button className="portfolio-action">
                <Eye size={16} />
              </button>
              <button className="portfolio-action">
                <Edit size={16} />
              </button>
              <button className="portfolio-action delete">
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
        
        <div className="add-portfolio-item">
          <Upload size={24} />
          <span>Add New Image</span>
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="portfolio-stats">
        <div className="stat-item">
          <Image size={16} />
          <span>{portfolioImages.length} Images</span>
        </div>
        <div className="stat-item">
          <Eye size={16} />
          <span>2,456 Total Views</span>
        </div>
        <div className="stat-item">
          <Star size={16} />
          <span>4.8 Average Rating</span>
        </div>
      </div>
    </div>
  );

  const renderAvailability = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Availability & Working Hours</h3>
      </div>

      <div className="working-hours-section">
        <h4>Working Hours</h4>
        <div className="hours-grid">
          {Object.entries(workingHours).map(([day, hours]) => (
            <div key={day} className="hour-item">
              <div className="day-name">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </div>
              <div className="day-status">
                {hours.working ? (
                  <span className="working-hours">
                    {hours.open} - {hours.close}
                  </span>
                ) : (
                  <span className="closed">Closed</span>
                )}
              </div>
              <label className="working-toggle">
                <input 
                  type="checkbox" 
                  checked={hours.working}
                  onChange={(e) => setWorkingHours({
                    ...workingHours,
                    [day]: { ...hours, working: e.target.checked }
                  })}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Settings */}
      <div className="booking-settings">
        <h4>Booking Settings</h4>
        <div className="settings-grid">
          <div className="setting-item">
            <label>Advance Booking Required</label>
            <select className="form-select">
              <option value="1">1 day</option>
              <option value="3">3 days</option>
              <option value="7" selected>7 days</option>
              <option value="14">14 days</option>
            </select>
          </div>
          
          <div className="setting-item">
            <label>Maximum Bookings per Day</label>
            <select className="form-select">
              <option value="1">1 booking</option>
              <option value="2" selected>2 bookings</option>
              <option value="3">3 bookings</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="profile-section">
      <div className="section-header">
        <h3>Documents & Verification</h3>
      </div>

      <div className="verification-overview">
        <div className="verification-status">
          <CheckCircle size={24} />
          <div className="status-text">
            <h4>Profile Verified</h4>
            <p>Your business profile is verified and active</p>
          </div>
        </div>
      </div>

      <div className="documents-grid">
        {Object.entries(profileData.documents).map(([docType, doc]) => (
          <div key={docType} className="document-card">
            <div className="document-header">
              <div className="document-icon">
                <FileText size={20} />
              </div>
              <div className="document-info">
                <h4>{docType.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <div className={`document-status status-${doc.status}`}>
                  {doc.status === 'verified' && <CheckCircle size={14} />}
                  {doc.status === 'pending' && <Clock size={14} />}
                  {doc.status === 'expired' && <AlertTriangle size={14} />}
                  <span>{doc.status}</span>
                </div>
              </div>
            </div>

            {doc.expiryDate && (
              <div className="document-expiry">
                <Calendar size={14} />
                <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
              </div>
            )}

            <div className="document-actions">
              <button className="btn-secondary-small">
                <Eye size={14} />
                View
              </button>
              <button className="btn-primary-small">
                <Upload size={14} />
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="business-profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-preview">
          <div className="preview-avatar">
            <img src={profileData.basic.logo} alt="Business Logo" />
          </div>
          <div className="preview-info">
            <h2>{profileData.basic.businessName}</h2>
            <p>{profileData.basic.tagline}</p>
            <div className="preview-stats">
              <div className="stat-item">
                <Star size={16} />
                <span>4.8 Rating</span>
              </div>
              <div className="stat-item">
                <Package size={16} />
                <span>45 Services</span>
              </div>
              <div className="stat-item">
                <Calendar size={16} />
                <span>247 Bookings</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-secondary">
            <Eye size={16} />
            Preview Profile
          </button>
          <button className="btn-primary">
            <Link size={16} />
            Share Profile
          </button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'business' && renderBusinessDetails()}
        {activeTab === 'portfolio' && renderPortfolio()}
        {activeTab === 'availability' && renderAvailability()}
        {activeTab === 'documents' && renderDocuments()}
      </div>
    </div>
  );
};

export default BusinessProfilePage;