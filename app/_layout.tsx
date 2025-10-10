import '@/global.css';

import CustomSplashScreen from '@/app/splash';
import { View } from '@/src/components/ui/view';
import { AuthProvider, useAuth } from '@/src/contexts/AuthProvider';
import { ThemeProvider } from '@/src/contexts/ThemeProvider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { clearAsyncStorage } from '@/src/utils/helpers';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState, useEffect } from 'react';
import ToastManager from 'toastify-react-native';

import 'react-native-reanimated';

// Instruct SplashScreen not to hide yet, we want to do this manually
SplashScreen.preventAutoHideAsync();

/**
 * Navigation controller that handles route changes based on auth state
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {JSX.Element} The navigation controller component.
 */
function NavigationController({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isFirstTime } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Don't navigate while loading

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inOnboarding = segments[0] === 'onboarding';
    const inInterpreters = segments[0] === 'interpreters';
    const inRequests = segments[0] === 'requests';

    if (isAuthenticated && isFirstTime && !inOnboarding) {
      // First time user, show onboarding
      router.replace('/onboarding');
    } else if (
      isAuthenticated &&
      !isFirstTime &&
      (inAuthGroup || inOnboarding)
    ) {
      // Existing user, redirect to tabs
      router.replace('/(tabs)');
    } else if (
      !isAuthenticated &&
      (inTabsGroup || inOnboarding || inInterpreters || inRequests)
    ) {
      // Not authenticated, redirect to auth
      router.replace('/(auth)');
    } else if (
      !inAuthGroup &&
      !inTabsGroup &&
      !inOnboarding &&
      !inInterpreters &&
      !inRequests &&
      !isLoading
    ) {
      // At root level, decide where to go
      if (isAuthenticated) {
        router.replace(isFirstTime ? '/onboarding' : '/(tabs)');
      } else {
        router.replace('/(auth)');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, isFirstTime, segments]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

/**
 * Root navigator component that defines the main navigation structure.
 * @returns {JSX.Element} The root navigator component.
 */
function RootNavigator() {
  return (
    <NavigationController>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="interpreters" />
        <Stack.Screen name="requests" />
      </Stack>
    </NavigationController>
  );
}

/**
 * App content component that uses the auth context.
 * @returns {JSX.Element} The app content component.
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

        // Force a clean start by clearing AsyncStorage (development only) - uncomment if needed
        // await clearAsyncStorage();
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
