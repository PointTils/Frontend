import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Button, ButtonIcon } from './ui/button';
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
import HapticTab from './HapticTab';

interface FilterSheetProps {
  onApply: (filters: any) => void;
  onClose: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ onApply, onClose }) => {
  const [checkedOnline, setCheckedOnline] = useState(false);
  const [checkedPersonally, setCheckedPersonally] = useState(false);
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [gender, setGender] = useState([]);
  const [city, setCity] = useState<string[]>([]);
  const [state, setState] = useState<string>('');
  const [show, setShow] = useState(false);

  const colors = useColors();

  const handleApply = () => {
    const filters = {
      // modalityOnline,
      // modalityPersonally,
      specialty,
      availableDates,
      gender,
      city,
      state,
    };

    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(
        ([_, value]) => value !== undefined && value !== '',
      ),
    );

    onApply(cleanedFilters);
  };
  const cityOptions = [
    { label: 'Porto Alegre', value: 'portoalegre' },
    { label: 'Canoas', value: 'canos' },
    { label: 'Cachoeirinha', value: 'Cachoeirinha' },
  ];

  const stateOptions = [
    { label: 'RS', value: 'rs' },
    { label: 'SP', value: 'sp' },
    { label: 'RJ', value: 'rj' },
  ];

  const specialtyOptions = [
    { label: 'Especialidade 1', value: 'esp1' },
    { label: 'Especialidade 2', value: 'esp2' },
    { label: 'Especialidade 3', value: 'esp3' },
  ];
  return (
    <Modal transparent animationType="slide">
      <TouchableOpacity
        className="flex-1 bg-black/40"
        activeOpacity={1}
        onPress={onClose}
      />
      <View className="p-4 bg-white h-[550px]">
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              Modalidade
            </FormControlLabelText>
          </FormControlLabel>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Checkbox
              status={checkedOnline ? 'checked' : 'unchecked'}
              onPress={() => setCheckedOnline(!checkedOnline)}
            />
            <Text>Online</Text>
            <Checkbox
              status={checkedPersonally ? 'checked' : 'unchecked'}
              onPress={() => setCheckedPersonally(!checkedPersonally)}
            />
            <Text>Presencial</Text>
          </View>
        </FormControl>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              Localização
            </FormControlLabelText>
          </FormControlLabel>
          <View className="flex-row justify-start space-x-2 w-full">
            <View className="w-[100px]">
              <ModalSingleSelection
                items={stateOptions}
                selectedValue={state}
                onSelectionChange={setState}
              />
            </View>

            <View className="w-[200px]">
              <ModalMultipleSelection
                items={cityOptions}
                selectedValues={city}
                onSelectionChange={setCity}
              />
            </View>
          </View>
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              Especialidade
            </FormControlLabelText>
          </FormControlLabel>
          <ModalMultipleSelection
            items={specialtyOptions}
            selectedValues={specialty}
            onSelectionChange={setSpecialty}
          />
        </FormControl>

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              Data
            </FormControlLabelText>
          </FormControlLabel>
          <>
            <TouchableOpacity onPress={() => setShow(true)}>
              <TextInput
                placeholder="DD/MM/AAAA"
                className={`border rounded-lg px-4 py-3 mb-4`}
                value={availableDates}
                editable={false}
              />
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

        <FormControl>
          <FormControlLabel>
            <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
              Genero
            </FormControlLabelText>
          </FormControlLabel>
          <ModalMultipleSelection
            items={specialtyOptions}
            selectedValues={specialty}
            onSelectionChange={setSpecialty}
          />
        </FormControl>
        <View className="mt-14 pb-4 gap-4">
          <Button
            onPress={handleApply}
            size="md"
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <Text className="font-ifood-regular text-text-dark">Buscar</Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default FilterSheet;
