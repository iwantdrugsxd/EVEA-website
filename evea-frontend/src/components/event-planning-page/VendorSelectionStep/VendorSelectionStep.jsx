// src/components/event-planning-page/VendorSelectionStep/VendorSelectionStep.jsx
import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Star, 
  MapPin, 
  Phone, 
  Mail,
  Users,
  Calendar,
  DollarSign,
  Award,
  Shield,
  Clock,
  Heart,
  MessageCircle
} from 'lucide-react';
import './VendorSelectionStep.css';

const VendorSelectionStep = ({ eventData, addSelectedVendor, removeSelectedVendor, nextStep, prevStep }) => {
  const [selectedVendors, setSelectedVendors] = useState(eventData.selectedVendors || []);
  const [favorites, setFavorites] = useState([]);
  const [contactedVendors, setContactedVendors] = useState([]);

  // Mock vendor data - this would come from your previous search/comparison steps
  const availableVendors = [
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
      description: 'Capturing beautiful moments with artistic flair and professional expertise.',
      portfolio: 150,
      responseTime: '< 2 hours',
      availability: 'Available',
      contact: {
        phone: '+91 98765 43210',
        email: 'contact@goldenmoments.com'
      },
      packages: [
        { name: 'Basic', price: 35000, features: ['4 hours coverage', 'Online gallery', '100 edited photos'] },
        { name: 'Premium', price: 45000, features: ['8 hours coverage', 'Online gallery', '300 edited photos', 'Prints included'] },
        { name: 'Luxury', price: 65000, features: ['12 hours coverage', 'Premium album', '500+ edited photos', 'Same day preview'] }
      ],
      badges: ['Top Rated', 'Quick Response', 'Verified']
    },
    {
      id: 2,
      name: 'Royal Feast Catering',
      category: 'catering',
      rating: 4.8,
      reviews: 95,
      price: 800,
      priceLabel: '₹800/person',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400',
      location: 'Mumbai',
      experience: '12 years',
      specialty: 'Multi-cuisine',
      description: 'Premium catering services with diverse menu options and exceptional taste.',
      portfolio: 200,
      responseTime: '< 1 hour',
      availability: 'Available',
      contact: {
        phone: '+91 98765 43211',
        email: 'bookings@royalfeast.com'
      },
      packages: [
        { name: 'Standard', price: 600, features: ['3-course meal', 'Basic service', 'Standard setup'] },
        { name: 'Premium', price: 800, features: ['4-course meal', 'Live counters', 'Premium service', 'Decoration'] },
        { name: 'Luxury', price: 1200, features: ['5-course meal', 'Live stations', 'Chef on site', 'Premium setup'] }
      ],
      badges: ['Verified', 'Premium', 'Hygiene Certified']
    },
    {
      id: 3,
      name: 'Dreamy Decorations',
      category: 'decoration',
      rating: 4.7,
      reviews: 156,
      price: 75000,
      priceLabel: '₹75,000',
      image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400',
      location: 'Mumbai',
      experience: '6 years',
      specialty: 'Theme Decoration',
      description: 'Creating magical atmospheres with stunning decorative designs.',
      portfolio: 180,
      responseTime: '< 4 hours',
      availability: 'Limited slots',
      contact: {
        phone: '+91 98765 43212',
        email: 'hello@dreamydeco.com'
      },
      packages: [
        { name: 'Essential', price: 50000, features: ['Basic decoration', 'Stage setup', 'Lighting'] },
        { name: 'Deluxe', price: 75000, features: ['Theme decoration', 'Stage + backdrop', 'Premium lighting', 'Floral arrangements'] },
        { name: 'Royal', price: 120000, features: ['Luxury theme', 'Complete venue transformation', 'Designer lighting', 'Premium florals'] }
      ],
      badges: ['Creative', 'On-time', 'Award Winner']
    }
  ];

  const handleVendorSelect = (vendor) => {
    const isSelected = selectedVendors.some(v => v.id === vendor.id);
    
    if (isSelected) {
      const newSelection = selectedVendors.filter(v => v.id !== vendor.id);
      setSelectedVendors(newSelection);
      removeSelectedVendor(vendor.id);
    } else {
      const newSelection = [...selectedVendors, vendor];
      setSelectedVendors(newSelection);
      addSelectedVendor(vendor);
    }
  };

  const toggleFavorite = (vendorId) => {
    setFavorites(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const contactVendor = (vendorId) => {
    if (!contactedVendors.includes(vendorId)) {
      setContactedVendors(prev => [...prev, vendorId]);
    }
  };

  const isVendorSelected = (vendorId) => {
    return selectedVendors.some(v => v.id === vendorId);
  };

  const getTotalCost = () => {
    return selectedVendors.reduce((total, vendor) => {
      return total + vendor.price;
    }, 0);
  };

  return (
    <div className="vendor-selection-step">
      <div className="selection-background">
        <div className="bg-pattern"></div>
      </div>

      <div className="selection-container">
        <div className="selection-header">
          <h1 className="step-title">
            Select Your <span className="gradient-text">Dream Team</span>
          </h1>
          <p className="step-subtitle">
            Choose the perfect vendors for your event. You can customize packages and negotiate directly.
          </p>
          
          <div className="selection-summary">
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-number">{selectedVendors.length}</span>
                <span className="stat-label">Vendors Selected</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹{getTotalCost().toLocaleString()}</span>
                <span className="stat-label">Estimated Total</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{availableVendors.length}</span>
                <span className="stat-label">Available Options</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vendors-selection-grid">
          {availableVendors.map((vendor) => {
            const isSelected = isVendorSelected(vendor.id);
            const isFavorited = favorites.includes(vendor.id);
            const isContacted = contactedVendors.includes(vendor.id);
            
            return (
              <div 
                key={vendor.id} 
                className={`vendor-selection-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="vendor-image-section">
                  <img src={vendor.image} alt={vendor.name} className="vendor-image" />
                  
                  <div className="vendor-overlay">
                    <button 
                      onClick={() => toggleFavorite(vendor.id)}
                      className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    
                    <div className="vendor-badges">
                      {vendor.badges.slice(0, 2).map(badge => (
                        <span key={badge} className="vendor-badge">{badge}</span>
                      ))}
                    </div>
                  </div>

                  <div className={`availability-status ${vendor.availability.toLowerCase().replace(' ', '-')}`}>
                    {vendor.availability}
                  </div>
                </div>

                <div className="vendor-content">
                  <div className="vendor-header">
                    <div className="vendor-basic-info">
                      <h3 className="vendor-name">{vendor.name}</h3>
                      <div className="vendor-specialty">{vendor.specialty}</div>
                      <div className="vendor-location">
                        <MapPin className="w-4 h-4" />
                        <span>{vendor.location} • {vendor.experience}</span>
                      </div>
                    </div>
                    
                    <div className="vendor-rating">
                      <div className="rating-display">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="rating-number">{vendor.rating}</span>
                      </div>
                      <div className="reviews-count">({vendor.reviews} reviews)</div>
                    </div>
                  </div>

                  <p className="vendor-description">{vendor.description}</p>

                  <div className="vendor-quick-stats">
                    <div className="quick-stat">
                      <Award className="w-4 h-4" />
                      <span>{vendor.portfolio} projects</span>
                    </div>
                    <div className="quick-stat">
                      <Clock className="w-4 h-4" />
                      <span>Responds in {vendor.responseTime}</span>
                    </div>
                    <div className="quick-stat">
                      <Shield className="w-4 h-4" />
                      <span>Verified vendor</span>
                    </div>
                  </div>

                  <div className="vendor-packages">
                    <h4>Available Packages</h4>
                    <div className="packages-list">
                      {vendor.packages.map((pkg, index) => (
                        <div key={index} className="package-item">
                          <div className="package-header">
                            <span className="package-name">{pkg.name}</span>
                            <span className="package-price">
                              {vendor.category === 'catering' ? `₹${pkg.price}/person` : `₹${pkg.price.toLocaleString()}`}
                            </span>
                          </div>
                          <div className="package-features">
                            {pkg.features.slice(0, 2).map((feature, idx) => (
                              <span key={idx} className="package-feature">• {feature}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="vendor-contact">
                    <div className="contact-info">
                      <div className="contact-item">
                        <Phone className="w-4 h-4" />
                        <span>{vendor.contact.phone}</span>
                      </div>
                      <div className="contact-item">
                        <Mail className="w-4 h-4" />
                        <span>{vendor.contact.email}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => contactVendor(vendor.id)}
                      className={`contact-btn ${isContacted ? 'contacted' : ''}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {isContacted ? 'Contacted' : 'Contact'}
                    </button>
                  </div>
                </div>

                <div className="vendor-actions">
                  <div className="pricing-display">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">{vendor.priceLabel}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleVendorSelect(vendor)}
                    className={`selection-btn ${isSelected ? 'selected' : ''}`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      <>
                        Select Vendor
                      </>
                    )}
                  </button>
                </div>

                {isSelected && (
                  <div className="selected-indicator">
                    <Check className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedVendors.length > 0 && (
          <div className="selection-summary-card">
            <h3>Your Selected Team ({selectedVendors.length} vendors)</h3>
            <div className="selected-vendors-list">
              {selectedVendors.map(vendor => (
                <div key={vendor.id} className="selected-vendor-item">
                  <div className="selected-vendor-info">
                    <span className="selected-vendor-name">{vendor.name}</span>
                    <span className="selected-vendor-category">{vendor.category}</span>
                  </div>
                  <div className="selected-vendor-price">{vendor.priceLabel}</div>
                  <button 
                    onClick={() => handleVendorSelect(vendor)}
                    className="remove-vendor-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="total-cost">
              <span>Estimated Total: </span>
              <span className="total-amount">₹{getTotalCost().toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="step-actions">
          <button onClick={prevStep} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </button>
          
          <button 
            onClick={nextStep}
            className={`btn-primary ${selectedVendors.length === 0 ? 'disabled' : ''}`}
            disabled={selectedVendors.length === 0}
          >
            Continue with {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorSelectionStep;