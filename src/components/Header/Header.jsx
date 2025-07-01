// src/components/Header/Header.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import siteLogo from '../../assets/images/home_logo.png';
import styles from './Header.module.css';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        {/* Logo (left side) */}
        <div className={styles.navLeft}>
          <Link to="/" className={styles.logoLink} onClick={closeMenu}>
            <img src={siteLogo} alt="Your Movie Site Logo" className={styles.navLogo} />
            {/* Optional: Add site name text next to the logo */}
            {/* <span className={styles.siteName}>CineScope</span> */}
          </Link>
        </div>

        {/* Hamburger Menu Icon (for mobile) */}
        <button
          className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links (main & auth) */}
        <div className={`${styles.navRight} ${isMenuOpen ? styles.menuActive : ''}`}>
          <ul className={styles.navLinks}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? styles.activeLink : undefined}
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/movies"
                className={({ isActive }) => isActive ? styles.activeLink : undefined}
                onClick={closeMenu}
              >
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/series"
                className={({ isActive }) => isActive ? styles.activeLink : undefined}
                onClick={closeMenu}
              >
                Series
              </NavLink>
            </li>
            {/* NEW: Dashboard link added to main navigation */}
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => isActive ? styles.activeLink : undefined}
                onClick={closeMenu}
              >
                Dashboard
              </NavLink>
            </li>
            {/* REMOVED: The 'About' link was here */}
          </ul>

          <div className={styles.authLinks}>
            {isLoggedIn ? (
              <>
                {/* Profile link remains here as it's user-specific */}
                <NavLink
                  to="/profile"
                  className={({ isActive }) => isActive ? styles.activeLink : undefined}
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
                <button onClick={() => { logout(); closeMenu(); }} className={styles.logoutButton}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => isActive ? styles.activeLink : undefined}
                  onClick={closeMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => isActive ? styles.activeLink : undefined}
                  onClick={closeMenu}
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;