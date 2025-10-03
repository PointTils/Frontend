import Header from '@/src/components/Header';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { Card } from '@/src/components/ui/card';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import type { InterpreterListResponse } from '@/src/types/api';
import { mapModality } from '@/src/utils/masks';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';

function SkeletonCard() {
  return (
    <View className="w-full h-40 bg-gray-200 rounded-2xl mb-4 animate-pulse" />
  );
}

export default function SearchScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterpreterListResponse | null>(null);

  const handleData = (data: InterpreterListResponse) => {
    console.warn('[Search] results:', data);
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

      <View className="mt-4 border-t-[2px] border-gray-200">
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
              return (
                <View className="bg-white border-b-[4px] border-gray-100">
                  <Card
                    variant="search"
                    photoUrl={item.picture}
                    fullName={item?.name || ''}
                    specialty={
                      item.specialties?.map((s) => s.name).join(', ') ?? ''
                    }
                    rating={item?.professional_data?.rating || 0}
                    modality={
                      mapModality(item?.professional_data?.modality) || ''
                    }
                    priceRange={
                      item?.professional_data
                        ? `R$ ${item.professional_data?.min_value ?? '0,00'} - R$ ${item.professional_data?.max_value ?? '0,00'}`
                        : ''
                    }
                    location={
                      item?.locations?.[0]
                        ? `${item.locations[0].city}, ${item.locations[0].uf}`
                        : ''
                    }
                    onPress={() =>
                      router.push({
                        pathname: '/interpreters/[id]',
                        params: { id: item.id },
                      })
                    }
                  />
                </View>
              );
            }}
          />
        ) : (
          <Text className="text-gray-500 text-center mt-6">
            {Strings.common.noResults}
          </Text>
        )}
      </View>
    </View>
  );
}
