// src/components/admin/analytics/performance-metrics/PerformanceMetrics.jsx
import React, { useState } from 'react';
import { 
  Star, TrendingUp, TrendingDown, MapPin, 
  Award, Target, Users, DollarSign,
  ChevronRight, Eye, MoreHorizontal
} from 'lucide-react';
import './PerformanceMetrics.css';

const PerformanceMetrics = ({ data, dateRange }) => {
  const [activeTab, setActiveTab] = useState('vendors');

  if (!data) {
    return (
      <div className="performance-metrics">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading performance data...</p>
        </div>
      </div>
    );
  }

  const { topVendors, topCategories, regionalData } = data;

  const tabs = [
    { id: 'vendors', name: 'Top Vendors', icon: <Users size={16} /> },
    { id: 'categories', name: 'Categories', icon: <Target size={16} /> },
    { id: 'regions', name: 'Regions', icon: <MapPin size={16} /> }
  ];

  const renderVendorsTab = () => (
    <div className="metrics-content">
      <div className="section-header">
        <h3>Top Performing Vendors</h3>
        <span className="section-subtitle">Based on revenue and customer satisfaction</span>
      </div>
      
      <div className="vendors-grid">
        {topVendors?.map((vendor, index) => (
          <div key={index} className="vendor-card">
            <div className="vendor-rank">
              <div className={`rank-badge rank-${index + 1}`}>
                #{index + 1}
              </div>
              {index < 3 && (
                <div className="medal">
                  <Award size={16} />
                </div>
              )}
            </div>
            
            <div className="vendor-info">
              <h4>{vendor.name}</h4>
              <div className="vendor-metrics">
                <div className="metric">
                  <DollarSign size={14} />
                  <span>₹{vendor.revenue?.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <Target size={14} />
                  <span>{vendor.orders} orders</span>
                </div>
                <div className="metric rating">
                  <Star size={14} />
                  <span>{vendor.rating}/5</span>
                </div>
              </div>
            </div>
            
            <div className="vendor-performance">
              <div className="performance-bar">
                <div 
                  className="performance-fill"
                  style={{ width: `${(vendor.rating / 5) * 100}%` }}
                />
              </div>
              <span className="performance-score">{vendor.rating}/5</span>
            </div>
            
            <button className="vendor-details-btn">
              <Eye size={14} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="performance-insights">
        <h4>Vendor Insights</h4>
        <div className="insights-list">
          <div className="insight">
            <TrendingUp size={16} className="insight-icon success" />
            <span>Top 5 vendors contribute to 65% of total platform revenue</span>
          </div>
          <div className="insight">
            <Star size={16} className="insight-icon warning" />
            <span>Average vendor rating has improved by 0.3 points this month</span>
          </div>
          <div className="insight">
            <Target size={16} className="insight-icon info" />
            <span>Elite Catering Co. leads with highest revenue per order</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoriesTab = () => (
    <div className="metrics-content">
      <div className="section-header">
        <h3>Category Performance</h3>
        <span className="section-subtitle">Revenue and growth by service category</span>
      </div>
      
      <div className="categories-list">
        {topCategories?.map((category, index) => (
          <div key={index} className="category-item">
            <div className="category-rank">
              <span className="rank-number">{index + 1}</span>
            </div>
            
            <div className="category-info">
              <h4>{category.category}</h4>
              <div className="category-stats">
                <span className="revenue">₹{category.revenue?.toLocaleString()}</span>
                <span className="orders">{category.orders} orders</span>
              </div>
            </div>
            
            <div className="category-growth">
              <div className={`growth-indicator ${category.growth > 0 ? 'positive' : 'negative'}`}>
                {category.growth > 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                <span>{Math.abs(category.growth)}%</span>
              </div>
            </div>
            
            <div className="category-share">
              <div className="share-chart">
                <div 
                  className="share-fill"
                  style={{ 
                    width: `${(category.revenue / topCategories[0].revenue) * 100}%`,
                    backgroundColor: getCategoryColor(index)
                  }}
                />
              </div>
              <span className="share-percentage">
                {((category.revenue / topCategories.reduce((sum, cat) => sum + cat.revenue, 0)) * 100).toFixed(1)}%
              </span>
            </div>
            
            <button className="category-details-btn">
              <ChevronRight size={16} />
            </button>
          </div>
        ))}
      </div>
      
      <div className="category-distribution">
        <h4>Revenue Distribution</h4>
        <div className="distribution-chart">
          {topCategories?.map((category, index) => {
            const percentage = (category.revenue / topCategories.reduce((sum, cat) => sum + cat.revenue, 0)) * 100;
            return (
              <div 
                key={index}
                className="distribution-segment"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: getCategoryColor(index)
                }}
                title={`${category.category}: ${percentage.toFixed(1)}%`}
              />
            );
          })}
        </div>
        <div className="distribution-legend">
          {topCategories?.map((category, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: getCategoryColor(index) }}
              />
              <span>{category.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRegionsTab = () => (
    <div className="metrics-content">
      <div className="section-header">
        <h3>Regional Performance</h3>
        <span className="section-subtitle">Market penetration and revenue by region</span>
      </div>
      
      <div className="regions-grid">
        {regionalData?.map((region, index) => (
          <div key={index} className="region-card">
            <div className="region-header">
              <h4>{region.region}</h4>
              <div className="region-rank">
                <span>#{index + 1}</span>
              </div>
            </div>
            
            <div className="region-metrics">
              <div className="metric-item">
                <div className="metric-icon revenue">
                  <DollarSign size={16} />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Revenue</span>
                  <span className="metric-value">₹{region.revenue?.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-icon orders">
                  <Target size={16} />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Orders</span>
                  <span className="metric-value">{region.orders}</span>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-icon vendors">
                  <Users size={16} />
                </div>
                <div className="metric-details">
                  <span className="metric-label">Vendors</span>
                  <span className="metric-value">{region.vendors}</span>
                </div>
              </div>
            </div>
            
            <div className="region-performance">
              <div className="performance-indicator">
                <span className="indicator-label">Market Share</span>
                <div className="indicator-bar">
                  <div 
                    className="indicator-fill"
                    style={{ 
                      width: `${(region.revenue / regionalData[0].revenue) * 100}%`
                    }}
                  />
                </div>
                <span className="indicator-value">
                  {((region.revenue / regionalData.reduce((sum, r) => sum + r.revenue, 0)) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="regional-insights">
        <h4>Regional Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon-wrapper success">
              <TrendingUp size={20} />
            </div>
            <div className="insight-content">
              <h5>Mumbai Leading</h5>
              <p>Mumbai accounts for 30% of total platform revenue with strong vendor density</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon-wrapper info">
              <MapPin size={20} />
            </div>
            <div className="insight-content">
              <h5>Expansion Opportunity</h5>
              <p>Southern regions show potential for vendor expansion and market growth</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon-wrapper warning">
              <Target size={20} />
            </div>
            <div className="insight-content">
              <h5>Order Density</h5>
              <p>Delhi has the highest orders-to-vendors ratio, indicating strong demand</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getCategoryColor = (index) => {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];
    return colors[index % colors.length];
  };

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <h2>Performance Metrics</h2>
        <div className="metrics-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="metrics-body">
        {activeTab === 'vendors' && renderVendorsTab()}
        {activeTab === 'categories' && renderCategoriesTab()}
        {activeTab === 'regions' && renderRegionsTab()}
      </div>
    </div>
  );
};

export default PerformanceMetrics;