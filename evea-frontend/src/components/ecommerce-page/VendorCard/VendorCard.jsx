// src/components/ecommerce-page/VendorCard/VendorCard.jsx
import React, { useState } from 'react';
import { 
  Star, Heart, ChevronDown, ChevronUp, Plus
} from 'lucide-react';
import './VendorCard.css';

const VendorCard = ({ vendor, onAddToPackage, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleAddToPackage = () => {
    const servicesToAdd = selectedServices.length > 0 
      ? vendor.services.filter(service => selectedServices.includes(service.id))
      : [vendor.packageDeal];
    
    onAddToPackage(vendor.id, servicesToAdd);
    setSelectedServices([]);
  };

  const getTotalPrice = () => {
    if (selectedServices.length === 0) return vendor.packageDeal.price;
    return selectedServices.reduce((total, serviceId) => {
      const service = vendor.services.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
  };

  return (
    <div className="vendor-carde">
      {/* Card Header */}
      <div className="vendor-card-header">
        <div className="vendor-image">
          <img src={vendor.image} alt={vendor.name} />
          <div className="vendor-badges">
            {vendor.isVerified && (
              <div className="vendor-badge verified">
                Verified
              </div>
            )}
            {vendor.isTopRated && (
              <div className="vendor-badge top-rated">
                Top Rated
              </div>
            )}
            {vendor.features.includes('instant-booking') && (
              <div className="vendor-badge instant">
                Instant Booking
              </div>
            )}
          </div>
          <button 
            className={`favorite-btn ${vendor.isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(vendor.id)}
          >
            <Heart size={16} fill={vendor.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="vendor-card-content">
        <div className="vendor-header">
          <div className="vendor-title-section">
            <h3 className="vendor-name">{vendor.name}</h3>
            <div className="vendor-rating">
              <Star size={14} fill="currentColor" />
              <span className="rating-value">{vendor.rating}</span>
              <span className="rating-count">({vendor.reviewCount} reviews)</span>
            </div>
          </div>
          
          <div className="vendor-meta">
            <div className="meta-item">
              <span className="meta-label">Location:</span>
              <span className="meta-value">{vendor.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Experience:</span>
              <span className="meta-value">{vendor.experience}</span>
            </div>
          </div>
        </div>

        {/* Primary Services */}
        <div className="vendor-services">
          <h4 className="services-heading">Services Offered</h4>
          <div className="services-list">
            {vendor.primaryServices.map((service, index) => (
              <span key={index} className="service-tag">
                {service.name}
              </span>
            ))}
          </div>
        </div>

        {/* Package Deal */}
        <div className="package-deal">
          <div className="package-header">
            <div className="package-info">
              <h4 className="package-title">{vendor.packageDeal.name}</h4>
              <p className="package-description">{vendor.packageDeal.description}</p>
            </div>
            <div className="package-price">
              <span className="price-label">Package Deal</span>
              <span className="price-value">₹{vendor.packageDeal.price.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expand/Collapse Toggle */}
        <button 
          className="expand-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>
            {isExpanded ? 'Hide Services' : `View All Services (${vendor.services.length})`}
          </span>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Expanded Services */}
        {isExpanded && (
          <div className="expanded-services">
            <h4 className="services-title">Individual Services & Pricing</h4>
            <div className="services-grid">
              {vendor.services.map((service) => (
                <div key={service.id} className="service-item">
                  <label className="service-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                    />
                    <span className="service-checkmark"></span>
                    <div className="service-details">
                      <div className="service-name">{service.name}</div>
                      <div className="service-desc">{service.description}</div>
                      <div className="service-price">₹{service.price.toLocaleString()}</div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            
            {selectedServices.length > 0 && (
              <div className="selected-services-summary">
                <div className="summary-info">
                  <span className="selected-count">{selectedServices.length} services selected</span>
                  <span className="total-price">Total: ₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Card Actions */}
        <div className="vendor-card-actions">
          <div className="price-display">
            <span className="price-from">Starting from</span>
            <span className="current-price">
              ₹{(selectedServices.length > 0 ? getTotalPrice() : vendor.startingPrice).toLocaleString()}
            </span>
          </div>
          
          <button 
            className="add-to-package-btn"
            onClick={handleAddToPackage}
          >
            <Plus size={16} />
            Add to Package
          </button>
        </div>

        {/* Features */}
        {vendor.features.length > 0 && (
          <div className="vendor-features">
            <div className="features-label">Available Features:</div>
            <div className="features-list">
              {vendor.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCard;