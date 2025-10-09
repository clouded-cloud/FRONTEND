import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'username'
  const { login, register, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Debug current auth state
  console.log('=== LOGIN COMPONENT DEBUG ===');
  console.log('currentUser:', currentUser);
  console.log('isAdmin:', isAdmin);

  // Auto-redirect if already logged in
  useEffect(() => {
    console.log('=== AUTO-REDIRECT CHECK ===');
    console.log('currentUser:', currentUser);
    console.log('isAdmin:', isAdmin);
    
    if (currentUser) {
      console.log('User is logged in, checking admin status...');
      if (isAdmin) {
        console.log('User is admin, redirecting to /admin');
        navigate('/admin');
      } else {
        console.log('User is not admin, redirecting to /pos');
        navigate('/pos');
      }
    }
  }, [currentUser, isAdmin, navigate]);

  const [formData, setFormData] = useState({
    email: 'john@example.com',
    username: 'john',
    password: 'password123',
    first_name: '',
    last_name: '',
    phone_number: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== LOGIN ATTEMPT ===');
    console.log('Form data:', formData);
    console.log('Login method:', loginMethod);

    try {
      let result;
      
      if (isLogin) {
        // Use either email or username based on selected method
        if (loginMethod === 'email') {
          result = await login(formData.email, formData.password);
        } else {
          result = await login(formData.username, formData.password);
        }
      } else {
        result = await register(formData);
      }

      console.log('=== LOGIN RESULT ===');
      console.log('Result:', result);

      if (result.success) {
        console.log('Login successful!');
        console.log('User data:', result.user);
        console.log('User is_admin:', result.user?.is_admin);
        // Navigation will be handled by useEffect
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Quick test function to fill with test credentials
  const fillTestUserCredentials = () => {
    setFormData({
      email: 'john@example.com',
      username: 'john',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: ''
    });
  };

  const fillAdminCredentials = () => {
    setFormData({
      email: 'admin@example.com',
      username: 'admin',
      password: 'admin123',
      first_name: 'Admin',
      last_name: 'User',
      phone_number: ''
    });
  };

  // Direct admin login without filling form
  const directAdminLogin = async () => {
    console.log('=== DIRECT ADMIN LOGIN ===');
    setLoading(true);
    setError('');
    
    try {
      const result = await login('admin@example.com', 'admin123');
      
      console.log('Direct admin login result:', result);
      
      if (result.success) {
        console.log('Admin login successful!');
        console.log('User is_admin:', result.user?.is_admin);
        // Navigation will be handled by useEffect
      } else {
        const errorMsg = result.error || 'Admin login failed. Check if admin user exists.';
        setError(errorMsg);
        console.error('Admin login failed:', errorMsg);
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Admin login failed - check console for details');
    } finally {
      setLoading(false);
    }
  };

  // Direct admin login with username
  const directAdminLoginWithUsername = async () => {
    console.log('=== DIRECT ADMIN LOGIN WITH USERNAME ===');
    setLoading(true);
    setError('');
    
    try {
      const result = await login('admin', 'admin123');
      
      console.log('Direct admin login result:', result);
      
      if (result.success) {
        console.log('Admin login successful!');
        console.log('User is_admin:', result.user?.is_admin);
        // Navigation will be handled by useEffect
      } else {
        const errorMsg = result.error || 'Admin login failed. Check if admin user exists.';
        setError(errorMsg);
        console.error('Admin login failed:', errorMsg);
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Admin login failed - check console for details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        
        {/* Debug info display */}
        <div style={{
          background: '#f8f9fa',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          fontSize: '12px',
          border: '1px solid #dee2e6'
        }}>
          <div><strong>Debug Info:</strong></div>
          <div>Authenticated: {currentUser ? 'Yes' : 'No'}</div>
          <div>Admin: {isAdmin ? 'Yes' : 'No'}</div>
          <div>Loading: {loading ? 'Yes' : 'No'}</div>
          <div>Login Method: {loginMethod}</div>
        </div>
        
        {/* Quick login buttons */}
        {isLogin && (
          <div style={{ marginBottom: '15px' }}>
            {/* Login method selector */}
            <div style={{ 
              display: 'flex', 
              marginBottom: '10px',
              background: '#e9ecef',
              borderRadius: '4px',
              padding: '4px'
            }}>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  background: loginMethod === 'email' ? '#007bff' : 'transparent',
                  color: loginMethod === 'email' ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                📧 Email Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('username')}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: 'none',
                  borderRadius: '4px',
                  background: loginMethod === 'username' ? '#007bff' : 'transparent',
                  color: loginMethod === 'username' ? 'white' : 'black',
                  cursor: 'pointer'
                }}
              >
                👤 Username Login
              </button>
            </div>

            {/* Quick admin login buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button 
                type="button"
                className="admin-login-btn"
                onClick={directAdminLogin}
                disabled={loading}
                style={{
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flex: 1,
                  fontWeight: 'bold',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? '🔄' : '🚀'} Admin (Email)
              </button>
              
              <button 
                type="button"
                className="admin-login-btn"
                onClick={directAdminLoginWithUsername}
                disabled={loading}
                style={{
                  background: '#fd7e14',
                  color: 'white',
                  border: 'none',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flex: 1,
                  fontWeight: 'bold',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? '🔄' : '👑'} Admin (Username)
              </button>
            </div>

            {/* Fill credentials buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                type="button"
                className="test-credentials-btn"
                onClick={fillTestUserCredentials}
                disabled={loading}
                style={{
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Fill Test User
              </button>

              <button 
                type="button"
                className="auto-admin-btn"
                onClick={fillAdminCredentials}
                disabled={loading}
                style={{
                  background: '#ffc107',
                  color: 'black',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  flex: 1
                }}
              >
                Fill Admin
              </button>
            </div>
          </div>
        )}
        
        {error && (
          <div className="error-message" style={{
            background: '#f8d7da',
            color: '#721c24',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #f5c6cb'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                value={formData.first_name}
                onChange={handleChange}
                disabled={loading}
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                value={formData.last_name}
                onChange={handleChange}
                disabled={loading}
              />
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={loading}
              />
            </>
          )}
          
          {/* Show email or username field based on selected method */}
          {isLogin ? (
            loginMethod === 'email' ? (
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            ) : (
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            )
          ) : (
            // For registration, show both email and username
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </>
          )}
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            disabled={loading}
          />
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              background: loading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%',
              fontSize: '16px',
              marginTop: '10px'
            }}
          >
            {loading ? '🔄 Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button" 
            className="toggle-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({
                email: '',
                username: '',
                password: '',
                first_name: '',
                last_name: '',
                phone_number: ''
              });
            }}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: loading ? 'not-allowed' : 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;