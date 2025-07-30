import React, { useState } from 'react';
import { TrendingUp, Calendar, Download, MoreVertical } from 'lucide-react';
import './RevenueChart.css';

const RevenueChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [showOptions, setShowOptions] = useState(false);

  // Sample revenue data for the chart
  const revenueData = {
    '7days': [
      { day: 'Mon', revenue: 45000, orders: 12 },
      { day: 'Tue', revenue: 52000, orders: 15 },
      { day: 'Wed', revenue: 48000, orders: 13 },
      { day: 'Thu', revenue: 61000, orders: 18 },
      { day: 'Fri', revenue: 55000, orders: 16 },
      { day: 'Sat', revenue: 73000, orders: 22 },
      { day: 'Sun', revenue: 68000, orders: 20 }
    ],
    '30days': [
      { day: 'Week 1', revenue: 320000, orders: 89 },
      { day: 'Week 2', revenue: 380000, orders: 105 },
      { day: 'Week 3', revenue: 425000, orders: 118 },
      { day: 'Week 4', revenue: 390000, orders: 112 }
    ],
    '3months': [
      { day: 'Month 1', revenue: 1200000, orders: 345 },
      { day: 'Month 2', revenue: 1450000, orders: 398 },
      { day: 'Month 3', revenue: 1680000, orders: 456 }
    ]
  };

  const currentData = revenueData[selectedPeriod];
  const maxRevenue = Math.max(...currentData.map(d => d.revenue));
  const totalRevenue = currentData.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = currentData.reduce((sum, d) => sum + d.orders, 0);

  const periods = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '3months', label: 'Last 3 months' }
  ];

  const handleExport = () => {
    console.log('Exporting revenue data...');
    // Implementation for exporting data
  };

  return (
    <div className="revenue-chart">
      <div className="chart-header">
        <div className="chart-title-section">
          <h3>Revenue Analytics</h3>
          <div className="chart-summary">
            <div className="summary-item">
              <span className="summary-value">₹{totalRevenue.toLocaleString()}</span>
              <span className="summary-label">Total Revenue</span>
            </div>
            <div className="summary-item">
              <span className="summary-value">{totalOrders}</span>
              <span className="summary-label">Total Orders</span>
            </div>
            <div className="trend-indicator positive">
              <TrendingUp size={16} />
              <span>+12.5%</span>
            </div>
          </div>
        </div>
        
        <div className="chart-controls">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="period-select"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
          
          <div className="chart-actions">
            <button className="action-btn" onClick={handleExport}>
              <Download size={16} />
            </button>
            <button 
              className="action-btn"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical size={16} />
            </button>
            
            {showOptions && (
              <div className="options-dropdown">
                <button onClick={() => console.log('View details')}>View Details</button>
                <button onClick={() => console.log('Compare periods')}>Compare Periods</button>
                <button onClick={handleExport}>Export Data</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-grid">
          {/* Y-axis labels */}
          <div className="y-axis">
            <span className="y-label">₹{Math.round(maxRevenue / 1000)}K</span>
            <span className="y-label">₹{Math.round(maxRevenue * 0.75 / 1000)}K</span>
            <span className="y-label">₹{Math.round(maxRevenue * 0.5 / 1000)}K</span>
            <span className="y-label">₹{Math.round(maxRevenue * 0.25 / 1000)}K</span>
            <span className="y-label">₹0</span>
          </div>
          
          {/* Chart bars */}
          <div className="chart-bars">
            {currentData.map((item, index) => (
              <div key={index} className="bar-container">
                <div 
                  className="revenue-bar"
                  style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  title={`${item.day}: ₹${item.revenue.toLocaleString()} (${item.orders} orders)`}
                >
                  <div className="bar-tooltip">
                    <div className="tooltip-revenue">₹{item.revenue.toLocaleString()}</div>
                    <div className="tooltip-orders">{item.orders} orders</div>
                  </div>
                </div>
                <div className="bar-label">{item.day}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color revenue"></div>
            <span>Revenue</span>
          </div>
          <div className="legend-item">
            <div className="legend-color orders"></div>
            <span>Orders</span>
          </div>
        </div>
      </div>

      <div className="chart-insights">
        <div className="insight-item">
          <div className="insight-icon trend-up">
            <TrendingUp size={20} />
          </div>
          <div className="insight-content">
            <div className="insight-title">Revenue Growth</div>
            <div className="insight-description">
              {selectedPeriod === '7days' && 'Weekend sales showing 25% higher conversion'}
              {selectedPeriod === '30days' && 'Steady month-over-month growth of 12.5%'}
              {selectedPeriod === '3months' && 'Quarterly revenue increased by 40%'}
            </div>
          </div>
        </div>
        
        <div className="insight-item">
          <div className="insight-icon calendar">
            <Calendar size={20} />
          </div>
          <div className="insight-content">
            <div className="insight-title">Peak Performance</div>
            <div className="insight-description">
              {selectedPeriod === '7days' && 'Saturday generated highest revenue (₹73K)'}
              {selectedPeriod === '30days' && 'Week 3 was the most profitable period'}
              {selectedPeriod === '3months' && 'Month 3 showed exceptional performance'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;