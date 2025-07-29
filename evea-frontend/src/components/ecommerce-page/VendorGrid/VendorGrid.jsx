// src/components/ecommerce-page/VendorGrid/VendorGrid.jsx
import React, { useState } from 'react';
import { Grid, List, ArrowLeft, ArrowRight, Package, Filter } from 'lucide-react';
import VendorCard from '../VendorCard/VendorCard';
import './VendorGrid.css';

const VendorGrid = ({ vendors, loading, currentPage, totalPages, onPageChange, onAddToPackage, onToggleFavorite }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [packageItems, setPackageItems] = useState([]);

  const handleAddToPackage = (vendorId, services) => {
    setPackageItems(prev => [...prev, { vendorId, services, addedAt: Date.now() }]);
    onAddToPackage(vendorId, services);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeft size={16} />
        Previous
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="pagination-number"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="pagination-dots">...</span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="pagination-dots">...</span>
        );
      }
      
      pages.push(
        <button
          key={totalPages}
          className="pagination-number"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
        <ArrowRight size={16} />
      </button>
    );

    return (
      <div className="pagination">
        {pages}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="vendor-grid-container">
        <div className="loading-grid">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="vendor-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-button"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!vendors || vendors.length === 0) {
    return (
      <div className="vendor-grid-container">
        <div className="no-results">
          <div className="no-results-icon">
            <Filter size={48} />
          </div>
          <h3>No vendors found</h3>
          <p>Try adjusting your filters or search criteria</p>
          <button className="reset-filters-btn">
            Reset All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-grid-container">
      {/* Results Header */}
      <div className="results-header">
        <div className="results-info">
          <h2 className="results-title">
            {vendors.length} vendors found
          </h2>
          <p className="results-subtitle">
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <div className="view-controls">
          <div className="view-mode-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
              Grid
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
              List
            </button>
          </div>

          {packageItems.length > 0 && (
            <div className="package-indicator">
              <Package size={16} />
              <span>{packageItems.length} in package</span>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Grid */}
      <div className={`vendor-grid ${viewMode}`}>
        {vendors.map((vendor) => (
          <VendorCard
            key={vendor.id}
            vendor={vendor}
            onAddToPackage={handleAddToPackage}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default VendorGrid;