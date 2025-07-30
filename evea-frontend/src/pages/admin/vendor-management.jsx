import React, { useState } from 'react';
import AdminLayout from '../../components/admin/layout/admin-layout/AdminLayout';
import VendorApplicationCard from '../../components/admin/vendor-approval/vendor-application-card/VendorApplicationCard';
import ApprovalModal from '../../components/admin/vendor-approval/approval-modal/ApprovalModal';
import VendorDetailsModal from '../../components/admin/vendor-approval/vendor-details-modal/VendorDetailsModal';
import { Search, SlidersHorizontal } from 'lucide-react';
import './vendor-management.css';

const VendorManagement = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample vendor applications
  const [vendorApplications, setVendorApplications] = useState([
    {
      id: 'VEN-2024-001',
      businessName: 'Royal Wedding Photography',
      ownerName: 'Priya Sharma',
      email: 'priya@royalwedding.com',
      phone: '+91 98765 43210',
      category: 'Photography',
      subcategory: 'Wedding Photography',
      location: 'Mumbai, Maharashtra',
      gstNumber: '27AABCU9603R1ZM',
      panNumber: 'AABCU9603R',
      registrationNumber: 'MH-12345-REG',
      submittedAt: '2024-01-15T10:30:00',
      status: 'pending_review',
      bankDetails: {
        accountHolderName: 'Priya Sharma',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank'
      },
      documents: {
        businessLicense: { verified: false },
        panCard: { verified: false },
        bankStatement: { verified: false },
        addressProof: { verified: false }
      }
    },
    {
      id: 'VEN-2024-002',
      businessName: 'Elegant Catering Services',
      ownerName: 'Rajesh Kumar',
      email: 'rajesh@elegantcatering.com',
      phone: '+91 87654 32109',
      category: 'Catering',
      subcategory: 'Wedding Catering',
      location: 'Delhi, NCR',
      gstNumber: '07AABCU9603R1ZM',
      panNumber: 'AABCU9603R',
      registrationNumber: 'DL-67890-REG',
      submittedAt: '2024-01-14T14:20:00',
      status: 'pending_review',
      bankDetails: {
        accountHolderName: 'Rajesh Kumar',
        accountNumber: '0987654321',
        ifscCode: 'ICICI0001234',
        bankName: 'ICICI Bank'
      },
      documents: {
        businessLicense: { verified: true },
        panCard: { verified: true },
        fssaiLicense: { verified: false }
      }
    }
  ]);

  const handleOpenApproval = (vendor, action) => {
    setSelectedVendor(vendor);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const handleOpenDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  const handleApprovalComplete = (vendorId, action) => {
    setVendorApplications(prev => prev.map(vendor => {
      if (vendor.id === vendorId) {
        return { ...vendor, status: action === 'approve' ? 'approved' : 'rejected' };
      }
      return vendor;
    }));
    setShowApprovalModal(false);
    setSelectedVendor(null);
  };

  const filteredVendors = vendorApplications.filter(vendor => {
    const matchesTab = selectedTab === 'all' || vendor.status === selectedTab || 
                     (selectedTab === 'pending' && vendor.status === 'pending_review');
    const matchesSearch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: vendorApplications.length,
    pending: vendorApplications.filter(v => v.status === 'pending_review').length,
    approved: vendorApplications.filter(v => v.status === 'approved').length,
    rejected: vendorApplications.filter(v => v.status === 'rejected').length
  };

  return (
    <AdminLayout>
      <div className="vendor-management">
        <div className="vendor-header">
          <div className="header-content">
            <h1>Vendor Management</h1>
            <p>Review and approve vendor registrations to expand your platform network</p>
          </div>
          
          <div className="vendor-stats">
            <div className="stat-item total">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Applications</span>
            </div>
            <div className="stat-item pending">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending Review</span>
            </div>
            <div className="stat-item approved">
              <span className="stat-value">{stats.approved}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-item rejected">
              <span className="stat-value">{stats.rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        </div>

        <div className="vendor-controls">
          <div className="search-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="filter-btn">
              <SlidersHorizontal size={16} />
              Filters
            </button>
          </div>

          <div className="vendor-tabs">
            {['pending', 'approved', 'rejected', 'all'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${selectedTab === tab ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab !== 'all' && (
                  <span className="tab-count">
                    {tab === 'pending' ? stats.pending : 
                     tab === 'approved' ? stats.approved : stats.rejected}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="vendor-applications">
          {filteredVendors.length === 0 ? (
            <div className="empty-state">
              <h3>No applications found</h3>
              <p>No vendor applications match your current filters</p>
            </div>
          ) : (
            <div className="applications-grid">
              {filteredVendors.map(vendor => (
                <VendorApplicationCard
                  key={vendor.id}
                  vendor={vendor}
                  onApprove={() => handleOpenApproval(vendor, 'approve')}
                  onReject={() => handleOpenApproval(vendor, 'reject')}
                  onViewDetails={() => handleOpenDetails(vendor)}
                />
              ))}
            </div>
          )}
        </div>

        {showApprovalModal && selectedVendor && (
          <ApprovalModal
            vendor={selectedVendor}
            action={approvalAction}
            onClose={() => setShowApprovalModal(false)}
            onComplete={handleApprovalComplete}
          />
        )}

        {showDetailsModal && selectedVendor && (
          <VendorDetailsModal
            vendor={selectedVendor}
            onClose={() => setShowDetailsModal(false)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default VendorManagement;