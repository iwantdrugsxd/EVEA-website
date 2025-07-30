import React from 'react';
import { 
  DollarSign, UserCheck, ShoppingBag, Calendar,
  TrendingUp, TrendingDown 
} from 'lucide-react';
import './StatsGrid.css';

const StatsGrid = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,67,890',
      change: '+12.5%',
      changeType: 'positive',
      icon: <DollarSign size={24} />,
      color: 'green',
      description: 'vs last month'
    },
    {
      title: 'Active Vendors',
      value: '1,247',
      change: '+8.2%',
      changeType: 'positive',
      icon: <UserCheck size={24} />,
      color: 'blue',
      description: 'verified vendors'
    },
    {
      title: 'Total Orders',
      value: '8,945',
      change: '+15.7%',
      changeType: 'positive',
      icon: <ShoppingBag size={24} />,
      color: 'purple',
      description: 'this month'
    },
    {
      title: 'Monthly Events',
      value: '456',
      change: '+22.1%',
      changeType: 'positive',
      icon: <Calendar size={24} />,
      color: 'orange',
      description: 'events completed'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card stat-${stat.color}`}>
          <div className="stat-header">
            <div className={`stat-icon stat-icon-${stat.color}`}>
              {stat.icon}
            </div>
            <div className={`stat-change ${stat.changeType}`}>
              {stat.changeType === 'positive' ? 
                <TrendingUp size={16} /> : 
                <TrendingDown size={16} />
              }
              <span>{stat.change}</span>
            </div>
          </div>
          
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-description">{stat.description}</div>
          </div>
          
          <div className="stat-footer">
            <div className="stat-progress">
              <div 
                className={`stat-progress-bar stat-progress-${stat.color}`}
                style={{width: '75%'}}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;