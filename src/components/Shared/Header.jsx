import React, { useState } from "react";
import {
  MdOutlineReorder,
  MdTableBar,
  MdDashboard,
  MdClose,
  MdMenu,
} from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { FaUserCircle, FaUsers, FaShoppingCart } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";
import { useMutation } from "@tanstack/react-query";

import ProfileModal from "../Shared/ProfileModal";
import { logout } from "../../https/Index.js";
import { removeUser } from "../../redux/slices/userSlice.js";

const Header = ({ onCartToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user || {});
  const cartItems = useSelector((state) => state.cart?.items ?? []);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name: "", phone: "", guests: 0 }));
    navigate("/tables");
    setIsMobileMenuOpen(false);
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
    { path: "/", icon: <MdOutlineReorder size={20} />, label: "Orders" },
    { path: "/tables", icon: <MdTableBar size={20} />, label: "Tables" },
    { path: "/menu", icon: <BiSolidDish size={20} />, label: "Menu" },
    ...(isAdmin
      ? [{ path: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" }]
      : []),
    ...(userData.isSuperuser || userData.role === "superadmin"
      ? [{ path: "/user-management", icon: <FaUsers size={20} />, label: "Users" }]
      : []),
  ];

  const getRoleLabel = () => {
    if (userData.isSuperuser) return "Super Admin";
    if (userData.isAdmin) return "Admin";
    return "Staff";
  };

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          {/* Logo */}
          <div className="logo-section">
            <div className="logo">
              <h1>SHARUBATI</h1>
              <span className="subtitle">POS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                title={item.label}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="header-right">
            {/* New Order Button */}
            <button
              onClick={handleCreateOrder}
              className="new-order-btn"
              title="New Order"
            >
              <BiSolidDish size={20} />
              <span>New Order</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onCartToggle}
              className="cart-btn"
              title="Shopping Cart"
            >
              <FaShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>

            {/* User Section */}
            <div className="user-section">
              <div
                className="avatar"
                onClick={() => setIsProfileOpen(true)}
                role="button"
                tabIndex={0}
                title="Profile"
              >
                {userData.avatar ? (
                  <img src={userData.avatar} alt="Avatar" />
                ) : (
                  <FaUserCircle size={32} />
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
                <IoLogOut size={18} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              title="Menu"
            >
              {isMobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mobile-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`mobile-nav-item ${isActive(item.path) ? "active" : ""}`}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {isProfileOpen && (
        <ProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      )}

      <style jsx>{`
        .app-header {
          background: #2c5530;
          color: white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          height: 70px;
          max-width: none;
        }

        .logo-section {
          display: flex;
          align-items: center;
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .logo h1 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: white;
        }

        .logo .subtitle {
          font-size: 0.75rem;
          font-weight: 500;
          color: #e8f5e8;
          margin-top: -2px;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          color: #e8f5e8;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .nav-item.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .nav-item .icon {
          display: flex;
          align-items: center;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .new-order-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #d4a574;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .new-order-btn:hover {
          background: #c1915e;
          transform: translateY(-1px);
        }

        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cart-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #d4a574;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          border: 2px solid #2c5530;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .avatar:hover {
          border-color: white;
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .user-info .name {
          font-size: 0.9rem;
          font-weight: 600;
          color: white;
        }

        .user-info .role {
          font-size: 0.75rem;
          color: #e8f5e8;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 6px;
          color: #e8f5e8;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(220, 53, 69, 0.8);
          color: white;
        }

        .mobile-menu-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .mobile-nav {
          display: none;
          background: #2c5530;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          color: #e8f5e8;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-align: left;
        }

        .mobile-nav-item:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .mobile-nav-item.active {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .mobile-nav {
            display: block;
          }

          .header-content {
            padding: 0 1rem;
          }

          .logo h1 {
            font-size: 1.25rem;
          }

          .new-order-btn {
            display: none;
          }

          .user-info {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 0.75rem;
            height: 60px;
          }

          .logo h1 {
            font-size: 1.1rem;
          }

          .logo .subtitle {
            font-size: 0.7rem;
          }

          .cart-btn,
          .mobile-menu-toggle {
            width: 40px;
            height: 40px;
          }

          .avatar {
            width: 36px;
            height: 36px;
          }

          .logout-btn {
            width: 32px;
            height: 32px;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            padding: 0 0.5rem;
          }

          .logo-section {
            flex: 1;
          }

          .header-right {
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
