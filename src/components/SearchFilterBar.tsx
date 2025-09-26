import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useColors } from '../hooks/useColors';
import { Strings } from '../constants/Strings';
import FilterSheet from './FilterSheet';

type AppliedFilters = {
  userId?: number;
  modality?: string;
  availableDates?: string;
  online?: boolean;
  specialty?: string[];
  gender?: string[];
  city?: string[];
  state?: string;
};

export default function SearchFilterBar() {
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<AppliedFilters>({});
  const [isSheetVisible, setSheetVisible] = useState(false);

  const handleApplyFilters = (appliedFilters: AppliedFilters) => {
    console.log('Filtros recebidos:', appliedFilters);
    setFilters(appliedFilters);
    setSheetVisible(false);
  };

  const handlerComplete = (data?: string) =>
    data ? 'border-red-300' : 'border-gray-300';

  const handlerOnline = (data?: string) =>
    data === 'Online' ? 'border-red-300' : 'border-gray-300';

  const handlerFilterCount = () => {
    const count = Object.values(filters).filter(
      (value) => value !== undefined && value !== null && value !== '',
    ).length;

    return count === 0 ? '' : count;
  };

  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
        <Ionicons name="search" size={20} color={colors.primaryBlue} />
        <TextInput
          placeholder={Strings.common.search}
          className="ml-2 flex-1 text-base"
          placeholderTextColor={colors.disabled}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <View className="flex-row justify-start space-x-2 mt-3">
        <TouchableOpacity
          className={`px-3 py-2 mr-2 border ${handlerComplete(
            filters.availableDates,
          )} rounded-md`}
        >
          <Text className="text-gray-700">{Strings.search.datesAvaible}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-3 py-2 mr-2 border ${handlerOnline(
            filters.modality,
          )} rounded-md`}
        >
          <Text className="text-gray-700">{Strings.search.online}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-3 py-2 border border-gray-400 rounded-md"
          onPress={() => setSheetVisible(true)}
        >
          <Feather name="sliders" size={18} color="#374151" />
          <Text className="ml-1 text-gray-700">
            {Strings.search.filter} {handlerFilterCount()}
          </Text>
        </TouchableOpacity>
      </View>

      {isSheetVisible && (
        <FilterSheet
          onApply={handleApplyFilters}
          onClose={() => setSheetVisible(false)}
        />
      )}
    </View>
  );
}
