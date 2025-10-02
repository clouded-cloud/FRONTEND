import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const AuthContext = createContext()

// Sample initial data
const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", password: "123", role: "user", status: "active" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", password: "123", role: "admin", status: "active" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", password: "123", role: "user", status: "inactive" }
]

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('user', null)
  const [users, setUsers] = useLocalStorage('users', initialUsers)
  const [alert, setAlert] = useState({ show: false, message: '', type: '' })

  const isAdmin = user?.role === 'admin'

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type })
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 5000)
  }

  const login = (email, password) => {
    const foundUser = users.find(u => u.email === email && u.password === password && u.status === 'active')
    if (foundUser) {
      setUser(foundUser)
      showAlert('Login successful!', 'success')
      return true
    }
    showAlert('Invalid credentials or inactive account', 'error')
    return false
  }

  const logout = () => {
    setUser(null)
    showAlert('Logged out successfully', 'success')
  }

  const addUser = (userData) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...userData,
      status: 'active'
    }
    setUsers([...users, newUser])
    showAlert('User added successfully', 'success')
  }

  const updateUserStatus = (userId, status) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status } : u))
    showAlert(`User ${status === 'active' ? 'activated' : 'deactivated'}`, 'success')
  }

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId))
      showAlert('User deleted successfully', 'success')
    }
  }

  const registerUser = (userData) => {
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      ...userData,
      role: 'user',
      status: 'active'
    }
    setUsers([...users, newUser])
    showAlert('Account created successfully! Note: Checkout is disabled for regular users.', 'success')
  }

  return (
    <AuthContext.Provider value={{
      user,
      users,
      isAdmin,
      alert,
      login,
      logout,
      addUser,
      updateUserStatus,
      deleteUser,
      registerUser,
      showAlert
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}