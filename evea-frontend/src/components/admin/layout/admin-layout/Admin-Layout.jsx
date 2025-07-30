import React, { useState } from 'react';
import AdminSidebar from '../admin-sidebar/AdminSidebar';
import AdminHeader from '../admin-header/AdminHeader';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <AdminHeader onToggleSidebar={toggleSidebar} />
        
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;