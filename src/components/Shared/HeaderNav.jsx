import React from "react";
import { FaHome } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar, MdDashboard } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

const HeaderNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name: "", phone: "", guests: 0 }));
    navigate("/tables");
  };

  const navItems = [
    { path: "/", icon: <FaHome size={20} />, label: "Home" },
    { path: "/orders", icon: <MdOutlineReorder size={20} />, label: "Orders" },
    { path: "/tables", icon: <MdTableBar size={20} />, label: "Tables" },
    { path: "/menu", icon: <BiSolidDish size={20} />, label: "Menu" },
    { path: "/dashboard", icon: <MdDashboard size={20} />, label: "Dashboard" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">POS System</h1>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* New Order Button */}
          <div className="flex items-center">
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
      <div className="md:hidden border-t border-gray-200">
        <nav className="px-4 py-2">
          <div className="flex justify-around">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-2 rounded-md text-xs font-medium transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderNav;
