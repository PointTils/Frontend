import HapticTab from '@/src/components/HapticTab';
import { Text } from '@/src/components/ui/text';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { Tabs } from 'expo-router';
import { FileClock, House, User } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  const colors = useColors();

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
        name="(search)"
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
