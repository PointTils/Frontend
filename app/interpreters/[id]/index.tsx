import Header from '@/src/components/Header';
import { View } from '@/src/components/ui/view';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function InterpreterDetailsScreen() {
  return (
    <View className="flex-1">
      <View className="mt-12 pb-2">
        <Header
          title="AGENDAR"
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1 px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      ></KeyboardAvoidingView>
    </View>
  );
}
