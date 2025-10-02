import Header from '@/src/components/Header';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { Card } from '@/src/components/ui/card';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import {
  InterpreterResponseData,
  UserListResponse,
  UserType,
} from '@/src/types/api';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, FlatList, Text } from 'react-native';

const SkeletonCard = () => (
  <View className="w-full h-40 bg-gray-200 rounded-2xl mb-4 animate-pulse" />
);

const isInterpreter = (item: any): item is InterpreterResponseData =>
  item.type === UserType.INTERPRETER;

export default function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UserListResponse | null>(null);

  const handleData = (data: UserListResponse) => {
    setLoading(true);
    setTimeout(() => {
      setResult(data);
      setLoading(false);
    }, 1000);
  };
  return (
    <View className="flex-1 w-full">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.common.headers.search}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      <SearchFilterBar onData={handleData} />

      <View className="flex-1 px-6 mt-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : result?.data?.length ? (
          <FlatList
            data={result.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const interpreter = isInterpreter(item) ? item : null;
              return (
                <Card
                  variant="search"
                  photoUrl={item.picture}
                  fullName={interpreter?.name || ''}
                  specialty={
                    item.specialties?.map((s) => s.name).join(', ') ?? ''
                  }
                  rating={interpreter?.professional_data?.rating || 0}
                  modality={interpreter?.professional_data?.modality || ''}
                  priceRange={
                    interpreter
                      ? `R$ ${interpreter.professional_data?.min_value ?? '0,00'} - R$ ${interpreter.professional_data?.max_value ?? '0,00'}`
                      : ''
                  }
                  location={
                    interpreter?.locations?.[0]
                      ? `${interpreter.locations[0].city}, ${interpreter.locations[0].uf}`
                      : ''
                  }
                />
              );
            }}
          />
        ) : (
          <Text className="text-gray-500 text-center mt-6">
            {Strings.common.noResults}
          </Text>
        )}
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      />
    </View>
  );
}
