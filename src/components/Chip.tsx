import { Text } from '@/src/components/ui/text';
import React from 'react';
import { View } from 'react-native';

type ChipProps = {
  text: string;
};

/**
 * A component to display a colored chip with text.
 *
 * @param text - The text to display inside the chip.
 *
 * @returns A styled chip component.
 *
 * @example
 * <Chip text="Example Chip" />
 */
export default function Chip({ text }: ChipProps) {
  return (
    <View className="px-4 py-2 rounded-md bg-sky-500 mr-2 mb-2">
      <Text className="text-white font-ifood-regular text-sm">{text}</Text>
    </View>
  );
}
