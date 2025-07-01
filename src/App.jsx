import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx'; // Import AuthProvider

import Header from './components/Header/Header';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import NotFound from './pages/NotFound';
import Footer from './components/Footer/Footer.jsx'; // <--- NEW: Import the Footer component

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap your entire app with AuthProvider */}
        <Header />
        <main style={{ paddingTop: 'var(--header-height)', minHeight: 'calc(100vh - var(--header-height))' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
          </Routes>
        </main>
        <Footer /> {/* <--- NEW: Render the Footer component here */}
      </AuthProvider>
    </Router>
  );
}

export default App;