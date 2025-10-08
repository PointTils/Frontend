import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import React from 'react';

type IconComponent = React.ComponentType<{
  width?: number;
  height?: number;
  color?: string;
}>;

type InfoRowProps = {
  icon?: IconComponent;
  label: string;
  value?: string;
};

export function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  const colors = useColors();

  if (!label) return null;

  return (
    <View className={`w-full ${value ? 'mb-4' : ''}`}>
      <View className="flex-row items-center gap-2 mb-1">
        {Icon ? <Icon width={16} height={16} color={colors.text} /> : null}
        <Text className="text-base font-ifood-medium text-left text-primary-800">
          {label}
        </Text>
      </View>
      <Text
        className={`w-full ${Icon ? 'pl-6' : ''} text-base font-ifood-regular text-left text-primary-800`}
      >
        {value}
      </Text>
    </View>
  );
}

export default InfoRow;
