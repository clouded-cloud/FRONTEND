import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../../services/authService';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add isAuthenticated derived from user state
  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    if (AuthService.isAuthenticated()) {
      try {
        const userData = await AuthService.getCurrentUser();
        setUser(userData);
        setIsAdmin(userData.is_admin || false);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        AuthService.logout();
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await AuthService.login(email, password);
      
      // Get user profile after successful login
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      setIsAdmin(userData.is_admin || false);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await AuthService.register(userData);
      
      // Auto-login after successful registration
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    isAuthenticated, // Add this
    isAdmin,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children} {/* Remove the !loading condition here */}
    </AuthContext.Provider>
  );
}