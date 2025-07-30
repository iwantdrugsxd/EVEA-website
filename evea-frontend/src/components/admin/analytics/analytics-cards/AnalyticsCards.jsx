// src/components/admin/analytics/analytics-cards/AnalyticsCards.jsx
import React from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Users, 
  ShoppingBag, Star, Calendar, Target,
  ArrowUp, ArrowDown, Minus
} from 'lucide-react';
import './AnalyticsCards.css';

const AnalyticsCards = ({ data, selectedMetric, dateRange }) => {
  const getMetricData = () => {
    switch (selectedMetric) {
      case 'revenue':
        return {
          title: 'Revenue Analytics',
          cards: [
            {
              title: 'Total Revenue',
              value: `₹${data.overview?.totalRevenue?.toLocaleString() || '0'}`,
              change: data.overview?.growthRates?.revenue || 0,
              trend: 'up',
              icon: <DollarSign size={24} />,
              color: 'success',
              subtitle: 'Platform revenue'
            },
            {
              title: 'Avg Order Value',
              value: `₹${Math.floor((data.overview?.totalRevenue || 0) / (data.overview?.totalOrders || 1)).toLocaleString()}`,
              change: 5.2,
              trend: 'up',
              icon: <Target size={24} />,
              color: 'info',
              subtitle: 'Per order average'
            },
            {
              title: 'Commission Earned',
              value: `₹${Math.floor((data.overview?.totalRevenue || 0) * 0.15).toLocaleString()}`,
              change: 8.7,
              trend: 'up',
              icon: <TrendingUp size={24} />,
              color: 'warning',
              subtitle: '15% commission rate'
            },
            {
              title: 'Revenue Growth',
              value: `${data.overview?.growthRates?.revenue || 0}%`,
              change: 2.1,
              trend: 'up',
              icon: <ArrowUp size={24} />,
              color: 'primary',
              subtitle: 'Month over month'
            }
          ]
        };
      case 'orders':
        return {
          title: 'Order Analytics',
          cards: [
            {
              title: 'Total Orders',
              value: data.overview?.totalOrders?.toLocaleString() || '0',
              change: data.overview?.growthRates?.orders || 0,
              trend: 'up',
              icon: <ShoppingBag size={24} />,
              color: 'info',
              subtitle: 'All orders'
            },
            {
              title: 'Completed Orders',
              value: Math.floor((data.overview?.totalOrders || 0) * 0.85).toLocaleString(),
              change: 7.3,
              trend: 'up',
              icon: <Target size={24} />,
              color: 'success',
              subtitle: '85% completion rate'
            },
            {
              title: 'Pending Orders',
              value: Math.floor((data.overview?.totalOrders || 0) * 0.12).toLocaleString(),
              change: -2.1,
              trend: 'down',
              icon: <Calendar size={24} />,
              color: 'warning',
              subtitle: '12% pending'
            },
            {
              title: 'Cancelled Orders',
              value: Math.floor((data.overview?.totalOrders || 0) * 0.03).toLocaleString(),
              change: -15.4,
              trend: 'down',
              icon: <ArrowDown size={24} />,
              color: 'error',
              subtitle: '3% cancellation rate'
            }
          ]
        };
      case 'vendors':
        return {
          title: 'Vendor Analytics',
          cards: [
            {
              title: 'Active Vendors',
              value: data.overview?.activeVendors?.toString() || '0',
              change: data.overview?.growthRates?.vendors || 0,
              trend: 'up',
              icon: <Users size={24} />,
              color: 'info',
              subtitle: 'Currently active'
            },
            {
              title: 'New Vendors',
              value: Math.floor((data.overview?.activeVendors || 0) * 0.08).toString(),
              change: 23.5,
              trend: 'up',
              icon: <TrendingUp size={24} />,
              color: 'success',
              subtitle: 'This month'
            },
            {
              title: 'Avg Rating',
              value: data.overview?.customerSatisfaction?.toFixed(1) || '0.0',
              change: data.overview?.growthRates?.satisfaction || 0,
              trend: 'up',
              icon: <Star size={24} />,
              color: 'warning',
              subtitle: 'Vendor rating'
            },
            {
              title: 'Top Performers',
              value: Math.floor((data.overview?.activeVendors || 0) * 0.15).toString(),
              change: 12.1,
              trend: 'up',
              icon: <Target size={24} />,
              color: 'primary',
              subtitle: '15% top rated'
            }
          ]
        };
      case 'customers':
        return {
          title: 'Customer Analytics',
          cards: [
            {
              title: 'Total Customers',
              value: Math.floor((data.overview?.totalOrders || 0) * 0.7).toLocaleString(),
              change: 18.2,
              trend: 'up',
              icon: <Users size={24} />,
              color: 'info',
              subtitle: 'Registered users'
            },
            {
              title: 'Repeat Customers',
              value: Math.floor((data.overview?.totalOrders || 0) * 0.35).toLocaleString(),
              change: 14.7,
              trend: 'up',
              icon: <TrendingUp size={24} />,
              color: 'success',
              subtitle: '50% repeat rate'
            },
            {
              title: 'Customer Satisfaction',
              value: `${data.overview?.customerSatisfaction?.toFixed(1) || '0.0'}/5`,
              change: data.overview?.growthRates?.satisfaction || 0,
              trend: 'up',
              icon: <Star size={24} />,
              color: 'warning',
              subtitle: 'Average rating'
            },
            {
              title: 'Customer Lifetime Value',
              value: `₹${Math.floor((data.overview?.totalRevenue || 0) / Math.max((data.overview?.totalOrders || 1) * 0.7, 1)).toLocaleString()}`,
              change: 9.3,
              trend: 'up',
              icon: <DollarSign size={24} />,
              color: 'primary',
              subtitle: 'Average CLV'
            }
          ]
        };
      default:
        return { title: 'Analytics', cards: [] };
    }
  };

  const metricData = getMetricData();

  const getTrendIcon = (trend, change) => {
    if (change === 0) return <Minus size={16} />;
    return trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const getTrendClass = (trend, change) => {
    if (change === 0) return 'neutral';
    return trend === 'up' ? 'positive' : 'negative';
  };

  return (
    <div className="analytics-cards">
      <div className="section-header">
        <h2>{metricData.title}</h2>
        <div className="period-indicator">
          <span className="period-text">
            {dateRange === '7d' ? 'Last 7 days' : 
             dateRange === '30d' ? 'Last 30 days' : 
             'Last 90 days'}
          </span>
        </div>
      </div>
      
      <div className="cards-grid">
        {metricData.cards.map((card, index) => (
          <div key={index} className={`analytics-card ${card.color}`}>
            <div className="card-header">
              <div className="card-icon">
                {card.icon}
              </div>
              <div className={`trend-indicator ${getTrendClass(card.trend, card.change)}`}>
                {getTrendIcon(card.trend, card.change)}
                <span>{Math.abs(card.change)}%</span>
              </div>
            </div>
            
            <div className="card-content">
              <h3 className="card-title">{card.title}</h3>
              <div className="card-value">{card.value}</div>
              <p className="card-subtitle">{card.subtitle}</p>
            </div>
            
            <div className="card-footer">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min(Math.abs(card.change) * 5, 100)}%` }}
                />
              </div>
              <span className="progress-text">
                {card.trend === 'up' ? 'Growing' : card.trend === 'down' ? 'Declining' : 'Stable'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Additional Insights */}
      <div className="insights-summary">
        <h3>Key Insights</h3>
        <div className="insights-list">
          <div className="insight-item">
            <div className="insight-dot success"></div>
            <span>
              {selectedMetric === 'revenue' && 'Revenue growth is accelerating with strong vendor performance'}
              {selectedMetric === 'orders' && 'Order completion rate improved significantly this period'}
              {selectedMetric === 'vendors' && 'New vendor onboarding is exceeding targets'}
              {selectedMetric === 'customers' && 'Customer retention and satisfaction are at all-time highs'}
            </span>
          </div>
          <div className="insight-item">
            <div className="insight-dot warning"></div>
            <span>
              {selectedMetric === 'revenue' && 'Consider expanding high-performing vendor categories'}
              {selectedMetric === 'orders' && 'Monitor pending orders for potential bottlenecks'}
              {selectedMetric === 'vendors' && 'Focus on improving average vendor ratings'}
              {selectedMetric === 'customers' && 'Implement programs to increase customer lifetime value'}
            </span>
          </div>
          <div className="insight-item">
            <div className="insight-dot info"></div>
            <span>
              {selectedMetric === 'revenue' && 'Peak season approaching - prepare capacity scaling'}
              {selectedMetric === 'orders' && 'Seasonal patterns suggest demand will increase'}
              {selectedMetric === 'vendors' && 'Top performers could benefit from premium features'}
              {selectedMetric === 'customers' && 'Referral programs showing positive impact'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCards;