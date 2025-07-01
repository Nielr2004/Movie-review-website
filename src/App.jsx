import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx'; // Ensure Footer is imported if used

import ErrorBoundary from './ErrorBoundary.jsx';

// Lazy load page components for better performance
const Home = lazy(() => import('./pages/Home.jsx'));
// Correctly import the new DetailPage component from its new path
const DetailPage = lazy(() => import('./pages/DetailPage/DetailPage.jsx')); // CORRECTED IMPORT PATH AND NAME
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Login = lazy(() => import('./components/Auth/Login.jsx'));
const Signup = lazy(() => import('./components/Auth/Signup.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <ErrorBoundary>
        <main style={{ paddingTop: 'var(--header-height)', minHeight: 'calc(100vh - var(--header-height))', display: 'flex', flexDirection: 'column' }}>
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Home />} />
              <Route path="/series" element={<Home />} />
              {/* Route to the new DetailPage component using :mediaType and :id */}
              <Route path="/:mediaType/:id" element={<DetailPage />} /> {/* UPDATED ELEMENT TO DetailPage */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        </ErrorBoundary>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;