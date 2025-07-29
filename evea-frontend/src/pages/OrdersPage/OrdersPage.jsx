// src/pages/VendorDashboard/pages/OrdersPage.jsx
import React, { useState } from 'react';
import { 
  Search, Filter, Download, MoreVertical, Eye, MessageSquare,
  CheckCircle, XCircle, Clock, Calendar, User, IndianRupee,
  Camera, Utensils, Palette, Music, Building, Package,
  Phone, Mail, MapPin, Star, ArrowUpDown, RefreshCw
} from 'lucide-react';
import './OrdersPage.css';

const OrdersPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('card'); // card or table

  // Sample orders data
  const orders = [
    {
      id: 'ORD-2024-001',
      customer: {
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        email: 'priya.sharma@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612e673?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      event: {
        type: 'Wedding',
        name: 'Priya & Arjun Wedding',
        date: '2024-03-15',
        time: '18:00',
        location: 'The Leela Palace, Mumbai',
        guests: 300
      },
      services: [
        { name: 'Wedding Photography', price: 50000, icon: <Camera size={16} /> },
        { name: 'Candid Photography', price: 30000, icon: <Camera size={16} /> }
      ],
      amount: 80000,
      status: 'pending',
      createdAt: '2024-02-01T10:30:00',
      lastUpdate: '2024-02-01T10:30:00',
      priority: 'high'
    },
    {
      id: 'ORD-2024-002',
      customer: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 43211',
        email: 'rajesh.kumar@email.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      event: {
        type: 'Corporate Event',
        name: 'Annual Conference 2024',
        date: '2024-03-20',
        time: '09:00',
        location: 'Hyatt Regency, Delhi',
        guests: 150
      },
      services: [
        { name: 'Event Photography', price: 25000, icon: <Camera size={16} /> },
        { name: 'Video Coverage', price: 35000, icon: <Camera size={16} /> }
      ],
      amount: 60000,
      status: 'confirmed',
      createdAt: '2024-01-28T14:20:00',
      lastUpdate: '2024-01-29T09:15:00',
      priority: 'medium'
    },
    {
      id: 'ORD-2024-003',
      customer: {
        name: 'Ananya Patel',
        phone: '+91 98765 43212',
        email: 'ananya.patel@email.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
      },
      event: {
        type: 'Birthday Party',
        name: 'Ananya\'s 25th Birthday',
        date: '2024-02-28',
        time: '19:00',
        location: 'Home Party, Bangalore',
        guests: 50
      },
      services: [
        { name: 'Party Photography', price: 15000, icon: <Camera size={16} /> }
      ],
      amount: 15000,
      status: 'completed',
      createdAt: '2024-01-25T16:45:00',
      lastUpdate: '2024-02-28T22:30:00',
      priority: 'low'
    }
  ];

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
    { id: 'in-progress', label: 'In Progress', count: orders.filter(o => o.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  // Statistics
  const orderStats = [
    {
      title: 'Total Orders',
      value: '247',
      change: '+12',
      positive: true,
      icon: <Package size={20} />
    },
    {
      title: 'Revenue This Month',
      value: '₹2,45,000',
      change: '+18%',
      positive: true,
      icon: <IndianRupee size={20} />
    },
    {
      title: 'Average Order Value',
      value: '₹18,500',
      change: '+₹2,300',
      positive: true,
      icon: <ArrowUpDown size={20} />
    },
    {
      title: 'Completion Rate',
      value: '96.8%',
      change: '+1.2%',
      positive: true,
      icon: <CheckCircle size={20} />
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-warning',
      confirmed: 'status-info',
      'in-progress': 'status-primary',
      completed: 'status-success',
      cancelled: 'status-danger'
    };
    return colors[status] || 'status-neutral';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Clock size={14} />,
      confirmed: <CheckCircle size={14} />,
      'in-progress': <RefreshCw size={14} />,
      completed: <CheckCircle size={14} />,
      cancelled: <XCircle size={14} />
    };
    return icons[status] || <Clock size={14} />;
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === 'all' || order.status === selectedFilter;
    const matchesSearch = order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="orders-page">
      {/* Orders Header */}
      <div className="orders-header">
        <div className="header-main">
          <div className="header-title">
            <h2>Orders Management</h2>
            <span className="order-count">{filteredOrders.length} orders</span>
          </div>
          
          <div className="header-actions">
            <button className="btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button className="btn-primary">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="orders-controls">
          <div className="search-container">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search orders, customers, events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
              <option value="customer">Sort by Customer</option>
            </select>
            
            <button className="filter-btn">
              <Filter size={16} />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="orders-stats">
        {orderStats.map((stat, index) => (
          <div key={index} className="stat-card">
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

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <Package size={48} />
            <h3>No orders found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Order Header */}
              <div className="order-header">
                <div className="order-id">
                  <span className="id-label">Order ID:</span>
                  <span className="id-value">{order.id}</span>
                </div>
                
                <div className="order-status">
                  <span className={`status-badge ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="order-actions">
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

              {/* Order Content */}
              <div className="order-content">
                {/* Customer Info */}
                <div className="customer-section">
                  <div className="customer-avatar">
                    <img src={order.customer.avatar} alt={order.customer.name} />
                  </div>
                  <div className="customer-info">
                    <h4 className="customer-name">{order.customer.name}</h4>
                    <div className="customer-contact">
                      <div className="contact-item">
                        <Phone size={12} />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="contact-item">
                        <Mail size={12} />
                        <span>{order.customer.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="event-section">
                  <div className="event-header">
                    <h4 className="event-name">{order.event.name}</h4>
                    <span className="event-type">{order.event.type}</span>
                  </div>
                  <div className="event-details">
                    <div className="detail-item">
                      <Calendar size={14} />
                      <span>{new Date(order.event.date).toLocaleDateString()}</span>
                      <span>{order.event.time}</span>
                    </div>
                    <div className="detail-item">
                      <MapPin size={14} />
                      <span>{order.event.location}</span>
                    </div>
                    <div className="detail-item">
                      <User size={14} />
                      <span>{order.event.guests} guests</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="services-section">
                  <h5 className="services-title">Services Requested</h5>
                  <div className="services-list">
                    {order.services.map((service, index) => (
                      <div key={index} className="service-item">
                        <div className="service-icon">
                          {service.icon}
                        </div>
                        <div className="service-info">
                          <span className="service-name">{service.name}</span>
                          <span className="service-price">₹{service.price.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                  <div className="summary-row">
                    <span className="summary-label">Total Amount:</span>
                    <span className="summary-value">₹{order.amount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Order Date:</span>
                    <span className="summary-value">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Last Update:</span>
                    <span className="summary-value">
                      {new Date(order.lastUpdate).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="order-footer">
                {order.status === 'pending' && (
                  <div className="action-buttons">
                    <button className="btn-danger">
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button className="btn-success">
                      <CheckCircle size={16} />
                      Accept Order
                    </button>
                  </div>
                )}
                
                {order.status === 'confirmed' && (
                  <div className="action-buttons">
                    <button className="btn-secondary">
                      <MessageSquare size={16} />
                      Message Customer
                    </button>
                    <button className="btn-primary">
                      Mark In Progress
                    </button>
                  </div>
                )}

                {order.status === 'in-progress' && (
                  <div className="action-buttons">
                    <button className="btn-secondary">
                      <Calendar size={16} />
                      Schedule Update
                    </button>
                    <button className="btn-success">
                      <CheckCircle size={16} />
                      Mark Complete
                    </button>
                  </div>
                )}

                {order.status === 'completed' && (
                  <div className="action-buttons">
                    <button className="btn-secondary">
                      <Star size={16} />
                      View Review
                    </button>
                    <button className="btn-primary">
                      <Download size={16} />
                      Download Invoice
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="orders-pagination">
        <div className="pagination-info">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" disabled>Previous</button>
          <button className="pagination-btn active">1</button>
          <button className="pagination-btn">2</button>
          <button className="pagination-btn">3</button>
          <button className="pagination-btn">Next</button>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;