// src/pages/InventoryPage/InventoryPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Grid, List, Upload, Download, 
  Camera, Edit, Trash2, Star, TrendingUp, Eye, Package,
  Calendar, DollarSign, Users, Clock, ArrowUpRight, MoreVertical,
  ChevronDown, Activity, Target, Zap, Award, Heart
} from 'lucide-react';
import './InventoryPage.css';

const InventoryPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample services data with more realistic content
  const services = [
    {
      id: 'SRV-001',
      name: 'Premium Wedding Photography',
      category: 'photography',
      price: 80000,
      originalPrice: 100000,
      description: 'Complete wedding photography package with pre-wedding shoot',
      images: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&w=400',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&w=400'
      ],
      features: ['2 Photographers', 'Pre-wedding Shoot', '500+ Edited Photos', 'Album Included'],
      rating: 4.9,
      bookings: 45,
      revenue: 3600000,
      status: 'active',
      availability: 'available',
      lastUpdated: '2024-01-15',
      bookedDates: 12,
      totalCapacity: 20,
      badge: 'bestseller'
    },
    {
      id: 'SRV-002',
      name: 'Corporate Event Planning',
      category: 'planning',
      price: 150000,
      originalPrice: 180000,
      description: 'End-to-end corporate event management and coordination',
      images: [
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&w=400'
      ],
      features: ['Full Event Planning', 'Vendor Coordination', 'On-site Management', '24/7 Support'],
      rating: 4.7,
      bookings: 32,
      revenue: 4800000,
      status: 'active',
      availability: 'limited',
      lastUpdated: '2024-01-20',
      bookedDates: 15,
      totalCapacity: 18,
      badge: 'premium'
    },
    {
      id: 'SRV-003',
      name: 'Birthday Party Decoration',
      category: 'decoration',
      price: 25000,
      originalPrice: 30000,
      description: 'Themed birthday party decoration with balloon arrangements',
      images: [
        'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&w=400'
      ],
      features: ['Theme Setup', 'Balloon Arch', 'Table Decoration', 'Photo Booth'],
      rating: 4.5,
      bookings: 28,
      revenue: 700000,
      status: 'active',
      availability: 'available',
      lastUpdated: '2024-01-18',
      bookedDates: 8,
      totalCapacity: 25,
      badge: 'trending'
    },
    {
      id: 'SRV-004',
      name: 'Live Music Performance',
      category: 'entertainment',
      price: 75000,
      originalPrice: 90000,
      description: 'Professional live band performance for events',
      images: [
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&w=400'
      ],
      features: ['3-piece Band', 'Sound System', '4-hour Performance', 'Song Requests'],
      rating: 4.8,
      bookings: 18,
      revenue: 1350000,
      status: 'active',
      availability: 'limited',
      lastUpdated: '2024-01-22',
      bookedDates: 6,
      totalCapacity: 8,
      badge: 'featured'
    }
  ];

  // Categories with icons and stats
  const categories = [
    { id: 'all', name: 'All Services', icon: <Package size={18} />, count: services.length },
    { id: 'photography', name: 'Photography', icon: <Camera size={18} />, count: services.filter(s => s.category === 'photography').length },
    { id: 'planning', name: 'Event Planning', icon: <Calendar size={18} />, count: services.filter(s => s.category === 'planning').length },
    { id: 'decoration', name: 'Decoration', icon: <Star size={18} />, count: services.filter(s => s.category === 'decoration').length },
    { id: 'entertainment', name: 'Entertainment', icon: <Activity size={18} />, count: services.filter(s => s.category === 'entertainment').length }
  ];

  // Performance metrics
  const performanceMetrics = [
    {
      title: 'Total Revenue',
      value: '₹1.04Cr',
      change: '+23.5%',
      positive: true,
      icon: <DollarSign size={24} />,
      color: 'green',
      gradient: 'from-emerald-500 to-green-600'
    },
    {
      title: 'Active Services',
      value: services.filter(s => s.status === 'active').length,
      change: '+2',
      positive: true,
      icon: <Package size={24} />,
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: 'Total Bookings',
      value: services.reduce((acc, s) => acc + s.bookings, 0),
      change: '+18.2%',
      positive: true,
      icon: <Calendar size={24} />,
      color: 'purple',
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      title: 'Avg. Rating',
      value: '4.7',
      change: '+0.3',
      positive: true,
      icon: <Star size={24} />,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-600'
    }
  ];

  // Filter services based on search and category
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort services
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'bookings':
        return b.bookings - a.bookings;
      case 'rating':
        return b.rating - a.rating;
      case 'revenue':
        return b.revenue - a.revenue;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const getBadgeInfo = (badge) => {
    const badges = {
      bestseller: { text: 'Bestseller', color: 'bg-red-500', icon: <Award size={12} /> },
      premium: { text: 'Premium', color: 'bg-purple-500', icon: <Star size={12} /> },
      trending: { text: 'Trending', color: 'bg-green-500', icon: <TrendingUp size={12} /> },
      featured: { text: 'Featured', color: 'bg-blue-500', icon: <Zap size={12} /> }
    };
    return badges[badge] || null;
  };

  const handleBulkAction = (action) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(`Bulk ${action} for services:`, selectedServices);
      setSelectedServices([]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Animate page load
    const cards = document.querySelectorAll('.service-card, .metric-card, .category-tab');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, []);

  return (
    <div className="inventory-page">
      {/* Header Section */}
      <div className="inventory-header">
        <div className="header-content">
          <div className="header-main">
            <div className="header-title-section">
              <h1 className="page-title">Service Inventory</h1>
              <p className="page-subtitle">Manage your services, track performance, and optimize your offerings</p>
              <div className="service-count-badge">
                <Package size={16} />
                <span>{filteredServices.length} Services</span>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="btn-secondary" onClick={() => handleBulkAction('export')}>
                <Download size={18} />
                Export Data
              </button>
              <button className="btn-secondary" onClick={() => handleBulkAction('import')}>
                <Upload size={18} />
                Import Services
              </button>
              <button className="btn-primary">
                <Plus size={18} />
                Add New Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <div className="metrics-grid">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className={`metric-card metric-${metric.color}`}>
              <div className="metric-icon">
                <div className={`icon-wrapper bg-gradient-to-r ${metric.gradient}`}>
                  {metric.icon}
                </div>
              </div>
              <div className="metric-content">
                <div className="metric-header">
                  <h3 className="metric-title">{metric.title}</h3>
                  <div className={`metric-change ${metric.positive ? 'positive' : 'negative'}`}>
                    <ArrowUpRight size={14} />
                    {metric.change}
                  </div>
                </div>
                <div className="metric-value">{metric.value}</div>
              </div>
              <div className="metric-sparkline"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Controls */}
      <div className="controls-section">
        <div className="search-controls">
          <div className="search-container">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search services, descriptions, features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="control-buttons">
            <div className="sort-container">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="bookings">Sort by Bookings</option>
                <option value="rating">Sort by Rating</option>
                <option value="revenue">Sort by Revenue</option>
              </select>
              <ChevronDown size={16} className="select-arrow" />
            </div>
            
            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filters
            </button>
            
            <div className="view-toggle">
              <button 
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedServices.length > 0 && (
          <div className="bulk-actions">
            <div className="bulk-info">
              <span>{selectedServices.length} services selected</span>
            </div>
            <div className="bulk-buttons">
              <button className="bulk-btn" onClick={() => handleBulkAction('edit')}>
                <Edit size={16} />
                Edit Selected
              </button>
              <button className="bulk-btn danger" onClick={() => handleBulkAction('delete')}>
                <Trash2 size={16} />
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="category-section">
        <div className="category-tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="tab-icon">{category.icon}</div>
              <div className="tab-content">
                <span className="tab-name">{category.name}</span>
                <span className="tab-count">{category.count}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid/List */}
      <div className="services-section">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Processing...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="empty-state">
            <Package size={64} />
            <h3>No Services Found</h3>
            <p>Start by adding your first service to showcase your offerings</p>
            <button className="btn-primary">
              <Plus size={18} />
              Add Your First Service
            </button>
          </div>
        ) : (
          <div className={`services-container ${viewMode}`}>
            {sortedServices.map((service) => {
              const badge = getBadgeInfo(service.badge);
              const utilizationRate = Math.round((service.bookedDates / service.totalCapacity) * 100);
              
              return (
                <div key={service.id} className="service-card">
                  <div className="service-card-header">
                    <div className="service-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedServices([...selectedServices, service.id]);
                          } else {
                            setSelectedServices(selectedServices.filter(id => id !== service.id));
                          }
                        }}
                      />
                    </div>
                    
                    {badge && (
                      <div className={`service-badge ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.text}</span>
                      </div>
                    )}
                    
                    <div className="service-actions">
                      <button className="action-btn" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button className="action-btn" title="Edit Service">
                        <Edit size={16} />
                      </button>
                      <button className="action-btn danger" title="Delete Service">
                        <Trash2 size={16} />
                      </button>
                      <button className="action-btn" title="More Options">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="service-image-container">
                    <img 
                      src={service.images[0]} 
                      alt={service.name}
                      className="service-image"
                    />
                    <div className="image-overlay">
                      <div className="image-count">
                        <Camera size={14} />
                        {service.images.length} photos
                      </div>
                    </div>
                  </div>

                  <div className="service-content">
                    <div className="service-header">
                      <h3 className="service-name">{service.name}</h3>
                      <div className="service-rating">
                        <Star size={14} className="star-filled" />
                        <span>{service.rating}</span>
                      </div>
                    </div>

                    <p className="service-description">{service.description}</p>

                    <div className="service-features">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                      {service.features.length > 3 && (
                        <span className="feature-tag more">
                          +{service.features.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="service-pricing">
                      <div className="price-main">
                        <span className="current-price">₹{service.price.toLocaleString()}</span>
                        {service.originalPrice > service.price && (
                          <span className="original-price">₹{service.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      {service.originalPrice > service.price && (
                        <div className="discount-badge">
                          {Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    <div className="service-stats">
                      <div className="stat-item">
                        <Users size={14} />
                        <span>{service.bookings} bookings</span>
                      </div>
                      <div className="stat-item">
                        <DollarSign size={14} />
                        <span>₹{(service.revenue / 100000).toFixed(1)}L revenue</span>
                      </div>
                      <div className="stat-item">
                        <Target size={14} />
                        <span>{utilizationRate}% utilization</span>
                      </div>
                    </div>

                    <div className="service-availability">
                      <div className={`availability-status ${service.availability}`}>
                        <div className="status-indicator"></div>
                        <span>{service.availability.charAt(0).toUpperCase() + service.availability.slice(1)}</span>
                      </div>
                      <div className="capacity-info">
                        <Clock size={14} />
                        <span>{service.bookedDates}/{service.totalCapacity} slots</span>
                      </div>
                    </div>
                  </div>

                  <div className="service-footer">
                    <div className="last-updated">
                      Last updated: {new Date(service.lastUpdated).toLocaleDateString()}
                    </div>
                    <div className="footer-actions">
                      <button className="btn-secondary-small">
                        <Eye size={14} />
                        View
                      </button>
                      <button className="btn-primary-small">
                        <Edit size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button className="floating-add-btn" title="Add New Service">
        <Plus size={24} />
      </button>
    </div>
  );
};

export default InventoryPage;