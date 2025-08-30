import '@/global.css';

import { AuthProvider, useAuth } from '@/src/contexts/AuthProvider';
import { ThemeProvider } from '@/src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import 'react-native-reanimated';

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // ou <SplashScreen />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'iFoodRC-Thin': require('../src/assets/fonts/iFoodRCTextos-Thin.ttf'),
    'iFoodRC-Light': require('../src/assets/fonts/iFoodRCTextos-Light.ttf'),
    'iFoodRC-Regular': require('../src/assets/fonts/iFoodRCTextos-Regular.ttf'),
    'iFoodRC-Medium': require('../src/assets/fonts/iFoodRCTextos-Medium.ttf'),
    'iFoodRC-Bold': require('../src/assets/fonts/iFoodRCTextos-Bold.ttf'),
    'iFoodRC-ExtraBold': require('../src/assets/fonts/iFoodRCTextos-ExtraBold.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
