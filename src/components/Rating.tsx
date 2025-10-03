import { useColors } from '@/src/hooks/useColors';
import { StarIcon } from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';

interface StarRatingProps {
  rating: number;
  size?: number;
  color?: string;
}
/**
 * Componente de renderização de rating com estrelas
 *
 * @param rating Valor numérico referente à nota do intérprete
 * @param size Tamanho da estrela, não obrigatório.
 * @param color Cor das estrelas, não obrigatório.
 * @returns
 */
export function StarRating({ rating, size = 24, color }: StarRatingProps) {
  const colors = useColors();
  const totalStars = 5;
  const starColor = color ?? colors.primaryBlue;

  return (
    <View className="flex-row relative items-center">
      {Array.from({ length: totalStars }).map((_, i) => (
        <StarIcon
          key={i}
          stroke={colors.disabled}
          fill="none"
          width={size}
          height={size}
        />
      ))}

      <View
        className="absolute top-0 left-0 overflow-hidden flex-row"
        style={{
          // dynamic width must stay inline
          width: (rating / totalStars) * size * totalStars,
        }}
      >
        {Array.from({ length: totalStars }).map((_, i) => (
          <StarIcon
            key={i}
            stroke={starColor}
            fill={starColor}
            width={size}
            height={size}
          />
        ))}
      </View>

      <Text className="mx-3 font-ifood-light">{rating}</Text>
    </View>
  );
}
