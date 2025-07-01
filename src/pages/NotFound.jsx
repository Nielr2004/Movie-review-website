import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './PageStyles.css';

const NotFound = () => {
  return (
    <motion.div
      className="page-container text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title" style={{ fontSize: '4em' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className="btn">Go to Home</Link>
    </motion.div>
  );
};

export default NotFound;