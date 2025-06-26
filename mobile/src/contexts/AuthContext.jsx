import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://10.50.25.99:5000/api';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No token');

      const res = await fetch(`${API_URL}/auth/validate`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Invalid token');

      const data = await res.json();
      if (data.valid) {
        const user = data.user;
        let profile = data.profile;

        if (!profile) {
          const profileRes = await fetch(`${API_URL}/${user.role}/profile?userId=${user.user_id}`);
          profile = await profileRes.json();
        }

        const userData = { ...user, ...profile };
        setCurrentUser(userData);
        setUserRole(user.role);
      } else {
        await AsyncStorage.removeItem('authToken');
      }
    } catch (error) {
      console.log('Auth check failed:', error.message);
      await AsyncStorage.removeItem('authToken');
      setCurrentUser(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (userId, password, role) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, role }),
      });

      if (!res.ok) throw new Error('Login failed');

      const { token, user, profile } = await res.json();
      let profileData = profile;

      if (!profileData) {
        const profileRes = await fetch(`${API_URL}/${user.role}/profile?userId=${user.user_id}`);
        profileData = await profileRes.json();
      }

      const userData = { ...user, ...profileData };
      await AsyncStorage.setItem('authToken', token);
      setCurrentUser(userData);
      setUserRole(user.role);

      return { success: true, role: user.role };
    } catch (e) {
      return { success: false, message: e.message };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setCurrentUser(null);
    setUserRole(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      userRole,
      loading,
      login,
      logout,
      checkAuth,
    }),
    [currentUser, userRole, loading]
  );

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
