import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, TouchableOpacity } from 'react-native';
import { Strings } from '../constants/Strings';
import { Radio, RadioGroup, RadioIndicator, RadioLabel } from './ui/radio';
import { useColors } from '../hooks/useColors';

interface FilterSheetProps {
  onApply: (filters: any) => void;
  onClose: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ onApply, onClose }) => {
  const [modality, setModality] = useState('P');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState('');
  const [gender, setGender] = useState('');
  const [filter1, setFilter1] = useState('');
  const [filter2, setFilter2] = useState('');

  const colors = useColors();

  const handleApply = () => {
    onApply({ filter1, filter2 });
  };

  return (
    <Modal transparent animationType="slide">
      <TouchableOpacity className="flex-1 bg-black/40" activeOpacity={1} onPress={onClose} />
      <View className="bg-white p-4 rounded-t-2xl max-h-1/2">
        <Text className="text-lg font-bold mb-4">{Strings.search.modality}</Text>
        <RadioGroup
          value={modality}
          onChange={(value) => setModality(value)}
          className="flex-row items-center mb-4"
        >
          <Radio value="presencial">
            <RadioIndicator className="data-[checked=true]:bg-primary-blue-light data-[checked=true]:border-primary-blue-light" />
            <RadioLabel>
              <Text
                style={{
                  color:
                    modality === 'presencial' ? colors.primaryBlue : colors.disabled,
                }}
                className="font-ifood-regular"
              >
                Presencial
              </Text>
            </RadioLabel>
          </Radio>
          <Radio value="online">
            <RadioIndicator className="data-[checked=true]:bg-primary-blue-light data-[checked=true]:border-primary-blue-light" />

            <RadioLabel>
              <Text
                style={{
                  color:
                    modality === 'online'
                      ? colors.primaryBlue
                      : colors.disabled,
                }}
                className="font-ifood-regular"
              >
                {Strings.search.online}
              </Text>
            </RadioLabel>
          </Radio>
        </RadioGroup>

        <Text className="mb-1">Filtro 1</Text>
        <TextInput
          className="border border-gray-300 rounded p-2 mb-3"
          placeholder="Digite algo..."
          value={filter1}
          onChangeText={setFilter1}
        />

        <Text className="mb-1">Filtro 2</Text>
        <TextInput
          className="border border-gray-300 rounded p-2 mb-3"
          placeholder="Digite algo..."
          value={filter2}
          onChangeText={setFilter2}
        />

        <Button title="Aplicar" onPress={handleApply} />
      </View>
    </Modal>
  );
};

export default FilterSheet;
