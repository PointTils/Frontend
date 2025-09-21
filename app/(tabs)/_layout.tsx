import HapticTab from '@/src/components/HapticTab';
import { Text } from '@/src/components/ui/text';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { Tabs, useSegments } from 'expo-router';
import { FileClock, House, User } from 'lucide-react-native';
import React from 'react';
import { HIDE_TABBAR_SEGMENTS } from '@/src/constants/Config';

export default function TabLayout() {
  const colors = useColors();
  const segments = useSegments();
  const hideTabBar = [...segments].some((segment) =>
    HIDE_TABBAR_SEGMENTS.includes(segment),
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primaryOrange,
        headerShown: false,
        tabBarButton: HapticTab,
        // Used to hide tab bar on specific screens
        tabBarStyle: { display: hideTabBar ? 'none' : 'flex' },
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
        name="(profile)"
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
