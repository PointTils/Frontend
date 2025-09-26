import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="interpreter" />
      {/* You can add more screens here as needed*/}
    </Stack>
  );
}
