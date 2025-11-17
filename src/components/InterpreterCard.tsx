import StarRating from '@/src/components/Rating';
import { Text } from '@/src/components/ui/text';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { CalendarDays, MapPin, Info } from 'lucide-react-native';
import React from 'react';
import { View, Pressable } from 'react-native';

import { Avatar, AvatarImage } from './ui/avatar';

type CardVariant = 'appointment' | 'search';

export interface CardProps {
  photoUrl: string;
  fullName: string;

  /** Subtitle (e.g., specialty or CPF/CNPJ) */
  subtitle?: string;
  /** Kept for backward compatibility: used if 'subtitle' is not provided */
  specialty?: string;

  /** Rating 0..5 (visible when showRating=true) */
  rating?: number;
  showRating?: boolean;

  /** Card 3: "pending" badge */
  pending?: boolean;
  pendingLabel?: string;

  /** "Appointment" fields (cards 1–3) */
  date?: string;
  location?: string;

  /** "Search" fields (card 4) */
  variant?: CardVariant; // 'appointment' | 'search'
  modality?: string; // e.g., "Presencial/Online" or "Online"
  isOnlineOnly?: boolean; // true => hides Location

  /** Additional Tailwind classes */
  className?: string;
  onPress?: () => void;
}

/**
 * A reusable card used across two variants:
 * - 'appointment': shows date and location
 * - 'search': shows modality, optional location, and price range
 *
 * Notes:
 * - Rating is displayed with simple stars and a numeric value.
 * - When `pending` is true, a small "Pendente" badge is shown.
 *
 * Usage examples:
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { SafeAreaView } from 'react-native-safe-area-context';
 * import { View } from '@/src/components/ui/view';
 * import InterpreterCard from '@/src/components/InterpreterCard';
 *
 * export default function CardTestScreen() {
 *   return (
 *     <SafeAreaView className="flex-1 bg-background-50">
 *       <View className="flex-1 items-center p-4 gap-y-6">
 *         // CARD 1 — Appointment with rating
 *         <Card
 *           photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
 *           fullName="Nome Sobrenome"
 *           specialty="Intérprete de Libras"
 *           rating={4.4}
 *           showRating
 *           date="20/08/2025 11:30 - 12:30"
 *           location="Av. Ipiranga 6681, Partenon, Porto Alegre - RS"
 *         />
 *
 *         // CARD 2 — TIL (CPF) without stars
 *         <Card
 *           photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
 *           fullName="Nome Sobrenome"
 *           subtitle="XXX.XXX.XXX-XX"
 *           showRating={false}
 *           date="20/08/2025 11:30 - 12:30"
 *           location="Online"
 *         />
 *
 *         // CARD 3 — TIL (CNPJ) without stars + Pending
 *         <Card
 *           photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
 *           fullName="Razão social"
 *           subtitle="XX.XXX.XXX/0001-XX"
 *           showRating={false}
 *           pending
 *           date="20/08/2025 11:30 - 12:30"
 *           location="Av. Ipiranga 6681, Partenon, Porto Alegre - RS"
 *         />
 *
 *         // CARD 4 — Search (with Location)
 *         <Card
 *           variant="search"
 *           photoUrl="https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg"
 *           fullName="Nome Sobrenome"
 *           specialty="Intérprete de Libras"
 *           rating={4.5}
 *           modality="Presencial/Online"
 *           location="Porto Alegre, Canoas & Gravataí"
 *         />
 *       </View>
 *     </SafeAreaView>
 *   );
 * }
 * ```
 */
export default function InterpreterCard({
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
  isOnlineOnly = false,
  className,
  onPress,
}: CardProps) {
  const colors = useColors();

  /** --- Bottom section renderers --- */
  const renderAppointmentBottom = () => (
    <View className="flex-row">
      {/* Date */}
      <View className="flex-1 mr-8">
        <View className="flex-row items-center mb-1">
          <CalendarDays size={12} color={colors.text} />
          <Text className="text-text-light text-xs font-ifood-medium ml-1">
            {Strings.common.fields.date}
          </Text>
        </View>
        <Text className="text-typography-600 font-ifood-regular text-xs">
          {date}
        </Text>
      </View>

      {/* Location */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <MapPin size={12} color={colors.text} />
          <Text className="text-text-light text-xs font-ifood-medium ml-1">
            {Strings.common.fields.location}
          </Text>
        </View>
        <Text
          className="text-typography-600 font-ifood-regular text-xs shrink"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {location}
        </Text>
      </View>
    </View>
  );

  const renderSearchBottom = () => (
    <View>
      {/* First column: modality */}
      <View className="flex-row">
        <View className="flex-1 mr-8">
          <View className="flex-row items-center mb-1">
            <Info size={12} color={colors.text} />
            <Text className="text-text-light text-xs font-ifood-medium ml-1">
              {Strings.common.fields.modality}
            </Text>
          </View>
          <Text className="text-typography-600 font-ifood-regular text-xs">
            {modality}
          </Text>
        </View>

        {/* Second column: location spanning full width */}
        {!isOnlineOnly && !!location && (
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <MapPin size={12} color={colors.text} />
              <Text className="text-text-light text-xs font-ifood-medium ml-1">
                {Strings.common.fields.location}
              </Text>
            </View>
            <Text
              className="text-typography-600 font-ifood-regular text-xs shrink"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {location}
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      className={`relative bg-background-0 p-6 w-full ${className || ''}`}
    >
      {/* Pending badge (Card 3) */}
      {pending && (
        <View
          className="absolute right-6 top-6 flex-row items-center px-2.5 py-1 rounded-md"
          style={{ backgroundColor: colors.pendingBadgeBackground }}
        >
          <Info size={12} color={colors.pendingBadge} />
          <Text
            className="ml-1 text-xs font-ifood-medium"
            style={{ color: colors.pendingBadge }}
          >
            {pendingLabel}
          </Text>
        </View>
      )}

      {/* Header (Avatar + Title/Subtitle + Rating) */}
      <View className="flex-row items-start mb-4 pr-20">
        <Avatar size="xl" borderRadius="full" className="mr-4">
          <AvatarImage
            source={{
              uri:
                photoUrl ||
                'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
            }}
          />
        </Avatar>

        <View className="flex-1 items-start">
          <Text
            className="text-text-light font-ifood-medium text-sm mb-0.5"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {fullName}
          </Text>

          {(subtitle || specialty) && (
            <Text
              className="text-typography-600 font-ifood-regular text-xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle ?? specialty}
            </Text>
          )}

          {showRating && typeof rating === 'number' && (
            <View className="mt-1">
              <StarRating rating={rating} size={14} />
            </View>
          )}
        </View>
      </View>

      {/* Bottom area based on variant */}
      {variant === 'search' ? renderSearchBottom() : renderAppointmentBottom()}
    </Pressable>
  );
}
