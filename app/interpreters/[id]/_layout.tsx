import { Stack } from 'expo-router';

export default function InterpreterDetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="to-schedule" />
    </Stack>
  );
}
