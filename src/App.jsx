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
import './components/styles/App.css';

// Loading Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-lg">Loading Restaurant System...</p>
    </div>
  </div>
);

// Main App Content Component
function AppContent() {
  const { user, isAdmin, loading } = useAuth();
  const [currentView, setCurrentView] = useState('pos');

  // Show loading spinner while checking auth
  if (loading) {
    return <LoadingSpinner />;
  }

  // If no user, show login (this should be handled by routes, but as fallback)
  if (!user) {
    return <Login />;
  }

  // Determine available views based on user role
  const getAvailableViews = () => {
    const views = [
      { id: 'pos', label: 'POS System', icon: '🖥️' },
      { id: 'user', label: 'Customer View', icon: '👤' }
    ];
    
    if (isAdmin) {
      views.push({ id: 'admin', label: 'Admin Panel', icon: '⚙️' });
    }
    
    return views;
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminPanel />;
      case 'pos':
        return <POSDashboard />;
      case 'user':
      default:
        return <UserView />;
    }
  };

  return (
    <div className="app min-h-screen bg-gray-50">
      <Header 
        user={user} 
        isAdmin={isAdmin}
        currentView={currentView}
        setCurrentView={setCurrentView}
        availableViews={getAvailableViews()}
      />
      
      <div className="main-container">
        {renderCurrentView()}
      </div>
    </div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/" replace />;
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
                
                {/* Main app route */}
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