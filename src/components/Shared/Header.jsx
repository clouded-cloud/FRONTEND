import React from "react";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../../https/Index.js";
import { removeUser } from "../../redux/slices/userSlice.js";
// import logo from "../../assets/images/logo.png"; // Uncomment if you need the logo

const Header = () => {
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: (data) => {
      console.log("Logout successful:", data);
      // Clear tokens from localStorage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Remove user from Redux store
      dispatch(removeUser());
      // Redirect to auth page
      navigate("/auth");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Clear tokens even if there's an error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Remove user from Redux store
      dispatch(removeUser());
      // Redirect to auth page
      navigate("/auth");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8 bg-1a1a1a gap-4">
      {/* LOGO */}
      <div 
        onClick={() => navigate("/")} 
        className="flex items-center gap-2 cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate("/");
          }
        }}
      >
        {/* <img src={logo} className="h-4 w-4" alt="restro logo" /> */}
        <h1 className="text-sm sm:text-lg font-semibold text-f5f5f5 tracking-wide">
          Restro
        </h1>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-4 bg-1f1f1f rounded-15px px-3 sm:px-5 py-2 w-full sm:w-400px lg:w-500px mx-auto">
        <FaSearch className="text-f5f5f5" />
        <input
          type="text"
          placeholder="Search"
          className="bg-1f1f1f focus:outline-none text-f5f5f5 flex-1 w-full"
        />
      </div>

      {/* LOGGED USER DETAILS */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        {userData.role === "Admin" && (
          <div 
            onClick={() => navigate("/dashboard")} 
            className="bg-1f1f1f rounded-15px p-2 sm:p-3 cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate("/dashboard");
              }
            }}
          >
            <MdDashboard className="text-f5f5f5 text-xl sm:text-2xl" />
          </div>
        )}
        
        <div 
          className="bg-1f1f1f rounded-15px p-2 sm:p-3 cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // Add notification functionality here
              console.log("Notifications clicked");
            }
          }}
        >
          <FaBell className="text-f5f5f5 text-xl sm:text-2xl" />
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <FaUserCircle className="text-f5f5f5 text-2xl sm:text-3xl lg:text-4xl" />
          <div className="flex flex-col items-start hidden sm:flex">
            <h1 className="text-sm sm:text-md text-f5f5f5 font-semibold tracking-wide">
              {userData.name || "TEST USER"}
            </h1>
            <p className="text-xs text-ababab font-medium">
              {userData.role || "Role"}
            </p>
          </div>
          <IoLogOut
            onClick={handleLogout}
            className="text-f5f5f5 ml-1 sm:ml-2 cursor-pointer hover:text-red-500 transition-colors"
            size={30}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogout();
              }
            }}
            aria-label="Logout"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;