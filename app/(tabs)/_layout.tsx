import HapticTab from '@/src/components/HapticTab';
import { Text } from '@/src/components/ui/text';
import { HIDE_TABBAR_SEGMENTS } from '@/src/constants/Config';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { router, Tabs, useSegments } from 'expo-router';
import { HistoryIcon, House, User } from 'lucide-react-native';
import React from 'react';

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
        tabBarStyle: { display: hideTabBar ? 'none' : 'flex', height: 70 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="font-ifood-regular text-xs" style={{ color }}>
              {Strings.home.tabBar}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <House width={24} height={24} stroke={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // avoid default behavior (keeping last nested route)
            router.navigate('/appointments'); // go to index of the tab
          },
        }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="font-ifood-regular text-xs" style={{ color }}>
              {Strings.appointments.tabBar}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <HistoryIcon width={24} height={24} stroke={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="font-ifood-regular text-xs" style={{ color }}>
              {Strings.profile.tabBar}
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
