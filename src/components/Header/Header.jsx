// src/components/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Import NavLink
import styles from './Header.module.css';

// Import your logo image.
import siteLogo from '../../assets/images/home_logo.png';

const Header = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <Link to="/" className={styles.logoLink}>
          <img src={siteLogo} alt="My Movie App Logo" className={styles.navLogo} />
          {/* <span className={styles.siteName}>MyMovieApp</span> */}
        </Link>
      </div>

      <ul className={styles.navList}>
        {/* Using NavLink for active styling */}
        <li><NavLink to="/" className={({ isActive }) => isActive ? styles.activeNavItem : styles.navItem}>Home</NavLink></li>
        
        {/* NEW: Movies and Series buttons as requested */}
        <li><NavLink to="/movies" className={({ isActive }) => isActive ? styles.activeNavItem : styles.navItem}>Movies</NavLink></li>
        <li><NavLink to="/series" className={({ isActive }) => isActive ? styles.activeNavItem : styles.navItem}>Series</NavLink></li>
        
        {/* Existing new links for future authentication features */}
        <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.activeNavItem : styles.navItem}>Dashboard</NavLink></li>
        <li><NavLink to="/login" className={({ isActive }) => isActive ? styles.activeNavItem : styles.navItem}>Login</NavLink></li>
        <li><NavLink to="/signup" className={({ isActive }) => isActive ? styles.activeNavItem : styles.navItem}>Sign Up</NavLink></li>
      </ul>
    </nav>
  );
};

export default Header;