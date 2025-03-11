// src/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar (always visible) */}
      <div style={styles.sidebar}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div style={styles.mainContent}>
        <Outlet /> {/* Render page content here */}
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#343a40',
    color: '#fff',
    padding: '20px',
  },
  mainContent: {
    flexGrow: 1,
    padding: '30px',
    backgroundColor: '#f8f9fa',
  },
};

export default Layout;
