import HapticTab from '@/src/components/HapticTab';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { Tabs } from 'expo-router';
import { CalendarFold, PlusCircleIcon, User } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  const colors = useColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: Strings.myAppointments.title,
          tabBarIcon: ({ color }) => (
            <CalendarFold width={28} height={28} stroke={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-appointment"
        options={{
          title: Strings.newAppointment.title,
          tabBarIcon: ({ color }) => (
            <PlusCircleIcon width={28} height={28} stroke={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: Strings.profile.title,
          tabBarIcon: ({ color }) => (
            <User width={28} height={28} stroke={color} />
          ),
        }}
      />
    </Tabs>
  );
}
