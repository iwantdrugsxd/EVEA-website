import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  MapPin, 
  Heart, 
  Calendar, 
  Users 
} from 'lucide-react';
import ServicesHero from '../../components/services-page/ServicesHero/ServicesHero';
import './ServicesPage.css';

const ServicesPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Services', count: 1250 },
    { id: 'photography', name: 'Photography', count: 320 },
    { id: 'catering', name: 'Catering', count: 280 },
    { id: 'decoration', name: 'Decoration', count: 190 },
    { id: 'entertainment', name: 'Entertainment', count: 150 },
    { id: 'venues', name: 'Venues', count: 200 },
    { id: 'transportation', name: 'Transportation', count: 110 }
  ];

  const services = [
    {
      id: 1,
      name: "Premium Wedding Photography",
      vendor: "Capture Moments Studio",
      category: "photography",
      price: "₹25,000",
      rating: 4.9,
      reviews: 156,
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      id: 2,
      name: "Gourmet Catering Services",
      vendor: "Delicious Bites",
      category: "catering",
      price: "₹800/plate",
      rating: 4.8,
      reviews: 203,
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false
    },
    {
      id: 3,
      name: "Elegant Event Decoration",
      vendor: "Dream Decorators",
      category: "decoration",
      price: "₹15,000",
      rating: 4.7,
      reviews: 89,
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      id: 4,
      name: "Live Band Entertainment",
      vendor: "Rhythm Masters",
      category: "entertainment",
      price: "₹35,000",
      rating: 4.6,
      reviews: 74,
      location: "Mumbai",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false
    },
    {
      id: 5,
      name: "Luxury Wedding Venue",
      vendor: "Grand Palace Hotels",
      category: "venues",
      price: "₹2,50,000",
      rating: 4.8,
      reviews: 134,
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: true
    },
    {
      id: 6,
      name: "Premium Car Rental",
      vendor: "Luxury Rides",
      category: "transportation",
      price: "₹5,000/day",
      rating: 4.5,
      reviews: 98,
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      featured: false
    }
  ];

  const popularSearches = [
    "Wedding photographers",
    "Birthday decorators", 
    "Corporate catering",
    "DJ services",
    "Event venues"
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="services-page">
      {/* Integrated ServicesHero Component */}
      <ServicesHero />

      {/* Combined Search and Services Section */}
      <div className="services-content-combined aos-init aos-animate">
        <div className="container">
          {/* Enhanced Search and Filter Section */}
          <div className="enhanced-search-section">
            <div className="search-filter-container">
              <div className="main-search-form">
                <div className="search-inputs-row">
                  <div className="enhanced-search-field">
                    <Search className="field-icon" size={20} />
                    <input 
                      type="text"
                      placeholder="Search services, vendors, or keywords..."
                      className="enhanced-search-input"
                    />
                  </div>
                  
                  <div className="enhanced-location-field">
                    <MapPin className="field-icon" size={20} />
                    <input 
                      type="text"
                      placeholder="Mumbai, Maharashtra"
                      className="enhanced-location-input"
                    />
                  </div>
                  
                  <button className="enhanced-search-btn">
                    <Search size={18} />
                    Search
                  </button>
                </div>
                
                <div className="enhanced-filter-pills">
                  <button className="filter-pill active">
                    <Filter size={16} />
                    All Categories
                  </button>
                  <button className="filter-pill">
                    <Calendar size={16} />
                    Event Date
                  </button>
                  <button className="filter-pill">
                    <Users size={16} />
                    Guest Count
                  </button>
                  <button className="filter-pill">
                    <Star size={16} />
                    Top Rated
                  </button>
                </div>
              </div>
            </div>
            
            {/* Popular Searches */}
            <div className="popular-searches-section">
              <span className="popular-searches-label">Popular searches:</span>
              <div className="popular-search-tags">
                {popularSearches.map((search, index) => (
                  <button key={index} className="popular-search-tag">
                    {search}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Layout */}
          <div className="services-layout">
            <aside className="services-sidebar">
              <div className="filter-section">
                <h3 className="filter-title">
                  <Filter size={20} />
                  Categories
                </h3>
                <div className="category-filters">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>{category.name}</span>
                      <span className="count">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Price Range</h3>
                <div className="price-filters">
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Under ₹10,000</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>₹10,000 - ₹25,000</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>₹25,000 - ₹50,000</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Above ₹50,000</span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Rating</h3>
                <div className="rating-filters">
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>4.5+ ⭐</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>4.0+ ⭐</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>3.5+ ⭐</span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Location</h3>
                <div className="location-filters">
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Mumbai</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Delhi</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Bangalore</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Chennai</span>
                  </label>
                </div>
              </div>

              <div className="filter-section">
                <h3 className="filter-title">Features</h3>
                <div className="feature-filters">
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Instant Booking</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Free Cancellation</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>24/7 Support</span>
                  </label>
                  <label className="filter-checkbox">
                    <input type="checkbox" />
                    <span>Verified Vendor</span>
                  </label>
                </div>
              </div>
            </aside>

            <main className="services-main">
              <div className="services-header">
                <div className="results-info">
                  <h2>Showing {filteredServices.length} services</h2>
                  <p>{selectedCategory === 'all' ? 'All categories' : categories.find(c => c.id === selectedCategory)?.name}</p>
                </div>

                <div className="view-controls">
                  <div className="view-toggle">
                    <button 
                      className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid size={18} />
                    </button>
                    <button 
                      className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <List size={18} />
                    </button>
                  </div>

                  <select className="sort-select">
                    <option>Sort by Relevance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating: High to Low</option>
                    <option>Most Popular</option>
                    <option>Newest First</option>
                  </select>
                </div>
              </div>

              <div className={`services-grid ${viewMode}`}>
                {filteredServices.map((service) => (
                  <div key={service.id} className="service-card">
                    {service.featured && (
                      <div className="featured-badge">Featured</div>
                    )}
                    
                    <div className="service-image">
                      <img src={service.image} alt={service.name} loading="lazy" />
                      <button className="favorite-btn">
                        <Heart size={16} />
                      </button>
                      <div className="image-overlay">
                        <button className="quick-view-btn">Quick View</button>
                      </div>
                    </div>

                    <div className="service-content">
                      <div className="service-header">
                        <h3 className="service-name">{service.name}</h3>
                        <div className="service-rating">
                          <Star size={14} className="star-filled" />
                          <span>{service.rating}</span>
                          <span className="review-count">({service.reviews})</span>
                        </div>
                      </div>

                      <p className="service-vendor">by {service.vendor}</p>
                      
                      <div className="service-location">
                        <MapPin size={14} />
                        <span>{service.location}</span>
                      </div>

                      <div className="service-features">
                        <span className="feature-tag">Verified</span>
                        <span className="feature-tag">Instant Booking</span>
                      </div>

                      <div className="service-footer">
                        <div className="service-price">
                          <span className="price-label">Starting from</span>
                          <span className="price-amount">{service.price}</span>
                        </div>
                        <button className="contact-btn">View Details</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="no-results">
                  <div className="no-results-content">
                    <h3>No services found</h3>
                    <p>Try adjusting your filters or search terms</p>
                    <button 
                      className="reset-filters-btn"
                      onClick={() => setSelectedCategory('all')}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}

              <div className="pagination">
                <button className="pagination-btn prev" disabled>
                  Previous
                </button>
                <div className="pagination-numbers">
                  <button className="pagination-number active">1</button>
                  <button className="pagination-number">2</button>
                  <button className="pagination-number">3</button>
                  <span className="pagination-dots">...</span>
                  <button className="pagination-number">10</button>
                </div>
                <button className="pagination-btn next">
                  Next
                </button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;