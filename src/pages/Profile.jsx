import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import Button from '../components/UI/Button'; // Assuming you want a button here
import './PageStyles.css';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="page-container text-center">
        <h2>Access Denied</h2>
        <p>Please log in to view your profile.</p>
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
      <h1 className="page-title">User Profile</h1>
      <div className="profile-details">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user.uid}</p>
        <p>Manage your account settings here.</p>
        <Button onClick={() => alert('Edit profile feature coming soon!')}>Edit Profile</Button>
      </div>
    </motion.div>
  );
};

export default Profile;