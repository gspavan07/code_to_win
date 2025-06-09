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

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Validate token on backend
          const response = await axios.get(`${API_URL}/auth/validate`, {
            headers: {
              Authorization: `${token}`,
            },
          });

          if (response.data.valid) {
            const userId = response.data.user.user_id;
            const result = await axios.get(
              `${API_URL}/${response.data.user.role}/profile`,
              {
                params: {
                  userId,
                },
              }
            );
            const userData = { ...response.data.user, ...result.data };
            setCurrentUser(userData);
            setUserRole(response.data.user.role);
          } else {
            // Invalid token, clear it
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

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        role,
      });

      const { token, user } = response.data;

      const userId = user.user_id;
      const result = await axios.get(`${API_URL}/${user.role}/profile`, {
        params: {
          userId,
        },
      });
      const userData = { ...user, ...result.data };
      localStorage.setItem("authToken", token);
      setCurrentUser(userData);
      setUserRole(user.role);
      return { success: true, role: user.role };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
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
