import React from 'react';
// Import your TMDb logo. Adjust the path based on where you saved it.
// For example, if you saved it in src/assets/images/tmdb_logo.svg
import tmdbLogo from '../../assets/images/tmdb_logo.svg'; 
// If you saved it as a PNG: import tmdbLogo from '../../assets/images/tmdb_logo.png';

import './Footer.module.css'; // Import the CSS Module for styling

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Dynamically get the current year

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* TMDb Attribution Text */}
        <p className="attribution-text">
          This product uses the TMDb API but is not endorsed or certified by TMDb.
        </p>
        
        {/* TMDb Logo */}
        <a
          href="https://www.themoviedb.org/" // Link to TMDb website
          target="_blank"                  // Open in a new tab
          rel="noopener noreferrer"        // Security best practice for target="_blank"
          aria-label="The Movie Database (TMDb)" // Accessibility label
        >
          <img src={tmdbLogo} alt="The Movie Database (TMDb) Logo" className="tmdb-logo" />
        </a>
        
        {/* Your Website's Copyright */}
        <p className="copyright-text">
          &copy; {currentYear} Your Movie Website Name. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;