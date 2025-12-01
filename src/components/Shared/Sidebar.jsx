import React, { useState } from "react";
import {
  MdOutlineReorder,
  MdTableBar,
  MdDashboard,
  MdClose,
  MdMenu,
} from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { FaUserCircle, FaUsers } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useMutation } from "@tanstack/react-query";

import ProfileModal from "../Shared/ProfileModal";
import { logout } from "../../https/Index.js";
import { removeUser } from "../../redux/slices/userSlice.js";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user || {});

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // Sidebar is always visible now. Removed collapsed/hover toggles.

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name: "", phone: "", guests: 0 }));
    navigate("/tables");
  };

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(removeUser());
      navigate("/auth");
    },
    onError: () => {
      dispatch(removeUser());
      navigate("/auth");
    },
  });

  const isAdmin = Boolean(
    userData.isAdmin ||
      userData.isSuperuser ||
      ["admin", "superadmin", "superuser"].includes(userData.role)
  );

  const navItems = [
    { path: "/", icon: <MdOutlineReorder size={22} />, label: "Orders" },
    { path: "/tables", icon: <MdTableBar size={22} />, label: "Tables" },
    { path: "/menu", icon: <BiSolidDish size={22} />, label: "Menu" },
    ...(isAdmin
      ? [{ path: "/dashboard", icon: <MdDashboard size={22} />, label: "Dashboard" }]
      : []),
    ...(userData.isSuperuser || userData.role === "superadmin"
      ? [{ path: "/user-management", icon: <FaUsers size={22} />, label: "Users" }]
      : []),
  ];

  const getRoleLabel = () => {
    if (userData.isSuperuser) return "Super Admin";
    if (userData.isAdmin) return "Admin";
    return "Staff";
  };


  const handleCloseSidebar = () => {
    // kept for compatibility with profile modal behavior – no-op now
  };

  return (
    <>
      <aside className={`app-sidebar`}>
        <div className="sidebar-inner">
          {/* Header */}
          <div className="sidebar-header">
            <div className="logo">
              <h1>SHARUBATI</h1>
              <span className="subtitle">POS</span>
            </div>
            {/* collapse button removed — sidebar always visible */}
          </div>

          {/* Navigation */}
          <nav className="nav-list">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  handleCloseSidebar();
                }}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                title={item.label}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* New Order */}
          <div className="new-order-wrapper">
            <button 
              onClick={() => {
                handleCreateOrder();
                handleCloseSidebar();
              }} 
              className="new-order-btn"
              title="New Order"
            >
              <BiSolidDish size={22} />
              <span>New Order</span>
            </button>
          </div>

          {/* User Section */}
          <div className="user-section">
            <div
              className="avatar"
              onClick={() => {
                setIsProfileOpen(true);
                handleCloseSidebar();
              }}
              role="button"
              tabIndex={0}
              title="Profile"
            >
              {userData.avatar ? (
                <img src={userData.avatar} alt="Avatar" />
              ) : (
                <FaUserCircle size={42} />
              )}
            </div>

            <div className="user-info">
              <div className="name">{userData.name || "User"}</div>
              <div className="role">{getRoleLabel()}</div>
            </div>

            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="logout-btn"
              title="Logout"
            >
              <IoLogOut size={20} />
            </button>
          </div>
        </div>


      </aside>

      {isProfileOpen && (
        <ProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;