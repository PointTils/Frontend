import Header from '@/src/components/Header';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Interpreter ID from route params

  return (
    <View className="flex-1">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.requests.request}
          showBackButton={true}
          handleBack={() => router.back()}
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
