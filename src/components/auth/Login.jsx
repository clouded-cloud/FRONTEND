import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { login } from "../../https/Index.js"
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    }

    const loginMutation = useMutation({
        mutationFn: (reqData) => login(reqData),
        onSuccess: (res) => {
            const { data } = res;
            console.log('Login successful:', data);
            
            // ✅ FIXED: Extract data from the correct structure
            if (data.success && data.user) {
                const { 
                    id, 
                    email, 
                    username, 
                    first_name, 
                    last_name, 
                    is_admin, 
                    phone_number 
                } = data.user;
                
                // ✅ Store the access token for future API calls
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                
                // ✅ Dispatch user data with correct field mapping
                dispatch(setUser({ 
                    _id: id, 
                    name: first_name && last_name ? `${first_name} ${last_name}` : username,
                    email: email,
                    phone: phone_number || '',
                    role: is_admin ? 'admin' : 'user'
                }));
                
                enqueueSnackbar('Login successful!', { variant: "success" });
                navigate("/");
            } else {
                enqueueSnackbar('Login failed: Invalid response format', { variant: "error" });
            }
        },
        onError: (error) => {
            console.error('Login error:', error);
            const { response } = error;
            if (response && response.data) {
                enqueueSnackbar(
                    response.data.message || 
                    response.data.detail || 
                    response.data.error || 
                    'Login failed', 
                    { variant: "error" }
                );
            } else {
                enqueueSnackbar('Network error: Could not connect to server', { variant: "error" });
            }
        }
    })

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                        Employee Email
                    </label>
                    <div className="flex items-center rounded-lg p-5 px-4 bg-gray-800 border border-gray-600">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter employee email"
                            className="bg-transparent flex-1 text-white focus:outline-none placeholder-gray-400"
                            required
                            disabled={loginMutation.isPending}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                        Password
                    </label>
                    <div className="flex items-center rounded-lg p-5 px-4 bg-gray-800 border border-gray-600">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="bg-transparent flex-1 text-white focus:outline-none placeholder-gray-400"
                            required
                            disabled={loginMutation.isPending}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full rounded-lg mt-6 py-3 text-lg bg-yellow-400 text-gray-900 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </div>
    );
};

export default Login;