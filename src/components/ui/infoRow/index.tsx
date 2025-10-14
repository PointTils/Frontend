import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import React from 'react';
import { View } from '../view';

// esse é o componente da linha de informações da tela de perfil(apenas label e valor)

type InfoRowProps = {
  icon?: React.ReactNode;
  label: string;
  value?: string;
};

export function InfoRow({ icon, label, value }: InfoRowProps) {
  if (!value) return null;

  return (
    <View className={icon ? 'flex-row' : ''}>
      {icon && <View>{icon}</View>}
      <View className="flex-1 pl-2 ">
        <Text className="font-ifood-medium text-left mb-1 text-text-light dark:text-text-dark">
          {label}
        </Text>
        <Text className="font-ifood-regular text-left mb-4 text-text-light dark:text-text-dark">
          {value}
        </Text>
      </View>
    </View>
  );
}

export default InfoRow;
