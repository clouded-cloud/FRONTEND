import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, addUser, deleteUser, updateUser, resetUserPassword } from "../../https/Index";
import { enqueueSnackbar } from "notistack";
import { FaTrash, FaPlus, FaEdit, FaKey } from "react-icons/fa";

const UserManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    is_admin: false,
    is_superadmin: false,
    is_staff: true // Default to staff for new users
  });
  const [search, setSearch] = useState("");

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    onError: (error) => {
      console.error("Failed to fetch users:", error);
      enqueueSnackbar("Failed to load users", { variant: "error" });
    }
  });

  // Add user mutation with optimistic update + robust cache merge
  const addUserMutation = useMutation({
    mutationFn: addUser,
    // Optimistic UI: add a temporary user entry to the users cache
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previous = queryClient.getQueryData(["users"]);

      // Create a temporary ID so UI can show the row immediately
      const tempId = `tmp-${Date.now()}`;
      const tempUser = { id: tempId, ...newUser };

      const mergeWith = (old) => {
        if (!old) return { data: [tempUser] };
        // If old is an array
        if (Array.isArray(old)) return [tempUser, ...old];
        // If old.data is array
        if (Array.isArray(old.data)) return { ...old, data: [tempUser, ...old.data] };
        // Attempt to find deeper wrapper
        if (old.data && old.data.data && Array.isArray(old.data.data)) {
          return { ...old, data: { ...old.data, data: [tempUser, ...old.data.data] } };
        }
        return old;
      };

      queryClient.setQueryData(["users"], (old) => mergeWith(old));

      return { previous, tempId };
    },
    onError: (err, newUser, context) => {
      // Rollback
      if (context?.previous) queryClient.setQueryData(["users"], context.previous);
      // Log full server response when available to help diagnose 500s
      console.error("Failed to add user:", err, err?.response?.status, err?.response?.data);

      // Prefer server-provided error messages if present
      const serverMsg = err?.response?.data?.message || err?.response?.data?.detail || err?.response?.data || null;
      const friendly = serverMsg ? (typeof serverMsg === 'string' ? serverMsg : JSON.stringify(serverMsg)) : (err?.message || "Failed to add user");

      enqueueSnackbar(friendly, { variant: "error" });
    },
    onSuccess: (response, newUser, context) => {
      enqueueSnackbar("User added successfully", { variant: "success" });

      // Extract created user from various possible response shapes
      const created = response?.data ?? response;

      // Replace temp user if present, or append created user
      queryClient.setQueryData(["users"], (old) => {
        if (!old) return { data: [created] };
        // If old is array
        if (Array.isArray(old)) {
          // replace temp by matching properties
          if (context?.tempId) {
            return old.map((u) => (u.id === context.tempId ? created : u));
          }
          return [created, ...old];
        }
        // If old.data is array
        if (Array.isArray(old.data)) {
          if (context?.tempId) {
            return { ...old, data: old.data.map((u) => (u.id === context.tempId ? created : u)) };
          }
          return { ...old, data: [created, ...old.data] };
        }
        // If nested wrapper like old.data.data
        if (old.data && old.data.data && Array.isArray(old.data.data)) {
          if (context?.tempId) {
            return { ...old, data: { ...old.data, data: old.data.data.map((u) => (u.id === context.tempId ? created : u)) } };
          }
          return { ...old, data: { ...old.data, data: [created, ...old.data.data] } };
        }
        return old;
      });

      // Close and reset UI
      setIsModalOpen(false);
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        is_admin: false,
        is_superadmin: false,
        is_staff: true
      });

      // Finally, ensure fresh data by refetching in background
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      enqueueSnackbar("User deleted successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to delete user:", error);
      enqueueSnackbar("Failed to delete user", { variant: "error" });
    }
  });

  // Update user mutation (promote/demote, toggle privileges)
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, payload }) => updateUser(userId, payload),
    onSuccess: () => {
      enqueueSnackbar("User updated successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      enqueueSnackbar("Failed to update user", { variant: "error" });
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (userId) => resetUserPassword(userId),
    onSuccess: () => {
      enqueueSnackbar("Password reset/Email sent successfully", { variant: "success" });
    },
    onError: (error) => {
      console.error("Failed to reset password:", error);
      enqueueSnackbar("Failed to reset password", { variant: "error" });
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle role logic
    if (name === "is_superadmin" && checked) {
      // If making super admin, also make admin and staff
      setFormData(prev => ({
        ...prev,
        is_superadmin: true,
        is_admin: true,
        is_staff: true
      }));
    } else if (name === "is_admin" && checked) {
      // If making admin, also make staff
      setFormData(prev => ({
        ...prev,
        is_admin: true,
        is_staff: true,
        [name]: type === "checkbox" ? checked : value
      }));
    } else if (name === "is_admin" && !checked) {
      // If removing admin, also remove super admin
      setFormData(prev => ({
        ...prev,
        is_admin: false,
        is_superadmin: false,
        [name]: type === "checkbox" ? checked : value
      }));
    } else if (name === "is_staff" && !checked) {
      // If removing staff, also remove admin and super admin
      setFormData(prev => ({
        ...prev,
        is_staff: false,
        is_admin: false,
        is_superadmin: false,
        [name]: type === "checkbox" ? checked : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic client-side validation before sending
    if (!formData.username || !formData.email || !formData.password) {
      enqueueSnackbar("Please provide username, email and password", { variant: "warning" });
      return;
    }

    addUserMutation.mutate(formData);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Helper function to determine user role display
  const getUserRole = (user) => {
    if (user.is_superadmin) return "Super Admin";
    if (user.is_admin) return "Admin";
    if (user.is_staff) return "Staff";
    return "User";
  };

  // Helper function to get role badge class
  const getRoleBadgeClass = (user) => {
    if (user.is_superadmin) return "role-superadmin";
    if (user.is_admin) return "role-admin";
    if (user.is_staff) return "role-staff";
    return "role-user";
  };

  const users = usersData?.data || [];
  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (u.username || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      ((u.first_name || "") + " " + (u.last_name || "")).toLowerCase().includes(q)
    );
  });

  return (
    <div className="user-management-container">
      <div className="user-management-content">
        {/* Header */}
        <div className="management-header">
          <div>
            <h2 className="management-title">User Management</h2>
            <p className="management-subtitle">Manage restaurant staff and administrators</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-user-button"
          >
            <FaPlus className="button-icon" />
            Add User
          </button>
        </div>

        {/* Search */}
        <div className="search-section">
          <div className="search-container">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name or email"
              className="search-input"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="table-card">
          <div className="table-container">
            <table className="users-table">
              <thead className="table-header">
                <tr>
                  <th className="table-th">Name</th>
                  <th className="table-th">Email</th>
                  <th className="table-th">Phone</th>
                  <th className="table-th">Role</th>
                  <th className="table-th">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="loading-cell">
                      <div className="loading-content">
                        <div className="table-spinner"></div>
                        Loading users...
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      <div className="empty-content">
                        <div className="empty-icon">👥</div>
                        No users found
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id || user._id} className="table-row">
                      <td className="table-td">
                        <div className="user-name">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user.username}
                        </div>
                      </td>
                      <td className="table-td user-email">{user.email}</td>
                      <td className="table-td user-phone">{user.phone_number || "N/A"}</td>
                      <td className="table-td">
                        <span className={`role-badge ${getRoleBadgeClass(user)}`}>
                          {getUserRole(user)}
                        </span>
                      </td>
                      <td className="table-td">
                        <div className="actions-container">
                          {/* Staff Toggle */}
                          {user.is_staff ? (
                            <button
                              onClick={() => updateUserMutation.mutate({ 
                                userId: user.id || user._id, 
                                payload: { 
                                  is_staff: false,
                                  is_admin: false,
                                  is_superadmin: false 
                                } 
                              })}
                              className="action-button revoke-staff-button"
                              disabled={updateUserMutation.isPending}
                            >
                              Revoke Staff
                            </button>
                          ) : (
                            <button
                              onClick={() => updateUserMutation.mutate({ 
                                userId: user.id || user._id, 
                                payload: { is_staff: true } 
                              })}
                              className="action-button make-staff-button"
                              disabled={updateUserMutation.isPending}
                            >
                              Make Staff
                            </button>
                          )}

                          {/* Admin Toggle */}
                          {user.is_admin ? (
                            <button
                              onClick={() => updateUserMutation.mutate({ 
                                userId: user.id || user._id, 
                                payload: { 
                                  is_admin: false,
                                  is_superadmin: false 
                                } 
                              })}
                              className="action-button revoke-admin-button"
                              disabled={updateUserMutation.isPending}
                            >
                              Revoke Admin
                            </button>
                          ) : user.is_staff && (
                            <button
                              onClick={() => updateUserMutation.mutate({ 
                                userId: user.id || user._id, 
                                payload: { is_admin: true } 
                              })}
                              className="action-button make-admin-button"
                              disabled={updateUserMutation.isPending}
                            >
                              Make Admin
                            </button>
                          )}

                          {/* Super Admin Toggle */}
                          {user.is_superadmin ? (
                            <button
                              onClick={() => updateUserMutation.mutate({ 
                                userId: user.id || user._id, 
                                payload: { is_superadmin: false } 
                              })}
                              className="action-button superadmin-active"
                              disabled={updateUserMutation.isPending}
                            >
                              Super Admin
                            </button>
                          ) : user.is_admin && (
                            <button
                              onClick={() => updateUserMutation.mutate({ 
                                userId: user.id || user._id, 
                                payload: { is_superadmin: true } 
                              })}
                              className="action-button superadmin-inactive"
                              disabled={updateUserMutation.isPending}
                            >
                              Make Super
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm(`Send password reset to ${user.email}?`)) resetPasswordMutation.mutate(user.id || user._id);
                            }}
                            className="action-button reset-button"
                            disabled={resetPasswordMutation.isPending}
                          >
                            <FaKey className="action-icon" />
                            Reset
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id || user._id)}
                            className="action-button delete-button"
                            disabled={deleteUserMutation.isPending}
                          >
                            <FaTrash className="action-icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add User Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h3 className="modal-title">Add New User</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="close-button"
                >
                  <FaTrash size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_staff"
                      checked={formData.is_staff}
                      onChange={handleInputChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Staff privileges </span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={formData.is_admin}
                      onChange={handleInputChange}
                      disabled={!formData.is_staff}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Admin privileges </span>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_superadmin"
                      checked={formData.is_superadmin}
                      onChange={handleInputChange}
                      disabled={!formData.is_admin}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Super Admin privileges </span>
                  </label>
                </div>
                
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addUserMutation.isPending}
                    className="submit-button"
                  >
                    {addUserMutation.isPending ? "Adding..." : "Add User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .user-management-container {
          padding: 1.5rem;
          font-family: 'Inter', sans-serif;
          background: var(--bg-body);
          min-height: 100vh;
        }

        .user-management-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .management-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .management-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .management-subtitle {
          color: var(--text-secondary);
          margin: 0;
          font-size: 1rem;
        }

        .add-user-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        .add-user-button:hover {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(44, 85, 48, 0.4);
        }

        .button-icon {
          font-size: 0.875rem;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 1.5rem;
        }

        .search-container {
          max-width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: var(--input-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        /* Table */
        .table-card {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .table-card:hover {
          box-shadow: var(--shadow-lg);
        }

        .table-container {
          overflow-x: auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .table-header {
          background: #f8f9fa;
          border-bottom: 2px solid var(--border-color);
        }

        .table-th {
          padding: 1rem 1.5rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: left;
        }

        .table-body {
          background: var(--card-bg);
        }

        .table-row {
          border-bottom: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .table-row:hover {
          background: #f8f9fa;
          transform: translateX(4px);
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-td {
          padding: 1.25rem 1.5rem;
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .loading-cell, .empty-cell {
          padding: 3rem 1.5rem;
          text-align: center;
        }

        .loading-content, .empty-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
        }

        .table-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid var(--border-color);
          border-top: 2px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .empty-icon {
          font-size: 2rem;
          opacity: 0.5;
        }

        /* User Info */
        .user-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .user-email, .user-phone {
          color: var(--text-secondary);
        }

        /* Role Badges */
        .role-badge {
          padding: 0.5rem 0.875rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .role-superadmin {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .role-admin {
          background: #eff6ff;
          color: var(--primary);
          border: 1px solid #bfdbfe;
        }

        .role-staff {
          background: #f0fdf4;
          color: #28a745;
          border: 1px solid #bbf7d0;
        }

        .role-user {
          background: #f8fafc;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        /* Actions */
        .actions-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-button {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .make-staff-button {
          background: #f0fdf4;
          color: #28a745;
          border: 1px solid #bbf7d0;
        }

        .make-staff-button:hover:not(:disabled) {
          background: #28a745;
          color: white;
          transform: translateY(-1px);
        }

        .revoke-staff-button {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fcd34d;
        }

        .revoke-staff-button:hover:not(:disabled) {
          background: #d97706;
          color: white;
          transform: translateY(-1px);
        }

        .make-admin-button {
          background: #eff6ff;
          color: var(--primary);
          border: 1px solid #bfdbfe;
        }

        .make-admin-button:hover:not(:disabled) {
          background: var(--primary);
          color: white;
          transform: translateY(-1px);
        }

        .revoke-admin-button {
          background: #fef3c7;
          color: #d97706;
          border: 1px solid #fcd34d;
        }

        .revoke-admin-button:hover:not(:disabled) {
          background: #d97706;
          color: white;
          transform: translateY(-1px);
        }

        .superadmin-active {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .superadmin-inactive {
          background: #f8fafc;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .superadmin-active:hover:not(:disabled),
        .superadmin-inactive:hover:not(:disabled) {
          background: #dc2626;
          color: white;
          transform: translateY(-1px);
        }

        .reset-button {
          background: #faf5ff;
          color: #9333ea;
          border: 1px solid #e9d5ff;
        }

        .reset-button:hover:not(:disabled) {
          background: #9333ea;
          color: white;
          transform: translateY(-1px);
        }

        .delete-button {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 0.5rem;
        }

        .delete-button:hover:not(:disabled) {
          background: #dc2626;
          color: white;
          transform: translateY(-1px);
        }

        .action-icon {
          font-size: 0.75rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          width: 100%;
          max-width: 32rem;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .close-button {
          color: var(--text-secondary);
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          color: var(--text-primary);
          background: var(--border-color);
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 600;
          margin: 0;
        }

        .form-input {
          background: var(--input-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          padding: 0.875rem 1rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid var(--border-color);
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-input {
          width: 1.125rem;
          height: 1.125rem;
          border: 1.5px solid var(--border-color);
          border-radius: 4px;
          cursor: pointer;
          margin-top: 0.125rem;
          flex-shrink: 0;
        }

        .checkbox-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .checkbox-text {
          color: var(--text-primary);
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.4;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .cancel-button {
          flex: 1;
          padding: 0.875rem 1.5rem;
          background: var(--card-bg);
          color: var(--text-primary);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button:hover {
          background: #f8f9fa;
          border-color: var(--primary);
        }

        .submit-button {
          flex: 1;
          padding: 0.875rem 1.5rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .submit-button:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Table row animations */
        .table-row {
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Stagger animation for table rows */
        .table-row:nth-child(1) { animation-delay: 0.1s; }
        .table-row:nth-child(2) { animation-delay: 0.2s; }
        .table-row:nth-child(3) { animation-delay: 0.3s; }
        .table-row:nth-child(4) { animation-delay: 0.4s; }

        /* Custom scrollbar */
        .table-container::-webkit-scrollbar {
          height: 8px;
        }

        .table-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
        }

        .table-container::-webkit-scrollbar-thumb:hover {
          background: var(--text-muted);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .actions-container {
            gap: 0.25rem;
          }

          .action-button {
            padding: 0.375rem 0.5rem;
            font-size: 0.7rem;
          }
        }

        @media (max-width: 768px) {
          .user-management-container {
            padding: 1rem;
          }

          .management-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .management-title {
            font-size: 1.5rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .table-th, .table-td {
            padding: 1rem;
          }

          .actions-container {
            flex-direction: column;
            align-items: flex-start;
          }

          .modal-container {
            padding: 1.5rem;
          }

          .modal-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 640px) {
          .table-container {
            border-radius: 12px;
          }

          .table-th, .table-td {
            padding: 0.75rem 0.5rem;
            font-size: 0.8rem;
          }

          .role-badge {
            font-size: 0.7rem;
            padding: 0.375rem 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UserManagement;