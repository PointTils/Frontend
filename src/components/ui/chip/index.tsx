import { Text } from '@/src/components/ui/text';
import React from 'react';
import { View } from 'react-native';


// esse é o componente do quadrado azul das Preferências e Especialidades

type ChipProps = {
  text: string;
};

export function Chip({ text }: ChipProps) {
  return (
    <View className="px-4 py-2 rounded-md bg-sky-500 mr-2 mb-2">
      <Text className="text-white font-ifood-regular text-sm">
        {text}
      </Text>
    </View>
  );
}

export default Chip;
