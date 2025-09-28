import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { Toast } from 'toastify-react-native';

import ModalMultipleSelection from './ModalMultipleSelection';
import ModalSingleSelection from './ModalSingleSelection';
import { Button } from './ui/button';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from './ui/form-control';
import { Input, InputField } from './ui/input';
import { ApiRoutes } from '../constants/ApiRoutes';
import { Strings } from '../constants/Strings';
import { useAuth } from '../contexts/AuthProvider';
import { useApiGet } from '../hooks/useApi';
import { useColors } from '../hooks/useColors';
import type { SpecialtiesResponse } from '../types/api/specialties';
import type { CityResponse, StateResponse } from '../types/api/state';
import type { AppliedFilters } from '../types/search-filter-bar';
import { formatDateTime } from '../utils/masks';

interface FilterSheetProps {
  onApply: (filters: AppliedFilters) => void;
  onClose: () => void;
  filter: AppliedFilters;
  initialFocus?: 'date' | 'modality';
}

function FilterSheet({
  onApply,
  onClose,
  filter,
  initialFocus,
}: FilterSheetProps) {
  const [checkedOnline, setCheckedOnline] = useState(false);
  const [checkedPersonally, setCheckedPersonally] = useState(false);
  const [showDate, setShowDate] = useState(initialFocus === 'date');
  const [showTime, setShowTime] = useState(false);

  const [specialty, setSpecialty] = useState<string[]>([]);
  const [specialtyOptions, setSpecialtyOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [date, setDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');

  const [statesOptions, setStatesOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const colors = useColors();
  const { user, isAuthenticated } = useAuth();

  const { data: statesData, error: statesError } = useApiGet<StateResponse>(
    user?.id && isAuthenticated ? ApiRoutes.states.base : '',
  );

  const citiesApiUrl =
    user?.id && isAuthenticated && state
      ? ApiRoutes.states.cities(state)
      : null;

  const { data: citiesData, error: citiesError } = useApiGet<CityResponse>(
    citiesApiUrl || '',
  );

  const { data: specialtiesData, error: specialtiesError } =
    useApiGet<SpecialtiesResponse>(
      user?.id && isAuthenticated ? ApiRoutes.specialties.base : '',
    );

  useEffect(() => {
    if (filter) {
      setSpecialty(filter.specialty ?? []);
      setCity(filter.city ?? '');
      setState(filter.state ?? '');
      setGender(filter.gender ?? '');
      if (filter.availableDates) {
        const d = new Date(filter.availableDates);
        setDate(d);
      }
      if (filter.modality === 'ONLINE' || filter.modality === 'ALL')
        setCheckedOnline(true);
      if (filter.modality === 'PERSONALLY' || filter.modality === 'ALL')
        setCheckedPersonally(true);
    }
  }, [filter]);

  // Estados
  useEffect(() => {
    if (statesError || !statesData?.success || !statesData?.data) return;

    const mapped = statesData.data.map((item) => ({
      label: item.name,
      value: item.name,
    }));
    setStatesOptions(mapped);
  }, [statesData, statesError]);

  // Cidades
  useEffect(() => {
    if (citiesError || !citiesData?.success || !citiesData?.data) return;

    const mapped = citiesData.data.map((item) => ({
      label: item.name,
      value: item.name,
    }));
    setCityOptions(mapped);
  }, [citiesData, citiesError]);

  // Especialidades
  useEffect(() => {
    if (specialtiesError || !specialtiesData?.success || !specialtiesData?.data)
      return;

    const mapped = specialtiesData.data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
    setSpecialtyOptions(mapped);
  }, [specialtiesData, specialtiesError]);

  // Tratamento de erro global
  useEffect(() => {
    if (statesError || citiesError || specialtiesError) {
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
  }, [statesError, citiesError, specialtiesError]);

  const handleApply = () => {
    const filters: AppliedFilters = {
      specialty,
      availableDates: date ? date.toISOString() : undefined,
      gender,
      city,
      state,
      modality:
        checkedOnline && checkedPersonally
          ? 'ALL'
          : checkedOnline
            ? 'ONLINE'
            : checkedPersonally
              ? 'PERSONALLY'
              : '',
    };

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0),
      ),
    ) as AppliedFilters;

    onApply(cleanedFilters);
  };

  const genderOptions = [
    { label: 'Masculino', value: 'MALE' },
    { label: 'Feminino', value: 'FEMALE' },
    { label: 'Outros', value: 'OTHERS' },
  ];

  return (
    <Modal transparent animationType="slide">
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      />
      <View className="p-4 bg-white h-[550px]">
        <FormControl className="mb-4 mt-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.search.modality}
            </FormControlLabelText>
          </FormControlLabel>
          <View className="flex-row items-center justify-center gap-8">
            <View className="flex-row items-center">
              <Checkbox
                color={colors.primaryBlue}
                status={checkedOnline ? 'checked' : 'unchecked'}
                onPress={() => setCheckedOnline(!checkedOnline)}
              />
              <Text className="font-ifood-regular text-text-light">
                {Strings.search.online}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Checkbox
                color={colors.primaryBlue}
                status={checkedPersonally ? 'checked' : 'unchecked'}
                onPress={() => setCheckedPersonally(!checkedPersonally)}
              />
              <Text className="font-ifood-regular text-text-light">
                {Strings.search.personally}
              </Text>
            </View>
          </View>
        </FormControl>

        {/* Localização */}
        {checkedPersonally && (
          <FormControl className="mb-4">
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.search.localization}
              </FormControlLabelText>
            </FormControlLabel>
            <View className="flex-row justify-start space-x-2 w-full gap-3">
              <View className="w-[100px]">
                <ModalSingleSelection
                  items={statesOptions}
                  selectedValue={state}
                  onSelectionChange={setState}
                />
              </View>

              <View className="w-[220px]">
                {cityOptions.length > 0 ? (
                  <ModalSingleSelection
                    items={cityOptions}
                    selectedValue={city}
                    onSelectionChange={setCity}
                  />
                ) : (
                  <Text className="text-gray-500 mt-2">
                    {Strings.search.selectCity}
                  </Text>
                )}
              </View>
            </View>
          </FormControl>
        )}

        {/* Especialidade */}
        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.search.specialitie}
            </FormControlLabelText>
          </FormControlLabel>
          <View className="flex-row justify-start items-center space-x-2 gap-3">
            <Ionicons name="book-outline" size={24} color="black" />
            <View className="w-[300px]">
              <ModalMultipleSelection
                items={specialtyOptions}
                selectedValues={specialty}
                onSelectionChange={setSpecialty}
              />
            </View>
          </View>
        </FormControl>

        {/* Data */}
        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.search.date}
            </FormControlLabelText>
          </FormControlLabel>
          <>
            <View className="flex-row justify-start items-center space-x-2 gap-3">
              <Ionicons name="calendar-outline" size={24} color="black" />
              <View className="w-[300px]">
                <TouchableOpacity
                  onPress={() => {
                    setShowDate(true);
                  }}
                >
                  <Input pointerEvents="none">
                    <InputField
                      placeholder="DD/MM/AAAA HH:mm"
                      className="font-ifood-regular"
                      value={date ? formatDateTime(date) : ''}
                      editable={false}
                    />
                  </Input>
                </TouchableOpacity>

                {/* iOS datetime */}
                {showDate && Platform.OS === 'ios' && (
                  <DateTimePicker
                    value={date ?? new Date()}
                    mode="datetime"
                    display="spinner"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDate(false);
                      if (selectedDate) {
                        setDate(selectedDate);
                      }
                    }}
                  />
                )}

                {/* Android date */}
                {showDate && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={date ?? new Date()}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={(event, selectedDate) => {
                      setShowDate(false);
                      if (selectedDate) {
                        setDate(selectedDate);
                        setShowTime(true);
                      }
                    }}
                  />
                )}

                {/* Android time */}
                {showTime && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={date ?? new Date()}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                      setShowTime(false);
                      if (selectedTime) {
                        setDate(selectedTime);
                      }
                    }}
                  />
                )}
              </View>
            </View>
          </>
        </FormControl>

        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.search.gender}
            </FormControlLabelText>
          </FormControlLabel>
          <View className="flex-row justify-start items-center space-x-2 gap-3">
            <Ionicons name="male-female-outline" size={24} color="black" />
            <View className="w-[300px]">
              <ModalSingleSelection
                items={genderOptions}
                selectedValue={gender}
                onSelectionChange={setGender}
              />
            </View>
          </View>
        </FormControl>

        <View className="mt-16 pb-3 gap-4">
          <Button
            onPress={handleApply}
            size="md"
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <Text className="font-ifood-regular text-text-dark">
              {Strings.search.search}
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

export default FilterSheet;
