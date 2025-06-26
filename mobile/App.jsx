import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from 'src/contexts/AuthContext';
import AppNavigation from 'src/navigation/AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'src/contexts/ThemeContext';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar />
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
