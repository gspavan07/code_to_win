import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AuthProvider } from 'src/contexts/AuthContext';
import AppNavigation from 'src/navigation/AppNavigation';
import './global.css';
export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
