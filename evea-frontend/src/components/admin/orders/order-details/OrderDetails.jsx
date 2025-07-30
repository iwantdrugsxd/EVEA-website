// src/components/admin/orders/order-details/OrderDetails.jsx
import React, { useState } from 'react';
import { 
  X, User, Building, MapPin, Calendar, DollarSign,
  Phone, Mail, Clock, CheckCircle, AlertTriangle,
  Edit, Download, MessageSquare, Star, XCircle,
  CreditCard, Wallet, Receipt, FileText
} from 'lucide-react';
import './OrderDetails.css';

const OrderDetails = ({ isOpen, onClose, order, onStatusUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [newStatus, setNewStatus] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusNote, setStatusNote] = useState('');

  if (!isOpen || !order) return null;

  const tabs = [
    { id: 'details', name: 'Order Details', icon: <FileText size={16} /> },
    { id: 'timeline', name: 'Timeline', icon: <Clock size={16} /> },
    { id: 'payment', name: 'Payment', icon: <CreditCard size={16} /> },
    { id: 'communication', name: 'Messages', icon: <MessageSquare size={16} /> }
  ];

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
  };

  const handleStatusUpdate = () => {
    if (onStatusUpdate && newStatus) {
      onStatusUpdate(order.id, newStatus, statusNote);
      setShowStatusUpdate(false);
      setNewStatus('');
      setStatusNote('');
    }
  };

  const renderDetailsTab = () => (
    <div className="tab-content">
      {/* Order Summary */}
      <div className="order-summary">
        <div className="summary-header">
          <h3>Order Summary</h3>
          <div className="order-status-section">
            <div className={`order-status ${order.status}`}>
              {getStatusIcon(order.status)}
              <span>{order.status.replace('_', ' ').toUpperCase()}</span>
            </div>
            <button 
              className="update-status-btn"
              onClick={() => setShowStatusUpdate(true)}
            >
              <Edit size={14} />
              Update Status
            </button>
          </div>
        </div>
        
        <div className="summary-grid">
          <div className="summary-item">
            <div className="summary-icon">
              <FileText size={20} />
            </div>
            <div className="summary-details">
              <span className="summary-label">Order ID</span>
              <span className="summary-value">{order.id}</span>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon">
              <Calendar size={20} />
            </div>
            <div className="summary-details">
              <span className="summary-label">Event Date</span>
              <span className="summary-value">{formatDate(order.eventDate)}</span>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon">
              <DollarSign size={20} />
            </div>
            <div className="summary-details">
              <span className="summary-label">Total Amount</span>
              <span className="summary-value">{formatCurrency(order.amount)}</span>
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-icon">
              <User size={20} />
            </div>
            <div className="summary-details">
              <span className="summary-label">Guests</span>
              <span className="summary-value">{order.guests} people</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer & Vendor Information */}
      <div className="parties-section">
        <div className="party-card customer">
          <div className="party-header">
            <div className="party-avatar customer">
              <User size={24} />
            </div>
            <div className="party-info">
              <h4>Customer</h4>
              <span className="party-name">{order.customerName}</span>
            </div>
            <div className="party-actions">
              <button 
                className="contact-btn phone"
                onClick={() => window.open(`tel:${order.customerPhone}`)}
                title="Call Customer"
              >
                <Phone size={16} />
              </button>
              <button 
                className="contact-btn email"
                onClick={() => window.open(`mailto:${order.customerEmail}`)}
                title="Email Customer"
              >
                <Mail size={16} />
              </button>
            </div>
          </div>
          
          <div className="party-details">
            <div className="detail-row">
              <Phone size={16} />
              <span>{order.customerPhone}</span>
            </div>
            <div className="detail-row">
              <Mail size={16} />
              <span>{order.customerEmail}</span>
            </div>
          </div>
        </div>
        
        <div className="party-card vendor">
          <div className="party-header">
            <div className="party-avatar vendor">
              <Building size={24} />
            </div>
            <div className="party-info">
              <h4>Vendor</h4>
              <span className="party-name">{order.vendorName}</span>
            </div>
            <div className="party-actions">
              <button 
                className="contact-btn phone"
                onClick={() => window.open(`tel:${order.vendorPhone || '+91 98765 43210'}`)}
                title="Call Vendor"
              >
                <Phone size={16} />
              </button>
              <button 
                className="contact-btn email"
                onClick={() => window.open(`mailto:${order.vendorEmail}`)}
                title="Email Vendor"
              >
                <Mail size={16} />
              </button>
            </div>
          </div>
          
          <div className="party-details">
            <div className="detail-row">
              <Building size={16} />
              <span>{order.service}</span>
            </div>
            <div className="detail-row">
              <Mail size={16} />
              <span>{order.vendorEmail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="event-details">
        <h3>Event Details</h3>
        <div className="event-info-grid">
          <div className="event-info-item">
            <MapPin size={16} />
            <div>
              <span className="event-label">Location</span>
              <span className="event-value">{order.location}</span>
            </div>
          </div>
          
          <div className="event-info-item">
            <Calendar size={16} />
            <div>
              <span className="event-label">Event Date & Time</span>
              <span className="event-value">{formatDate(order.eventDate)}</span>
            </div>
          </div>
          
          <div className="event-info-item">
            <User size={16} />
            <div>
              <span className="event-label">Expected Guests</span>
              <span className="event-value">{order.guests} people</span>
            </div>
          </div>
          
          <div className="event-info-item">
            <Clock size={16} />
            <div>
              <span className="event-label">Booking Date</span>
              <span className="event-value">{formatDate(order.bookingDate)}</span>
            </div>
          </div>
        </div>
        
        {order.requirements && (
          <div className="requirements-section">
            <h4>Special Requirements</h4>
            <div className="requirements-content">
              <p>{order.requirements}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTimelineTab = () => (
    <div className="tab-content">
      <div className="timeline-section">
        <h3>Order Timeline</h3>
        <div className="timeline">
          <div className="timeline-item completed">
            <div className="timeline-marker">
              <CheckCircle size={16} />
            </div>
            <div className="timeline-content">
              <h4>Order Placed</h4>
              <p>Customer placed the order and made advance payment</p>
              <span className="timeline-date">{formatDate(order.bookingDate)}</span>
            </div>
          </div>
          
          <div className={`timeline-item ${order.status !== 'pending' ? 'completed' : 'active'}`}>
            <div className="timeline-marker">
              {order.status !== 'pending' ? <CheckCircle size={16} /> : <Clock size={16} />}
            </div>
            <div className="timeline-content">
              <h4>Order Confirmed</h4>
              <p>Vendor accepted the order and confirmed availability</p>
              {order.status !== 'pending' && (
                <span className="timeline-date">{formatDate(order.bookingDate)}</span>
              )}
            </div>
          </div>
          
          <div className={`timeline-item ${order.status === 'in_progress' || order.status === 'completed' ? 'completed' : 'pending'}`}>
            <div className="timeline-marker">
              {order.status === 'in_progress' || order.status === 'completed' ? 
                <AlertTriangle size={16} /> : <Clock size={16} />}
            </div>
            <div className="timeline-content">
              <h4>Service in Progress</h4>
              <p>Vendor is preparing for the event</p>
              {(order.status === 'in_progress' || order.status === 'completed') && (
                <span className="timeline-date">In progress</span>
              )}
            </div>
          </div>
          
          <div className={`timeline-item ${order.status === 'completed' ? 'completed' : 'pending'}`}>
            <div className="timeline-marker">
              {order.status === 'completed' ? <CheckCircle size={16} /> : <Clock size={16} />}
            </div>
            <div className="timeline-content">
              <h4>Service Completed</h4>
              <p>Event successfully completed and final payment processed</p>
              {order.status === 'completed' && (
                <span className="timeline-date">Completed</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="tab-content">
      <div className="payment-section">
        <h3>Payment Information</h3>
        
        <div className="payment-summary">
          <div className="payment-status-card">
            <div className="payment-header">
              <div className={`payment-status ${order.paymentStatus}`}>
                {getPaymentStatusIcon(order.paymentStatus)}
                <span>{order.paymentStatus.replace('_', ' ').toUpperCase()}</span>
              </div>
            </div>
            
            <div className="payment-breakdown">
              <div className="payment-item">
                <span className="payment-label">Total Amount</span>
                <span className="payment-value total">{formatCurrency(order.amount)}</span>
              </div>
              
              <div className="payment-item">
                <span className="payment-label">Advance Paid</span>
                <span className="payment-value advance">{formatCurrency(order.advance)}</span>
              </div>
              
              <div className="payment-item">
                <span className="payment-label">Remaining Balance</span>
                <span className="payment-value remaining">
                  {formatCurrency(order.amount - order.advance)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-history">
          <h4>Payment History</h4>
          <div className="payment-transactions">
            <div className="transaction-item">
              <div className="transaction-icon success">
                <CreditCard size={16} />
              </div>
              <div className="transaction-details">
                <div className="transaction-info">
                  <span className="transaction-type">Advance Payment</span>
                  <span className="transaction-date">{formatDate(order.bookingDate)}</span>
                </div>
                <span className="transaction-amount success">
                  +{formatCurrency(order.advance)}
                </span>
              </div>
            </div>
            
            {order.paymentStatus === 'fully_paid' && (
              <div className="transaction-item">
                <div className="transaction-icon success">
                  <Wallet size={16} />
                </div>
                <div className="transaction-details">
                  <div className="transaction-info">
                    <span className="transaction-type">Final Payment</span>
                    <span className="transaction-date">Event completion</span>
                  </div>
                  <span className="transaction-amount success">
                    +{formatCurrency(order.amount - order.advance)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommunicationTab = () => (
    <div className="tab-content">
      <div className="communication-section">
        <h3>Messages & Communication</h3>
        
        <div className="message-thread">
          <div className="message-item customer">
            <div className="message-avatar customer">
              <User size={16} />
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">{order.customerName}</span>
                <span className="message-time">{formatDate(order.bookingDate)}</span>
              </div>
              <div className="message-text">
                Hi, I would like to book your {order.service.toLowerCase()} service for my event. 
                Please confirm availability and pricing details.
              </div>
            </div>
          </div>
          
          <div className="message-item vendor">
            <div className="message-avatar vendor">
              <Building size={16} />
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">{order.vendorName}</span>
                <span className="message-time">{formatDate(order.bookingDate)}</span>
              </div>
              <div className="message-text">
                Hello! Thank you for your interest. We have availability for your event date. 
                I'll send you a detailed quote shortly.
              </div>
            </div>
          </div>
          
          <div className="message-item system">
            <div className="message-avatar system">
              <Receipt size={16} />
            </div>
            <div className="message-content">
              <div className="message-header">
                <span className="message-sender">System</span>
                <span className="message-time">{formatDate(order.bookingDate)}</span>
              </div>
              <div className="message-text">
                Order confirmed! Advance payment of {formatCurrency(order.advance)} received.
              </div>
            </div>
          </div>
        </div>
        
        <div className="message-compose">
          <div className="compose-header">
            <h4>Send Message</h4>
          </div>
          <div className="compose-body">
            <textarea 
              placeholder="Type your message here..."
              rows={3}
            />
            <div className="compose-actions">
              <button className="send-btn">
                <MessageSquare size={16} />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="order-modal-overlay">
      <div className="order-details-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="order-header-info">
            <h2>Order Details</h2>
            <span className="order-id">{order.id}</span>
          </div>
          
          <div className="header-actions">
            <button className="header-btn download" title="Download Invoice">
              <Download size={16} />
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
          {activeTab === 'details' && renderDetailsTab()}
          {activeTab === 'timeline' && renderTimelineTab()}
          {activeTab === 'payment' && renderPaymentTab()}
          {activeTab === 'communication' && renderCommunicationTab()}
        </div>

        {/* Status Update Modal */}
        {showStatusUpdate && (
          <div className="status-update-overlay">
            <div className="status-update-modal">
              <div className="status-header">
                <h3>Update Order Status</h3>
                <button onClick={() => setShowStatusUpdate(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="status-body">
                <div className="current-status">
                  <span>Current Status: </span>
                  <div className={`status-badge ${order.status}`}>
                    {getStatusIcon(order.status)}
                    {order.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
                
                <div className="status-form">
                  <label>New Status:</label>
                  <select 
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="">Select new status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <label>Note (Optional):</label>
                  <textarea
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="status-footer">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowStatusUpdate(false)}
                >
                  Cancel
                </button>
                <button 
                  className="update-btn"
                  onClick={handleStatusUpdate}
                  disabled={!newStatus}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;