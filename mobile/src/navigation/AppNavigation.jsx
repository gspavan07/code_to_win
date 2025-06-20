import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import Home from '../screens/Home';
import StudentDashboard from '../screens/dashboards/StudentDashboard';
import FacultyDashboard from '../screens/dashboards/FacultyDashboard';
import HeadDashboard from '../screens/dashboards/HeadDashboard';
import AdminDashboard from '../screens/dashboards/AdminDashboard';
// Add other dashboard screens as needed

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <Stack.Screen name="Home" component={Home} />; // or show a splash/loading screen

  const getDashboard = () => {
    switch (userRole) {
      case 'student':
        return StudentDashboard;
      case 'faculty':
        return FacultyDashboard;
      case 'hod':
        return HeadDashboard;
      case 'admin':
        return AdminDashboard;
      default:
        return LoginScreen;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Dashboard" component={getDashboard()} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
