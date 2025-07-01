import React, { Suspense, lazy } from 'react'; // Import Suspense and lazy
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import Header from './components/Header/Header.jsx'; // Corrected extension
// Lazy load page components for better performance
const Home = lazy(() => import('./pages/Home.jsx')); // Lazy load
const MovieDetails = lazy(() => import('./pages/MovieDetails.jsx')); // Lazy load
const Dashboard = lazy(() => import('./pages/Dashboard.jsx')); // Lazy load
const Profile = lazy(() => import('./pages/Profile.jsx')); // Lazy load
const Login = lazy(() => import('./components/Auth/Login.jsx')); // Lazy load
const Signup = lazy(() => import('./components/Auth/Signup.jsx')); // Lazy load
const NotFound = lazy(() => import('./pages/NotFound.jsx')); // Lazy load
import Footer from './components/Footer/Footer.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        {/* Use <main> tag for main content, and apply styling */}
        <main style={{ paddingTop: 'var(--header-height)', minHeight: 'calc(100vh - var(--header-height))', display: 'flex', flexDirection: 'column' }}>
          {/* Suspense is required when using React.lazy */}
          <Suspense fallback={<div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} /> {/* Catch-all for 404 */}
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;