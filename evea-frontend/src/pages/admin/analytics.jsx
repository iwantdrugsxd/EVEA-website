// src/pages/admin/analytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Calendar, Download, Filter, RefreshCw,
  Eye, Star, Clock, Target
} from 'lucide-react';
import AdminLayout from '../../components/admin/layout/admin-layout/AdminLayout';
import AnalyticsCards from '../../components/admin/analytics/analytics-cards/AnalyticsCards';
import TrendCharts from '../../components/admin/analytics/trend-charts/TrendCharts';
import PerformanceMetrics from '../../components/admin/analytics/performance-metrics/PerformanceMetrics';
import './analytics.css';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});

  // Mock analytics data
  useEffect(() => {
    const mockData = {
      overview: {
        totalRevenue: 2456750,
        totalOrders: 1245,
        activeVendors: 156,
        customerSatisfaction: 4.7,
        growthRates: {
          revenue: 12.5,
          orders: 8.3,
          vendors: 15.2,
          satisfaction: 3.1
        }
      },
      trends: {
        revenue: generateTrendData('revenue', dateRange),
        orders: generateTrendData('orders', dateRange),
        vendors: generateTrendData('vendors', dateRange),
        customers: generateTrendData('customers', dateRange)
      },
      performance: {
        topVendors: [
          { name: 'Elite Catering Co.', revenue: 245000, orders: 45, rating: 4.9 },
          { name: 'Dream Photographers', revenue: 198000, orders: 62, rating: 4.8 },
          { name: 'Luxury Decorators', revenue: 187000, orders: 38, rating: 4.7 },
          { name: 'Perfect Venues Ltd.', revenue: 165000, orders: 29, rating: 4.6 },
          { name: 'Melodic Events', revenue: 142000, orders: 51, rating: 4.5 }
        ],
        topCategories: [
          { category: 'Catering', revenue: 856000, orders: 234, growth: 15.2 },
          { category: 'Photography', revenue: 642000, orders: 189, growth: 12.8 },
          { category: 'Venues', revenue: 534000, orders: 156, growth: 18.5 },
          { category: 'Decoration', revenue: 423000, orders: 145, growth: 9.7 },
          { category: 'Entertainment', revenue: 298000, orders: 98, growth: 22.1 }
        ],
        regionalData: [
          { region: 'Mumbai', revenue: 756000, orders: 312, vendors: 45 },
          { region: 'Delhi', revenue: 643000, orders: 287, vendors: 38 },
          { region: 'Bangalore', revenue: 534000, orders: 245, vendors: 32 },
          { region: 'Chennai', revenue: 423000, orders: 198, vendors: 28 },
          { region: 'Pune', revenue: 312000, orders: 156, vendors: 24 }
        ]
      }
    };

    setAnalyticsData(mockData);
  }, [dateRange]);

  function generateTrendData(type, range) {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000);
      const baseValue = type === 'revenue' ? 25000 : type === 'orders' ? 15 : type === 'vendors' ? 2 : 10;
      const randomFactor = 0.8 + Math.random() * 0.4;
      
      return {
        date: date.toLocaleDateString(),
        value: Math.floor(baseValue * randomFactor),
        label: date.getDate().toString()
      };
    });
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      // Refresh data logic here
    }, 2000);
  };

  const handleExport = () => {
    // Export logic here
    console.log('Exporting analytics data...');
  };

  const metricOptions = [
    { value: 'revenue', label: 'Revenue Analytics', icon: <DollarSign size={16} /> },
    { value: 'orders', label: 'Order Analytics', icon: <BarChart3 size={16} /> },
    { value: 'vendors', label: 'Vendor Analytics', icon: <Users size={16} /> },
    { value: 'customers', label: 'Customer Analytics', icon: <Target size={16} /> }
  ];

  return (
    <AdminLayout>
      <div className="analytics">
        {/* Page Header */}
        <div className="analytics-header">
          <div className="header-content">
            <h1>Analytics Dashboard</h1>
            <p>Comprehensive insights into platform performance and trends</p>
          </div>
          
          <div className="header-controls">
            <div className="metric-selector">
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="metric-select"
              >
                {metricOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="date-range-control">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="date-range-select"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <button 
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={16} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button className="export-btn" onClick={handleExport}>
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-card revenue">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <div className="stat-value">₹{analyticsData.overview?.totalRevenue?.toLocaleString()}</div>
              <div className="stat-change positive">
                <TrendingUp size={14} />
                +{analyticsData.overview?.growthRates?.revenue}%
              </div>
            </div>
          </div>
          
          <div className="stat-card orders">
            <div className="stat-icon">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <div className="stat-value">{analyticsData.overview?.totalOrders?.toLocaleString()}</div>
              <div className="stat-change positive">
                <TrendingUp size={14} />
                +{analyticsData.overview?.growthRates?.orders}%
              </div>
            </div>
          </div>
          
          <div className="stat-card vendors">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>Active Vendors</h3>
              <div className="stat-value">{analyticsData.overview?.activeVendors}</div>
              <div className="stat-change positive">
                <TrendingUp size={14} />
                +{analyticsData.overview?.growthRates?.vendors}%
              </div>
            </div>
          </div>
          
          <div className="stat-card satisfaction">
            <div className="stat-icon">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <h3>Satisfaction</h3>
              <div className="stat-value">{analyticsData.overview?.customerSatisfaction}/5</div>
              <div className="stat-change positive">
                <TrendingUp size={14} />
                +{analyticsData.overview?.growthRates?.satisfaction}%
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="analytics-section">
          <AnalyticsCards 
            data={analyticsData}
            selectedMetric={selectedMetric}
            dateRange={dateRange}
          />
        </div>

        {/* Trend Charts */}
        <div className="charts-section">
          <TrendCharts 
            data={analyticsData.trends}
            selectedMetric={selectedMetric}
            dateRange={dateRange}
          />
        </div>

        {/* Performance Metrics */}
        <div className="performance-section">
          <PerformanceMetrics 
            data={analyticsData.performance}
            dateRange={dateRange}
          />
        </div>

        {/* Insights Summary */}
        <div className="insights-section">
          <div className="insights-card">
            <h2>Key Insights</h2>
            <div className="insights-grid">
              <div className="insight-item">
                <div className="insight-icon success">
                  <TrendingUp size={20} />
                </div>
                <div className="insight-content">
                  <h4>Revenue Growth</h4>
                  <p>Platform revenue has increased by 12.5% compared to last month, driven primarily by catering and venue bookings.</p>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon warning">
                  <Clock size={20} />
                </div>
                <div className="insight-content">
                  <h4>Peak Season Approaching</h4>
                  <p>Wedding season is approaching. Consider expanding vendor capacity and optimizing pricing strategies.</p>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon info">
                  <Eye size={20} />
                </div>
                <div className="insight-content">
                  <h4>Vendor Performance</h4>
                  <p>Top 10 vendors contribute to 60% of total revenue. Focus on vendor retention and quality improvement.</p>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-icon success">
                  <Target size={20} />
                </div>
                <div className="insight-content">
                  <h4>Customer Satisfaction</h4>
                  <p>Customer satisfaction has improved to 4.7/5, indicating strong service quality across the platform.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;