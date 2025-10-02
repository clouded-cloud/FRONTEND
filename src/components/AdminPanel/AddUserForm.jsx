import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function AddUserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  })
  const { addUser, users } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (users.some(u => u.email === formData.email)) {
      alert('A user with this email already exists')
      return
    }

    addUser(formData)
    setFormData({ name: '', email: '', password: '', role: 'user' })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="add-user-form">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>
  )
}

export default AddUserForm