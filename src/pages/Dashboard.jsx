import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button';
import './PageStyles.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="page-container text-center">
        <h2>Access Denied</h2>
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title">Welcome to Your Dashboard, {user.email}!</h1>
      <p>Here you can manage your watchlist, view your reviews, and more.</p>

      <section className="dashboard-section">
        <h2>Your Watchlist</h2>
        <p>Your watchlist will appear here.</p>
        <Button onClick={() => alert('Feature coming soon!')}>Browse Movies to Add</Button>
      </section>

      <section className="dashboard-section">
        <h2>Your Reviews</h2>
        <p>Your movie reviews will be listed here.</p>
      </section>

      <div className="dashboard-actions">
        <Button onClick={logout} className="logout-button">Logout</Button>
      </div>
    </motion.div>
  );
};

export default Dashboard;