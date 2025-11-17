import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import React from 'react';

type InfoRowProps = {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  onlyLabel?: boolean;
  border?: boolean;
  valueColor?: string;
};

/**
 * A component to display a row of information with an optional icon, label, and value.
 *
 * @param icon - An optional icon to display alongside the label.
 * @param label - The label text for the information row.
 * @param value - The value text for the information row.
 * @param valueColor - Optional color for the value text.
 * @param onlyLabel - If true, only the label will be displayed, even if the value is not provided.
 * @param border - If true, a border will be added around the value text.
 *
 * @returns A React component that displays an information row.
 *
 * @example
 * <InfoRow
 *   icon={<SomeIcon />}
 *   label="Email"
 *   value="email@example.com"
 *   valueColor="text-blue-500"
 */
export default function InfoRow({
  icon,
  label,
  value,
  onlyLabel = false,
  border = false,
  valueColor,
}: InfoRowProps) {
  if (!value && !onlyLabel) return null;

  return (
    <View className={icon ? 'flex-row' : ''}>
      {icon && <View>{icon}</View>}
      <View className="flex-1 pl-2">
        <Text className="font-ifood-medium text-left mb-1 text-text-light dark:text-text-dark">
          {label}
        </Text>
        {border ? (
          <View className="border border-gray-200 p-2 mb-4 rounded-lg">
            <Text
              className={`font-ifood-regular text-left ${valueColor ? valueColor : 'text-text-light'} dark:text-text-dark`}
            >
              {value}
            </Text>
          </View>
        ) : (
          <Text
            className={`font-ifood-regular text-left mb-4 ${valueColor ? valueColor : 'text-text-light'} dark:text-text-dark`}
          >
            {value}
          </Text>
        )}
      </View>
    </View>
  );
}
