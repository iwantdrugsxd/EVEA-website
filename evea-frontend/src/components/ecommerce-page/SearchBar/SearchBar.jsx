// src/components/ecommerce-page/SearchBar/SearchBar.jsx
import React, { useState } from 'react';
import { Search, Calendar, Users, Star, ChevronDown } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [sortBy, setSortBy] = useState('top-rated');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'photography', label: 'Photography' },
    { value: 'catering', label: 'Catering' },
    { value: 'decoration', label: 'Decoration' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'venues', label: 'Venues' },
    { value: 'transportation', label: 'Transportation' }
  ];

  const popularSearches = [
    'Wedding photographers',
    'Birthday decorators', 
    'Corporate catering',
    'DJ services',
    'Event venues'
  ];

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      category: selectedCategory,
      eventDate,
      guestCount,
      sortBy
    });
  };

  const handlePopularSearchClick = (search) => {
    setSearchQuery(search);
    onSearch({
      query: search,
      category: selectedCategory,
      eventDate,
      guestCount,
      sortBy
    });
  };

  return (
    <div className="search-bar-section">
      <div className="container">
        <div className="search-bar-container">
          {/* Main Search Input */}
          <div className="main-search-wrapper">
            <div className="search-input-group">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                className="search-input"
                placeholder="Search services, vendors, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <button className="search-button" onClick={handleSearch}>
              <Search size={18} />
              Search
            </button>
          </div>

          {/* Filter Row */}
          <div className="filter-row">
            <div className="filter-group">
              <div className="filter-item">
                <select 
                  className="filter-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="select-icon" size={16} />
              </div>

              <div className="filter-item">
                <Calendar className="filter-icon" size={16} />
                <input
                  type="date"
                  className="filter-input"
                  placeholder="Event Date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="filter-item">
                <Users className="filter-icon" size={16} />
                <select 
                  className="filter-select"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                >
                  <option value="">Guest Count</option>
                  <option value="1-50">1-50 guests</option>
                  <option value="51-100">51-100 guests</option>
                  <option value="101-200">101-200 guests</option>
                  <option value="201-500">201-500 guests</option>
                  <option value="500+">500+ guests</option>
                </select>
              </div>

              <div className="filter-item">
                <Star className="filter-icon" size={16} />
                <select 
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="top-rated">Top Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="most-booked">Most Booked</option>
                </select>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="popular-searches">
            <span className="popular-label">Popular searches:</span>
            <div className="popular-tags">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="popular-tag"
                  onClick={() => handlePopularSearchClick(search)}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;