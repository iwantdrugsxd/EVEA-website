// src/pages/admin/financial-management.jsx
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, Download, 
  Filter, Calendar, Search, Eye, MoreHorizontal,
  CreditCard, Wallet, PieChart, BarChart3
} from 'lucide-react';
import AdminLayout from '../../components/admin/layout/admin-layout/AdminLayout';
import RevenueSummary from '../../components/admin/financial/revenue-summary/RevenueSummary';
import TransactionsTable from '../../components/admin/financial/transactions-table/TransactionsTable';
import PayoutManagement from '../../components/admin/financial/payout-management/PayoutManagement';
import './financial-management.css';

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock financial data
  const [financialData, setFinancialData] = useState({
    revenue: {
      total: 2456750,
      growth: 12.5,
      commission: 245675,
      commissionGrowth: 8.2
    },
    transactions: {
      total: 1245,
      pending: 45,
      completed: 1156,
      failed: 44
    },
    payouts: {
      pending: 125000,
      scheduled: 85000,
      completed: 1876500
    }
  });

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${financialData.revenue.total.toLocaleString()}`,
      growth: financialData.revenue.growth,
      icon: <DollarSign size={24} />,
      color: 'success',
      trend: 'up'
    },
    {
      title: 'Commission Earned',
      value: `₹${financialData.revenue.commission.toLocaleString()}`,
      growth: financialData.revenue.commissionGrowth,
      icon: <Wallet size={24} />,
      color: 'info',
      trend: 'up'
    },
    {
      title: 'Total Transactions',
      value: financialData.transactions.total.toLocaleString(),
      growth: 5.8,
      icon: <CreditCard size={24} />,
      color: 'warning',
      trend: 'up'
    },
    {
      title: 'Pending Payouts',
      value: `₹${financialData.payouts.pending.toLocaleString()}`,
      growth: -2.1,
      icon: <TrendingDown size={24} />,
      color: 'error',
      trend: 'down'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', count: null },
    { id: 'transactions', name: 'Transactions', count: financialData.transactions.pending },
    { id: 'payouts', name: 'Payouts', count: 8 },
    { id: 'reports', name: 'Reports', count: null }
  ];

  const handleExportData = () => {
    // Handle data export
    console.log('Exporting financial data...');
  };

  return (
    <AdminLayout>
      <div className="financial-management">
        {/* Page Header */}
        <div className="financial-header">
          <div className="header-content">
            <h1>Financial Management</h1>
            <p>Monitor revenue, transactions, and vendor payouts across the platform</p>
          </div>
          
          <div className="header-actions">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-select"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
            
            <button className="export-btn" onClick={handleExportData}>
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Financial Stats */}
        <div className="financial-stats">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.trend}`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {Math.abs(stat.growth)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="financial-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
              {tab.count && (
                <span className="tab-count">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <RevenueSummary 
                data={financialData}
                dateRange={dateRange}
              />
              <div className="recent-activity">
                <h3>Recent Financial Activity</h3>
                <TransactionsTable 
                  limit={5}
                  showPagination={false}
                />
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="transactions-tab">
              <div className="transactions-controls">
                <div className="search-filter-section">
                  <div className="search-box">
                    <Search size={20} />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="filter-controls">
                    <select 
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Transactions</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    
                    <button className="filter-btn">
                      <Filter size={16} />
                      Filters
                    </button>
                  </div>
                </div>
              </div>
              
              <TransactionsTable 
                searchTerm={searchTerm}
                filter={selectedFilter}
                showPagination={true}
              />
            </div>
          )}

          {activeTab === 'payouts' && (
            <div className="payouts-tab">
              <PayoutManagement />
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-tab">
              <div className="reports-grid">
                <div className="report-card">
                  <h3>Revenue Report</h3>
                  <p>Detailed breakdown of platform revenue and commission earnings</p>
                  <button className="generate-report-btn">
                    <BarChart3 size={16} />
                    Generate Report
                  </button>
                </div>
                
                <div className="report-card">
                  <h3>Transaction Report</h3>
                  <p>Comprehensive analysis of all platform transactions</p>
                  <button className="generate-report-btn">
                    <PieChart size={16} />
                    Generate Report
                  </button>
                </div>
                
                <div className="report-card">
                  <h3>Vendor Payout Report</h3>
                  <p>Summary of vendor payments and pending payouts</p>
                  <button className="generate-report-btn">
                    <Wallet size={16} />
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FinancialManagement;