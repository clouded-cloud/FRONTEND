// src/components/auth/Register.jsx
import React from "react";
import { useMutation } from "@tanstack/react-query";
import { register } from "../../https/Index.js";
import { enqueueSnackbar } from "notistack";

const Register = ({ setIsRegister }) => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRole = (role) => {
    setFormData({ ...formData, role });
  };

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (res) => {
      enqueueSnackbar(res.data.message || "Account created successfully!", {
        variant: "success",
      });
      // Switch back to login after 1.5 seconds
      setTimeout(() => setIsRegister(false), 1500);
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Registration failed. Please try again.";
      enqueueSnackbar(msg, { variant: "error" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate(formData);
      }}
    >
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="auth-input"
          placeholder="John Doe"
          required
        />
      </div>

      {/* Email */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="auth-input"
          placeholder="name@company.com"
          required
        />
      </div>

      {/* Phone */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone (optional)
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="auth-input"
          placeholder="0123456789"
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
          className="auth-input"
          placeholder="••••••••"
          required
        />
      </div>

      {/* Role Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Role
        </label>
        <div className="grid grid-cols-3 gap-3">
          {["Waiter", "Cashier", "Admin"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleRole(r)}
              className={`py-3 rounded-xl font-medium transition-all duration-200 ${
                formData.role === r
                  ? "bg-[#0d6efd] text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="auth-btn mt-8"
      >
        {mutation.isPending ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default Register;