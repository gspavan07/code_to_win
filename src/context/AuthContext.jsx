import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = "http://localhost:5000";
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await fetch(`${API_URL}/auth/validate`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) {
          throw new Error("Token validation failed");
        }

        const validationData = await response.json();

        if (validationData.valid) {
          const user = validationData.user;
          const userId = user.user_id;
          const role = user.role;

          // Construct query string manually
          const profileRes = await fetch(
            `${API_URL}/${role}/profile?userId=${encodeURIComponent(userId)}`
          );

          if (!profileRes.ok) {
            throw new Error("Failed to fetch user profile");
          }

          const profileData = await profileRes.json();

          const userData = { ...user, ...profileData };
          setCurrentUser(userData);
          setUserRole(role);
        } else {
          localStorage.removeItem("authToken");
          setCurrentUser(null);
          setUserRole(null);
        }
      }
    } catch (error) {
      console.error("Auth validation error:", error);
      localStorage.removeItem("authToken");
      setCurrentUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };
  // Check if user is already logged in
  useEffect(() => {
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token, user } = await response.json();

      const userId = user.user_id;

      const profileRes = await fetch(
        `${API_URL}/${user.role}/profile?userId=${encodeURIComponent(userId)}`
      );

      if (!profileRes.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const profileData = await profileRes.json();

      const userData = { ...user, ...profileData };
      localStorage.setItem("authToken", token);
      setCurrentUser(userData);
      setUserRole(user.role);

      return { success: true, role: user.role };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
