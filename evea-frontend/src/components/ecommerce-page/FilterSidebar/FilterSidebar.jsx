// src/components/ecommerce-page/FilterSidebar/FilterSidebar.jsx
import React, { useState } from 'react';
import { 
  Filter, Star, X
} from 'lucide-react';
import './FilterSidebar.css';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters }) => {
  const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);
  const [selectedPriceRange, setSelectedPriceRange] = useState(filters.priceRange || '');
  const [selectedRating, setSelectedRating] = useState(filters.rating || '');
  const [selectedLocation, setSelectedLocation] = useState(filters.location || '');
  const [selectedFeatures, setSelectedFeatures] = useState(filters.features || []);

  const categories = [
    { id: 'all', name: 'All Services', count: 1250 },
    { id: 'photography', name: 'Photography', count: 320 },
    { id: 'catering', name: 'Catering', count: 280 },
    { id: 'decoration', name: 'Decoration', count: 190 },
    { id: 'entertainment', name: 'Entertainment', count: 150 },
    { id: 'venues', name: 'Venues', count: 200 },
    { id: 'transportation', name: 'Transportation', count: 110 }
  ];

  const priceRanges = [
    { id: 'under-10k', label: 'Under ₹10,000' },
    { id: '10k-25k', label: '₹10,000 - ₹25,000' },
    { id: '25k-50k', label: '₹25,000 - ₹50,000' },
    { id: 'above-50k', label: 'Above ₹50,000' }
  ];

  const ratings = [
    { id: '4.5+', label: '4.5+ ⭐', count: 892 },
    { id: '4.0+', label: '4.0+ ⭐', count: 1156 },
    { id: '3.5+', label: '3.5+ ⭐', count: 1250 }
  ];

  const locations = [
    { id: 'mumbai', name: 'Mumbai', count: 425 },
    { id: 'delhi', name: 'Delhi', count: 380 },
    { id: 'bangalore', name: 'Bangalore', count: 295 },
    { id: 'chennai', name: 'Chennai', count: 150 }
  ];

  const features = [
    { id: 'instant-booking', name: 'Instant Booking' },
    { id: 'free-cancellation', name: 'Free Cancellation' },
    { id: '24-7-support', name: '24/7 Support' },
    { id: 'verified-vendor', name: 'Verified Vendor' }
  ];

  const handleCategoryChange = (categoryId) => {
    let newCategories;
    if (categoryId === 'all') {
      newCategories = ['all'];
    } else {
      newCategories = selectedCategories.filter(c => c !== 'all');
      if (selectedCategories.includes(categoryId)) {
        newCategories = newCategories.filter(c => c !== categoryId);
      } else {
        newCategories = [...newCategories, categoryId];
      }
      if (newCategories.length === 0) {
        newCategories = ['all'];
      }
    }
    
    setSelectedCategories(newCategories);
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceRangeChange = (priceRange) => {
    const newPriceRange = selectedPriceRange === priceRange ? '' : priceRange;
    setSelectedPriceRange(newPriceRange);
    onFilterChange({ ...filters, priceRange: newPriceRange });
  };

  const handleRatingChange = (rating) => {
    const newRating = selectedRating === rating ? '' : rating;
    setSelectedRating(newRating);
    onFilterChange({ ...filters, rating: newRating });
  };

  const handleLocationChange = (location) => {
    const newLocation = selectedLocation === location ? '' : location;
    setSelectedLocation(newLocation);
    onFilterChange({ ...filters, location: newLocation });
  };

  const handleFeatureChange = (featureId) => {
    const newFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(f => f !== featureId)
      : [...selectedFeatures, featureId];
    
    setSelectedFeatures(newFeatures);
    onFilterChange({ ...filters, features: newFeatures });
  };

  const handleClearAll = () => {
    setSelectedCategories(['all']);
    setSelectedPriceRange('');
    setSelectedRating('');
    setSelectedLocation('');
    setSelectedFeatures([]);
    onClearFilters();
  };

  const hasActiveFilters = selectedCategories.length > 1 || 
    selectedCategories[0] !== 'all' || 
    selectedPriceRange || 
    selectedRating || 
    selectedLocation || 
    selectedFeatures.length > 0;

  return (
    <div className="filter-sidebar">
      <div className="filter-header">
        <div className="filter-title">
          <Filter size={20} />
          Filters
        </div>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={handleClearAll}>
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="filter-section">
        <h3 className="filter-section-title">Categories</h3>
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategories.includes(category.id) ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
            >
              <div className="category-info">
                <span className="category-name">{category.name}</span>
              </div>
              <span className="category-count">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <h3 className="filter-section-title">Price Range</h3>
        <div className="price-filters">
          {priceRanges.map((range) => (
            <label key={range.id} className="price-checkbox">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range.id}
                onChange={() => handlePriceRangeChange(range.id)}
              />
              <span className="checkmark"></span>
              <span className="price-label">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="filter-section">
        <h3 className="filter-section-title">Rating</h3>
        <div className="rating-filters">
          {ratings.map((rating) => (
            <button
              key={rating.id}
              className={`rating-btn ${selectedRating === rating.id ? 'active' : ''}`}
              onClick={() => handleRatingChange(rating.id)}
            >
              <span className="rating-label">{rating.label}</span>
              <span className="rating-count">({rating.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="filter-section">
        <h3 className="filter-section-title">Location</h3>
        <div className="location-filters">
          {locations.map((location) => (
            <button
              key={location.id}
              className={`location-btn ${selectedLocation === location.id ? 'active' : ''}`}
              onClick={() => handleLocationChange(location.id)}
            >
              <span className="location-name">{location.name}</span>
              <span className="location-count">({location.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="filter-section">
        <h3 className="filter-section-title">Features</h3>
        <div className="feature-filters">
          {features.map((feature) => (
            <label key={feature.id} className="feature-checkbox">
              <input
                type="checkbox"
                checked={selectedFeatures.includes(feature.id)}
                onChange={() => handleFeatureChange(feature.id)}
              />
              <span className="feature-checkmark"></span>
              <span className="feature-name">{feature.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;