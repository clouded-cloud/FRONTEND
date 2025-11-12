import React from "react";
import { MdOutlineReorder, MdTableBar, MdDashboard } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../../https/Index.js";
import { removeUser } from "../../redux/slices/userSlice.js";

const HeaderNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user);

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name: "", phone: "", guests: 0 }));
    navigate("/tables");
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log("Logout completed:", data);
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: (error) => {
      console.error("Logout mutation error:", error);
      // The logout function should handle token clearing internally
      dispatch(removeUser());
      navigate("/auth");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { path: "/", icon: <MdOutlineReorder size={20} />, label: "Orders" },
    { path: "/tables", icon: <MdTableBar size={20} />, label: "Tables" },
    { path: "/menu", icon: <BiSolidDish size={20} />, label: "Menu" },
    ...(userData.role === 'admin' ? [{ path: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" }] : []),
  ];

  return (
    <header className="bg-black shadow-sm border-b border-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">SHARUBATI</h1>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Details and Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-gray-300 text-2xl" />
              <div className="hidden sm:flex flex-col items-start">
                <h1 className="text-sm font-semibold text-white">
                  {userData.name || "TEST USER"}
                </h1>
                <p className="text-xs text-gray-400">
                  {userData.role || "Role"}
                </p>
              </div>
              <IoLogOut
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-400 cursor-pointer ml-2"
                size={24}
              />
            </div>
            <button
              onClick={handleCreateOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <BiSolidDish size={18} />
              <span>New Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-600">
        <nav className="px-4 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-md text-xs font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 p-2 rounded-md text-xs font-medium transition-colors text-gray-300 hover:text-red-400"
            >
              <IoLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderNav;
