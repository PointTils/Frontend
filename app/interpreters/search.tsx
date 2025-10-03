import Header from '@/src/components/Header';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { Card } from '@/src/components/ui/card';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import type { InterpreterListResponse } from '@/src/types/api';
import { mapModality } from '@/src/utils/masks';
import { router } from 'expo-router';
import React, { Fragment, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';

export default function SearchScreen() {
  const colors = useColors();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterpreterListResponse | null>(null);

  const handleData = (data: InterpreterListResponse) => {
    setLoading(true);
    setTimeout(() => {
      setResult(data);
      setLoading(false);
    }, 1000);
  };

  return (
    <View className="flex-1 w-full">
      <View className="mt-12 pb-2 mb-4">
        <Header
          title={Strings.common.headers.search}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      <SearchFilterBar onData={handleData} />

      {/* Divider */}
      <View className="w-full h-[1px] bg-gray-200" />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color={colors.primaryBlue} size="small" />
          <Text className="mt-2 font-ifood-regular text-primary-blue-light">
            {Strings.common.Loading}
          </Text>
        </View>
      ) : result?.data?.length ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="pb-4">
            {result.data.map((item) => (
              <Fragment key={item.id}>
                <View className="w-full h-px bg-gray-200" />
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
                <View className="w-full h-px bg-gray-200" />
              </Fragment>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text className="text-gray-500 text-center mt-6">
          {Strings.common.noResults}
        </Text>
      )}
    </View>
  );
}
