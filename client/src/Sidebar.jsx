
// src/components/Sidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import logo from './logo.png';

const Sidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <nav>
        <ul style={styles.ul}>
          <li><img src={logo} alt="Logo" style={styles.logo} /></li>
          <li><Link to="/home" style={styles.link}>Home</Link></li>
          <li><Link to="/Dashboard" style={styles.link}>Dashboard</Link></li>
          <li><Link to="/Forecast" style={styles.link}>Forecast</Link></li>
          <li><Link to="/UserProfile" style={styles.link}>User Profile</Link></li>
          <li><Link to="/AboutUs" style={styles.link}>About Us</Link></li>
          <li><Link to="/Login" style={styles.link}>Log out</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#2c3e50',
    padding: '20px',
    color: '#ecf0f1',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  logo: {
    width: '80px',
    marginBottom: '20px',
  },
  link: {
    display: 'block',
    padding: '15px',
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '18px',
    fontWeight: '500',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  linkHover: {
    backgroundColor: '#34495e',
  },
};
