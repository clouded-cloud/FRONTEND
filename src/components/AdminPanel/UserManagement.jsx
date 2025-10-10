// components/AdminPanel/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import './AdminPanel/UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate fetching users - replace with actual API call
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/users/');
        // const data = await response.json();
        
        // Mock data for now
        const mockUsers = [
          { id: 1, email: 'admin@example.com', username: 'admin', is_admin: true },
          { id: 2, email: 'user@example.com', username: 'user', is_admin: false }
        ];
        
        setUsers(mockUsers);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
      </div>
    );
  }

  // Safe check for users array
  if (!users || !Array.isArray(users) || users.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No users found.</p>
      </div>
    );
  }

  return (
    <div className="user-management">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Username</th>
              <th className="px-4 py-2 border-b">Admin</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.id}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 border-b">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.is_admin ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-4 py-2 border-b">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm mr-2">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;