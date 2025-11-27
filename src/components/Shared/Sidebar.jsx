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

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user || {});

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

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

  const isSidebarVisible = isCollapsed && isHovered;

  const handleCloseSidebar = () => {
    setIsHovered(false);
  };

  const handleToggleSidebar = () => {
    if (isCollapsed && !isHovered) {
      setIsHovered(true);
    } else {
      setIsCollapsed(!isCollapsed);
      setIsHovered(false);
    }
  };

  return (
    <>
      {/* Toggle Button when sidebar is completely collapsed */}
      {isCollapsed && !isHovered && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setIsHovered(true)}
          aria-label="Open sidebar"
        >
          <MdMenu size={24} />
        </button>
      )}

      <aside 
        className={`app-sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "hover-visible" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sidebar-inner">
          {/* Header */}
          <div className="sidebar-header">
            <div className="logo">
              <h1>SHARUBATI</h1>
              <span className="subtitle">POS</span>
            </div>
            <button
              onClick={handleToggleSidebar}
              className="collapse-btn"
              aria-label="Toggle sidebar"
            >
              <MdClose size={20} />
            </button>
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

        <style jsx>{`
          :root {
            --primary: #2563eb;
            --primary-light: #3b82f6;
            --card: #ffffff;
            --bg: #f8fbff;
            --border: #bae6fd;
            --text: #0c4a6e;
            --text-light: #0369a1;
            --shadow: 0 10px 30px rgba(37, 99, 235, 0.15);
          }

          .sidebar-toggle-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 999;
            background: var(--primary);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            cursor: pointer;
            display: grid;
            place-items: center;
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
          }

          .sidebar-toggle-btn:hover {
            background: var(--primary-light);
            transform: scale(1.1);
          }

          .app-sidebar {
            width: 280px;
            background: var(--card);
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 1000;
            border-right: 1px solid var(--border);
            box-shadow: var(--shadow);
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            transform: translateX(0);
          }

          .app-sidebar.collapsed {
            width: 70px;
            transform: translateX(0);
          }

          .app-sidebar.collapsed:not(.hover-visible) .sidebar-header,
          .app-sidebar.collapsed:not(.hover-visible) .label,
          .app-sidebar.collapsed:not(.hover-visible) .subtitle,
          .app-sidebar.collapsed:not(.hover-visible) .user-info,
          .app-sidebar.collapsed:not(.hover-visible) .new-order-btn span {
            display: none;
          }

          .app-sidebar.collapsed.hover-visible {
            width: 280px;
            transform: translateX(0);
          }

          .app-sidebar.collapsed.hover-visible .sidebar-header,
          .app-sidebar.collapsed.hover-visible .label,
          .app-sidebar.collapsed.hover-visible .subtitle,
          .app-sidebar.collapsed.hover-visible .user-info,
          .app-sidebar.collapsed.hover-visible .new-order-btn span {
            display: block;
          }

          .sidebar-inner {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 1.5rem 0;
          }

          .sidebar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 1.5rem 2rem;
            transition: all 0.3s ease;
          }

          .logo h1 {
            font-size: 1.7rem;
            font-weight: 900;
            color: var(--primary);
            margin: 0;
            transition: opacity 0.3s ease;
          }

          .subtitle {
            font-size: 0.7rem;
            color: var(--text-light);
            font-weight: 600;
            letter-spacing: 2px;
            transition: opacity 0.3s ease;
          }

          .collapse-btn {
            background: var(--primary-light);
            color: white;
            border: none;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            cursor: pointer;
            display: grid;
            place-items: center;
            transition: 0.3s;
          }

          .collapse-btn:hover {
            background: var(--primary);
            transform: rotate(90deg);
          }

          .app-sidebar.collapsed:not(.hover-visible) .collapse-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: var(--primary);
          }

          .nav-list {
            flex: 1;
            padding: 0 0.5rem;
          }

          .app-sidebar.collapsed.hover-visible .nav-list {
            padding: 0 1rem;
          }

          .nav-item {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border-radius: 16px;
            margin-bottom: 0.5rem;
            background: transparent;
            color: var(--text-light);
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
            overflow: hidden;
            justify-content: flex-start;
          }

          .app-sidebar.collapsed:not(.hover-visible) .nav-item {
            justify-content: center;
            padding: 1rem 0.5rem;
          }

          .nav-item:hover {
            background: #e0f2fe;
            color: var(--primary);
          }

          .app-sidebar.collapsed.hover-visible .nav-item:hover {
            transform: translateX(6px);
          }

          .nav-item.active {
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            color: white;
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          }

          .icon {
            flex-shrink: 0;
            width: 24px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .label {
            white-space: nowrap;
            transition: all 0.3s ease;
            opacity: 1;
          }

          .app-sidebar.collapsed:not(.hover-visible) .label {
            display: none;
          }

          .new-order-wrapper {
            padding: 0 1rem;
            margin: 2rem 0;
          }

          .app-sidebar.collapsed:not(.hover-visible) .new-order-wrapper {
            padding: 0 0.5rem;
          }

          .new-order-btn {
            width: 100%;
            padding: 1.1rem;
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            color: white;
            border: none;
            border-radius: 16px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
            transition: all 0.4s;
            overflow: hidden;
          }

          .app-sidebar.collapsed:not(.hover-visible) .new-order-btn {
            padding: 1rem 0.5rem;
            justify-content: center;
          }

          .app-sidebar.collapsed:not(.hover-visible) .new-order-btn span {
            display: none;
          }

          .new-order-btn:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(37, 99, 235, 0.4);
          }

          .user-section {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background: var(--bg);
            border-top: 1px solid var(--border);
            transition: all 0.3s ease;
          }

          .app-sidebar.collapsed:not(.hover-visible) .user-section {
            justify-content: center;
            padding: 1rem 0.5rem;
          }

          .avatar {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            overflow: hidden;
            border: 3px solid var(--border);
            cursor: pointer;
            transition: 0.3s;
            flex-shrink: 0;
          }

          .app-sidebar.collapsed:not(.hover-visible) .avatar {
            width: 40px;
            height: 40px;
          }

          .avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .avatar svg {
            width: 100%;
            height: 100%;
            color: var(--text-light);
          }

          .avatar:hover {
            border-color: var(--primary);
            transform: scale(1.1);
          }

          .user-info {
            flex: 1;
            min-width: 0;
            transition: all 0.3s ease;
          }

          .app-sidebar.collapsed:not(.hover-visible) .user-info {
            display: none;
          }

          .name {
            font-weight: 700;
            color: var(--text);
            font-size: 0.95rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .role {
            font-size: 0.8rem;
            color: var(--text-light);
          }

          .logout-btn {
            background: #fee2e2;
            color: #ef4444;
            border: none;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            cursor: pointer;
            display: grid;
            place-items: center;
            transition: 0.3s;
            flex-shrink: 0;
          }

          .app-sidebar.collapsed:not(.hover-visible) .logout-btn {
            width: 40px;
            height: 40px;
          }

          .logout-btn:hover {
            background: #ef4444;
            color: white;
            transform: scale(1.1);
          }

          @media (max-width: 1024px) {
            .app-sidebar.collapsed:not(.hover-visible) {
              transform: translateX(-100%);
            }
            
            .app-sidebar.collapsed.hover-visible {
              transform: translateX(0);
            }

            .sidebar-toggle-btn {
              display: grid;
            }

            .app-sidebar.collapsed:not(.hover-visible) .collapse-btn {
              display: none;
            }
          }

          @media (min-width: 1025px) {
            .sidebar-toggle-btn {
              display: none;
            }
          }
        `}</style>
      </aside>

      {isProfileOpen && (
        <ProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
};

export default Sidebar;