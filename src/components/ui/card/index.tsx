import React from 'react';
import { View, Image, Pressable } from 'react-native';
import { Text } from '@/src/components/ui/text';
import { CalendarDays, MapPin, Info, Wallet } from 'lucide-react-native';
import { useColors } from '@/src/hooks/useColors';

type CardVariant = 'appointment' | 'search';

interface CardProps {
  photoUrl: string;
  fullName: string;

  /** Subtítulo (ex.: especialidade ou CPF/CNPJ) */
  subtitle?: string;
  /** Mantido p/ compat: usado se 'subtitle' não vier */
  specialty?: string;

  /** Avaliação 0..5 (mostra se showRating=true) */
  rating?: number;
  showRating?: boolean;

  /** Card 3: badge de "pendente" */
  pending?: boolean;
  pendingLabel?: string;

  /** Campos "Appointment" (cards 1–3) */
  date?: string;
  location?: string;

  /** Campos "Search" (card 4) */
  variant?: CardVariant;            // 'appointment' | 'search'
  modality?: string;                // ex.: "Presencial/Online" ou "Online"
  priceRange?: string;              // ex.: "R$ 100 - R$ 2.500"
  isOnlineOnly?: boolean;           // true => oculta Localização

  className?: string;
  onPress?: () => void;
}

export function Card({
  photoUrl,
  fullName,
  subtitle,
  specialty,
  rating = 0,
  showRating = true,
  pending = false,
  pendingLabel = 'Pendente',
  date,
  location,
  variant = 'appointment',
  modality,
  priceRange,
  isOnlineOnly = false,
  className,
  onPress,
}: CardProps) {
  const colors = useColors();

  const renderStars = (value: number) => {
    const stars = [];
    const full = Math.floor(value);
    const hasHalf = value % 1 !== 0;

    for (let i = 0; i < full; i++) {
      stars.push(
        <Text key={`full-${i}`} className="text-lg" style={{ color: colors.primaryBlue }}>
          ★
        </Text>
      );
    }
    if (hasHalf) {
      stars.push(
        <Text key="half" className="text-lg" style={{ color: colors.primaryBlue }}>
          ☆
        </Text>
      );
    }
    const empty = 5 - Math.ceil(value);
    for (let i = 0; i < empty; i++) {
      stars.push(
        <Text key={`empty-${i}`} className="text-gray-300 text-lg">
          ☆
        </Text>
      );
    }
    return stars;
  };

  /** --- Bottom section renderers --- */
  const renderAppointmentBottom = () => (
    <View className="flex-row">
      {/* Data */}
      <View className="flex-1 mr-4">
        <View className="flex-row items-center mb-1">
          <CalendarDays size={12} color="#000000" />
          <Text className="text-primary-800 text-xs font-medium ml-1">Data</Text>
        </View>
        <Text className="text-typography-500 text-xs">{date}</Text>
      </View>

      {/* Localização */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <MapPin size={12} color="#000000" />
          <Text className="text-primary-800 text-xs font-regular ml-1">Localização</Text>
        </View>
        <Text className="text-typography-500 text-xs">{location}</Text>
      </View>
    </View>
  );

  const renderSearchBottom = () => (
    <View>
      <View className="flex-row">
        {/* Modalidade (e Localização logo abaixo, se houver) */}
        <View className="flex-1 mr-4">
          <View className="flex-row items-center mb-1">
            <Info size={12} color="#000000" />
            <Text className="text-primary-800 text-xs font-medium ml-1">Modalidade</Text>
          </View>
          <Text className="text-typography-500 text-xs">{modality}</Text>

          {!isOnlineOnly && !!location && (
            <View className="mt-4">
              <View className="flex-row items-center mb-1">
                <MapPin size={12} color="#000000" />
                <Text className="text-primary-800 text-xs font-regular ml-1">
                  Localização
                </Text>
              </View>
              <Text className="text-typography-500 text-xs">{location}</Text>
            </View>
          )}
        </View>

        {/* Faixa de valores */}
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Wallet size={12} color="#000000" />
            <Text className="text-primary-800 text-xs font-regular ml-1">
              Faixa de valores
            </Text>
          </View>
          <Text className="text-typography-500 text-xs">{priceRange}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      className={`relative bg-background-0 p-6 w-full ${className || ''}`}
    >
      {/* Badge Pendente (Card 3) */}
      {pending && (
        <View
          className="absolute right-6 top-6 flex-row items-center px-2.5 py-1 rounded-md"
          style={{ backgroundColor: '#FCEFE6' }}
        >
          <Info size={12} color="#C96A2C" />
          <Text className="ml-1 text-xs font-medium" style={{ color: '#C96A2C' }}>
            {pendingLabel}
          </Text>
        </View>
      )}

      {/* Cabeçalho (Avatar + Título/Subtitle + Rating) */}
      <View className="flex-row items-start mb-4 pr-20">
        <Image
          source={{ uri: photoUrl }}
          className="w-16 h-16 rounded-full mr-4"
          resizeMode="cover"
        />

        <View className="flex-1 items-start">
          <Text
            className="text-typography-900 font-medium text-sm mb-0.5"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {fullName}
          </Text>

          {(subtitle || specialty) && (
            <Text
              className="text-typography-600 font-regular text-xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle ?? specialty}
            </Text>
          )}

          {showRating && typeof rating === 'number' && (
            <View className="flex-row items-center mt-1">
              <View className="flex-row mr-2">{renderStars(rating)}</View>
              <Text className="text-typography-600 text-xs">{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Base conforme o variant */}
      {variant === 'search' ? renderSearchBottom() : renderAppointmentBottom()}
    </Pressable>
  );
}
