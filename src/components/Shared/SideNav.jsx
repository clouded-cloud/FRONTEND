import React from "react";
import { FaHome, FaUsers } from "react-icons/fa";
import { MdOutlineReorder, MdTableBar, MdDashboard } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCustomer } from "../../redux/slices/customerSlice";

const SideNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isSuperuser } = useSelector((state) => state.user);

  const isActive = (path) => location.pathname === path;

  const handleCreateOrder = () => {
    dispatch(setCustomer({ name: "", phone: "", guests: 0 }));
    navigate("/tables");
  };

  const navItems = [
    { path: "/", icon: <FaHome size={24} />, label: "Home" },
    { path: "/orders", icon: <MdOutlineReorder size={24} />, label: "Orders" },
    { path: "/tables", icon: <MdTableBar size={24} />, label: "Tables" },
    { path: "/menu", icon: <BiSolidDish size={24} />, label: "Menu" },
    { path: "/dashboard", icon: <MdDashboard size={24} />, label: "Dashboard" },
  ];

  // Add User Management for superadmin
  if (isSuperuser === true) {
    navItems.push({
      path: "/user-management",
      icon: <FaUsers size={24} />,
      label: "User Management"
    });
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col shadow-lg z-50">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-yellow-400">SHARUBATI</h1>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive(item.path)
                    ? "bg-yellow-500 text-black font-semibold"
                    : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                {item.icon}
                <span className="text-lg">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Create Order Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleCreateOrder}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <BiSolidDish size={20} />
          <span>New Order</span>
        </button>
      </div>
    </div>
  );
};

export default SideNav;
