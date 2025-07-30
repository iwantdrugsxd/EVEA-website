import React, { useState } from 'react';
import { 
  Clock, CheckCircle, XCircle, DollarSign, UserPlus, 
  ShoppingBag, Star, AlertTriangle, RefreshCw, Eye
} from 'lucide-react';
import './ActivityFeed.css';

const ActivityFeed = () => {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const activities = [
    {
      id: 1,
      type: 'vendor_approved',
      title: 'Vendor Approved',
      message: 'Royal Wedding Photography application approved',
      user: 'Admin',
      timestamp: '2 minutes ago',
      icon: <CheckCircle size={20} />,
      color: 'success',
      details: {
        vendorName: 'Royal Wedding Photography',
        ownerName: 'Priya Sharma',
        category: 'Photography'
      }
    },
    {
      id: 2,
      type: 'order_placed',
      title: 'New Order',
      message: 'Wedding photography booking for ₹75,000',
      user: 'Ananya Patel',
      timestamp: '5 minutes ago',
      icon: <ShoppingBag size={20} />,
      color: 'info',
      details: {
        orderId: 'ORD-2024-1856',
        amount: 75000,
        service: 'Wedding Photography'
      }
    },
    {
      id: 3,
      type: 'payment_received',
      title: 'Payment Received',
      message: 'Payment of ₹45,000 processed successfully',
      user: 'System',
      timestamp: '12 minutes ago',
      icon: <DollarSign size={20} />,
      color: 'success',
      details: {
        orderId: 'ORD-2024-1855',
        amount: 45000,
        method: 'UPI'
      }
    },
    {
      id: 4,
      type: 'vendor_registered',
      title: 'New Registration',
      message: 'Elegant Catering Services submitted application',
      user: 'System',
      timestamp: '18 minutes ago',
      icon: <UserPlus size={20} />,
      color: 'primary',
      details: {
        vendorName: 'Elegant Catering Services',
        category: 'Catering',
        location: 'Delhi'
      }
    },
    {
      id: 5,
      type: 'review_submitted',
      title: 'New Review',
      message: '5-star review received for DJ Services',
      user: 'Rajesh Kumar',
      timestamp: '25 minutes ago',
      icon: <Star size={20} />,
      color: 'warning',
      details: {
        rating: 5,
        service: 'DJ Services',
        vendor: 'Party Beats Entertainment'
      }
    },
    {
      id: 6,
      type: 'payout_processed',
      title: 'Payout Processed',
      message: 'Vendor payout of ₹63,750 completed',
      user: 'System',
      timestamp: '1 hour ago',
      icon: <RefreshCw size={20} />,
      color: 'info',
      details: {
        vendorName: 'Royal Decorators',
        amount: 63750,
        commission: 11250
      }
    },
    {
      id: 7,
      type: 'vendor_rejected',
      title: 'Application Rejected',
      message: 'Incomplete documentation for verification',
      user: 'Admin',
      timestamp: '2 hours ago',
      icon: <XCircle size={20} />,
      color: 'error',
      details: {
        vendorName: 'Quick Events',
        reason: 'Incomplete business license'
      }
    },
    {
      id: 8,
      type: 'system_alert',
      title: 'System Alert',
      message: 'High server load detected - scaling initiated',
      user: 'System',
      timestamp: '3 hours ago',
      icon: <AlertTriangle size={20} />,
      color: 'warning',
      details: {
        severity: 'Medium',
        action: 'Auto-scaling triggered'
      }
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Activities', count: activities.length },
    { value: 'vendor_approved', label: 'Approvals', count: activities.filter(a => a.type === 'vendor_approved').length },
    { value: 'order_placed', label: 'Orders', count: activities.filter(a => a.type === 'order_placed').length },
    { value: 'payment_received', label: 'Payments', count: activities.filter(a => a.type === 'payment_received').length },
    { value: 'vendor_registered', label: 'Registrations', count: activities.filter(a => a.type === 'vendor_registered').length }
  ];

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const displayedActivities = showAll 
    ? filteredActivities 
    : filteredActivities.slice(0, 6);

  const getActivityIcon = (activity) => {
    return (
      <div className={`activity-icon ${activity.color}`}>
        {activity.icon}
      </div>
    );
  };

  const handleActivityClick = (activity) => {
    console.log('Activity clicked:', activity);
    // Navigate to relevant page or show details
  };

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h3>Recent Activity</h3>
        <div className="feed-controls">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="activity-list">
        {displayedActivities.length === 0 ? (
          <div className="empty-activity">
            <Clock size={48} />
            <p>No activities found</p>
            <span>Activities will appear here as they happen</span>
          </div>
        ) : (
          displayedActivities.map((activity, index) => (
            <div 
              key={activity.id}
              className="activity-item"
              onClick={() => handleActivityClick(activity)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {getActivityIcon(activity)}
              
              <div className="activity-content">
                <div className="activity-header">
                  <div className="activity-title">{activity.title}</div>
                  <div className="activity-time">{activity.timestamp}</div>
                </div>
                
                <div className="activity-message">{activity.message}</div>
                
                <div className="activity-meta">
                  <span className="activity-user">by {activity.user}</span>
                  {activity.details && (
                    <button className="view-details-btn">
                      <Eye size={12} />
                      Details
                    </button>
                  )}
                </div>

                {activity.details && (
                  <div className="activity-details">
                    {activity.type === 'vendor_approved' && (
                      <div className="details-grid">
                        <span>Vendor: {activity.details.vendorName}</span>
                        <span>Category: {activity.details.category}</span>
                      </div>
                    )}
                    
                    {activity.type === 'order_placed' && (
                      <div className="details-grid">
                        <span>Order: {activity.details.orderId}</span>
                        <span>Amount: ₹{activity.details.amount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    {activity.type === 'payment_received' && (
                      <div className="details-grid">
                        <span>Order: {activity.details.orderId}</span>
                        <span>Method: {activity.details.method}</span>
                      </div>
                    )}
                    
                    {activity.type === 'vendor_registered' && (
                      <div className="details-grid">
                        <span>Location: {activity.details.location}</span>
                        <span>Category: {activity.details.category}</span>
                      </div>
                    )}
                    
                    {activity.type === 'review_submitted' && (
                      <div className="details-grid">
                        <span>Rating: {'⭐'.repeat(activity.details.rating)}</span>
                        <span>Vendor: {activity.details.vendor}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {filteredActivities.length > 6 && (
        <div className="feed-footer">
          <button 
            className="load-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show ${filteredActivities.length - 6} More`}
          </button>
        </div>
      )}

      <div className="activity-summary">
        <div className="summary-stats">
          <div className="summary-stat">
            <span className="stat-value">{activities.filter(a => a.type === 'vendor_approved').length}</span>
            <span className="stat-label">Approved Today</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">{activities.filter(a => a.type === 'order_placed').length}</span>
            <span className="stat-label">New Orders</span>
          </div>
          <div className="summary-stat">
            <span className="stat-value">₹{activities.filter(a => a.type === 'payment_received').reduce((sum, a) => sum + (a.details?.amount || 0), 0).toLocaleString()}</span>
            <span className="stat-label">Payments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;