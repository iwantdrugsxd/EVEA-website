// src/components/event-planning-page/VendorComparisonStep/VendorComparisonStep.jsx
import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Star, 
  Heart, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Users,
  Award,
  Check,
  X,
  Eye,
  MessageCircle,
  DollarSign,
  Camera,
  Shield,
  ThumbsUp
} from 'lucide-react';
import './VendorComparisonStep.css';

const VendorComparisonStep = ({ eventData, addSelectedVendor, nextStep, prevStep }) => {
  const [comparedVendors, setComparedVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Mock vendor data with detailed information for comparison
  const mockVendors = [
    {
      id: 1,
      name: 'Golden Moments Photography',
      category: 'photography',
      rating: 4.9,
      reviews: 128,
      price: 45000,
      priceLabel: '₹45,000',
      image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400',
      location: 'Mumbai',
      experience: '8 years',
      specialty: 'Wedding Photography',
      responseTime: '< 2 hours',
      completedEvents: 350,
      packages: ['Basic', 'Premium', 'Luxury'],
      features: [
        'Pre-wedding shoot included',
        '500+ edited photos',
        'Online gallery',
        'Printed album',
        'Same day highlights'
      ],
      reviews_sample: [
        { rating: 5, comment: 'Amazing work! Captured every emotion perfectly.' },
        { rating: 5, comment: 'Professional and creative. Highly recommended!' }
      ],
      policies: {
        cancellation: '48 hours notice',
        advance: '30% advance required',
        refund: 'Partial refund available'
      }
    },
    {
      id: 2,
      name: 'Elite Capture Studios',
      category: 'photography',
      rating: 4.7,
      reviews: 89,
      price: 55000,
      priceLabel: '₹55,000',
      image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400',
      location: 'Mumbai',
      experience: '6 years',
      specialty: 'Cinematic Photography',
      responseTime: '< 4 hours',
      completedEvents: 220,
      packages: ['Standard', 'Premium', 'Elite'],
      features: [
        'Drone photography',
        'Raw files included',
        'Video highlights',
        'Custom album design',
        '24/7 support'
      ],
      reviews_sample: [
        { rating: 5, comment: 'Stunning cinematic style! Worth every penny.' },
        { rating: 4, comment: 'Great quality but slightly expensive.' }
      ],
      policies: {
        cancellation: '72 hours notice',
        advance: '40% advance required',
        refund: 'No refund on advance'
      }
    },
    {
      id: 3,
      name: 'Classic Lens Photography',
      category: 'photography',
      rating: 4.6,
      reviews: 156,
      price: 35000,
      priceLabel: '₹35,000',
      image: 'https://images.unsplash.com/photo-1554048612-b6ebae92138d?w=400',
      location: 'Mumbai',
      experience: '10 years',
      specialty: 'Traditional Photography',
      responseTime: '< 6 hours',
      completedEvents: 500,
      packages: ['Basic', 'Standard', 'Premium'],
      features: [
        'Traditional poses',
        '300+ photos',
        'Physical album',
        'Family portraits',
        'Group photos'
      ],
      reviews_sample: [
        { rating: 5, comment: 'Perfect for traditional ceremonies!' },
        { rating: 4, comment: 'Good value for money. Reliable service.' }
      ],
      policies: {
        cancellation: '24 hours notice',
        advance: '25% advance required',
        refund: 'Full refund if cancelled 7 days prior'
      }
    }
  ];

  const addToComparison = (vendor) => {
    if (comparedVendors.length < 3 && !comparedVendors.find(v => v.id === vendor.id)) {
      setComparedVendors([...comparedVendors, vendor]);
    }
  };

  const removeFromComparison = (vendorId) => {
    setComparedVendors(comparedVendors.filter(v => v.id !== vendorId));
  };

  const toggleFavorite = (vendorId) => {
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const selectVendor = (vendor) => {
    if (!selectedVendors.find(v => v.id === vendor.id)) {
      setSelectedVendors([...selectedVendors, vendor]);
      addSelectedVendor(vendor);
    }
  };

  const removeSelectedVendor = (vendorId) => {
    setSelectedVendors(selectedVendors.filter(v => v.id !== vendorId));
  };

  const clearComparison = () => {
    setComparedVendors([]);
  };

  return (
    <div className="vendor-comparison-step">
      <div className="comparison-background">
        <div className="gradient-mesh"></div>
      </div>

      <div className="comparison-container">
        <div className="comparison-header">
          <h1 className="step-title">
            Compare <span className="gradient-text">Vendors</span>
          </h1>
          <p className="step-subtitle">
            Compare vendors side by side to make the best choice for your event
          </p>
        </div>

        {/* Vendor Selection Grid */}
        <div className="vendor-selection-section">
          <div className="section-header">
            <h2>Available Vendors</h2>
            <div className="selection-info">
              {comparedVendors.length}/3 selected for comparison
            </div>
          </div>

          <div className="vendors-grid">
            {mockVendors.map(vendor => (
              <div key={vendor.id} className="vendor-preview-card">
                <div className="vendor-image">
                  <img src={vendor.image} alt={vendor.name} />
                  <div className="vendor-overlay">
                    <button 
                      onClick={() => toggleFavorite(vendor.id)}
                      className={`favorite-btn ${favorites.includes(vendor.id) ? 'active' : ''}`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="vendor-info">
                  <h3>{vendor.name}</h3>
                  <div className="vendor-meta">
                    <div className="rating">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span>{vendor.rating}</span>
                      <span className="review-count">({vendor.reviews})</span>
                    </div>
                    <div className="price">{vendor.priceLabel}</div>
                  </div>
                  <div className="vendor-location">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor.location} • {vendor.experience}</span>
                  </div>
                </div>

                <div className="vendor-actions">
                  <button 
                    onClick={() => addToComparison(vendor)}
                    disabled={comparedVendors.length >= 3 || comparedVendors.find(v => v.id === vendor.id)}
                    className="compare-btn"
                  >
                    {comparedVendors.find(v => v.id === vendor.id) ? 'Added' : 'Compare'}
                  </button>
                  <button 
                    onClick={() => selectVendor(vendor)}
                    className="select-btn"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {comparedVendors.length > 0 && (
          <div className="comparison-section">
            <div className="section-header">
              <h2>Vendor Comparison</h2>
              <button onClick={clearComparison} className="clear-btn">
                Clear All
              </button>
            </div>

            <div className="comparison-table">
              <div className="comparison-grid">
                {/* Header Row */}
                <div className="comparison-header-cell">
                  <span>Features</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={vendor.id} className="vendor-header-cell">
                    <div className="vendor-header-content">
                      <img src={vendor.image} alt={vendor.name} className="vendor-avatar" />
                      <div className="vendor-header-info">
                        <h4>{vendor.name}</h4>
                        <div className="vendor-rating">
                          <Star className="w-4 h-4 fill-current text-yellow-400" />
                          <span>{vendor.rating}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromComparison(vendor.id)}
                        className="remove-vendor-btn"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Price Row */}
                <div className="feature-label">
                  <DollarSign className="w-4 h-4" />
                  <span>Price</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={`price-${vendor.id}`} className="feature-value price-value">
                    {vendor.priceLabel}
                  </div>
                ))}

                {/* Experience Row */}
                <div className="feature-label">
                  <Award className="w-4 h-4" />
                  <span>Experience</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={`exp-${vendor.id}`} className="feature-value">
                    {vendor.experience}
                  </div>
                ))}

                {/* Response Time Row */}
                <div className="feature-label">
                  <Clock className="w-4 h-4" />
                  <span>Response Time</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={`response-${vendor.id}`} className="feature-value">
                    {vendor.responseTime}
                  </div>
                ))}

                {/* Completed Events Row */}
                <div className="feature-label">
                  <Camera className="w-4 h-4" />
                  <span>Completed Events</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={`events-${vendor.id}`} className="feature-value">
                    {vendor.completedEvents}+
                  </div>
                ))}

                {/* Features Row */}
                <div className="feature-label">
                  <Shield className="w-4 h-4" />
                  <span>Key Features</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={`features-${vendor.id}`} className="feature-value features-list">
                    {vendor.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="feature-item">
                        <Check className="w-3 h-3" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {vendor.features.length > 3 && (
                      <div className="more-features">+{vendor.features.length - 3} more</div>
                    )}
                  </div>
                ))}

                {/* Policies Row */}
                <div className="feature-label">
                  <MessageCircle className="w-4 h-4" />
                  <span>Cancellation Policy</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={`policy-${vendor.id}`} className="feature-value">
                    {vendor.policies.cancellation}
                  </div>
                ))}

                {/* Action Row */}
                <div className="feature-label">
                  <span>Actions</span>
                </div>
                {comparedVendors.map(vendor => (
                  <div key={`action-${vendor.id}`} className="feature-value action-cell">
                    <button 
                      onClick={() => selectVendor(vendor)}
                      className="select-vendor-btn"
                      disabled={selectedVendors.find(v => v.id === vendor.id)}
                    >
                      {selectedVendors.find(v => v.id === vendor.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          Selected
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-4 h-4" />
                          Select
                        </>
                      )}
                    </button>
                    <button className="contact-btn">
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Vendors Summary */}
        {selectedVendors.length > 0 && (
          <div className="selected-summary">
            <h3>Selected Vendors ({selectedVendors.length})</h3>
            <div className="selected-vendors-list">
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="selected-vendor-item">
                  <img src={vendor.image} alt={vendor.name} />
                  <div className="selected-vendor-info">
                    <h4>{vendor.name}</h4>
                    <div className="vendor-price">{vendor.priceLabel}</div>
                  </div>
                  <button 
                    onClick={() => removeSelectedVendor(vendor.id)}
                    className="remove-selected-btn"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="total-estimation">
              <span>Total Estimated Cost: </span>
              <span className="total-amount">
                ₹{selectedVendors.reduce((sum, vendor) => sum + vendor.price, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Step Actions */}
        <div className="step-actions">
          <button onClick={prevStep} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </button>
          
          <button 
            onClick={nextStep}
            disabled={selectedVendors.length === 0}
            className={`btn-primary ${selectedVendors.length === 0 ? 'disabled' : ''}`}
          >
            Continue with {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorComparisonStep;