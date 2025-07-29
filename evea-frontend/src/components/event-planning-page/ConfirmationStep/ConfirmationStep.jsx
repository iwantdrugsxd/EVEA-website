// src/pages/EventPlanningPage/components/ConfirmationStep/ConfirmationStep.jsx
import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Download, 
  Share2, 
  Bell, 
  Star,
  Phone,
  Mail,
  MessageCircle,
  Gift,
  ArrowRight,
  Home,
  Copy,
  Check
} from 'lucide-react';
import './ConfirmationStep.css';

const ConfirmationStep = ({ eventData, goToStep }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [copiedBookingId, setCopiedBookingId] = useState(false);
  const [selectedTab, setSelectedTab] = useState('timeline');

  const bookingDetails = {
    bookingId: 'EVA2024-001',
    transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    paymentMethod: 'Credit Card',
    totalAmount: 230600,
    bookingDate: new Date().toLocaleDateString(),
    eventDate: eventData.eventDetails.date,
    status: 'Confirmed'
  };

  const mockVendors = [
    {
      id: 1,
      name: 'Golden Moments Photography',
      category: 'Photography',
      contact: '+91 98765 43210',
      email: 'contact@goldenmoments.com',
      coordinator: 'Priya Sharma',
      status: 'Confirmed'
    },
    {
      id: 2,
      name: 'Royal Feast Catering',
      category: 'Catering',
      contact: '+91 98765 43211',
      email: 'bookings@royalfeast.com',
      coordinator: 'Rajesh Kumar',
      status: 'Confirmed'
    },
    {
      id: 3,
      name: 'Dreamy Decorations',
      category: 'Decoration',
      contact: '+91 98765 43212',
      email: 'hello@dreamydeco.com',
      coordinator: 'Anita Patel',
      status: 'Pending Confirmation'
    }
  ];

  const nextSteps = [
    {
      id: 1,
      title: 'Confirmation emails sent',
      description: 'You and all vendors have received confirmation emails',
      status: 'completed',
      time: 'Just now'
    },
    {
      id: 2,
      title: 'Vendor coordination begins',
      description: 'Our team will coordinate with vendors for detailed planning',
      status: 'in-progress',
      time: 'Within 24 hours'
    },
    {
      id: 3,
      title: 'Initial planning call',
      description: 'Schedule a call with your event coordinator',
      status: 'upcoming',
      time: 'Next 2-3 days'
    },
    {
      id: 4,
      title: 'Final timeline confirmation',
      description: 'Receive detailed event timeline and final arrangements',
      status: 'upcoming',
      time: '1 week before event'
    },
    {
      id: 5,
      title: 'Day-of coordination',
      description: 'On-ground support to ensure smooth execution',
      status: 'upcoming',
      time: 'Event day'
    }
  ];

  const quickActions = [
    {
      icon: <Download className="w-5 h-5" />,
      title: 'Download Invoice',
      description: 'Get your detailed invoice and receipts',
      action: () => console.log('Download invoice'),
      color: 'blue'
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: 'Share Event Details',
      description: 'Share event information with family and friends',
      action: () => console.log('Share event'),
      color: 'green'
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: 'Set Reminders',
      description: 'Get notified about important milestones',
      action: () => console.log('Set reminders'),
      color: 'purple'
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: 'Join Support Group',
      description: 'Connect with our planning community',
      action: () => console.log('Join group'),
      color: 'pink'
    }
  ];

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingDetails.bookingId);
    setCopiedBookingId(true);
    setTimeout(() => setCopiedBookingId(false), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVendorStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-green-600 bg-green-100';
      case 'Pending Confirmation': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="confirmation-step">
      <div className="confirmation-background">
        <div className="celebration-elements">
          <div className="confetti-piece confetti-1"></div>
          <div className="confetti-piece confetti-2"></div>
          <div className="confetti-piece confetti-3"></div>
          <div className="confetti-piece confetti-4"></div>
          <div className="confetti-piece confetti-5"></div>
          <div className="confetti-piece confetti-6"></div>
        </div>
        <div className="success-glow"></div>
      </div>

      <div className="confirmation-container">
        {/* Success Header */}
        <div className={`success-header ${isAnimated ? 'animate' : ''}`}>
          <div className="success-icon">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="success-title">
            Booking <span className="gradient-text">Confirmed!</span>
          </h1>
          <p className="success-subtitle">
            Congratulations! Your event has been successfully booked. We're excited to help you create an unforgettable experience.
          </p>
          
          <div className="booking-id-section">
            <div className="booking-id-card">
              <span className="booking-id-label">Booking ID</span>
              <div className="booking-id-value">
                <span>{bookingDetails.bookingId}</span>
                <button 
                  onClick={copyBookingId}
                  className="copy-button"
                  title="Copy booking ID"
                >
                  {copiedBookingId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="confirmation-content">
          {/* Event Summary Card */}
          <div className="content-section">
            <div className="event-summary-card">
              <div className="card-header">
                <h2>Event Summary</h2>
                <div className="status-badge confirmed">
                  <CheckCircle className="w-4 h-4" />
                  Confirmed
                </div>
              </div>
              
              <div className="event-details-grid">
                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Event</div>
                    <div className="detail-value">{eventData.eventDetails.name || 'My Amazing Event'}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Date & Time</div>
                    <div className="detail-value">
                      {eventData.eventDetails.date} at {eventData.eventDetails.time}
                    </div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Location</div>
                    <div className="detail-value">{eventData.eventDetails.location || 'Mumbai'}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Guests</div>
                    <div className="detail-value">{eventData.eventDetails.guests || '50-100'} guests</div>
                  </div>
                </div>
              </div>

              <div className="payment-summary">
                <div className="payment-item">
                  <span>Total Amount Paid</span>
                  <span className="amount">₹{bookingDetails.totalAmount.toLocaleString()}</span>
                </div>
                <div className="payment-item">
                  <span>Payment Method</span>
                  <span>{bookingDetails.paymentMethod}</span>
                </div>
                <div className="payment-item">
                  <span>Transaction ID</span>
                  <span className="transaction-id">{bookingDetails.transactionId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="content-section">
            <div className="tabs-container">
              <div className="tabs-header">
                <button 
                  onClick={() => setSelectedTab('timeline')}
                  className={`tab-button ${selectedTab === 'timeline' ? 'active' : ''}`}
                >
                  <Calendar className="w-4 h-4" />
                  Timeline
                </button>
                <button 
                  onClick={() => setSelectedTab('vendors')}
                  className={`tab-button ${selectedTab === 'vendors' ? 'active' : ''}`}
                >
                  <Users className="w-4 h-4" />
                  Vendors
                </button>
                <button 
                  onClick={() => setSelectedTab('actions')}
                  className={`tab-button ${selectedTab === 'actions' ? 'active' : ''}`}
                >
                  <Star className="w-4 h-4" />
                  Quick Actions
                </button>
              </div>

              <div className="tabs-content">
                {/* Timeline Tab */}
                {selectedTab === 'timeline' && (
                  <div className="tab-panel">
                    <h3>What Happens Next</h3>
                    <div className="timeline">
                      {nextSteps.map((step, index) => (
                        <div key={step.id} className={`timeline-item ${step.status}`}>
                          <div className="timeline-indicator">
                            {step.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <div className="timeline-dot">{index + 1}</div>
                            )}
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <h4>{step.title}</h4>
                              <span className={`status-badge ${getStatusColor(step.status)}`}>
                                {step.status.replace('-', ' ')}
                              </span>
                            </div>
                            <p>{step.description}</p>
                            <div className="timeline-time">{step.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vendors Tab */}
                {selectedTab === 'vendors' && (
                  <div className="tab-panel">
                    <h3>Your Vendor Team</h3>
                    <div className="vendors-list">
                      {mockVendors.map((vendor) => (
                        <div key={vendor.id} className="vendor-card">
                          <div className="vendor-header">
                            <div className="vendor-info">
                              <h4>{vendor.name}</h4>
                              <div className="vendor-category">{vendor.category}</div>
                            </div>
                            <div className={`vendor-status ${getVendorStatusColor(vendor.status)}`}>
                              {vendor.status}
                            </div>
                          </div>
                          <div className="vendor-contact">
                            <div className="contact-item">
                              <Phone className="w-4 h-4" />
                              <span>{vendor.contact}</span>
                            </div>
                            <div className="contact-item">
                              <Mail className="w-4 h-4" />
                              <span>{vendor.email}</span>
                            </div>
                            <div className="contact-item">
                              <Users className="w-4 h-4" />
                              <span>Coordinator: {vendor.coordinator}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions Tab */}
                {selectedTab === 'actions' && (
                  <div className="tab-panel">
                    <h3>Quick Actions</h3>
                    <div className="actions-grid">
                      {quickActions.map((action, index) => (
                        <div 
                          key={index} 
                          className={`action-card ${action.color}`}
                          onClick={action.action}
                        >
                          <div className="action-icon">
                            {action.icon}
                          </div>
                          <div className="action-content">
                            <h4>{action.title}</h4>
                            <p>{action.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 action-arrow" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="content-section">
            <div className="support-section">
              <div className="support-header">
                <h3>Need Help?</h3>
                <p>Our support team is here to assist you every step of the way</p>
              </div>
              
              <div className="support-options">
                <div className="support-option">
                  <div className="support-icon">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div className="support-content">
                    <h4>Call Support</h4>
                    <p>+91 1800-EVEA-HELP</p>
                    <span className="support-time">24/7 Available</span>
                  </div>
                </div>
                
                <div className="support-option">
                  <div className="support-icon">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="support-content">
                    <h4>Live Chat</h4>
                    <p>Instant support via chat</p>
                    <span className="support-time">Response in 2 min</span>
                  </div>
                </div>
                
                <div className="support-option">
                  <div className="support-icon">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="support-content">
                    <h4>Email Support</h4>
                    <p>support@evea.com</p>
                    <span className="support-time">Response in 4 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="content-section">
            <div className="final-actions">
              <button 
                onClick={() => goToStep(0)}
                className="btn-secondary"
              >
                <Home className="w-4 h-4" />
                Plan Another Event
              </button>
              
              <button className="btn-primary">
                <Download className="w-4 h-4" />
                Download Confirmation
              </button>
            </div>
          </div>
        </div>

        {/* Floating Thank You */}
        <div className={`thank-you-float ${isAnimated ? 'animate' : ''}`}>
          <Gift className="w-8 h-8" />
          <div className="thank-you-content">
            <h4>Thank you for choosing EVEA!</h4>
            <p>Your trust means everything to us</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;