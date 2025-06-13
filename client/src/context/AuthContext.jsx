import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
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
        const response = await fetch(`/api/auth/validate`, {
          method: "GET",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          mode: "cors",
        });

        if (!response.ok) throw new Error("Token validation failed");
        const validationData = await response.json();

        if (validationData.valid) {
          const user = validationData.user;
          const userId = user.user_id;
          const role = user.role;

          // Only fetch profile if not included in validationData
          let profileData = {};
          if (!validationData.profile) {
            const profileRes = await fetch(
              `/api/${role}/profile?userId=${encodeURIComponent(userId)}`
            );
            if (!profileRes.ok) throw new Error("Failed to fetch user profile");
            profileData = await profileRes.json();
          } else {
            profileData = validationData.profile;
          }

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

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const { token, user, profile } = await response.json();
      const userId = user.user_id;

      let profileData = profile;
      if (!profileData) {
        const profileRes = await fetch(
          `/api/${user.role}/profile?userId=${encodeURIComponent(userId)}`
        );
        if (!profileRes.ok) throw new Error("Failed to fetch user profile");
        profileData = await profileRes.json();
      }

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

  // Logout does not need to be async
  const logout = () => {
    localStorage.removeItem("authToken");
    setCurrentUser(null);
    setUserRole(null);
  };

  // Memoize context value
  const value = useMemo(
    () => ({
      currentUser,
      userRole,
      loading,
      login,
      logout,
    }),
    [currentUser, userRole, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
