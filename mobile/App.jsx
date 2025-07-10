import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from 'src/contexts/AuthContext';
import { MetaProvider } from 'src/contexts/MetaContext';
import AppNavigation from 'src/navigation/AppNavigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar />
      <MetaProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </MetaProvider>
    </SafeAreaProvider>
  );
}
