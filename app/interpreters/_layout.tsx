import { Stack } from 'expo-router';

export default function InterpretersLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="search" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
