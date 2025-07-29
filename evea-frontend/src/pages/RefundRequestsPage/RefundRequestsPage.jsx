// src/pages/VendorDashboard/pages/RefundRequestsPage.jsx
import React, { useState } from 'react';
import { 
  AlertTriangle, CheckCircle, XCircle, Clock, Eye, MessageSquare,
  FileText, IndianRupee, Calendar, User, Phone, Mail,
  Download, Filter, Search, MoreVertical, RefreshCw
} from 'lucide-react';
import './RefundRequestsPage.css';
const RefundRequestsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample refund requests data
  const refundRequests = [
    {
      id: 'REF-2024-001',
      orderId: 'ORD-2024-001',
      customer: {
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        email: 'priya.sharma@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e673?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      event: {
        name: 'Priya & Arjun Wedding',
        date: '2024-03-15',
        type: 'Wedding'
      },
      refund: {
        requestedAmount: 80000,
        originalAmount: 80000,
        refundType: 'full',
        reason: 'Event Cancelled',
        description: 'Due to unforeseen circumstances, we need to cancel our wedding. The venue has been cancelled and we would like to request a full refund.',
        requestDate: '2024-02-05T14:30:00',
        documents: ['cancellation_letter.pdf', 'venue_cancellation.pdf']
      },
      status: 'pending',
      priority: 'high',
      lastUpdate: '2024-02-05T14:30:00'
    },
    {
      id: 'REF-2024-002',
      orderId: 'ORD-2024-008',
      customer: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43211',
        email: 'rajesh.kumar@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      event: {
        name: 'Corporate Annual Meet',
        date: '2024-02-20',
        type: 'Corporate Event'
      },
      refund: {
        requestedAmount: 15000,
        originalAmount: 45000,
        refundType: 'partial',
        reason: 'Service Issues',
        description: 'The photographer arrived 2 hours late and missed the opening ceremony. Requesting partial refund for the inconvenience caused.',
        requestDate: '2024-02-21T09:15:00',
        documents: ['complaint_email.pdf']
      },
      status: 'approved',
      priority: 'medium',
      lastUpdate: '2024-02-22T11:20:00'
    },
    {
      id: 'REF-2024-003',
      orderId: 'ORD-2024-015',
      customer: {
        name: 'Ananya Patel',
        phone: '+91 98765 43212',
        email: 'ananya.patel@email.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      event: {
        name: 'Birthday Celebration',
        date: '2024-01-28',
        type: 'Birthday Party'
      },
      refund: {
        requestedAmount: 8000,
        originalAmount: 12000,
        refundType: 'partial',
        reason: 'Quality Issues',
        description: 'Some photos were blurry and the overall quality was not as expected. Requesting partial refund.',
        requestDate: '2024-01-30T16:45:00',
        documents: ['photo_samples.zip']
      },
      status: 'rejected',
      priority: 'low',
      lastUpdate: '2024-02-01T10:30:00'
    }
  ];

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Requests', count: refundRequests.length },
    { id: 'pending', label: 'Pending Review', count: refundRequests.filter(r => r.status === 'pending').length },
    { id: 'approved', label: 'Approved', count: refundRequests.filter(r => r.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: refundRequests.filter(r => r.status === 'rejected').length },
    { id: 'processed', label: 'Processed', count: refundRequests.filter(r => r.status === 'processed').length }
  ];

  // Statistics
  const refundStats = [
    {
      title: 'Pending Requests',
      value: '12',
      change: '+3 today',
      positive: false,
      icon: <Clock size={20} />,
      status: 'warning'
    },
    {
      title: 'Approved This Month',
      value: '8',
      change: '-2 from last month',
      positive: true,
      icon: <CheckCircle size={20} />,
      status: 'success'
    },
    {
      title: 'Total Refunded',
      value: '₹45,000',
      change: '+₹12,000',
      positive: false,
      icon: <IndianRupee size={20} />,
      status: 'info'
    },
    {
      title: 'Refund Rate',
      value: '2.3%',
      change: '-0.5%',
      positive: true,
      icon: <AlertTriangle size={20} />,
      status: 'neutral'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-warning',
      approved: 'status-success',
      rejected: 'status-danger',
      processed: 'status-info'
    };
    return colors[status] || 'status-neutral';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={14} />,
      approved: <CheckCircle size={14} />,
      rejected: <XCircle size={14} />,
      processed: <CheckCircle size={14} />
    };
    return icons[status] || <Clock size={14} />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return colors[priority] || 'priority-medium';
  };

  const filteredRequests = refundRequests.filter(request => {
    const matchesFilter = selectedFilter === 'all' || request.status === selectedFilter;
    const matchesSearch = request.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="refund-requests-page">
      {/* Refund Header */}
      <div className="refund-header">
        <div className="header-main">
          <div className="header-title">
            <h2>Refund Requests</h2>
            <span className="request-count">{filteredRequests.length} requests</span>
          </div>
          
          <div className="header-actions">
            <button className="btn-secondary">
              <Download size={16} />
              Export Report
            </button>
            <button className="btn-primary">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="refund-controls">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by customer, order ID, or refund ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <button className="filter-btn">
              <Filter size={16} />
              Advanced Filters
            </button>
          </div>
        </div>
      </div>

      {/* Refund Statistics */}
      <div className="refund-stats">
        {refundStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.status}`}>
            <div className="stat-icon">
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filterOptions.map((filter) => (
          <button
            key={filter.id}
            className={`filter-tab ${selectedFilter === filter.id ? 'active' : ''}`}
            onClick={() => setSelectedFilter(filter.id)}
          >
            <span>{filter.label}</span>
            {filter.count > 0 && (
              <span className="filter-count">{filter.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Refund Requests List */}
      <div className="refund-list">
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <RefreshCw size={48} />
            <h3>No refund requests found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="refund-card">
              {/* Refund Header */}
              <div className="refund-card-header">
                <div className="refund-id-section">
                  <div className="refund-id">
                    <span className="id-label">Refund ID:</span>
                    <span className="id-value">{request.id}</span>
                  </div>
                  <div className="order-reference">
                    <span className="ref-label">Order:</span>
                    <span className="ref-value">{request.orderId}</span>
                  </div>
                </div>
                
                <div className="status-priority">
                  <span className={`priority-badge ${getPriorityColor(request.priority)}`}>
                    {request.priority.toUpperCase()}
                  </span>
                  <span className={`status-badge ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status.toUpperCase()}
                  </span>
                </div>

                <div className="refund-actions">
                  <button className="action-btn">
                    <Eye size={16} />
                  </button>
                  <button className="action-btn">
                    <MessageSquare size={16} />
                  </button>
                  <button className="action-btn">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Refund Content */}
              <div className="refund-content">
                {/* Customer Info */}
                <div className="customer-section">
                  <div className="customer-avatar">
                    <img src={request.customer.avatar} alt={request.customer.name} />
                  </div>
                  <div className="customer-info">
                    <h4 className="customer-name">{request.customer.name}</h4>
                    <div className="customer-contact">
                      <div className="contact-item">
                        <Phone size={12} />
                        <span>{request.customer.phone}</span>
                      </div>
                      <div className="contact-item">
                        <Mail size={12} />
                        <span>{request.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="event-section">
                  <div className="event-header">
                    <h4 className="event-name">{request.event.name}</h4>
                    <span className="event-type">{request.event.type}</span>
                  </div>
                  <div className="event-date">
                    <Calendar size={14} />
                    <span>{new Date(request.event.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Refund Details */}
                <div className="refund-details-section">
                  <div className="refund-amounts">
                    <div className="amount-item">
                      <span className="amount-label">Original Amount:</span>
                      <span className="amount-value">₹{request.refund.originalAmount.toLocaleString()}</span>
                    </div>
                    <div className="amount-item refund-requested">
                      <span className="amount-label">Refund Requested:</span>
                      <span className="amount-value">₹{request.refund.requestedAmount.toLocaleString()}</span>
                    </div>
                    <div className="refund-type">
                      <span className={`type-badge ${request.refund.refundType}`}>
                        {request.refund.refundType.toUpperCase()} REFUND
                      </span>
                    </div>
                  </div>

                  <div className="refund-reason">
                    <h5 className="reason-title">Refund Reason</h5>
                    <div className="reason-category">
                      <AlertTriangle size={14} />
                      <span>{request.refund.reason}</span>
                    </div>
                    <p className="reason-description">{request.refund.description}</p>
                  </div>

                  {/* Supporting Documents */}
                  {request.refund.documents && request.refund.documents.length > 0 && (
                    <div className="refund-documents">
                      <h5 className="documents-title">Supporting Documents</h5>
                      <div className="documents-list">
                        {request.refund.documents.map((doc, index) => (
                          <div key={index} className="document-item">
                            <FileText size={14} />
                            <span>{doc}</span>
                            <button className="download-doc">
                              <Download size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="refund-timeline">
                  <div className="timeline-item">
                    <div className="timeline-date">
                      {new Date(request.refund.requestDate).toLocaleDateString()}
                    </div>
                    <div className="timeline-content">
                      <strong>Refund Request Submitted</strong>
                      <p>Customer submitted refund request</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-date">
                      {new Date(request.lastUpdate).toLocaleDateString()}
                    </div>
                    <div className="timeline-content">
                      <strong>Last Update</strong>
                      <p>Status: {request.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="refund-footer">
                {request.status === 'pending' && (
                  <div className="action-buttons">
                    <button className="btn-secondary">
                      <MessageSquare size={16} />
                      Request Info
                    </button>
                    <button className="btn-danger">
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button className="btn-warning">
                      Negotiate
                    </button>
                    <button className="btn-success">
                      <CheckCircle size={16} />
                      Approve
                    </button>
                  </div>
                )}
                
                {request.status === 'approved' && (
                  <div className="action-buttons">
                    <button className="btn-primary">
                      <IndianRupee size={16} />
                      Process Refund
                    </button>
                    <button className="btn-secondary">
                      <Download size={16} />
                      Download Receipt
                    </button>
                  </div>
                )}

                {request.status === 'rejected' && (
                  <div className="action-buttons">
                    <button className="btn-secondary">
                      <Eye size={16} />
                      View Details
                    </button>
                    <button className="btn-primary">
                      Reconsider
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="refund-pagination">
        <div className="pagination-info">
          Showing {filteredRequests.length} of {refundRequests.length} refund requests
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default RefundRequestsPage;