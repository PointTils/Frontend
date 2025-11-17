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
 * Component to display a star rating system.
 *
 * @param rating value between 0 and 5.
 * @param size size of the stars, default is 24.
 * @param color color of the stars, optional.
 *
 * @returns A React component that visually represents the rating with stars.
 */
export default function StarRating({
  rating,
  size = 24,
  color,
}: StarRatingProps) {
  const colors = useColors();
  const totalStars = 5;
  const starColor = color ?? colors.primaryBlue;
  const textSizeClass = size <= 14 ? 'text-sm' : 'text-md';

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
        className={`absolute left-0 overflow-hidden flex-row ${size === 14 ? 'top-0.5' : 'top-0'}`}
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

      <Text
        className={`mx-2 font-ifood-light text-typography-600 ${textSizeClass}`}
      >
        {rating}
      </Text>
    </View>
  );
}
