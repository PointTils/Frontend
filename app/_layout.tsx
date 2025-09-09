import '@/global.css';

import { AuthProvider, useAuth } from '@/src/contexts/AuthProvider';
import { ThemeProvider } from '@/src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { View } from '@/src/components/ui/view';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import CustomSplashScreen from './splash';

import 'react-native-reanimated';
import { useCallback, useState, useEffect } from 'react';

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <CustomSplashScreen onFinish={() => {}} />;
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

  const [loaded] = useFonts({
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
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn('Error during app preparation:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (loaded) {
      prepare();
    }
  }, [loaded]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
          <RootNavigator />
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    </AuthProvider>
  );
}
