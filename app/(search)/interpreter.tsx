import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Image, View } from 'react-native';
import {
  ChevronLeftIcon,
  BriefcaseBusinessIcon,
  SquarePenIcon,
  StarIcon,
  CalendarIcon,
  InfoIcon,
  CameraIcon,
  MapPinIcon,
  BanknoteIcon,
} from 'lucide-react-native';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { useRouter } from 'expo-router';
import { StarRating } from '@/src/components/Rating';

interface InterpreterProps {
  description: string | null;
  image: string;
  name: string;
  rating: number;
  specialty: string[];
  modality: string[];
  location: string[];
  imageRights: string;
  valueRange: string[];
  calendar: string[];
}

export default function Interpreter({
  description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`',
  image = 'https://www.w3schools.com/howto/img_avatar.png',
  name = 'Jefinho Silva',
  rating = 2.7,
  specialty = ['Intérprete de Libras'],
  modality = ['Online e Presencial'],
  location = ['Porto Alegre', 'Canoas', 'Gravataí'],
  imageRights = 'Autoriza',
  valueRange = ['100 - 300'],
}: InterpreterProps) {
  const [section, setSection] = useState<'Avaliações' | 'Dados'>(
    Strings.search.details,
  );

  const colors = useColors();
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    }
  };

  const handleAppoitnmentCreate = () => {
    // @TODO: router.push('/(app)/appointment/create');
  };

  return (
    <>
      {/* Header */}
      <View className="flex-row justify-center py-12">
        <TouchableOpacity
          className="absolute top-12 left-4"
          onPress={handleBack}
        >
          <ChevronLeftIcon color={colors.primaryOrange} />
        </TouchableOpacity>

        <Text className="font-ifood-bold text-text-light dark:text-text-dark">
          {Strings.search.title}
        </Text>
      </View>

      {/* Name and photo section */}
      <ScrollView className="px-8 w-full">
        <View className="items-center flex-row w-full justify-center gap-6">
          <Image className="w-32 h-32 rounded-full" source={{ uri: image }} />

          <View className="flex-col gap-1 w-48">
            <Text className="font-ifood-bold text-lg text-text-light dark:text-text-dark">
              {name}
            </Text>
            <Text numberOfLines={1} className="font-ifood-normal text-lg text-text-light dark:text-text-dark">
              {specialty[0]}
            </Text>
            <StarRating rating={rating} size={20} />
          </View>
        </View>

        {/* Section selector */}
        <View className="flex-row w-full mt-8">
          <TouchableOpacity
            style={{ flex: 0.5 }}
            activeOpacity={1}
            className={`pb-2 items-center ${section === Strings.search.details ? 'border-b-2 border-primary-blue-light' : ''}`}
            onPress={() => setSection(Strings.search.details)}
          >
            <View className="flex-row items-center gap-2">
              <BriefcaseBusinessIcon
                color={
                  section === Strings.search.details
                    ? colors.primaryBlue
                    : colors.disabled
                }
              />
              <Text
                className={`font-ifood-medium text-lg ${section === Strings.search.details ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.search.details}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 0.5 }}
            className={`pb-2 items-center ${section === Strings.search.reviews ? 'border-b-2 border-primary-blue-light' : ''}`}
            onPress={() => setSection(Strings.search.reviews)}
          >
            <View className="flex-row items-center gap-2">
              <StarIcon
                color={
                  section === Strings.search.reviews
                    ? colors.primaryBlue
                    : colors.disabled
                }
              />
              <Text
                className={`font-ifood-medium text-lg ${section === Strings.search.reviews ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.search.reviews}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Information section */}
        {section === Strings.search.details && (
          <>
            <View className="flex-row items-center gap-2 mt-6">
              <SquarePenIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg text-justify">
                {Strings.search.description}
              </Text>
            </View>
            <Text className="px-7">{description}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <InfoIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.modality}
              </Text>
            </View>
            <Text className="px-7">{modality.join(', ')}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <MapPinIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.localization}
              </Text>
            </View>
            <Text className="px-7">{location.join(', ')}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <CameraIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.imageRights}
              </Text>
            </View>
            <Text className="px-7">{imageRights}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <BanknoteIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.valueRange}
              </Text>
            </View>
            <Text className="px-7">{'R$' + valueRange.join('- ')}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <CalendarIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.calendar}
              </Text>
            </View>

            {/*TODO: <Calendario/> */}
          </>
        )}
      </ScrollView>

      <View className="items-center w-full my-6 ring">
        <TouchableOpacity
          className="w-4/5 bg-primary-orange-light mx-6 mb-6 rounded-lg py-3 px-6 items-center"
          onPress={handleAppoitnmentCreate}
        >
          <Text className="font-ifood-bold text-white text-lg">
            {Strings.search.createAppointment}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
