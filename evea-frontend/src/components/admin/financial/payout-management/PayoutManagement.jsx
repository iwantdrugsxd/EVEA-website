// src/components/admin/financial/payout-management/PayoutManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Send, Clock, CheckCircle, AlertTriangle, Eye, 
  Filter, Search, Calendar, Download, CreditCard,
  Building, User, DollarSign, TrendingUp
} from 'lucide-react';
import './PayoutManagement.css';

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [bulkActionMode, setBulkActionMode] = useState(false);
  const [selectedPayouts, setSelectedPayouts] = useState([]);

  // Mock payout data
  useEffect(() => {
    const mockPayouts = [
      {
        id: 'PO-2024-001',
        vendor: {
          name: 'Elite Catering Co.',
          id: 'VEN-001',
          bankAccount: '**** **** **** 1234',
          email: 'finance@elitecatering.com'
        },
        amount: 87500,
        commission: 12500,
        netAmount: 75000,
        status: 'pending',
        requestDate: '2024-01-15T10:30:00Z',
        dueDate: '2024-01-20T23:59:59Z',
        orders: [
          { id: 'ORD-456', amount: 25000, date: '2024-01-12' },
          { id: 'ORD-457', amount: 30000, date: '2024-01-13' },
          { id: 'ORD-458', amount: 32500, date: '2024-01-14' }
        ]
      },
      {
        id: 'PO-2024-002',
        vendor: {
          name: 'Dream Photographers',
          id: 'VEN-002',
          bankAccount: '**** **** **** 5678',
          email: 'payments@dreamphotos.com'
        },
        amount: 45000,
        commission: 6750,
        netAmount: 38250,
        status: 'processing',
        requestDate: '2024-01-14T14:20:00Z',
        dueDate: '2024-01-19T23:59:59Z',
        processedDate: '2024-01-16T09:15:00Z',
        orders: [
          { id: 'ORD-459', amount: 15000, date: '2024-01-11' },
          { id: 'ORD-460', amount: 30000, date: '2024-01-12' }
        ]
      },
      {
        id: 'PO-2024-003',
        vendor: {
          name: 'Luxury Decorators',
          id: 'VEN-003',
          bankAccount: '**** **** **** 9012',
          email: 'accounts@luxurydecorators.com'
        },
        amount: 62000,
        commission: 9300,
        netAmount: 52700,
        status: 'completed',
        requestDate: '2024-01-10T16:45:00Z',
        dueDate: '2024-01-15T23:59:59Z',
        processedDate: '2024-01-14T11:30:00Z',
        completedDate: '2024-01-15T14:22:00Z',
        transactionId: 'TXN-789012345',
        orders: [
          { id: 'ORD-461', amount: 35000, date: '2024-01-08' },
          { id: 'ORD-462', amount: 27000, date: '2024-01-09' }
        ]
      },
      {
        id: 'PO-2024-004',
        vendor: {
          name: 'Perfect Venues Ltd.',
          id: 'VEN-004',
          bankAccount: '**** **** **** 3456',
          email: 'finance@perfectvenues.com'
        },
        amount: 98000,
        commission: 14700,
        netAmount: 83300,
        status: 'scheduled',
        requestDate: '2024-01-16T09:15:00Z',
        scheduledDate: '2024-01-22T10:00:00Z',
        orders: [
          { id: 'ORD-463', amount: 45000, date: '2024-01-14' },
          { id: 'ORD-464', amount: 53000, date: '2024-01-15' }
        ]
      }
    ];

    setTimeout(() => {
      setPayouts(mockPayouts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPayouts = payouts.filter(payout => {
    const matchesSearch = searchTerm === '' || 
      payout.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || payout.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const payoutStats = {
    total: payouts.length,
    pending: payouts.filter(p => p.status === 'pending').length,
    processing: payouts.filter(p => p.status === 'processing').length,
    scheduled: payouts.filter(p => p.status === 'scheduled').length,
    completed: payouts.filter(p => p.status === 'completed').length,
    totalAmount: payouts.reduce((sum, p) => sum + p.netAmount, 0)
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <AlertTriangle size={16} />;
      case 'scheduled':
        return <Calendar size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleProcessPayout = (payoutId) => {
    setPayouts(payouts.map(payout => 
      payout.id === payoutId 
        ? { ...payout, status: 'processing', processedDate: new Date().toISOString() }
        : payout
    ));
  };

  const handleBulkAction = (action) => {
    if (action === 'process' && selectedPayouts.length > 0) {
      setPayouts(payouts.map(payout => 
        selectedPayouts.includes(payout.id) && payout.status === 'pending'
          ? { ...payout, status: 'processing', processedDate: new Date().toISOString() }
          : payout
      ));
      setSelectedPayouts([]);
      setBulkActionMode(false);
    }
  };

  const handleSelectPayout = (payoutId) => {
    if (selectedPayouts.includes(payoutId)) {
      setSelectedPayouts(selectedPayouts.filter(id => id !== payoutId));
    } else {
      setSelectedPayouts([...selectedPayouts, payoutId]);
    }
  };

  const PayoutModal = () => (
    selectedPayout && (
      <div className="modal-overlay" onClick={() => setShowPayoutModal(false)}>
        <div className="payout-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Payout Details - {selectedPayout.id}</h2>
            <button onClick={() => setShowPayoutModal(false)}>
              ×
            </button>
          </div>
          
          <div className="modal-content">
            <div className="payout-summary">
              <div className="summary-item">
                <DollarSign size={20} />
                <div>
                  <span className="label">Total Amount</span>
                  <span className="value">₹{selectedPayout.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="summary-item">
                <TrendingUp size={20} />
                <div>
                  <span className="label">Commission</span>
                  <span className="value commission">₹{selectedPayout.commission.toLocaleString()}</span>
                </div>
              </div>
              <div className="summary-item">
                <CreditCard size={20} />
                <div>
                  <span className="label">Net Payout</span>
                  <span className="value net">₹{selectedPayout.netAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="payout-details-grid">
              <div className="detail-section">
                <h3>Vendor Information</h3>
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{selectedPayout.vendor.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Vendor ID:</span>
                  <span className="value">{selectedPayout.vendor.id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{selectedPayout.vendor.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Bank Account:</span>
                  <span className="value">{selectedPayout.vendor.bankAccount}</span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Payout Timeline</h3>
                <div className="timeline">
                  <div className="timeline-item completed">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <span className="timeline-title">Requested</span>
                      <span className="timeline-date">{formatDate(selectedPayout.requestDate)}</span>
                    </div>
                  </div>
                  {selectedPayout.processedDate && (
                    <div className="timeline-item completed">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Processing</span>
                        <span className="timeline-date">{formatDate(selectedPayout.processedDate)}</span>
                      </div>
                    </div>
                  )}
                  {selectedPayout.scheduledDate && (
                    <div className="timeline-item pending">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Scheduled</span>
                        <span className="timeline-date">{formatDate(selectedPayout.scheduledDate)}</span>
                      </div>
                    </div>
                  )}
                  {selectedPayout.completedDate && (
                    <div className="timeline-item completed">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Completed</span>
                        <span className="timeline-date">{formatDate(selectedPayout.completedDate)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="orders-section">
              <h3>Included Orders</h3>
              <div className="orders-list">
                {selectedPayout.orders.map((order, index) => (
                  <div key={index} className="order-item">
                    <span className="order-id">{order.id}</span>
                    <span className="order-date">{new Date(order.date).toLocaleDateString()}</span>
                    <span className="order-amount">₹{order.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            {selectedPayout.status === 'pending' && (
              <button 
                className="process-payout-btn"
                onClick={() => {
                  handleProcessPayout(selectedPayout.id);
                  setShowPayoutModal(false);
                }}
              >
                <Send size={16} />
                Process Payout
              </button>
            )}
            <button className="download-details-btn">
              <Download size={16} />
              Download Details
            </button>
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="payout-loading">
        <div className="loading-spinner"></div>
        <p>Loading payouts...</p>
      </div>
    );
  }

  return (
    <div className="payout-management">
      {/* Payout Stats */}
      <div className="payout-stats">
        <div className="stat-card total">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <h3>Total Payouts</h3>
            <div className="stat-value">{payoutStats.total}</div>
            <div className="stat-amount">₹{payoutStats.totalAmount.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>Pending</h3>
            <div className="stat-value">{payoutStats.pending}</div>
          </div>
        </div>
        
        <div className="stat-card processing">
          <div className="stat-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>Processing</h3>
            <div className="stat-value">{payoutStats.processing}</div>
          </div>
        </div>
        
        <div className="stat-card completed">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>Completed</h3>
            <div className="stat-value">{payoutStats.completed}</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="payout-controls">
        <div className="search-filter-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search payouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        
        <div className="action-controls">
          <button 
            className={`bulk-mode-btn ${bulkActionMode ? 'active' : ''}`}
            onClick={() => setBulkActionMode(!bulkActionMode)}
          >
            {bulkActionMode ? 'Cancel' : 'Bulk Actions'}
          </button>
          
          {bulkActionMode && selectedPayouts.length > 0 && (
            <button 
              className="bulk-process-btn"
              onClick={() => handleBulkAction('process')}
            >
              <Send size={16} />
              Process Selected ({selectedPayouts.length})
            </button>
          )}
        </div>
      </div>

      {/* Payouts Table */}
      <div className="payouts-table">
        <div className="table-header">
          {bulkActionMode && <span>Select</span>}
          <span>Payout ID</span>
          <span>Vendor</span>
          <span>Amount</span>
          <span>Net Payout</span>
          <span>Status</span>
          <span>Due Date</span>
          <span>Actions</span>
        </div>
        
        {filteredPayouts.map((payout) => (
          <div key={payout.id} className="table-row">
            {bulkActionMode && (
              <div className="table-cell checkbox">
                <input
                  type="checkbox"
                  checked={selectedPayouts.includes(payout.id)}
                  onChange={() => handleSelectPayout(payout.id)}
                  disabled={payout.status !== 'pending'}
                />
              </div>
            )}
            <div className="table-cell payout-id">
              {payout.id}
            </div>
            <div className="table-cell vendor">
              <div className="vendor-info">
                <span className="vendor-name">{payout.vendor.name}</span>
                <span className="vendor-id">{payout.vendor.id}</span>
              </div>
            </div>
            <div className="table-cell amount">
              ₹{payout.amount.toLocaleString()}
            </div>
            <div className="table-cell net-amount">
              ₹{payout.netAmount.toLocaleString()}
            </div>
            <div className="table-cell status">
              <span className={`status-badge ${payout.status}`}>
                {getStatusIcon(payout.status)}
                {payout.status}
              </span>
            </div>
            <div className="table-cell due-date">
              {payout.dueDate ? formatDate(payout.dueDate) : '-'}
            </div>
            <div className="table-cell actions">
              <button 
                className="action-btn view"
                onClick={() => {
                  setSelectedPayout(payout);
                  setShowPayoutModal(true);
                }}
                title="View Details"
              >
                <Eye size={16} />
              </button>
              {payout.status === 'pending' && (
                <button 
                  className="action-btn process"
                  onClick={() => handleProcessPayout(payout.id)}
                  title="Process Payout"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payout Modal */}
      {showPayoutModal && <PayoutModal />}
    </div>
  );
};

export default PayoutManagement;