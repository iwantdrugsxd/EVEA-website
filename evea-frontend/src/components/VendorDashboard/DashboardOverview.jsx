import React from 'react';
import { TrendingUp, Users, IndianRupee, Star, Eye, Calendar,Package } from 'lucide-react';

const DashboardOverview = ({ vendor, dashboardStats }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `₹${dashboardStats?.totalRevenue?.toLocaleString() || '0'}`,
      change: '+12.5%',
      icon: <IndianRupee size={24} />,
      color: 'revenue'
    },
    {
      title: 'Total Bookings',
      value: dashboardStats?.totalBookings || '0',
      change: '+8.2%',
      icon: <Calendar size={24} />,
      color: 'bookings'
    },
    {
      title: 'Average Rating',
      value: dashboardStats?.averageRating?.toFixed(1) || '0.0',
      change: '+0.3',
      icon: <Star size={24} />,
      color: 'rating'
    },
    {
      title: 'Profile Views',
      value: '1,234',
      change: '+15.7%',
      icon: <Eye size={24} />,
      color: 'views'
    }
  ];

  return (
    <div className="dashboard-overview">
      <div className="overview-header">
        <h2>Welcome back, {vendor?.businessInfo?.ownerName}!</h2>
        <p>Here's how your business is performing</p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className={`metric-card ${metric.color}`}>
            <div className="metric-icon">
              {metric.icon}
            </div>
            <div className="metric-content">
              <h3>{metric.title}</h3>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-change positive">
                <TrendingUp size={16} />
                {metric.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button className="action-card">
            <Package size={24} />
            <span>Add New Service</span>
          </button>
          <button className="action-card">
            <Users size={24} />
            <span>View Customers</span>
          </button>
          <button className="action-card">
            <Star size={24} />
            <span>Manage Reviews</span>
          </button>
          <button className="action-card">
            <TrendingUp size={24} />
            <span>View Analytics</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">
              <Calendar size={16} />
            </div>
            <div className="activity-content">
              <p>New booking received for Wedding Photography</p>
              <span>2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Star size={16} />
            </div>
            <div className="activity-content">
              <p>New 5-star review from Priya Sharma</p>
              <span>1 day ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">
              <Eye size={16} />
            </div>
            <div className="activity-content">
              <p>Your profile was viewed 23 times</p>
              <span>2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;