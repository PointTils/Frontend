import { Chip } from '@/src/components/ui/chip';
import React from 'react';
import { View } from 'react-native';

// esse é o componente do grid de chips das Preferências e Especialidades

type ChipsSectionProps = {
  items?: string[];
};

export default function ChipsSection({ items }: ChipsSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <View className="w-full pl-2 pr-2 mt-2 mb-4 flex-row flex-wrap">
      {items.map((text, idx) => (
        <Chip key={`${text}-${idx}`} text={text} />
      ))}
    </View>
  );
}
