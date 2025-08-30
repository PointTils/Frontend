import '@/global.css';
import { ThemeProvider } from '@/src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

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
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="OnboardingUserScreen" options={{ headerShown: false }} />
        {/* ADICIONADO: registra a nova tela */}
        <Stack.Screen name="OnboardingCompanyScreen" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
