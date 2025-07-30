// src/components/admin/vendor-approval/vendor-details-modal/VendorDetailsModal.jsx
import React, { useState } from 'react';
import { 
  X, MapPin, Phone, Mail, Globe, Star, Calendar,
  User, Building, CreditCard, FileText, Check, 
  AlertTriangle, Download, Eye, Edit, MoreHorizontal,
  Clock, DollarSign, Target, TrendingUp, Award
} from 'lucide-react';
import './VendorDetailsModal.css';

const VendorDetailsModal = ({ 
  isOpen, 
  onClose, 
  vendor, 
  onApprove,
  onReject,
  onDocumentView 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotes, setShowNotes] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  if (!isOpen || !vendor) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <User size={16} /> },
    { id: 'documents', name: 'Documents', icon: <FileText size={16} /> },
    { id: 'services', name: 'Services', icon: <Target size={16} /> },
    { id: 'performance', name: 'Performance', icon: <TrendingUp size={16} /> },
    { id: 'history', name: 'History', icon: <Clock size={16} /> }
  ];

  const handleApprove = () => {
    if (onApprove) {
      onApprove(vendor.id, adminNotes);
    }
    onClose();
  };

  const handleReject = () => {
    if (onReject) {
      onReject(vendor.id, adminNotes);
    }
    onClose();
  };

  const renderOverviewTab = () => (
    <div className="tab-content">
      {/* Basic Information */}
      <div className="info-section">
        <h3>Basic Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <Building size={16} />
            <div>
              <span className="info-label">Business Name</span>
              <span className="info-value">{vendor.businessName}</span>
            </div>
          </div>
          
          <div className="info-item">
            <User size={16} />
            <div>
              <span className="info-label">Owner Name</span>
              <span className="info-value">{vendor.ownerName}</span>
            </div>
          </div>
          
          <div className="info-item">
            <Phone size={16} />
            <div>
              <span className="info-label">Phone</span>
              <span className="info-value">{vendor.phone}</span>
            </div>
          </div>
          
          <div className="info-item">
            <Mail size={16} />
            <div>
              <span className="info-label">Email</span>
              <span className="info-value">{vendor.email}</span>
            </div>
          </div>
          
          <div className="info-item">
            <MapPin size={16} />
            <div>
              <span className="info-label">Location</span>
              <span className="info-value">{vendor.location}</span>
            </div>
          </div>
          
          <div className="info-item">
            <Globe size={16} />
            <div>
              <span className="info-label">Website</span>
              <span className="info-value">
                <a href={vendor.website} target="_blank" rel="noopener noreferrer">
                  {vendor.website}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Details */}
      <div className="info-section">
        <h3>Business Details</h3>
        <div className="business-details">
          <div className="detail-item">
            <span className="detail-label">Business Type</span>
            <span className="detail-value">{vendor.businessType}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Years in Business</span>
            <span className="detail-value">{vendor.yearsInBusiness} years</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Registration Number</span>
            <span className="detail-value">{vendor.registrationNumber}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Tax ID</span>
            <span className="detail-value">{vendor.taxId}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Employee Count</span>
            <span className="detail-value">{vendor.employeeCount}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Service Area</span>
            <span className="detail-value">{vendor.serviceArea}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="info-section">
        <h3>Business Description</h3>
        <div className="description-content">
          <p>{vendor.description}</p>
        </div>
      </div>

      {/* Banking Information */}
      <div className="info-section">
        <h3>Banking Information</h3>
        <div className="banking-info">
          <div className="bank-detail">
            <CreditCard size={16} />
            <div>
              <span className="bank-label">Account Holder</span>
              <span className="bank-value">{vendor.bankDetails?.accountHolder}</span>
            </div>
          </div>
          
          <div className="bank-detail">
            <Building size={16} />
            <div>
              <span className="bank-label">Bank Name</span>
              <span className="bank-value">{vendor.bankDetails?.bankName}</span>
            </div>
          </div>
          
          <div className="bank-detail">
            <span className="bank-number">****</span>
            <div>
              <span className="bank-label">Account Number</span>
              <span className="bank-value">{vendor.bankDetails?.accountNumber}</span>
            </div>
          </div>
          
          <div className="bank-detail">
            <span className="bank-code">IFSC</span>
            <div>
              <span className="bank-label">IFSC Code</span>
              <span className="bank-value">{vendor.bankDetails?.ifscCode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="tab-content">
      <div className="documents-section">
        <h3>Verification Documents</h3>
        <div className="documents-grid">
          {vendor.documents?.map((doc, index) => (
            <div key={index} className="document-card">
              <div className="document-header">
                <div className="document-icon">
                  <FileText size={20} />
                </div>
                <div className="document-info">
                  <h4>{doc.name}</h4>
                  <span className="document-type">{doc.type}</span>
                </div>
                <div className={`verification-status ${doc.verified ? 'verified' : 'pending'}`}>
                  {doc.verified ? <Check size={16} /> : <Clock size={16} />}
                </div>
              </div>
              
              <div className="document-details">
                <span className="document-size">{doc.size}</span>
                <span className="upload-date">
                  Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="document-actions">
                <button 
                  className="doc-action-btn view"
                  onClick={() => onDocumentView && onDocumentView(doc)}
                >
                  <Eye size={14} />
                  View
                </button>
                <button className="doc-action-btn download">
                  <Download size={14} />
                  Download
                </button>
              </div>
              
              {doc.verifiedBy && (
                <div className="verification-info">
                  <span>Verified by {doc.verifiedBy}</span>
                  <span>{new Date(doc.verifiedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderServicesTab = () => (
    <div className="tab-content">
      <div className="services-section">
        <h3>Service Categories</h3>
        <div className="services-grid">
          {vendor.services?.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-header">
                <h4>{service.category}</h4>
                <span className="service-price">Starting from ₹{service.basePrice?.toLocaleString()}</span>
              </div>
              
              <div className="service-details">
                <p>{service.description}</p>
                
                <div className="service-features">
                  <h5>What's Included:</h5>
                  <ul>
                    {service.features?.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="service-packages">
                  <h5>Available Packages:</h5>
                  <div className="packages-list">
                    {service.packages?.map((pkg, idx) => (
                      <div key={idx} className="package-item">
                        <span className="package-name">{pkg.name}</span>
                        <span className="package-price">₹{pkg.price?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="tab-content">
      <div className="performance-section">
        <h3>Performance Metrics</h3>
        
        <div className="performance-stats">
          <div className="performance-stat">
            <div className="stat-icon revenue">
              <DollarSign size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Revenue</span>
              <span className="stat-value">₹{vendor.performance?.totalRevenue?.toLocaleString() || '0'}</span>
              <span className="stat-change positive">+12.5%</span>
            </div>
          </div>
          
          <div className="performance-stat">
            <div className="stat-icon orders">
              <Target size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{vendor.performance?.totalOrders || 0}</span>
              <span className="stat-change positive">+8.3%</span>
            </div>
          </div>
          
          <div className="performance-stat">
            <div className="stat-icon rating">
              <Star size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Average Rating</span>
              <span className="stat-value">{vendor.performance?.rating || 0}/5</span>
              <span className="stat-change positive">+0.2</span>
            </div>
          </div>
          
          <div className="performance-stat">
            <div className="stat-icon completion">
              <Award size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Completion Rate</span>
              <span className="stat-value">{vendor.performance?.completionRate || 0}%</span>
              <span className="stat-change positive">+5.1%</span>
            </div>
          </div>
        </div>

        <div className="performance-details">
          <div className="detail-section">
            <h4>Recent Reviews</h4>
            <div className="reviews-list">
              {vendor.performance?.recentReviews?.map((review, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{review.customerName}</span>
                      <span className="review-date">{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? 'star-filled' : 'star-empty'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              )) || <p className="no-reviews">No reviews available</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="tab-content">
      <div className="history-section">
        <h3>Application History</h3>
        <div className="timeline">
          {vendor.history?.map((event, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div className={`marker-dot ${event.type}`}></div>
              </div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>{event.title}</h4>
                  <span className="timeline-date">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="timeline-description">{event.description}</p>
                {event.admin && (
                  <span className="timeline-admin">By {event.admin}</span>
                )}
              </div>
            </div>
          )) || (
            <div className="no-history">
              <Clock size={48} />
              <p>No history records available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="vendor-modal-overlay">
      <div className="vendor-details-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="vendor-summary">
            <div className="vendor-avatar">
              <Building size={24} />
            </div>
            <div className="vendor-info">
              <h2>{vendor.businessName}</h2>
              <div className="vendor-meta">
                <span className="vendor-location">
                  <MapPin size={14} />
                  {vendor.location}
                </span>
                <span className="vendor-category">{vendor.category}</span>
                <div className={`vendor-status ${vendor.status}`}>
                  {vendor.status === 'pending' && <Clock size={14} />}
                  {vendor.status === 'approved' && <Check size={14} />}
                  {vendor.status === 'rejected' && <X size={14} />}
                  {vendor.status}
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="header-btn" title="Edit">
              <Edit size={16} />
            </button>
            <button className="header-btn" title="More">
              <MoreHorizontal size={16} />
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Navigation */}
        <div className="modal-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'services' && renderServicesTab()}
          {activeTab === 'performance' && renderPerformanceTab()}
          {activeTab === 'history' && renderHistoryTab()}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="footer-left">
            <button 
              className="notes-toggle-btn"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? 'Hide Notes' : 'Add Notes'}
            </button>
            
            {showNotes && (
              <div className="admin-notes">
                <textarea
                  placeholder="Add admin notes for this vendor application..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          
          <div className="footer-actions">
            {vendor.status === 'pending' && (
              <>
                <button 
                  className="action-btn reject"
                  onClick={handleReject}
                >
                  <X size={16} />
                  Reject Application
                </button>
                <button 
                  className="action-btn approve"
                  onClick={handleApprove}
                >
                  <Check size={16} />
                  Approve Vendor
                </button>
              </>
            )}
            
            {vendor.status !== 'pending' && (
              <button className="action-btn secondary" onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetailsModal;