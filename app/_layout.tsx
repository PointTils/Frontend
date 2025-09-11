import '@/global.css';

import { AuthProvider, useAuth } from '@/src/contexts/AuthProvider';
import { ThemeProvider } from '@/src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { View } from '@/src/components/ui/view';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomSplashScreen from './splash';

import 'react-native-reanimated';
import { useCallback, useState, useEffect } from 'react';

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync();

async function clearAllStorage(): Promise<void> {
  try {
    await AsyncStorage.clear();
    console.warn('All AsyncStorage cleared successfully');
  } catch (error) {
    console.error('Failed to clear all storage:', error);
    throw error;
  }
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Quando a autenticação estiver pronta, espere a splash animação
      const timer = setTimeout(() => setIsSplashReady(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || !isSplashReady) {
    return <CustomSplashScreen onFinish={() => setIsSplashReady(true)} />;
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
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);

  const [fontsLoaded] = useFonts({
    'iFoodRC-Thin': require('../src/assets/fonts/iFoodRCTextos-Thin.ttf'),
    'iFoodRC-Light': require('../src/assets/fonts/iFoodRCTextos-Light.ttf'),
    'iFoodRC-Regular': require('../src/assets/fonts/iFoodRCTextos-Regular.ttf'),
    'iFoodRC-Medium': require('../src/assets/fonts/iFoodRCTextos-Medium.ttf'),
    'iFoodRC-Bold': require('../src/assets/fonts/iFoodRCTextos-Bold.ttf'),
    'iFoodRC-ExtraBold': require('../src/assets/fonts/iFoodRCTextos-ExtraBold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate some async tasks like fetching data or loading resources
        await clearAllStorage();

        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  const hideNativeSplash = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
      setSplashHidden(true);
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <View onLayout={hideNativeSplash} style={{ flex: 1 }}>
          {splashHidden && <RootNavigator />}
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}
