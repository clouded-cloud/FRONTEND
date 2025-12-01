 // src/components/auth/Login.jsx
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../https/Index.js";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const { data } = res;
      if (data.success && data.user) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        const { id, email, username, first_name, last_name, phone_number } = data.user;
        const isAdmin = data.user.is_staff || data.user.is_admin || false;
        const isSuperuser = data.user.is_superadmin || false;

        dispatch(setUser({
          _id: id,
          name: first_name && last_name ? `${first_name} ${last_name}` : username || email,
          email,
          phone: phone_number || "",
          isAdmin,
          isSuperuser,
        }));

        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate("/");
      }
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.response?.data?.detail || "Login failed";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(formData); }}>
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Employee Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@company.com"
          className="auth-input"
          required
          disabled={loginMutation.isPending}
        />
      </div>

      {/* Password */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="auth-input"
          required
          disabled={loginMutation.isPending}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="auth-btn mt-8"
      >
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default Login;