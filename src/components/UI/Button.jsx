import React from 'react';
import { motion } from 'framer-motion';
import './Button.css';

const Button = ({ children, onClick, type = 'button', disabled = false, className = '' }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`btn ${className}`}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;