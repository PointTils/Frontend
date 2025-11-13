import { Stack } from 'expo-router';
import React from 'react';

export default function ForgotPasswordLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="step-one" />
      <Stack.Screen name="step-two" />
      <Stack.Screen name="step-three" />
    </Stack>
  );
}
