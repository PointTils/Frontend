import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '@/src/components/ui/checkbox';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { CheckIcon } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Platform } from 'react-native';
import { Toast } from 'toastify-react-native';

import HapticTab from './HapticTab';
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
import { genders, specialties } from '../constants/ItemsSelection';
import { Strings } from '../constants/Strings';
import { useAuth } from '../contexts/AuthProvider';
import { useApiGet } from '../hooks/useApi';
import {
  type StateAndCityResponse,
  type Gender,
  Modality,
} from '../types/api/common';
import type { AppliedFilters } from '../types/ui';
import { formatDateTime } from '../utils/masks';

interface FilterSheetProps {
  onApply: (filters: AppliedFilters) => void;
  onClose: () => void;
  filter: AppliedFilters;
  initialFocus?: 'date' | 'modality';
}

export default function FilterSheet({
  onApply,
  onClose,
  filter,
  initialFocus,
}: FilterSheetProps) {
  const [showDate, setShowDate] = useState(initialFocus === 'date');
  const [showTime, setShowTime] = useState(false);

  const [specialty, setSpecialty] = useState<string[]>([]);
  const [date, setDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender | null>(null);
  const [modality, setModality] = useState<Modality[]>([]);
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');

  const [statesOptions, setStatesOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const { user, isAuthenticated } = useAuth();

  const { data: statesData, error: statesError } =
    useApiGet<StateAndCityResponse>(
      user?.id && isAuthenticated ? ApiRoutes.states.base : '',
    );

  const citiesApiUrl =
    user?.id && isAuthenticated && state
      ? ApiRoutes.states.cities(state)
      : null;

  const { data: citiesData, error: citiesError } =
    useApiGet<StateAndCityResponse>(citiesApiUrl || '');

  useEffect(() => {
    if (filter) {
      setSpecialty(filter.specialty ?? []);
      setCity(filter.city ?? '');
      setState(filter.state ?? '');
      setGender(filter.gender ?? null);

      if (filter.availableDates) {
        const d = new Date(filter.availableDates);
        setDate(d);
      }

      if (filter.modality) {
        if (filter.modality === Modality.ALL) {
          setModality([Modality.ONLINE, Modality.PERSONALLY]);
        } else {
          setModality([filter.modality]);
        }
      }
    }
  }, [filter]);

  // Fetch states
  useEffect(() => {
    if (statesError || !statesData?.success || !statesData?.data) return;

    const mapped = statesData.data.map((item) => ({
      label: item.name,
      value: item.name,
    }));
    setStatesOptions(mapped);
  }, [statesData, statesError]);

  // Fetch cities when state changes
  useEffect(() => {
    if (citiesError || !citiesData?.success || !citiesData?.data) return;

    const mapped = citiesData.data.map((item) => ({
      label: item.name,
      value: item.name,
    }));
    setCityOptions(mapped);
  }, [citiesData, citiesError]);

  // Global error handling
  useEffect(() => {
    if (statesError || citiesError) {
      router.push('/');
      Toast.show({
        type: 'error',
        text1: Strings.search.toast.errorGetTitle,
        text2: Strings.search.toast.errorGetText,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
    }
  }, [statesError, citiesError]);

  const handleApply = () => {
    const filters: AppliedFilters = {
      specialty,
      availableDates: date ? date.toISOString() : undefined,
      gender,
      city,
      state,
      modality:
        modality.length === 2
          ? Modality.ALL
          : modality.length === 1
            ? modality[0]
            : undefined,
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

  return (
    <Modal transparent animationType="slide">
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      />
      <View className="p-4 bg-white py-8">
        <FormControl className="mb-4 mt-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.common.fields.modality}
            </FormControlLabelText>
          </FormControlLabel>
          <View className="flex-row items-center justify-center gap-8">
            <CheckboxGroup
              value={modality}
              onChange={(keys: string[]) => {
                setModality(keys as Modality[]);
              }}
              className="flex-row justify-around w-80 py-2"
            >
              <Checkbox value={Modality.PERSONALLY}>
                <CheckboxIndicator className="border w-6 h-6">
                  <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="font-ifood-regular">
                  {Strings.common.options.inPerson}
                </CheckboxLabel>
              </Checkbox>
              <Checkbox value={Modality.ONLINE}>
                <CheckboxIndicator className="border w-6 h-6">
                  <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel className="font-ifood-regular">
                  {Strings.common.options.online}
                </CheckboxLabel>
              </Checkbox>
            </CheckboxGroup>
          </View>
        </FormControl>

        {/* Location */}
        {modality.includes(Modality.PERSONALLY) && (
          <FormControl className="mb-4">
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.common.fields.location}
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

        {/* Specialties */}
        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.common.fields.specialties}
            </FormControlLabelText>
          </FormControlLabel>
          <View className="flex-row justify-start items-center space-x-2 gap-3">
            <Ionicons name="book-outline" size={24} color="black" />
            <View className="w-[300px]">
              <ModalMultipleSelection
                items={specialties}
                selectedValues={specialty}
                onSelectionChange={setSpecialty}
              />
            </View>
          </View>
        </FormControl>

        {/* Date */}
        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.common.fields.date}
            </FormControlLabelText>
          </FormControlLabel>
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
        </FormControl>

        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.common.fields.gender}
            </FormControlLabelText>
          </FormControlLabel>
          <View className="flex-row justify-start items-center space-x-2 gap-3">
            <Ionicons name="male-female-outline" size={24} color="black" />
            <View className="w-[300px]">
              <ModalSingleSelection
                items={genders}
                selectedValue={gender ?? ''}
                onSelectionChange={(value: string) =>
                  setGender(value as Gender)
                }
              />
            </View>
          </View>
        </FormControl>

        <View className="mt-24 gap-4">
          <Button
            onPress={handleApply}
            size="md"
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <Text className="font-ifood-regular text-text-dark">
              {Strings.common.buttons.search}
            </Text>
          </Button>
          <HapticTab
            onPress={() => {
              setModality([]);
              setCity('');
              setState('');
              setSpecialty([]);
              setDate(null);
              setGender(null);
              onApply({});
            }}
            className="flex-row justify-center py-2"
          >
            <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
              {Strings.common.buttons.clean}
            </Text>
          </HapticTab>
        </View>
      </View>
    </Modal>
  );
}
