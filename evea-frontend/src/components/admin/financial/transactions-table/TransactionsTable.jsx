// src/components/admin/financial/transactions-table/TransactionsTable.jsx
import React, { useState, useEffect } from 'react';
import { 
  Eye, Download, Filter, ChevronLeft, ChevronRight,
  CheckCircle, Clock, XCircle, AlertTriangle, Search
} from 'lucide-react';
import './TransactionsTable.css';

const TransactionsTable = ({ 
  searchTerm = '', 
  filter = 'all', 
  limit = null, 
  showPagination = true 
}) => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const itemsPerPage = limit || 10;

  // Mock transaction data
  useEffect(() => {
    const mockTransactions = [
      {
        id: 'TXN-2024-001',
        orderId: 'ORD-2024-456',
        vendor: 'Elite Catering Co.',
        customer: 'Sarah Johnson',
        amount: 25000,
        commission: 2500,
        status: 'completed',
        paymentMethod: 'Credit Card',
        date: '2024-01-15T10:30:00Z',
        description: 'Wedding catering service payment'
      },
      {
        id: 'TXN-2024-002',
        orderId: 'ORD-2024-457',
        vendor: 'Dream Photographers',
        customer: 'Michael Chen',
        amount: 15000,
        commission: 1500,
        status: 'pending',
        paymentMethod: 'Bank Transfer',
        date: '2024-01-15T14:20:00Z',
        description: 'Photography service booking'
      },
      {
        id: 'TXN-2024-003',
        orderId: 'ORD-2024-458',
        vendor: 'Luxury Decorators',
        customer: 'Emma Wilson',
        amount: 18500,
        commission: 1850,
        status: 'failed',
        paymentMethod: 'Credit Card',
        date: '2024-01-15T16:45:00Z',
        description: 'Event decoration services'
      },
      {
        id: 'TXN-2024-004',
        orderId: 'ORD-2024-459',
        vendor: 'Perfect Venues Ltd.',
        customer: 'David Brown',
        amount: 45000,
        commission: 4500,
        status: 'completed',
        paymentMethod: 'UPI',
        date: '2024-01-16T09:15:00Z',
        description: 'Venue booking payment'
      },
      {
        id: 'TXN-2024-005',
        orderId: 'ORD-2024-460',
        vendor: 'Melodic Events',
        customer: 'Lisa Anderson',
        amount: 12000,
        commission: 1200,
        status: 'processing',
        paymentMethod: 'Wallet',
        date: '2024-01-16T11:30:00Z',
        description: 'Entertainment service payment'
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions based on search and filter criteria
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || transaction.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <AlertTriangle size={16} />;
      case 'failed':
        return <XCircle size={16} />;
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

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const TransactionModal = () => (
    selectedTransaction && (
      <div className="modal-overlay" onClick={() => setShowTransactionModal(false)}>
        <div className="transaction-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Transaction Details - {selectedTransaction.id}</h2>
            <button onClick={() => setShowTransactionModal(false)}>
              <XCircle size={24} />
            </button>
          </div>
          
          <div className="modal-content">
            <div className="transaction-details-grid">
              <div className="detail-section">
                <h3>Transaction Information</h3>
                <div className="detail-item">
                  <span className="label">Transaction ID:</span>
                  <span className="value">{selectedTransaction.id}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Order ID:</span>
                  <span className="value">{selectedTransaction.orderId}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(selectedTransaction.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Status:</span>
                  <span className={`value status ${selectedTransaction.status}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    {selectedTransaction.status.toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Payment Details</h3>
                <div className="detail-item">
                  <span className="label">Amount:</span>
                  <span className="value amount">₹{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Commission:</span>
                  <span className="value commission">₹{selectedTransaction.commission.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">{selectedTransaction.paymentMethod}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Description:</span>
                  <span className="value">{selectedTransaction.description}</span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Parties Involved</h3>
                <div className="detail-item">
                  <span className="label">Vendor:</span>
                  <span className="value">{selectedTransaction.vendor}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Customer:</span>
                  <span className="value">{selectedTransaction.customer}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button className="download-receipt-btn">
              <Download size={16} />
              Download Receipt
            </button>
            <button className="close-modal-btn" onClick={() => setShowTransactionModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );

  if (loading) {
    return (
      <div className="transactions-loading">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transactions-table">
      {/* Table */}
      <div className="table-container">
        <div className="table-header">
          <span>Transaction ID</span>
          <span>Vendor</span>
          <span>Customer</span>
          <span>Amount</span>
          <span>Commission</span>
          <span>Status</span>
          <span>Date</span>
          <span>Actions</span>
        </div>
        
        {currentTransactions.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <h3>No transactions found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          currentTransactions.map((transaction) => (
            <div key={transaction.id} className="table-row">
              <div className="table-cell transaction-id">
                {transaction.id}
              </div>
              <div className="table-cell vendor-name">
                {transaction.vendor}
              </div>
              <div className="table-cell customer-name">
                {transaction.customer}
              </div>
              <div className="table-cell amount">
                ₹{transaction.amount.toLocaleString()}
              </div>
              <div className="table-cell commission">
                ₹{transaction.commission.toLocaleString()}
              </div>
              <div className="table-cell status">
                <span className={`status-badge ${transaction.status}`}>
                  {getStatusIcon(transaction.status)}
                  {transaction.status}
                </span>
              </div>
              <div className="table-cell date">
                {formatDate(transaction.date)}
              </div>
              <div className="table-cell actions">
                <button 
                  className="action-btn view"
                  onClick={() => handleViewTransaction(transaction)}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="action-btn download"
                  title="Download Receipt"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {showPagination && filteredTransactions.length > itemsPerPage && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          
          <div className="pagination-controls">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && <TransactionModal />}
    </div>
  );
};

export default TransactionsTable;