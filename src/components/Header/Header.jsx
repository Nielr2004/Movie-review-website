import React from 'react';
import { Link } from 'react-router-dom';
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
        <li><Link to="/" className={styles.navItem}>Home</Link></li>
        {/* Removed About, Projects, Skills, Contact links as per your request */}
        <li><Link to="/dashboard" className={styles.navItem}>Dashboard</Link></li>
        <li><Link to="/login" className={styles.navItem}>Login</Link></li>
        <li><Link to="/signup" className={styles.navItem}>Sign Up</Link></li>
      </ul>
    </nav>
  );
};

export default Header;