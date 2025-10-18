import Chip from '@/src/components/Chip';
import React from 'react';
import { View } from 'react-native';

type ChipsSectionProps = {
  items?: string[];
};

/**
 * A component to display a section of chips.
 *
 * @param items - An array of strings to display as chips.
 *
 * @returns A styled section containing multiple chip components.
 *
 * @example
 * <ChipsSection items={['Chip 1', 'Chip 2', 'Chip 3']} />
 */
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
