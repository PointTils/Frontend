import React from 'react';
import { View, Text } from 'react-native';
import { StarIcon } from 'lucide-react-native';
import { useColors } from '@/src/hooks/useColors';

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
export function StarRating({
  rating,
  size = 24,
  color = useColors().primaryBlue,
}: StarRatingProps) {
  const totalStars = 5;

  return (
    <View className="flex-row relative items-center">
      {/* Estrelas de fundo cinza */}
      {Array.from({ length: totalStars }).map((_, i) => (
        <StarIcon
          stroke={useColors().disabled}
          key={i}
          fill="none"
          width={size}
          height={size}
        />
      ))}

      {/* Estrelas preenchidas proporcionalmente */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          overflow: 'hidden',
          width: (rating / totalStars) * size * totalStars,
          flexDirection: 'row',
        }}
      >
        {Array.from({ length: totalStars }).map((_, i) => (
          <StarIcon
            key={i}
            stroke={color}
            fill={color}
            width={size}
            height={size}
          />
        ))}
      </View>

      <Text className="mx-3 font-ifood-light">{rating}</Text>
    </View>
  );
}
