import React, { useState } from 'react';
import AdminLayout from '../../components/admin/layout/admin-layout/AdminLayout';
import { 
  Search, Filter, Calendar, Download, Eye, 
  MoreVertical, CheckCircle, Clock, XCircle,
  Phone, Mail, MapPin, IndianRupee
} from 'lucide-react';
import './order-management.css';

const OrderManagement = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Sample orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-2024-1856',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@example.com',
      customerPhone: '+91 98765 43210',
      vendorName: 'Royal Wedding Photography',
      serviceName: 'Premium Wedding Photography',
      eventDate: '2024-03-15',
      eventLocation: 'Mumbai, Maharashtra',
      bookingDate: '2024-01-20',
      amount: 75000,
      advanceAmount: 25000,
      status: 'confirmed',
      paymentStatus: 'advance_paid',
      guestCount: 300,
      duration: '8 hours',
      requirements: 'Pre-wedding shoot included, drone photography required'
    },
    {
      id: 'ORD-2024-1855',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh@example.com',
      customerPhone: '+91 87654 32109',
      vendorName: 'Elegant Catering Services',
      serviceName: 'Wedding Catering Package',
      eventDate: '2024-02-28',
      eventLocation: 'Delhi, NCR',
      bookingDate: '2024-01-18',
      amount: 150000,
      advanceAmount: 50000,
      status: 'in_progress',
      paymentStatus: 'fully_paid',
      guestCount: 500,
      duration: 'Full day',
      requirements: 'Vegetarian menu, live counters, dessert station'
    },
    {
      id: 'ORD-2024-1854',
      customerName: 'Ananya Patel',
      customerEmail: 'ananya@example.com',
      customerPhone: '+91 99887 76655',
      vendorName: 'Party Beats Entertainment',
      serviceName: 'DJ & Sound System',
      eventDate: '2024-02-10',
      eventLocation: 'Bangalore, Karnataka',
      bookingDate: '2024-01-15',
      amount: 25000,
      advanceAmount: 10000,
      status: 'completed',
      paymentStatus: 'fully_paid',
      guestCount: 200,
      duration: '6 hours',
      requirements: 'Sound system for outdoor venue, wireless mics'
    },
    {
      id: 'ORD-2024-1853',
      customerName: 'Suresh Agarwal',
      customerEmail: 'suresh@example.com',
      customerPhone: '+91 88776 65544',
      vendorName: 'Royal Decorators',
      serviceName: 'Wedding Decoration',
      eventDate: '2024-04-05',
      eventLocation: 'Pune, Maharashtra',
      bookingDate: '2024-01-12',
      amount: 85000,
      advanceAmount: 30000,
      status: 'pending',
      paymentStatus: 'pending',
      guestCount: 350,
      duration: '2 days setup',
      requirements: 'Traditional theme, flower arrangements, stage decoration'
    },
    {
      id: 'ORD-2024-1852',
      customerName: 'Meera Singh',
      customerEmail: 'meera@example.com',
      customerPhone: '+91 77665 54433',
      vendorName: 'Elite Events',
      serviceName: 'Corporate Event Management',
      eventDate: '2024-02-20',
      eventLocation: 'Mumbai, Maharashtra',
      bookingDate: '2024-01-10',
      amount: 120000,
      advanceAmount: 40000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      guestCount: 300,
      duration: 'Full day',
      requirements: 'AV setup, registration desk, catering coordination'
    }
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { value: 'in_progress', label: 'In Progress', count: orders.filter(o => o.status === 'in_progress').length },
    { value: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'in_progress': return <Clock size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'in_progress': return 'in-progress';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.amount, 0)
  };

  const OrderModal = () => (
    selectedOrder && (
      <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
        <div className="order-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Order Details - {selectedOrder.id}</h2>
            <button onClick={() => setShowOrderModal(false)}>
              <XCircle size={24} />
            </button>
          </div>
          
          <div className="modal-content">
            <div className="order-details-grid">
              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{selectedOrder.customerName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{selectedOrder.customerEmail}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Phone:</span>
                  <span className="value">{selectedOrder.customerPhone}</span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Service Details</h3>
                <div className="detail-item">
                  <span className="label">Vendor:</span>
                  <span className="value">{selectedOrder.vendorName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Service:</span>
                  <span className="value">{selectedOrder.serviceName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span className="value">{selectedOrder.duration}</span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Event Information</h3>
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span className="value">{new Date(selectedOrder.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{selectedOrder.eventLocation}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Guests:</span>
                  <span className="value">{selectedOrder.guestCount} guests</span>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Payment Information</h3>
                <div className="detail-item">
                  <span className="label">Total Amount:</span>
                  <span className="value amount">₹{selectedOrder.amount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Advance:</span>
                  <span className="value">₹{selectedOrder.advanceAmount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Payment Status:</span>
                  <span className={`value status ${selectedOrder.paymentStatus}`}>
                    {selectedOrder.paymentStatus.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            
            {selectedOrder.requirements && (
              <div className="requirements-section">
                <h3>Special Requirements</h3>
                <p>{selectedOrder.requirements}</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <select 
              value={selectedOrder.status}
              onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
              className="status-update-select"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button className="contact-customer-btn">
              <Phone size={16} />
              Contact Customer
            </button>
            <button className="contact-vendor-btn">
              <Mail size={16} />
              Contact Vendor
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <AdminLayout>
      <div className="order-management">
        <div className="page-header">
          <div className="header-content">
            <h1>Order Management</h1>
            <p>Monitor and manage all service bookings across the platform</p>
          </div>
          
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{stats.confirmed}</span>
              <span className="stat-label">Confirmed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">₹{stats.totalRevenue.toLocaleString()}</span>
              <span className="stat-label">Total Value</span>
            </div>
          </div>
        </div>

        <div className="order-controls">
          <div className="search-filter-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search orders by ID, customer, vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <button className="filter-btn">
                <Filter size={16} />
                Advanced Filters
              </button>
              <button className="export-btn">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          <div className="status-tabs">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                className={`tab-btn ${selectedStatus === option.value ? 'active' : ''}`}
                onClick={() => setSelectedStatus(option.value)}
              >
                {option.label}
                <span className="tab-count">{option.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="orders-table-container">
          <div className="orders-table">
            <div className="table-header">
              <div className="header-cell">Order ID</div>
              <div className="header-cell">Customer</div>
              <div className="header-cell">Service</div>
              <div className="header-cell">Event Date</div>
              <div className="header-cell">Amount</div>
              <div className="header-cell">Status</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {filteredOrders.map(order => (
              <div key={order.id} className="table-row" onClick={() => handleOrderClick(order)}>
                <div className="table-cell order-id">
                  <span className="id-text">{order.id}</span>
                  <span className="booking-date">
                    Booked: {new Date(order.bookingDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="table-cell customer-info">
                  <div className="customer-name">{order.customerName}</div>
                  <div className="customer-contact">
                    <Mail size={12} />
                    {order.customerEmail}
                  </div>
                </div>
                
                <div className="table-cell service-info">
                  <div className="service-name">{order.serviceName}</div>
                  <div className="vendor-name">{order.vendorName}</div>
                </div>
                
                <div className="table-cell event-date">
                  <div className="date">{new Date(order.eventDate).toLocaleDateString()}</div>
                  <div className="location">
                    <MapPin size={12} />
                    {order.eventLocation.split(',')[0]}
                  </div>
                </div>
                
                <div className="table-cell amount-info">
                  <div className="total-amount">₹{order.amount.toLocaleString()}</div>
                  <div className="payment-status">{order.paymentStatus.replace('_', ' ')}</div>
                </div>
                
                <div className="table-cell status-cell">
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                
                <div className="table-cell actions-cell">
                  <button 
                    className="action-btn view"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOrderClick(order);
                    }}
                  >
                    <Eye size={14} />
                  </button>
                  <button 
                    className="action-btn menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="empty-state">
              <h3>No orders found</h3>
              <p>No orders match your current filters</p>
            </div>
          )}
        </div>

        {showOrderModal && <OrderModal />}
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;