import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

import { useAuth } from '../../src/contexts/AuthProvider';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and authenticated, redirect to home
    if (!isLoading && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // While loading or redirecting, don't render anything
  if (isLoading || isAuthenticated) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* You can add more screens here as needed*/}
    </Stack>
  );
}
