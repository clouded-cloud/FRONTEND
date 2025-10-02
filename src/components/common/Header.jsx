import React from 'react'
import { useAuth } from '../contexts/AuthContext'

function Header({ currentView, setCurrentView }) {
  const { user, isAdmin, logout } = useAuth()

  return (
    <header>
      <div className="header-content">
        <div className="logo">Admin Panel</div>
        <div className="header-controls">
          {isAdmin && (
            <div className="view-switcher">
              <button 
                className={currentView === 'user' ? 'active' : ''}
                onClick={() => setCurrentView('user')}
              >
                User View
              </button>
              <button 
                className={currentView === 'admin' ? 'active' : ''}
                onClick={() => setCurrentView('admin')}
              >
                Admin Panel
              </button>
            </div>
          )}
          <div className="admin-info">
            <div className="admin-avatar">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span>{user?.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header