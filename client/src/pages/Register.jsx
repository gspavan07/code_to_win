import React, { useState, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff, FiUserCheck } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useMeta } from "../context/MetaContext";

const Register = () => {
  const { depts, years, sections } = useMeta();
  const [formData, setFormData] = useState({
    rollNum: "",
    name: "",
    email: "",
    gender: "",
    dept: "",
    year: "",
    section: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [err, setErr] = useState(null);
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  if (currentUser) {
    return <Navigate to={`/${currentUser.role}`} replace />;
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setIsSubmitting(true);
    // console.log(formData.userId, formData.password, selectedRole);
    try {
      const result = await login(
        formData.rollNum,
        formData.name,
        formData.email,
        formData.branch,
        formData.year,
        formData.section
      );
      if (result.success) {
        navigate(`/${result.role || "student"}`);
      } else {
        setErr(result.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErr(result.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <div className=" pt-16 flex items-center justify-center px-4 py-12">
      <div className="bg-white w-1/2 rounded-xl shadow-lg p-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Add Me to CodeTracker
          </h1>

          {err && <p className="mt-3 text-red-500 text-sm">{err}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="rollNum"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Student ID
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="rollNum"
                type="username"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                placeholder="22A91XXXX"
                autoComplete="rollNum"
                onChange={(e) => handleChange("rollNum", e.target.value)}
              />
            </div>
          </div>
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Student Name
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="name"
                type="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                placeholder="Pavan G"
                autoComplete="name"
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
          </div>
          {/* email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Student Email
            </label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                placeholder="example@gmail.com"
                autoComplete="email"
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>
          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <div className="relative w-full">
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select gender</option>
                {["Male", "Female", "Other"].map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* dept */}
          <div>
            <label
              htmlFor="dept"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Branch
            </label>
            <div className="relative w-full">
              <select
                value={formData.dept}
                onChange={(e) => handleChange("dept", e.target.value)}
                className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select branch</option>
                {depts?.map((dept) => (
                  <option key={dept.dept_code} value={dept.dept_code}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* year */}
          <div>
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Year
            </label>
            <div className="relative w-full">
              <select
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select year</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* section */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Section
            </label>
            <div className="relative w-full">
              <select
                value={formData.section}
                onChange={(e) => handleChange("section", e.target.value)}
                className="w-full border-blue-50 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select section</option>
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
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
                Create Me
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
