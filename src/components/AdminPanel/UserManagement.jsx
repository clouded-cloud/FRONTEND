import React from 'react'
import { useAuth } from '../contexts/AuthContext'

function UserManagement() {
  const { users, updateUserStatus, deleteUser } = useAuth()

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                  {user.status}
                </span>
              </td>
              <td className="actions">
                <button 
                  onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'inactive' : 'active')}
                  className={user.status === 'active' ? 'danger' : ''}
                >
                  {user.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => deleteUser(user.id)}
                  className="danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagement