import HapticTab from '@/src/components/HapticTab';
import { Text } from '@/src/components/ui/text';
import { HIDE_TABBAR_SEGMENTS } from '@/src/constants/Config';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useAppointmentNotification } from '@/src/hooks/useAppointmentNotification';
import { useColors } from '@/src/hooks/useColors';
import { router, Tabs, useSegments } from 'expo-router';
import { HistoryIcon, House, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const colors = useColors();

  const hideTabBar = [...segments].some((segment) =>
    HIDE_TABBAR_SEGMENTS.includes(segment),
  );
  const { user } = useAuth();
  const { showAppointmentNotification, setShowAppointmentNotification } =
    useAppointmentNotification(user);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primaryOrange,
        headerShown: false,
        tabBarButton: HapticTab,
        // Used to hide tab bar on specific screens
        tabBarStyle: {
          display: hideTabBar ? 'none' : 'flex',
          paddingBottom: insets.bottom + 6,
        },
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
            e.preventDefault();
            setShowAppointmentNotification(false);
            router.navigate('/appointments');
          },
        }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text className="font-ifood-regular text-xs" style={{ color }}>
              {Strings.appointments.tabBar}
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <HistoryIcon width={24} height={24} stroke={color} />
              {showAppointmentNotification && (
                <View
                  className="absolute -right-1.5 -top-0.5 w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors.error }}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
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
