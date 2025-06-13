import React, { useState, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiEye, FiEyeOff, FiUserCheck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const ROLES = ["student", "faculty", "hod", "admin"];

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [err, setErr] = useState(null);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  const togglePasswordVisibility = useCallback(
    () => setShowPassword((prev) => !prev),
    []
  );

  const onSubmit = useCallback(
    async (data) => {
      setErr(null);
      setIsSubmitting(true);
      try {
        const result = await login(data.email, data.password, selectedRole);
        if (result.success) {
          navigate(`/${result.role || selectedRole}`);
        } else {
          setErr(result.message);
        }
      } catch (error) {
        console.error("Login error:", error);
        setErr(result.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [login, navigate, selectedRole]
  );

  const handleRoleChange = useCallback((role) => setSelectedRole(role), []);

  return (
    <div className=" pt-16 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Login to CodeTracker
          </h1>
          <p className="text-gray-600 mt-2">
            Access your dashboard based on your role
          </p>
          {err && <p className="mt-3 text-red-500 text-sm">{err}</p>}
        </div>

        {/* Role selection */}
        <div className="mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-1">
            {ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`px-4 py-2 rounded-md capitalize text-sm font-medium transition-colors ${
                  selectedRole === role
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-500"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select your role to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 ${
                  errors.email ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="your.email@example.com"
                autoComplete="username"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10 pr-10 ${
                  errors.password ? "border-red-500 focus:ring-red-500" : ""
                }`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center px-4 py-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                <FiUserCheck className="mr-2" />
                Sign in
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
