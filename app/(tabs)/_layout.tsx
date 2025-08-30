import HapticTab from '@/src/components/HapticTab';
import { Text } from '@/src/components/ui/text';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useColors } from '@/src/hooks/useColors';
import { Tabs, useRouter } from 'expo-router';
import { FileClock, House, User } from 'lucide-react-native';
import React, { useEffect } from 'react';

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const colors = useColors();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.replace('/(auth)');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primaryOrange,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="font-ifood-regular text-xs" style={{ color }}>
              {Strings.home.title}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <House width={24} height={24} stroke={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="font-ifood-regular text-xs" style={{ color }}>
              {Strings.history.title}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <FileClock width={24} height={24} stroke={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="font-ifood-regular text-xs" style={{ color }}>
              {Strings.profile.title}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <User width={24} height={24} stroke={color} />
          ),
        }}
      />
    </Tabs>
  );
}
