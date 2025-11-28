// UseLoadData.js
import { useDispatch } from "react-redux";
import { getUserProfile } from "../https/Index";
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
        setIsLoading(false);
        navigate("/auth");
        return;
      }

      try {
        const response = await getUserProfile();
        console.log("Full API response:", response);
        console.log("Response data:", response?.data);
        console.log("Response data.user:", response?.data?.user);
        
        // Check if response and data exist
        if (!response || !response.data) {
          console.error("Invalid response structure:", response);
          throw new Error("Invalid response from server");
        }

        // Handle different possible response structures
        const userData = response.data.user || response.data;
        
        if (!userData) {
          console.error("No user data found in response");
          throw new Error("No user data found");
        }

        console.log("User data to process:", userData);

        // Safely extract user properties with fallbacks
        const userId = userData.id || userData._id || userData.userId || '';
        const firstName = userData.first_name || userData.firstName || '';
        const lastName = userData.last_name || userData.lastName || '';
        const username = userData.username || userData.user_name || '';
        const email = userData.email || userData.email_address || '';
        
        // Build display name
        let displayName = username;
        if (firstName && lastName) {
          displayName = `${firstName} ${lastName}`;
        } else if (firstName) {
          displayName = firstName;
        } else if (lastName) {
          displayName = lastName;
        }

        // If we still don't have a display name, use email as fallback
        if (!displayName && email) {
          displayName = email.split('@')[0]; // Use part of email before @
        }

        // If no display name at all, use a generic one
        if (!displayName) {
          displayName = 'User';
        }

        // Prepare user object for Redux
        const userPayload = { 
          _id: userId,
          name: displayName,
          email: email,
          phone: userData.phone_number || userData.phone || userData.phoneNumber || '',
          role: (userData.is_admin || userData.is_staff || userData.role === 'admin') ? 'admin' : 'user',
          username: username,
          first_name: firstName,
          last_name: lastName,
          // Map backend flags into the frontend booleans
          isAdmin: Boolean(userData.is_staff || userData.is_admin || userData.isAdmin || userData.role === 'admin'),
          isSuperuser: Boolean(userData.is_superadmin || userData.is_superuser || userData.isSuperuser),
          avatar: userData.avatar || userData.profile_image || userData.profileImage || userData.photo || userData.image || ""
        };

        console.log("Final user payload for Redux:", userPayload);

        // Set user data in Redux
        dispatch(setUser(userPayload));

      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // Clear invalid tokens and user data
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