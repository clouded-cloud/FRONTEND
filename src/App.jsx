import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/contexts/AuthContext.jsx';
import { OrderProvider } from './components/contexts/OrderContext.jsx';
import { PosProvider } from './components/contexts/PosContext.jsx';
import Header from './components/common/Header';
import AdminPanel from './components/AdminPanel/AdminPanel';
import UserView from './components/UserView/UserView';
import POSDashboard from './pages/POSDashboard';
import Login from './components/auth/Login.jsx';
import './App.css';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg">Loading Restaurant System...</p>
    </div>
  </div>
);

// Main App Content Component - This only renders when user is authenticated
function AppContent() {
  const { user, isAdmin, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // This should never happen due to ProtectedRoute, but as safety
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  console.log('AppContent - User:', user); // Debug log
  console.log('AppContent - isAdmin:', isAdmin); // Debug log

  // Get available navigation items based on user role
  const getNavItems = () => {
    const items = [
      { id: 'pos', label: 'POS System', icon: '🖥️', path: '/pos' },
      { id: 'menu', label: 'Customer View', icon: '👤', path: '/menu' }
    ];
    
    if (isAdmin) {
      items.push({ id: 'admin', label: 'Admin Panel', icon: '⚙️', path: '/admin' });
    }
    
    console.log('Nav Items:', items); // Debug log
    return items;
  };

  return (
    <div className="app min-h-screen bg-gray-50">
      <Header 
        user={user} 
        isAdmin={isAdmin}
        navItems={getNavItems()}
      />
      
      <div className="main-container p-4">
        <Routes>
          {/* Default route redirects to POS */}
          <Route path="/" element={<Navigate to="/pos" replace />} />
          
          {/* POS System */}
          <Route path="/pos" element={<POSDashboard />} />
          
          {/* Customer Menu View */}
          <Route path="/menu" element={<UserView />} />
          
          {/* Admin Panel - only accessible to admins */}
          {isAdmin && <Route path="/admin/*" element={<AdminPanel />} />}
          
          {/* Catch all route - redirect to POS */}
          <Route path="*" element={<Navigate to="/pos" replace />} />
        </Routes>
      </div>
    </div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('ProtectedRoute - user:', user, 'loading:', loading); // Debug log
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (for login)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('PublicRoute - user:', user, 'loading:', loading); // Debug log
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <PosProvider>
          <OrderProvider>
            <div className="App min-h-screen bg-gray-50">
              <Routes>
                {/* Login route - public */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                
                {/* All other routes - protected */}
                <Route 
                  path="/*" 
                  element={
                    <ProtectedRoute>
                      <AppContent />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
          </OrderProvider>
        </PosProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;