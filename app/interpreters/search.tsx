import Header from '@/src/components/Header';
import { Card } from '@/src/components/ui/card';
import { View } from '@/src/components/ui/view';
import { router } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function SearchScreen() {
  return (
    <View className="flex-1 w-full">
      <View className="mt-12 pb-2">
        <Header
          title="PESQUISA"
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>
      <Card
        variant="search"
        photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
        fullName="Nome Sobrenome"
        specialty="Intérprete de Libras"
        rating={4.5}
        modality="Presencial/Online"
        priceRange="R$ 100 - R$ 2.500"
        location="Porto Alegre, Canoas & Gravataí"
      />

      <KeyboardAvoidingView
        className="flex-1 px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      />
    </View>
  );
}
