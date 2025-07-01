// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Auth Context
const AuthContext = createContext(null);

// 2. Create the Auth Provider Component
export const AuthProvider = ({ children }) => {
  // In a real application, you'd check localStorage for a token
  // or make an API call to verify the user's session here.
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState(null); // Could store user object (e.g., { username: '...' })

  // Example: Check for a "token" in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      // In a real app, validate this token with your backend
      // For now, we'll just assume presence of token means logged in
      setIsLoggedIn(true);
      // You might also fetch user details here
      setUser({ username: 'CurrentUser' }); // Placeholder user
    }
  }, []);

  const login = (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);
    // Store token/user data in localStorage or sessionStorage for persistence
    localStorage.setItem('userToken', token);
    console.log("User logged in:", userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    // Clear any stored authentication data
    localStorage.removeItem('userToken');
    console.log("User logged out.");
  };

  const authValue = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create the useAuth Custom Hook
// This hook makes it easy for any component to access the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};