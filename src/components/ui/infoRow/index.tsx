import { Text } from '@/src/components/ui/text';
import React from 'react';

type InfoRowProps = {
  label: string;
  value?: string;
};

export function InfoRow({ label, value }: InfoRowProps) {
  if (!value) return null;

  return (
    <>
      <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
        {label}
      </Text>
      <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
        {value}
      </Text>
    </>
  );
}

export default InfoRow;
