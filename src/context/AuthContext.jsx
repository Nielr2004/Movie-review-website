import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig'; // Import your Firebase auth instance
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // setUser is updated by onAuthStateChanged listener
      alert('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // setUser is updated by onAuthStateChanged listener
      alert('Signed up successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
      // setUser is updated by onAuthStateChanged listener to null
      alert('Logged out!');
      navigate('/');
    } catch (err) {
      console.error("Logout error:", err);
      setError(err.message || "Failed to log out.");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
  };

  // Show a global spinner while auth state is being determined
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--background-dark)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};