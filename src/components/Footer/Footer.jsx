import React from 'react';
import tmdbLogo from '../../assets/images/tmdb_logo.svg'; 
// Import CSS Module as 'styles' (or any other name, 'styles' is common)
import styles from './Footer.module.css'; // CHANGED: Added 'styles' alias

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Use 'styles.className' for all classNames from the CSS Module
    <footer className={styles.footer}>
      <div className={styles['footer-content']}> {/* Use bracket notation for hyphenated class names */}
        <p className={styles['attribution-text']}>
          This product uses the TMDb API but is not endorsed or certified by TMDb.
        </p>
        
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="The Movie Database (TMDb)"
        >
          <img src={tmdbLogo} alt="The Movie Database (TMDb) Logo" className={styles['tmdb-logo']} />
        </a>
        
        <p className={styles['copyright-text']}>
          &copy; {currentYear} Your Movie Website Name. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;