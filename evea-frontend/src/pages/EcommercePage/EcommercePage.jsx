// src/pages/EcommercePage/EcommercePage.jsx
import React, { useState, useEffect } from 'react';
import { Heart, Package, ShoppingCart, Filter as FilterIcon } from 'lucide-react';
import SearchBar from '../../components/ecommerce-page/SearchBar/SearchBar';
import FilterSidebar from '../../components/ecommerce-page/FilterSidebar/FilterSidebar';
import VendorGrid from '../../components/ecommerce-page/VendorGrid/VendorGrid';
import { generateVendorData } from '../../data/vendorData';
import './EcommercePage.css';

const EcommercePage = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [packageItems, setPackageItems] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    categories: ['all'],
    priceRange: '',
    rating: '',
    location: '',
    features: []
  });
  const [searchQuery, setSearchQuery] = useState('');

  const vendorsPerPage = 12;
  const totalPages = Math.ceil(filteredVendors.length / vendorsPerPage);
  const currentVendors = filteredVendors.slice(
    (currentPage - 1) * vendorsPerPage,
    currentPage * vendorsPerPage
  );

  // Initialize with generated vendor data
  const allVendorData = generateVendorData();

  // Simulate API call with generated data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVendors(allVendorData);
      setFilteredVendors(allVendorData);
      setLoading(false);
    }, 800);
  }, []);

  // Filter vendors
  useEffect(() => {
    let filtered = [...vendors];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.primaryServices.some(service => 
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes('all')) {
      filtered = filtered.filter(vendor =>
        vendor.primaryServices.some(service =>
          filters.categories.includes(service.category)
        )
      );
    }

    // Price range filter
    if (filters.priceRange) {
      filtered = filtered.filter(vendor => {
        const price = vendor.startingPrice;
        switch (filters.priceRange) {
          case 'under-10k':
            return price < 10000;
          case '10k-25k':
            return price >= 10000 && price <= 25000;
          case '25k-50k':
            return price >= 25000 && price <= 50000;
          case 'above-50k':
            return price > 50000;
          default:
            return true;
        }
      });
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating.replace('+', ''));
      filtered = filtered.filter(vendor => vendor.rating >= minRating);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(vendor =>
        vendor.location.toLowerCase() === filters.location.toLowerCase()
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(vendor =>
        filters.features.every(feature => vendor.features.includes(feature))
      );
    }

    setFilteredVendors(filtered);
    setCurrentPage(1);
  }, [vendors, filters, searchQuery]);

  const handleSearch = (searchData) => {
    setSearchQuery(searchData.query);
    // Handle other search parameters
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: ['all'],
      priceRange: '',
      rating: '',
      location: '',
      features: []
    });
    setSearchQuery('');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToPackage = (vendorId, services) => {
    const vendor = vendors.find(v => v.id === vendorId);
    const newPackageItem = {
      id: Date.now(),
      vendorId,
      vendorName: vendor.name,
      services,
      addedAt: new Date().toISOString(),
      totalPrice: services.reduce((sum, service) => sum + service.price, 0)
    };
    
    setPackageItems(prev => [...prev, newPackageItem]);
    
    // Show success notification (could be enhanced with toast)
    console.log('Added to package:', newPackageItem);
  };

  const handleToggleFavorite = (vendorId) => {
    setVendors(prev => prev.map(vendor =>
      vendor.id === vendorId
        ? { ...vendor, isFavorite: !vendor.isFavorite }
        : vendor
    ));
    setFilteredVendors(prev => prev.map(vendor =>
      vendor.id === vendorId
        ? { ...vendor, isFavorite: !vendor.isFavorite }
        : vendor
    ));
  };

  const getTotalPackagePrice = () => {
    return packageItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleClearPackage = () => {
    setPackageItems([]);
  };

  const handleViewPackage = () => {
    console.log('Viewing package:', packageItems);
    // Navigate to package/cart page
  };

  return (
    <div className="ecommerce-page">
      {/* Header */}
      <header className="ecommerce-header">
        <div className="header-container">
          <div className="header-content">
            <div className="logo">
              <Heart className="heart-icon" />
              <span>EVEA</span>
            </div>
            <nav className="header-nav">
              <a href="/" className="nav-link">Home</a>
              <a href="/services" className="nav-link">Services</a>
              <a href="/vendors" className="nav-link">Vendors</a>
              <a href="/about" className="nav-link">About</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar 
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <div className="ecommerce-main">
        <div className="container">
          <div className="ecommerce-layout">
            {/* Mobile Filter Toggle */}
            <button 
              className="mobile-filter-toggle"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FilterIcon size={20} />
              Filters
            </button>

            {/* Sidebar */}
            <aside className={`ecommerce-sidebar ${showMobileFilters ? 'mobile-open' : ''}`}>
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Main Content */}
            <main className="ecommerce-content">
              <VendorGrid
                vendors={currentVendors}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onAddToPackage={handleAddToPackage}
                onToggleFavorite={handleToggleFavorite}
              />
            </main>
          </div>
        </div>
      </div>

      {/* Floating Package Summary */}
      {packageItems.length > 0 && (
        <div className="package-summary visible">
          <div className="package-summary-content">
            <div className="package-info">
              <div className="package-count">{packageItems.length} items</div>
              <div className="package-details">
                <span className="package-label">Total Package Value:</span>
                <span className="package-total">₹{getTotalPackagePrice().toLocaleString()}</span>
              </div>
            </div>
            <div className="package-actions">
              <button className="package-btn secondary" onClick={handleClearPackage}>
                Clear Package
              </button>
              <button className="package-btn primary" onClick={handleViewPackage}>
                <ShoppingCart size={16} />
                View Package ({packageItems.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="quick-action-btn"
          data-tooltip="View Favorites"
          onClick={() => console.log('View favorites')}
        >
          <Heart size={20} />
        </button>
        <button 
          className="quick-action-btn"
          data-tooltip="Package"
          onClick={handleViewPackage}
        >
          <Package size={20} />
          {packageItems.length > 0 && (
            <div className="quick-action-badge">{packageItems.length}</div>
          )}
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div 
          className="mobile-filter-overlay"
          onClick={() => setShowMobileFilters(false)}
        />
      )}
    </div>
  );
};

export default EcommercePage;