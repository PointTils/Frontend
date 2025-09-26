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
import { useApiGet } from '@/src/hooks/useApi';
import InterpreterCalendar from '@/src/components/InterpreterCalendar';
import { PaginatedScheduleResponseDTO } from '@/src/types/api/schedule';
import { InterpreterResponseDTO } from '@/src/types/api/interpreter';
import { useSearchParams } from 'expo-router/build/hooks';


export const mockInterpreter: InterpreterResponseDTO = {
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  email: "jefinho.silva@example.com",
  type: "professional",
  status: "active",
  phone: "+55 51 99999-9999",
  picture: "https://www.w3schools.com/howto/img_avatar.png",
  name: "Jefinho Silva",
  gender: "MALE",
  birthday: "1990-05-20",
  cpf: "123.456.789-00",
  locations: [
    {
      id: "1",
      uf: "RS",
      city: "Porto Alegre",
      neighborhood: "Moinhos de Vento",
    },
    {
      id: "2",
      uf: "RS",
      city: "Canoas",
      neighborhood: "Centro",
    },
  ],
  specialties: [
    {
      id: "1",
      name: "Intérprete de Libras",
    },
    {
      id: "2",
      name: "Tradução Técnica",
    },
  ],
  professional_data: {
    cnpj: null,
    rating: 4.5,
    modality: "Online e Presencial",
    description: "Intérprete profissional com 10 anos de experiência em Libras e tradução técnica.",
    min_value: 100,
    max_value: 300,
    image_rights: true,
  },
};

export const mockSchedules: PaginatedScheduleResponseDTO = {
  page: 1,
  size: 30,
  total: 30,
  items: Array.from({ length: 30 }, (_, i) => {
    const today = new Date();
    today.setDate(today.getDate() + i);

    const day = today.toISOString().split("T")[0];

    return {
      id: i + 1,
      interpreterId: 1,
      day,
      startTime: "09:00",
      endTime: "18:00",
    };
  }),
};


export default function InterpreterDetails() {
  const [section, setSection] = useState<'Avaliações' | 'Dados'>(
    Strings.search.details,
  );

  const colors = useColors();
  const router = useRouter();
  const params = useSearchParams();

  const now = new Date();
  const then = new Date(now);
  then.setDate(now.getDate() + 30);
  const interpreterString = params.get('interpreter'); 

  // Mock pra teste caso não receba o parâmetro
  const interpreter: InterpreterResponseDTO = interpreterString
    ? JSON.parse(interpreterString) as InterpreterResponseDTO
    : mockInterpreter; 

  // Request dos schedules
  const { data: schedules, loading, error } = useApiGet<PaginatedScheduleResponseDTO>(
    '/schedules',
    {
      interpreterId: interpreter.id,
      status: 'available',
      dateFrom: now.toISOString().split('T')[0],
      dateTo: then.toISOString().split('T')[0],
    }
  );

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
          <Image className="w-24 h-24 rounded-full" source={{ uri: interpreter.picture }} />

          <View className="flex-col gap-1">
            <Text className="font-ifood-bold text-lg text-text-light dark:text-text-dark">
              {interpreter.name}
            </Text>
            <Text className="font-ifood-normal text-lg text-text-light dark:text-text-dark">
              {interpreter.specialties[0].name}
            </Text>
            <StarRating rating={interpreter.professional_data.rating} size={20} />
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
            <Text className="px-7">{interpreter.professional_data.description}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <InfoIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.modality}
              </Text>
            </View>
            <Text className="px-7">{interpreter.professional_data.modality}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <MapPinIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.localization}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.locations.map(loc => loc.neighborhood).join(", ")}
            </Text>

            <View className="flex-row items-center gap-2 mt-6">
              <CameraIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.imageRights}
              </Text>
            </View>
            <Text className="px-7">{interpreter.professional_data.image_rights
              ? Strings.search.imageRightsAuthorize
              : Strings.search.imageRightsNotAuthorize
            }</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <BanknoteIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.valueRange}
              </Text>
            </View>
            <Text className="px-7">{'R$' + interpreter.professional_data.min_value + '-'
              + interpreter.professional_data.max_value}</Text>
            <View className="flex-row items-center gap-2 mt-6">
              <CalendarIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.calendar}
              </Text>
            </View>


            {
              // @TODO: loading and error states
              <InterpreterCalendar schedules={mockSchedules?.items ?? []} />
            }

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
