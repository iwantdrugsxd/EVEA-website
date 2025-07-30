// src/components/admin/orders/orders-table/OrdersTable.jsx
import React, { useState, useEffect } from 'react';
import { 
  Eye, Search, Filter, ChevronLeft, ChevronRight,
  CheckCircle, Clock, XCircle, AlertTriangle, Phone, Mail,
  Calendar, DollarSign, User, Building, MoreVertical
} from 'lucide-react';
import './OrdersTable.css';

const OrdersTable = ({ 
  searchTerm = '', 
  statusFilter = 'all', 
  onOrderSelect,
  refreshTrigger = 0
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedOrders, setSelectedOrders] = useState([]);

  const ordersPerPage = 10;

  // Mock orders data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-2024-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.johnson@email.com',
        customerPhone: '+91 98765 43210',
        vendorName: 'Elite Catering Co.',
        vendorEmail: 'contact@elitecatering.com',
        service: 'Wedding Catering',
        amount: 75000,
        advance: 25000,
        status: 'confirmed',
        paymentStatus: 'advance_paid',
        eventDate: '2024-02-15T18:00:00Z',
        bookingDate: '2024-01-10T14:30:00Z',
        location: 'Mumbai, Maharashtra',
        guests: 150,
        requirements: 'Vegetarian menu only, outdoor setup required'
      },
      {
        id: 'ORD-2024-002',
        customerName: 'Michael Chen',
        customerEmail: 'michael.chen@email.com',
        customerPhone: '+91 98765 43211',
        vendorName: 'Dream Photographers',
        vendorEmail: 'hello@dreamphotos.com',
        service: 'Wedding Photography',
        amount: 45000,
        advance: 15000,
        status: 'pending',
        paymentStatus: 'advance_paid',
        eventDate: '2024-02-20T10:00:00Z',
        bookingDate: '2024-01-12T16:45:00Z',
        location: 'Delhi, India',
        guests: 100,
        requirements: 'Traditional and candid shots, album included'
      },
      {
        id: 'ORD-2024-003',
        customerName: 'Emma Wilson',
        customerEmail: 'emma.wilson@email.com',
        customerPhone: '+91 98765 43212',
        vendorName: 'Luxury Decorators',
        vendorEmail: 'info@luxurydecorators.com',
        service: 'Event Decoration',
        amount: 32000,
        advance: 10000,
        status: 'in_progress',
        paymentStatus: 'advance_paid',
        eventDate: '2024-02-18T16:00:00Z',
        bookingDate: '2024-01-08T11:20:00Z',
        location: 'Bangalore, Karnataka',
        guests: 80,
        requirements: 'Floral arrangements, stage decoration'
      },
      {
        id: 'ORD-2024-004',
        customerName: 'David Brown',
        customerEmail: 'david.brown@email.com',
        customerPhone: '+91 98765 43213',
        vendorName: 'Perfect Venues Ltd.',
        vendorEmail: 'bookings@perfectvenues.com',
        service: 'Venue Booking',
        amount: 120000,
        advance: 50000,
        status: 'completed',
        paymentStatus: 'fully_paid',
        eventDate: '2024-01-25T17:00:00Z',
        bookingDate: '2024-01-05T09:15:00Z',
        location: 'Chennai, Tamil Nadu',
        guests: 200,
        requirements: 'AC hall, parking for 50 cars, sound system'
      },
      {
        id: 'ORD-2024-005',
        customerName: 'Lisa Anderson',
        customerEmail: 'lisa.anderson@email.com',
        customerPhone: '+91 98765 43214',
        vendorName: 'Melodic Events',
        vendorEmail: 'contact@melodicevents.com',
        service: 'Entertainment',
        amount: 28000,
        advance: 8000,
        status: 'cancelled',
        paymentStatus: 'refunded',
        eventDate: '2024-02-10T19:00:00Z',
        bookingDate: '2024-01-15T13:45:00Z',
        location: 'Pune, Maharashtra',
        guests: 60,
        requirements: 'DJ and live band performance'
      }
    ];

    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, [refreshTrigger]);

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a.bookingDate);
        bValue = new Date(b.bookingDate);
        break;
      case 'amount':
        aValue = a.amount;
        bValue = b.amount;
        break;
      case 'customer':
        aValue = a.customerName.toLowerCase();
        bValue = b.customerName.toLowerCase();
        break;
      case 'vendor':
        aValue = a.vendorName.toLowerCase();
        bValue = b.vendorName.toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'in_progress':
        return <AlertTriangle size={16} />;
      case 'completed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case 'fully_paid':
        return <CheckCircle size={16} />;
      case 'advance_paid':
        return <AlertTriangle size={16} />;
      case 'pending':
        return <Clock size={16} />;
      case 'refunded':
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

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(order => order.id));
    }
  };

  if (loading) {
    return (
      <div className="orders-table-loading">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-table">
      {/* Table Controls */}
      <div className="table-controls">
        <div className="bulk-actions">
          <label className="bulk-select">
            <input
              type="checkbox"
              checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
              onChange={handleSelectAll}
            />
            <span>Select All ({selectedOrders.length})</span>
          </label>
          
          {selectedOrders.length > 0 && (
            <div className="bulk-action-buttons">
              <button className="bulk-btn export">
                Export Selected
              </button>
              <button className="bulk-btn update">
                Update Status
              </button>
            </div>
          )}
        </div>
        
        <div className="table-filters">
          <select 
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="customer">Sort by Customer</option>
            <option value="vendor">Sort by Vendor</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <div className="table-header">
          <div className="header-cell select">
            <input
              type="checkbox"
              checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
              onChange={handleSelectAll}
            />
          </div>
          <div className="header-cell order-id" onClick={() => handleSort('date')}>
            Order ID
            {sortBy === 'date' && (
              <span className={`sort-indicator ${sortOrder}`}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className="header-cell customer" onClick={() => handleSort('customer')}>
            Customer
            {sortBy === 'customer' && (
              <span className={`sort-indicator ${sortOrder}`}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className="header-cell vendor" onClick={() => handleSort('vendor')}>
            Vendor
            {sortBy === 'vendor' && (
              <span className={`sort-indicator ${sortOrder}`}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className="header-cell service">Service</div>
          <div className="header-cell amount" onClick={() => handleSort('amount')}>
            Amount
            {sortBy === 'amount' && (
              <span className={`sort-indicator ${sortOrder}`}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </div>
          <div className="header-cell status">Status</div>
          <div className="header-cell payment">Payment</div>
          <div className="header-cell event-date">Event Date</div>
          <div className="header-cell actions">Actions</div>
        </div>
        
        {currentOrders.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <h3>No orders found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <div key={order.id} className={`table-row ${selectedOrders.includes(order.id) ? 'selected' : ''}`}>
              <div className="table-cell select">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => handleSelectOrder(order.id)}
                />
              </div>
              
              <div className="table-cell order-id">
                <span className="order-id-text">{order.id}</span>
                <span className="booking-date">{formatDate(order.bookingDate)}</span>
              </div>
              
              <div className="table-cell customer">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <User size={16} />
                  </div>
                  <div className="customer-details">
                    <span className="customer-name">{order.customerName}</span>
                    <span className="customer-contact">{order.customerPhone}</span>
                  </div>
                </div>
              </div>
              
              <div className="table-cell vendor">
                <div className="vendor-info">
                  <div className="vendor-avatar">
                    <Building size={16} />
                  </div>
                  <div className="vendor-details">
                    <span className="vendor-name">{order.vendorName}</span>
                    <span className="vendor-email">{order.vendorEmail}</span>
                  </div>
                </div>
              </div>
              
              <div className="table-cell service">
                <span className="service-name">{order.service}</span>
                <span className="service-guests">{order.guests} guests</span>
              </div>
              
              <div className="table-cell amount">
                <div className="amount-info">
                  <span className="total-amount">{formatCurrency(order.amount)}</span>
                  <span className="advance-amount">Advance: {formatCurrency(order.advance)}</span>
                </div>
              </div>
              
              <div className="table-cell status">
                <span className={`status-badge ${order.status}`}>
                  {getStatusIcon(order.status)}
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="table-cell payment">
                <span className={`payment-badge ${order.paymentStatus}`}>
                  {getPaymentStatusIcon(order.paymentStatus)}
                  {order.paymentStatus.replace('_', ' ')}
                </span>
              </div>
              
              <div className="table-cell event-date">
                <div className="event-info">
                  <span className="event-date-text">{formatDate(order.eventDate)}</span>
                  <span className="event-location">{order.location}</span>
                </div>
              </div>
              
              <div className="table-cell actions">
                <button 
                  className="action-btn view"
                  onClick={() => onOrderSelect && onOrderSelect(order)}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button 
                  className="action-btn contact"
                  onClick={() => window.open(`tel:${order.customerPhone}`)}
                  title="Call Customer"
                >
                  <Phone size={16} />
                </button>
                <button 
                  className="action-btn email"
                  onClick={() => window.open(`mailto:${order.customerEmail}`)}
                  title="Email Customer"
                >
                  <Mail size={16} />
                </button>
                <button className="action-btn more" title="More Options">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
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
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page <= totalPages) {
                  return (
                    <button
                      key={page}
                      className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
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
    </div>
  );
};

export default OrdersTable;