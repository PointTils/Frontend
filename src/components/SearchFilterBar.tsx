import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Toast } from 'toastify-react-native';

import FilterSheet from './FilterSheet';
import { ApiRoutes } from '../constants/ApiRoutes';
import { Strings } from '../constants/Strings';
import { useAuth } from '../contexts/AuthProvider';
import { useApiGet } from '../hooks/useApi';
import { useColors } from '../hooks/useColors';
import type { UserResponse } from '../types/api';
import { Modality } from '../types/common';
import type { AppliedFilters } from '../types/ui';

/**
 * A search bar component with integrated filters for querying interpreters.
 * Provides a text input for free-text search and quick-access filter buttons
 * (date availability, online modality, and advanced filters via modal).
 *
 * @param onData - Callback function called with API response data (UserResponse)
 *
 * @returns A search bar with input field, filter controls, and modal integration.
 *
 * @example
 * <SearchFilterBar
 *   onData={(data) => {
 *     console.log('Fetched interpreters:', data);
 *   }}
 * />
 *
 */

interface SearchFilterBarProps {
  onData: (data: UserResponse) => void;
}

export default function SearchFilterBar({ onData }: SearchFilterBarProps) {
  const colors = useColors();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<AppliedFilters>({});
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [initialFocus, setInitialFocus] = useState<
    'date' | 'modality' | undefined
  >(undefined);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);

  const handleApplyFilters = (appliedFilters: AppliedFilters) => {
    setFilters(appliedFilters);
    setSheetVisible(false);
  };

  const handlerOnlineButton = (data?: Modality) =>
    data === Modality.ONLINE || data === Modality.ALL
      ? 'border-red-300'
      : 'border-gray-300';

  const handlerOnlineText = (data?: Modality) =>
    data === Modality.ONLINE || data === Modality.ALL
      ? 'text-primary-blue-light'
      : 'text-gray-700';

  const handlerDateText = (data?: string) =>
    data ? 'text-primary-blue-light' : 'text-gray-700';

  const handlerFilterCount = () => {
    const count = Object.values(filters).filter(
      (value) => value !== undefined && value !== null && value !== '',
    ).length;
    return count === 0 ? '' : count;
  };

  const { user, isAuthenticated } = useAuth();

  const buildQuery = (filters: AppliedFilters, queryText?: string) => {
    const query = new URLSearchParams();
    if (queryText && queryText.trim().length > 0) {
      query.append('search', queryText.trim());
    }
    if (filters.specialty?.length)
      query.append('specialty', filters.specialty.join(','));
    if (filters.availableDates) {
      const date = new Date(filters.availableDates);
      const pad = (n: number) => n.toString().padStart(2, '0');

      const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
      query.append('date', formatted);
    }
    if (filters.gender?.length) query.append('gender', filters.gender);
    if (filters.city?.length) query.append('city', filters.city);
    if (filters.state) query.append('uf', filters.state);
    if (filters.modality) query.append('modality', filters.modality);
    return query;
  };

  const { data, error } = useApiGet<UserResponse>(
    user?.id && isAuthenticated
      ? ApiRoutes.interpreters.base(buildQuery(filters, query))
      : '',
  );

  useEffect(() => {
    if (error) {
      router.push('/(tabs)');
      Toast.show({
        type: 'error',
        text1: Strings.search.toast.errorGetTitle,
        text2: Strings.search.toast.errorGetText,
        position: 'top',
        visibilityTime: 2500,
        autoHide: true,
        closeIconSize: 1,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data && data.success && data.data) {
      onData(data);
    }
  }, [data, onData]);

  useEffect(() => {
    if (query.trim().length === 0) {
      setIsSearchSubmitted(false);
    }
  }, [query]);

  const handleSubmitSearch = () => {
    if (query.trim().length > 0) {
      setIsSearchSubmitted(true);
      Keyboard.dismiss();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setIsSearchSubmitted(false);
    Keyboard.dismiss();
  };

  return (
    <View className="px-4 py-2 mt-12">
      <View className="flex-row items-center bg-white rounded-full px-4 shadow-sm border border-gray-200">
        {isSearchSubmitted ? (
          <TouchableOpacity
            onPress={handleClearSearch}
            accessibilityRole="button"
            accessibilityLabel={Strings.common.back}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primaryBlue} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="search" size={20} color={colors.primaryBlue} />
        )}
        <TextInput
          placeholder={Strings.common.search}
          className="ml-2 font-ifood-regular flex-1"
          placeholderTextColor={colors.disabled}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmitSearch}
          returnKeyType="search"
          maxLength={80}
          submitBehavior="blurAndSubmit"
        />
      </View>

      <View className="flex-row justify-center items-center space-x-3 mt-3">
        <TouchableOpacity
          className="px-3 py-2 mr-2 border rounded-md"
          style={{
            borderColor: filters.availableDates
              ? colors.primaryBlue
              : colors.fieldGray,
          }}
          onPress={() => {
            if (filters.availableDates) {
              setFilters({ ...filters, availableDates: undefined });
            } else {
              setInitialFocus('date');
              setSheetVisible(true);
            }
          }}
        >
          <Text
            className={`${handlerDateText(filters.availableDates)} font-ifood-regular`}
          >
            {Strings.search.datesAvailable}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          className={`px-3 py-2 mr-2 border ${handlerOnlineButton(
            filters.modality ?? undefined,
          )} rounded-md`}
          style={{
            borderColor:
              filters.modality === Modality.ONLINE ||
              filters.modality === Modality.ALL
                ? colors.primaryBlue
                : colors.fieldGray,
          }}
          onPress={() =>
            setFilters({
              ...filters,
              modality:
                filters.modality === Modality.ONLINE ||
                filters.modality === Modality.ALL
                  ? null
                  : Modality.ONLINE,
            })
          }
        >
          <Text
            className={`${handlerOnlineText(filters.modality ?? undefined)} font-ifood-regular`}
          >
            {Strings.search.online}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center px-3 py-2 border rounded-md"
          style={{
            borderColor:
              handlerFilterCount() > '' ? colors.primaryBlue : colors.fieldGray,
          }}
          onPress={() => {
            setInitialFocus(undefined);
            setSheetVisible(true);
          }}
        >
          <Feather
            name="sliders"
            size={18}
            color={
              handlerFilterCount() > '' ? colors.primaryBlue : colors.fieldGray
            }
          />
          <Text
            className="ml-1 font-ifood-regular"
            style={{
              color:
                handlerFilterCount() > '' ? colors.primaryBlue : colors.text,
            }}
          >
            {Strings.search.filter} {handlerFilterCount()}
          </Text>
        </TouchableOpacity>
      </View>

      {isSheetVisible && (
        <FilterSheet
          filter={filters}
          onApply={handleApplyFilters}
          initialFocus={initialFocus}
          onClose={() => {
            setSheetVisible(false);
          }}
        />
      )}
    </View>
  );
}
