import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { CalendarDays, MapPin } from 'lucide-react-native';
import { useColors } from '@/src/hooks/useColors';

interface CardProps {
  photoUrl: string;
  fullName: string;
  specialty: string;
  rating: number; // 0 a 5
  date: string;
  location: string;
  className?: string;
}

export function Card({
  photoUrl,
  fullName,
  specialty,
  rating,
  date,
  location,
  className,
}: CardProps) {
  const colors = useColors();
  
  // Função para renderizar as estrelas
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Estrelas preenchidas
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Text key={i} className="text-lg" style={{ color: colors.primaryBlue }}>
          ★
        </Text>
      );
    }

    // Meia estrela
    if (hasHalfStar) {
      stars.push(
        <Text key="half" className="text-lg" style={{ color: colors.primaryBlue }}>
          ☆
        </Text>
      );
    }

    // Estrelas vazias
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Text key={`empty-${i}`} className="text-gray-300 text-lg">
          ☆
        </Text>
      );
    }

    return stars;
  };

  return (
    <Pressable
      className={`bg-background-0 p-6 w-full ${className || ''}`}
    >
      {/* Seção Superior - Perfil e Avaliação */}
      <View className="flex-row items-center mb-4">
        {/* Foto do Perfil */}
        <View className="mr-4">
          <Image
            source={{ uri: photoUrl }}
            className="w-16 h-16 rounded-full"
            resizeMode="cover"
          />
        </View>

        {/* Informações do Perfil */}
        <View className="flex-1 items-start">
          <Text className="text-typography-900 font-medium text-sm mb-0.5">
            {fullName}
          </Text>
          <Text className="text-typography-600 font-regular text-xs">
            {specialty}
          </Text>
          
          {/* Avaliação */}
          <View className="flex-row items-center">
            <View className="flex-row mr-2">
              {renderStars(rating)}
            </View>
            <Text className="text-typography-600 text-xs">
              {rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Seção Inferior - Data e Localização */}
      <View className="flex-row">
        {/* Data */}
        <View className="flex-1 mr-4">
          <View className="flex-row items-center mb-1">
            <CalendarDays size={12} color="#000000"/>
            <Text className="text-primary-800 text-xs font-medium ml-1">
              Data
            </Text>
          </View>
          <Text className="text-typography-500 text-xs">
            {date}
          </Text>
        </View>

        {/* Localização */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <MapPin size={12} color="#000000"/>
            <Text className="text-primary-800 text-xs font-regular ml-1">
              Localização
            </Text>
          </View>
          <Text className="text-typography-500 text-xs">
            {location}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
