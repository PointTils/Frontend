import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
} from 'react-native';
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
import { useApiGet } from '@/src/hooks/useApi';
import InterpreterCalendar from '@/src/components/InterpreterCalendar';
import { Schedule, TimeSlot } from '@/src/types/api/schedule';
import { InterpreterResponseDTO } from '@/src/types/api/interpreter';
import { useSearchParams } from 'expo-router/build/hooks';
import { SCHEDULE_ENABLED } from '@/src/constants/Config';

export const mockInterpreter: InterpreterResponseDTO = {
  id: '70010538-7b5e-40b2-981d-4ad65a14a225',
  email: 'jefinho.silva@example.com',
  type: 'professional',
  status: 'active',
  phone: '+55 51 99999-9999',
  picture: 'https://www.w3schools.com/howto/img_avatar.png',
  name: 'Jefinho Silva',
  gender: 'MALE',
  birthday: '1990-05-20',
  cpf: '123.456.789-00',
  locations: [
    {
      id: '1',
      uf: 'RS',
      city: 'Porto Alegre',
      neighborhood: 'Moinhos de Vento',
    },
    {
      id: '2',
      uf: 'RS',
      city: 'Canoas',
      neighborhood: 'Centro',
    },
  ],
  specialties: [
    {
      id: '1',
      name: 'Intérprete de Libras',
    },
    {
      id: '2',
      name: 'Tradução Técnica',
    },
  ],
  professional_data: {
    cnpj: null,
    rating: 4.5,
    modality: 'Online e Presencial',
    description:
      'Intérprete profissional com 10 anos de experiência em Libras e tradução técnica.',
    min_value: 100,
    max_value: 300,
    image_rights: true,
  },
};

type TimeSelection = { date: string; time: string } | null;

export default function InterpreterDetails() {
  const [section, setSection] = useState<'Avaliações' | 'Dados'>(
    Strings.search.details,
  );
  const [selectTime, setSelectedTime] = useState<TimeSelection>(null);
  const colors = useColors();
  const router = useRouter();
  const params = useSearchParams();

  const now = new Date();
  const then = new Date(now);
  then.setDate(now.getDate() + 30);
  const interpreterString = params.get('interpreter');

  // Mock pra teste caso não receba o parâmetro
  const interpreter: InterpreterResponseDTO = interpreterString
    ? (JSON.parse(interpreterString) as InterpreterResponseDTO)
    : mockInterpreter;

  // Request dos schedules
  const {
    data: schedules,
    loading,
    error,
  } = useApiGet<any>('/schedules/available', {
    interpreterId: '9b135ab3-5a12-4649-8cd2-93e8cdf16ff3',
    dateFrom: now.toISOString().split('T')[0],
    dateTo: then.toISOString().split('T')[0],
  });

  // Handler de retorno
  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    }
  };

  // Handler para criar agendamento
  const handleAppointmentCreate = () => {
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
      <ScrollView className="px-8">
        <View className="items-center flex-row w-full justify-center gap-4">
          <Image
            className="w-24 h-24 rounded-full"
            source={{ uri: interpreter.picture }}
          />

          <View className="flex-col gap-1">
            <Text className="font-ifood-bold text-lg text-text-light dark:text-text-dark">
              {interpreter.name}
            </Text>
            <Text className="font-ifood-normal text-lg text-text-light dark:text-text-dark">
              {interpreter.specialties[0].name}
            </Text>
            <StarRating
              rating={interpreter.professional_data.rating}
              size={20}
            />
          </View>
        </View>

        {/* Section selector */}
        <View className="flex-row w-full mt-6">
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
              <Text className="font-ifood-medium text-lg">
                {Strings.search.description}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.professional_data.description}
            </Text>
            <View className="flex-row items-center gap-2 mt-6">
              <InfoIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.modality}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.professional_data.modality}
            </Text>
            <View className="flex-row items-center gap-2 mt-6">
              <MapPinIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.localization}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.locations.map((loc) => loc.neighborhood).join(', ')}
            </Text>

            <View className="flex-row items-center gap-2 mt-6">
              <CameraIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.imageRights}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.professional_data.image_rights
                ? Strings.search.imageRightsAuthorize
                : Strings.search.imageRightsNotAuthorize}
            </Text>
            <View className="flex-row items-center gap-2 mt-6">
              <BanknoteIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.valueRange}
              </Text>
            </View>
            <Text className="px-7">
              {'R$' +
                interpreter.professional_data.min_value +
                '-' +
                interpreter.professional_data.max_value}
            </Text>

            {loading ? (
              <View className="h-40 items-center justify-center">
                <ActivityIndicator size="large" color={colors.primaryBlue} />
              </View>
            ) : (
              <InterpreterCalendar
                schedules={schedules?.data ?? []}
                selectedTime={selectTime}
                onTimeSelect={setSelectedTime}
              />
            )}
          </>
        )}
      </ScrollView>

      <View className="items-center w-full p-6">
        <TouchableOpacity
          className="w-4/5 bg-primary-orange-light rounded-md py-3 px-6 mb-6"
          onPress={handleAppointmentCreate}
        >
          <Text className="font-ifood-bold text-white text-lg text-center">
            {Strings.search.createAppointment}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
