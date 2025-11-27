// UseLoadData.js
import { useDispatch } from "react-redux";
import { getUserData } from "../https/Index";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const useLoadData = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Check if we have a token first
      const token = localStorage.getItem('access_token');
      if (!token) {
        dispatch(removeUser());
        navigate("/auth");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getUserData();
        console.log("User data response:", response);
        
        const userData = response.data.user;
        
        // Set user data in Redux
        dispatch(setUser({ 
          _id: userData.id,
          name: userData.first_name && userData.last_name 
            ? `${userData.first_name} ${userData.last_name}` 
            : userData.username,
          email: userData.email,
          phone: userData.phone_number || '',
          role: userData.is_admin ? 'admin' : 'user',
          username: userData.username,
          first_name: userData.first_name,
          last_name: userData.last_name,
          // Map backend flags into the frontend booleans expected by userSlice
          isAdmin: Boolean(userData.is_staff || userData.is_admin || userData.isAdmin),
          isSuperuser: Boolean(userData.is_superadmin || userData.is_superuser || userData.isSuperuser),
          avatar: userData.avatar || userData.profile_image || userData.profileImage || userData.photo || ""
        }));

      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        dispatch(removeUser());
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [dispatch, navigate]);

  return isLoading;
};

export default useLoadData;