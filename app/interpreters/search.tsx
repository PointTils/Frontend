import Header from '@/src/components/Header';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { Card } from '@/src/components/ui/card';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import type { InterpretersResponse, Gender, Modality } from '@/src/types/api';
import type { AppliedFilters } from '@/src/types/ui';
import { formatDateToISO, mapModality } from '@/src/utils/masks';
import { router, useLocalSearchParams } from 'expo-router';
import { PackageSearchIcon } from 'lucide-react-native';
import React, { Fragment, useState } from 'react';
import { ActivityIndicator, ScrollView, Text } from 'react-native';

export default function SearchScreen() {
  const colors = useColors();

  const params = useLocalSearchParams<{
    name?: string;
    specialty?: string;
    date?: string;
    gender?: string;
    city?: string;
    uf?: string;
    modality?: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InterpretersResponse | null>(null);

  // Prepare initial filters from URL params
  const initialFilters: AppliedFilters = {
    specialty: params.specialty ? params.specialty.split(',') : [],
    availableDates: formatDateToISO(params.date),
    gender: (params.gender as Gender) || undefined,
    city: params.city || undefined,
    state: params.uf || undefined,
    modality: (params.modality as Modality) || undefined,
  };

  const handleData = (data: InterpretersResponse) => {
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
          title={Strings.search.header}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      <SearchFilterBar
        onData={handleData}
        initialQuery={params.name || ''}
        initialFilters={initialFilters}
      />

      {/* Divider */}
      <View className="w-full h-[1px] bg-gray-200" />

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator color={colors.primaryBlue} size="small" />
          <Text className="mt-2 font-ifood-regular text-primary-blue-light">
            {Strings.common.loading}
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
        <View className="flex-1 justify-center gap-y-4 items-center">
          <PackageSearchIcon size={38} color={colors.detailsGray} />
          <Text className="font-ifood-regular text-typography-400 text-md">
            {Strings.common.noResults}
          </Text>
        </View>
      )}
    </View>
  );
}
