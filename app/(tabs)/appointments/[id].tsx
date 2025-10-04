import Header from '@/src/components/Header';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

export default function AppointmentDetailsScreen() {
  const { id, returnTo } = useLocalSearchParams<{
    id: string;
    returnTo?: string;
  }>(); // Appointment ID from route params

  const handleBack = (returnTo: string) => {
    const target =
      typeof returnTo === 'string' && returnTo.length > 0
        ? returnTo === '/(tabs)'
          ? '/'
          : returnTo
        : '';

    if (target) {
      router.replace(target as any);
      return;
    }
    router.back();
  };

  return (
    <View className="flex-1">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.appointments.appointment}
          showBackButton={true}
          handleBack={() => handleBack(returnTo || '')}
        />
      </View>

      <ScrollView
        className="flex-1 px-6 py-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-ifood-medium text-text-light dark:text-text-dark">
          #{id}
        </Text>
      </ScrollView>
    </View>
  );
}
