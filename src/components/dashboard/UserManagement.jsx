import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, addUser, deleteUser } from "../../https/Index";
import { enqueueSnackbar } from "notistack";
import { FaTrash, FaPlus } from "react-icons/fa";

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
    is_superadmin: false
  });

  // Fetch users
  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    onError: (error) => {
      console.error("Failed to fetch users:", error);
      enqueueSnackbar("Failed to load users", { variant: "error" });
    }
  });

  // Add user mutation
  const addUserMutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      enqueueSnackbar("User added successfully", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
      setFormData({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        password: "",
        is_admin: false,
        is_superadmin: false
      });
    },
    onError: (error) => {
      console.error("Failed to add user:", error);
      enqueueSnackbar("Failed to add user", { variant: "error" });
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUserMutation.mutate(formData);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const users = usersData?.data || [];

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-3xl">User Management</h2>
          <p className="text-sm text-gray-400 mt-1">Manage restaurant staff and administrators</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <FaPlus size={16} />
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
              <tr>
                <th className="px-6 py-4 text-left text-white font-bold">Name</th>
                <th className="px-6 py-4 text-left text-white font-bold">Email</th>
                <th className="px-6 py-4 text-left text-white font-bold">Phone</th>
                <th className="px-6 py-4 text-left text-white font-bold">Role</th>
                <th className="px-6 py-4 text-left text-white font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#ababab]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#ababab]">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-700 hover:bg-gray-700/50 transition-colors duration-200">
                    <td className="px-6 py-4 text-white font-medium">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : user.username}
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-gray-300">{user.phone_number || "N/A"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        user.is_superadmin
                          ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                          : user.is_admin
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                          : "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
                      }`}>
                        {user.is_superadmin ? "Super Admin" : user.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/20 transition-all duration-200 transform hover:scale-110"
                        disabled={deleteUserMutation.isPending}
                      >
                        <FaTrash size={16} />
                      </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-700">
            <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text mb-6">Add New User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#ababab] mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#1a1a1a] text-[#f5f5f5] rounded border border-gray-600 focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[#ababab] mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#1a1a1a] text-[#f5f5f5] rounded border border-gray-600 focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#ababab] mb-2">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#1a1a1a] text-[#f5f5f5] rounded border border-gray-600 focus:outline-none focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-[#ababab] mb-2">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#1a1a1a] text-[#f5f5f5] rounded border border-gray-600 focus:outline-none focus:border-yellow-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#ababab] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#1a1a1a] text-[#f5f5f5] rounded border border-gray-600 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-[#ababab] mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#1a1a1a] text-[#f5f5f5] rounded border border-gray-600 focus:outline-none focus:border-yellow-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_admin"
                    checked={formData.is_admin}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-[#f5f5f5]">Admin privileges</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_superadmin"
                    checked={formData.is_superadmin}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span className="text-[#f5f5f5]">Super Admin privileges</span>
                </label>
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addUserMutation.isPending}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl hover:from-yellow-600 hover:to-orange-600 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                >
                  {addUserMutation.isPending ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
