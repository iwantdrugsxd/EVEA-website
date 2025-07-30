// src/components/admin/financial/revenue-summary/RevenueSummary.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent,
  Calendar, Download, BarChart3, PieChart
} from 'lucide-react';
import './RevenueSummary.css';

const RevenueSummary = ({ data, dateRange }) => {
  const [chartType, setChartType] = useState('revenue');

  // Mock chart data based on date range
  const getChartData = () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      revenue: Math.floor(Math.random() * 50000) + 20000,
      commission: Math.floor(Math.random() * 5000) + 2000,
      transactions: Math.floor(Math.random() * 50) + 10
    }));
  };

  const chartData = getChartData();
  const totalRevenue = chartData.reduce((sum, day) => sum + day.revenue, 0);
  const totalCommission = chartData.reduce((sum, day) => sum + day.commission, 0);
  const avgDailyRevenue = totalRevenue / chartData.length;

  const revenueMetrics = [
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString()}`,
      growth: 12.5,
      trend: 'up',
      color: 'success'
    },
    {
      label: 'Platform Commission',
      value: `₹${totalCommission.toLocaleString()}`,
      growth: 8.2,
      trend: 'up',
      color: 'info'
    },
    {
      label: 'Daily Average',
      value: `₹${Math.floor(avgDailyRevenue).toLocaleString()}`,
      growth: 5.7,
      trend: 'up',
      color: 'warning'
    },
    {
      label: 'Commission Rate',
      value: `${((totalCommission / totalRevenue) * 100).toFixed(1)}%`,
      growth: -0.3,
      trend: 'down',
      color: 'error'
    }
  ];

  const topVendors = [
    { name: 'Elite Catering Co.', revenue: 125000, commission: 12500, orders: 45 },
    { name: 'Luxury Decorators', revenue: 98000, commission: 9800, orders: 38 },
    { name: 'Dream Photographers', revenue: 87500, commission: 8750, orders: 52 },
    { name: 'Perfect Venues Ltd.', revenue: 76000, commission: 7600, orders: 29 },
    { name: 'Melodic Events', revenue: 65000, commission: 6500, orders: 34 }
  ];

  const revenueByCategory = [
    { category: 'Catering', amount: 856000, percentage: 34.8, color: '#8b5cf6' },
    { category: 'Venues', amount: 624000, percentage: 25.4, color: '#06b6d4' },
    { category: 'Photography', amount: 487000, percentage: 19.8, color: '#f59e0b' },
    { category: 'Decoration', amount: 368000, percentage: 15.0, color: '#10b981' },
    { category: 'Entertainment', amount: 122000, percentage: 5.0, color: '#ef4444' }
  ];

  return (
    <div className="revenue-summary">
      {/* Summary Header */}
      <div className="summary-header">
        <h2>Revenue Overview</h2>
        <div className="summary-actions">
          <select 
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="chart-type-select"
          >
            <option value="revenue">Revenue Trend</option>
            <option value="commission">Commission Trend</option>
            <option value="transactions">Transaction Volume</option>
          </select>
          <button className="export-chart-btn">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="revenue-metrics">
        {revenueMetrics.map((metric, index) => (
          <div key={index} className={`metric-card ${metric.color}`}>
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              <div className={`metric-trend ${metric.trend}`}>
                {metric.trend === 'up' ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {Math.abs(metric.growth)}%
              </div>
            </div>
            <div className="metric-value">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="revenue-chart">
          <h3>
            {chartType === 'revenue' && 'Revenue Trend'}
            {chartType === 'commission' && 'Commission Trend'}
            {chartType === 'transactions' && 'Transaction Volume'}
          </h3>
          
          {/* Simple bar chart visualization */}
          <div className="chart-container">
            <div className="chart-bars">
              {chartData.slice(-14).map((day, index) => {
                const value = chartType === 'revenue' ? day.revenue : 
                            chartType === 'commission' ? day.commission : day.transactions;
                const maxValue = Math.max(...chartData.map(d => 
                  chartType === 'revenue' ? d.revenue : 
                  chartType === 'commission' ? d.commission : d.transactions
                ));
                const height = (value / maxValue) * 100;
                
                return (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar"
                      style={{ height: `${height}%` }}
                      title={`${day.date}: ${value.toLocaleString()}`}
                    />
                    <span className="chart-label">
                      {new Date(day.date).getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="category-breakdown">
          <h3>Revenue by Category</h3>
          <div className="category-list">
            {revenueByCategory.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <div 
                    className="category-color"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="category-name">{category.category}</span>
                </div>
                <div className="category-stats">
                  <span className="category-amount">
                    ₹{category.amount.toLocaleString()}
                  </span>
                  <span className="category-percentage">
                    {category.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Vendors */}
      <div className="top-vendors">
        <h3>Top Performing Vendors</h3>
        <div className="vendors-table">
          <div className="table-header">
            <span>Vendor</span>
            <span>Revenue</span>
            <span>Commission</span>
            <span>Orders</span>
          </div>
          {topVendors.map((vendor, index) => (
            <div key={index} className="vendor-row">
              <div className="vendor-name">
                <div className="vendor-rank">#{index + 1}</div>
                {vendor.name}
              </div>
              <div className="vendor-revenue">
                ₹{vendor.revenue.toLocaleString()}
              </div>
              <div className="vendor-commission">
                ₹{vendor.commission.toLocaleString()}
              </div>
              <div className="vendor-orders">
                {vendor.orders}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueSummary;