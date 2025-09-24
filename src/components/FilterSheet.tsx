import React, { useState } from 'react';
import { View, Text, TextInput,  Modal, TouchableOpacity } from 'react-native';
import { useColors } from '../hooks/useColors';
import { Button } from './ui/button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Checkbox } from 'react-native-paper';

import { formatDateTime } from '../utils/mask';
import MultiSelect from './MultiSelect';

interface FilterSheetProps {
  onApply: (filters: any) => void;
  onClose: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ onApply, onClose }) => {
  const [checkedOnline, setCheckedOnline] = useState(false);
  const [checkedPersonally, setCheckedPersonally] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [availableDates, setAvailableDates] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [gender, setGender] = useState([]);
  const [city, setCity] =  useState<string[]>([]);
  const [state, setState] = useState('');
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
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
    );

    onApply(cleanedFilters);
  };
  
  return (
    <Modal transparent animationType="slide">
      <TouchableOpacity className="flex-1 bg-black/40" activeOpacity={1} onPress={onClose} />
      <View className="flex-1 p-4 bg-white">
      <View className="p-4">
      <Text className="text-lg font-bold mb-2">Modalidade</Text>
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
    </View>
      <Text className="text-lg font-semibold mb-2">Localização</Text>
      <MultiSelect
          label="city"
          options={['Porto Alergre', 'Canoas']}
          width='w-80'
          placeholder="Selecione uma ou mais opções"
          onChange={setCity}
      />
      <Text className="text-lg font-semibold mb-2">Especialidade</Text>
      <MultiSelect
          label="city"
          options={['Especialidade 1', 'Especialidade 2']}
          width='w-80'
          placeholder="Selecione uma ou mais opções"
          onChange={setCity}
      />
      {/* <Picker selectedValue={city} onValueChange={setCity} className="mb-4 bg-gray-100">
        <Picker.Item label="Selecione a cidade" value="" />
        <Picker.Item label="Porto Alegre" value="Porto Alegre" />
        <Picker.Item label="São Paulo" value="São Paulo" />
      </Picker> */}

      {/* Especialidade */}
      <Text className="text-lg font-semibold mb-2">Especialidade</Text>
      {/* <Picker selectedValue={specialty} onValueChange={setSpecialty} className="mb-4 bg-gray-100">
        <Picker.Item label="Selecione a especialidade" value="" />
        <Picker.Item label="Psicologia" value="Psicologia" />
        <Picker.Item label="Nutrição" value="Nutrição" />
      </Picker> */}

      {/* Data */}
      <Text className="text-lg font-semibold mb-2">Data</Text>
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

      {/* Gênero */}
      <Text className="text-lg font-semibold mb-2">Gênero</Text>
      {/* <Picker selectedValue={gender} onValueChange={setGender} className="mb-6 bg-gray-100">
        <Picker.Item label="Selecione o gênero" value="" />
        <Picker.Item label="Masculino" value="Masculino" />
        <Picker.Item label="Feminino" value="Feminino" />
        <Picker.Item label="Outro" value="Outro" />
      </Picker> */}

      {/* Botão Buscar */}
      <TouchableOpacity className="bg-orange-500 py-3 rounded">
       
        <Button className="text-white text-center text-lg font-semibold" onPress={handleApply} />
      </TouchableOpacity>
    </View>
    </Modal>
  );
};

export default FilterSheet;
