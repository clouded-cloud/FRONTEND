import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/contexts/AuthContext.jsx';
import { OrderProvider } from './components/contexts/OrderContext.jsx';
import Header from './components/common/Header';
import AdminPanel from './components/AdminPanel/AdminPanel';
import UserView from './components/UserView/UserView';
import Login from './components/auth/Login';
import './App.css';

function AppContent() {
  const { user, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState('user');

  if (user === undefined) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <Header 
        user={user} 
        isAdmin={isAdmin}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      
      <div className="container">
        {isAdmin && currentView === 'admin' ? (
          <AdminPanel />
        ) : (
          <UserView />
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;