import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, ArrowLeft, ArrowRight } from 'lucide-react';
import './VendorSearchStep.css';

const VendorSearchStep = ({ nextStep, prevStep, eventData, addSelectedVendor, removeSelectedVendor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendors, setSelectedVendors] = useState([]);

  // Mock vendor data
  const mockVendors = [
    {
      id: 1,
      name: "Elite Photography Studio",
      category: "Photography",
      rating: 4.8,
      location: "Mumbai",
      price: 25000,
      priceLabel: "₹25,000",
      image: "/api/placeholder/200/150",
      specialties: ["Wedding Photography", "Portrait Sessions"]
    },
    {
      id: 2,
      name: "Royal Caterers",
      category: "Catering",
      rating: 4.9,
      location: "Mumbai",
      price: 50000,
      priceLabel: "₹50,000",
      image: "/api/placeholder/200/150",
      specialties: ["Indian Cuisine", "Continental"]
    },
    {
      id: 3,
      name: "Dream Decorators",
      category: "Decoration",
      rating: 4.7,
      location: "Mumbai",
      price: 35000,
      priceLabel: "₹35,000",
      image: "/api/placeholder/200/150",
      specialties: ["Floral Arrangements", "Theme Decoration"]
    }
  ];

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleVendorSelect = (vendor) => {
    const isSelected = selectedVendors.find(v => v.id === vendor.id);
    if (isSelected) {
      setSelectedVendors(prev => prev.filter(v => v.id !== vendor.id));
      removeSelectedVendor(vendor.id);
    } else {
      setSelectedVendors(prev => [...prev, vendor]);
      addSelectedVendor(vendor);
    }
  };

  return (
    <div className="vendor-search-step">
      <div className="search-background">
        <div className="mesh-gradient"></div>
      </div>

      <div className="search-container">
        <div className="search-header">
          <h1 className="step-title">
            Find Perfect <span className="gradient-text">Vendors</span>
          </h1>
          <p className="step-subtitle">
            Discover and compare top-rated vendors for your event
          </p>
        </div>

        <div className="search-controls">
          <div className="search-input-group">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="filter-group">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
            >
              <option value="all">All Categories</option>
              <option value="photography">Photography</option>
              <option value="catering">Catering</option>
              <option value="decoration">Decoration</option>
              <option value="music">Music</option>
            </select>
          </div>
        </div>

        <div className="vendors-grid">
          {filteredVendors.map(vendor => {
            const isSelected = selectedVendors.find(v => v.id === vendor.id);
            return (
              <div key={vendor.id} className={`vendor-card ${isSelected ? 'selected' : ''}`}>
                <div className="vendor-image">
                  <img src={vendor.image} alt={vendor.name} />
                  <div className="vendor-rating">
                    <Star className="star-icon" size={16} />
                    <span>{vendor.rating}</span>
                  </div>
                </div>
                
                <div className="vendor-content">
                  <h3 className="vendor-name">{vendor.name}</h3>
                  <p className="vendor-category">{vendor.category}</p>
                  <div className="vendor-location">
                    <MapPin size={14} />
                    <span>{vendor.location}</span>
                  </div>
                  <p className="vendor-specialty">
                    {vendor.specialties.join(', ')}
                  </p>
                </div>
                
                <div className="vendor-footer">
                  <div className="vendor-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-value">{vendor.priceLabel}</span>
                  </div>
                  <button 
                    onClick={() => handleVendorSelect(vendor)}
                    className={`action-btn ${isSelected ? 'primary' : 'secondary'}`}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredVendors.length === 0 && (
          <div className="no-results">
            <div className="no-results-content">
              <div className="no-results-icon">🔍</div>
              <h3>No vendors found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          </div>
        )}

        <div className="step-actions">
          <button onClick={prevStep} className="btn-secondary">
            <ArrowLeft size={16} />
            Back
          </button>
          
          <button 
            onClick={nextStep}
            className="btn-primary"
            disabled={selectedVendors.length === 0}
          >
            Continue with {selectedVendors.length} vendor{selectedVendors.length !== 1 ? 's' : ''}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorSearchStep;