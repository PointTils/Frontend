import '@/global.css';

import { View } from '@/src/components/ui/view';
import { AuthProvider, useAuth } from '@/src/contexts/AuthProvider';
import { ThemeProvider } from '@/src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import ToastManager from 'toastify-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomSplashScreen from '@/app/splash';

import 'react-native-reanimated';

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

/**
 * Navigation controller that handles route changes based on auth state
 */
function NavigationController({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('NavigationController - Auth state:', {
      isAuthenticated,
      isLoading,
      segments,
      inAuthGroup,
      inTabsGroup,
    });

    if (isAuthenticated && inAuthGroup) {
      // User is authenticated but in auth screens, redirect to tabs
      console.log('Redirecting to tabs...');
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inTabsGroup) {
      // User is not authenticated but in protected screens, redirect to auth
      console.log('Redirecting to auth...');
      router.replace('/(auth)');
    } else if (!inAuthGroup && !inTabsGroup && !isLoading) {
      // User is at root level, decide where to go
      if (isAuthenticated) {
        console.log('Initial redirect to tabs...');
        router.replace('/(tabs)');
      } else {
        console.log('Initial redirect to auth...');
        router.replace('/(auth)');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  return <>{children}</>;
}

/**
 * Root navigator component with fixed routing structure
 */
function RootNavigator() {
  return (
    <NavigationController>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </NavigationController>
  );
}

/**
 * App content component that uses the auth context.
 */
function AppContent() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const { isLoading: authLoading } = useAuth();

  const [fontsLoaded] = useFonts({
    'iFoodRC-Thin': require('@/src/assets/fonts/iFoodRCTextos-Thin.ttf'),
    'iFoodRC-Light': require('@/src/assets/fonts/iFoodRCTextos-Light.ttf'),
    'iFoodRC-Regular': require('@/src/assets/fonts/iFoodRCTextos-Regular.ttf'),
    'iFoodRC-Medium': require('@/src/assets/fonts/iFoodRCTextos-Medium.ttf'),
    'iFoodRC-Bold': require('@/src/assets/fonts/iFoodRCTextos-Bold.ttf'),
    'iFoodRC-ExtraBold': require('@/src/assets/fonts/iFoodRCTextos-ExtraBold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
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
    }
  }, [appIsReady, fontsLoaded]);

  // Show splash while fonts are loading or app is preparing
  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  // Show custom splash while auth is loading or animation hasn't finished
  const showCustomSplash = !animationFinished || authLoading;

  return (
    <View onLayout={hideNativeSplash} className="flex-1">
      {showCustomSplash && (
        <CustomSplashScreen onFinish={() => setAnimationFinished(true)} />
      )}

      {!showCustomSplash && <RootNavigator />}

      <ToastManager />
      <StatusBar style="auto" />
    </View>
  );
}

/**
 * Root layout component that wraps the entire application.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
