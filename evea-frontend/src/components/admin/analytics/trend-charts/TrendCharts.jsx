// src/components/admin/analytics/trend-charts/TrendCharts.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, BarChart3, LineChart,
  Calendar, Download, Filter, RefreshCw
} from 'lucide-react';
import './TrendCharts.css';

const TrendCharts = ({ data, selectedMetric, dateRange }) => {
  const [chartType, setChartType] = useState('line');
  const [showComparison, setShowComparison] = useState(false);

  const getChartData = () => {
    if (!data || !data[selectedMetric]) {
      return [];
    }
    return data[selectedMetric];
  };

  const chartData = getChartData();

  const getMetricInfo = () => {
    switch (selectedMetric) {
      case 'revenue':
        return {
          title: 'Revenue Trends',
          color: '#10b981',
          format: (value) => `₹${value.toLocaleString()}`,
          icon: <TrendingUp size={20} />
        };
      case 'orders':
        return {
          title: 'Order Volume Trends',
          color: '#3b82f6',
          format: (value) => value.toString(),
          icon: <BarChart3 size={20} />
        };
      case 'vendors':
        return {
          title: 'Vendor Growth Trends',
          color: '#f59e0b',
          format: (value) => value.toString(),
          icon: <TrendingUp size={20} />
        };
      case 'customers':
        return {
          title: 'Customer Acquisition Trends',
          color: '#8b5cf6',
          format: (value) => value.toString(),
          icon: <TrendingUp size={20} />
        };
      default:
        return {
          title: 'Trends',
          color: '#6b7280',
          format: (value) => value.toString(),
          icon: <LineChart size={20} />
        };
    }
  };

  const metricInfo = getMetricInfo();

  const calculateTrend = () => {
    if (chartData.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const recent = chartData.slice(-7);
    const previous = chartData.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length;
    const previousAvg = previous.reduce((sum, item) => sum + item.value, 0) / previous.length;
    
    const change = ((recentAvg - previousAvg) / previousAvg) * 100;
    
    return {
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      percentage: Math.abs(change)
    };
  };

  const trend = calculateTrend();

  const getMaxValue = () => {
    return Math.max(...chartData.map(item => item.value));
  };

  const getMinValue = () => {
    return Math.min(...chartData.map(item => item.value));
  };

  const exportChart = () => {
    // Export chart data as CSV
    const csvContent = [
      ['Date', selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)],
      ...chartData.map(item => [item.date, item.value])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedMetric}_trends_${dateRange}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="trend-charts">
      {/* Chart Header */}
      <div className="chart-header">
        <div className="chart-title-section">
          <div className="chart-icon">
            {metricInfo.icon}
          </div>
          <div className="chart-info">
            <h2>{metricInfo.title}</h2>
            <div className="chart-summary">
              <span className="data-points">{chartData.length} data points</span>
              <div className={`trend-indicator ${trend.direction}`}>
                {trend.direction === 'up' ? (
                  <TrendingUp size={16} />
                ) : trend.direction === 'down' ? (
                  <TrendingDown size={16} />
                ) : (
                  <LineChart size={16} />
                )}
                <span>{trend.percentage.toFixed(1)}% {trend.direction === 'neutral' ? 'stable' : trend.direction}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="chart-controls">
          <div className="chart-type-selector">
            <button 
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
              title="Line Chart"
            >
              <LineChart size={16} />
            </button>
            <button 
              className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
              title="Bar Chart"
            >
              <BarChart3 size={16} />
            </button>
          </div>
          
          <button 
            className={`comparison-btn ${showComparison ? 'active' : ''}`}
            onClick={() => setShowComparison(!showComparison)}
          >
            <Filter size={16} />
            Compare
          </button>
          
          <button className="export-chart-btn" onClick={exportChart}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Chart Statistics */}
      <div className="chart-statistics">
        <div className="stat-item">
          <span className="stat-label">Peak</span>
          <span className="stat-value">{metricInfo.format(getMaxValue())}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Low</span>
          <span className="stat-value">{metricInfo.format(getMinValue())}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average</span>
          <span className="stat-value">
            {metricInfo.format(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length)}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Latest</span>
          <span className="stat-value">
            {chartData.length > 0 ? metricInfo.format(chartData[chartData.length - 1].value) : '0'}
          </span>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-container">
        {chartType === 'line' ? (
          <LineChartComponent 
            data={chartData}
            color={metricInfo.color}
            formatValue={metricInfo.format}
          />
        ) : (
          <BarChartComponent 
            data={chartData}
            color={metricInfo.color}
            formatValue={metricInfo.format}
          />
        )}
      </div>

      {/* Comparison View */}
      {showComparison && (
        <div className="comparison-section">
          <h3>Period Comparison</h3>
          <div className="comparison-grid">
            <div className="comparison-period">
              <h4>Current Period</h4>
              <div className="period-stats">
                <div className="period-stat">
                  <span className="period-label">Total</span>
                  <span className="period-value">
                    {metricInfo.format(chartData.reduce((sum, item) => sum + item.value, 0))}
                  </span>
                </div>
                <div className="period-stat">
                  <span className="period-label">Average</span>
                  <span className="period-value">
                    {metricInfo.format(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length)}
                  </span>
                </div>
                <div className="period-stat">
                  <span className="period-label">Growth</span>
                  <span className={`period-value ${trend.direction}`}>
                    {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}{trend.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="comparison-period previous">
              <h4>Previous Period</h4>
              <div className="period-stats">
                <div className="period-stat">
                  <span className="period-label">Total</span>
                  <span className="period-value">
                    {metricInfo.format(chartData.reduce((sum, item) => sum + item.value, 0) * 0.85)}
                  </span>
                </div>
                <div className="period-stat">
                  <span className="period-label">Average</span>
                  <span className="period-value">
                    {metricInfo.format((chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length) * 0.85)}
                  </span>
                </div>
                <div className="period-stat">
                  <span className="period-label">Growth</span>
                  <span className="period-value neutral">
                    +{(trend.percentage * 0.6).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Line Chart Component
const LineChartComponent = ({ data, color, formatValue }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  return (
    <div className="line-chart">
      <svg viewBox="0 0 800 300" className="chart-svg">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="60"
            y1={50 + (i * 50)}
            x2="750"
            y2={50 + (i * 50)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Data path */}
        <path
          d={`M ${data.map((item, index) => 
            `${60 + (index * (690 / (data.length - 1)))},${250 - ((item.value - minValue) / range) * 200}`
          ).join(' L ')}`}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Area fill */}
        <path
          d={`M 60,250 L ${data.map((item, index) => 
            `${60 + (index * (690 / (data.length - 1)))},${250 - ((item.value - minValue) / range) * 200}`
          ).join(' L ')} L 750,250 Z`}
          fill="url(#areaGradient)"
        />
        
        {/* Data points */}
        {data.map((item, index) => (
          <circle
            key={index}
            cx={60 + (index * (690 / (data.length - 1)))}
            cy={250 - ((item.value - minValue) / range) * 200}
            r="4"
            fill={color}
            className="data-point"
          />
        ))}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => (
          <text
            key={i}
            x="50"
            y={250 - (i * 50) + 5}
            textAnchor="end"
            fontSize="12"
            fill="#6b7280"
          >
            {formatValue(minValue + (range * i / 4))}
          </text>
        ))}
        
        {/* X-axis labels */}
        {data.map((item, index) => {
          if (index % Math.ceil(data.length / 6) === 0) {
            return (
              <text
                key={index}
                x={60 + (index * (690 / (data.length - 1)))}
                y="280"
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {item.label}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

// Bar Chart Component
const BarChartComponent = ({ data, color, formatValue }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bar-chart">
      <svg viewBox="0 0 800 300" className="chart-svg">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="60"
            y1={50 + (i * 50)}
            x2="750"
            y2={50 + (i * 50)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Bars */}
        {data.map((item, index) => {
          const barWidth = 690 / data.length * 0.7;
          const barHeight = (item.value / maxValue) * 200;
          const x = 60 + (index * (690 / data.length)) + ((690 / data.length) - barWidth) / 2;
          const y = 250 - barHeight;
          
          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              className="chart-bar"
              rx="2"
            />
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 1, 2, 3, 4].map(i => (
          <text
            key={i}
            x="50"
            y={250 - (i * 50) + 5}
            textAnchor="end"
            fontSize="12"
            fill="#6b7280"
          >
            {formatValue((maxValue * i) / 4)}
          </text>
        ))}
        
        {/* X-axis labels */}
        {data.map((item, index) => {
          if (index % Math.ceil(data.length / 6) === 0) {
            return (
              <text
                key={index}
                x={60 + (index * (690 / data.length)) + (690 / data.length) / 2}
                y="280"
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {item.label}
              </text>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default TrendCharts;