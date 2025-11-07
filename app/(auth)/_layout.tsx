import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="step-one" />
      <Stack.Screen name="step-two" />
      <Stack.Screen name="step-three" />
      {/* You can add more screens here as needed*/}
    </Stack>
  );
}
