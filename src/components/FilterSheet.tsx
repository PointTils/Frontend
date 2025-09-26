import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Button } from './ui/button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';
import { formatDateTime } from '../utils/masks';
import ModalMultipleSelection from './ModalMultipleSelection';
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from './ui/form-control';
import { Input, InputField } from './ui/input';
import { Strings } from '../constants/Strings';
import ModalSingleSelection from './ModalSingleSelection';
import { useApiGet } from '../hooks/useApi';
import { useAuth } from '../contexts/AuthProvider';
import { ApiRoutes } from '../constants/ApiRoutes';
import { CityResponse, StateResponse } from '../types/api/state';
import { SpecialtiesResponse } from '../types/api/specialties';
import { router } from 'expo-router';
import { Toast } from 'toastify-react-native';

interface FilterSheetProps {
  onApply: (filters: any) => void;
  onClose: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ onApply, onClose }) => {
  const [checkedOnline, setCheckedOnline] = useState(false);
  const [checkedPersonally, setCheckedPersonally] = useState(false);

  const [specialty, setSpecialty] = useState<string[]>([]);
  const [specialtyOptions, setSpecialtyOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const [availableDates, setAvailableDates] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);

  const [gender, setGender] = useState<string[]>([]);
  const [city, setCity] = useState<string[]>([]);
  const [state, setState] = useState<string>('');

  const [statesOptions, setStatesOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { label: string; value: string }[]
  >([]);

  const colors = useColors();
  const { user, isAuthenticated } = useAuth();

  // --- API HOOKS ---
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

  // --- EFFECTS ---

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

  // --- HANDLERS ---
  const handleApply = () => {
    const filters = {
      specialty,
      availableDates,
      gender,
      city,
      state,
      modality: checkedOnline
        ? 'Online'
        : checkedPersonally
          ? 'Presencial'
          : '',
    };

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) =>
          value !== undefined &&
          value !== '' &&
          !(Array.isArray(value) && value.length === 0),
      ),
    );

    onApply(cleanedFilters);
  };

  const genderOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Feminino', value: 'F' },
  ];

  // --- RENDER ---
  return (
    <Modal transparent animationType="slide">
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      />
      <View className="p-4 bg-white h-[550px]">
        {/* Modalidade */}
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
                  <ModalMultipleSelection
                    items={cityOptions}
                    selectedValues={city}
                    onSelectionChange={setCity}
                  />
                ) : (
                  <Text className="text-gray-500 mt-2">
                    Selecione um estado primeiro
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
          <ModalMultipleSelection
            items={specialtyOptions}
            selectedValues={specialty}
            onSelectionChange={setSpecialty}
          />
        </FormControl>

        {/* Data */}
        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.search.date}
            </FormControlLabelText>
          </FormControlLabel>
          <>
            <TouchableOpacity onPress={() => setShow(true)}>
              <Input pointerEvents="none">
                <InputField
                  placeholder="DD/MM/AAAA"
                  className="font-ifood-regular"
                  value={availableDates}
                  editable={false}
                />
              </Input>
            </TouchableOpacity>

            {show && (
              <DateTimePicker
                value={date ?? new Date()}
                mode="datetime"
                display="default"
                onChange={(event, selectedDate?: Date | undefined) => {
                  setShow(false);
                  if (selectedDate) {
                    setDate(selectedDate);
                    setAvailableDates(formatDateTime(selectedDate));
                  }
                }}
              />
            )}
          </>
        </FormControl>

        {/* Gênero */}
        <FormControl className="mb-4">
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              {Strings.search.gender}
            </FormControlLabelText>
          </FormControlLabel>
          <ModalMultipleSelection
            items={genderOptions}
            selectedValues={gender}
            onSelectionChange={setGender}
          />
        </FormControl>

        {/* Botão */}
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
};

export default FilterSheet;
