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
import { InterpreterResponseData, UserResponse } from '@/src/types/api/user';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import Header from '@/src/components/Header';
import { Schedule, ScheduleResponse } from '@/src/types/api/schedule';

type TimeSelection = { date: string; time: string } | null;

export default function InterpreterDetails() {
  const [section, setSection] = useState<'Avaliações' | 'Dados'>(
    Strings.search.details,
  );
  const [selectTime, setSelectedTime] = useState<TimeSelection>(null);
  const colors = useColors();
  const router = useRouter();
  const now = new Date();
  const then = new Date(now);
  then.setDate(now.getDate() + 30);

  const params = useLocalSearchParams<{ id: string }>();

  const interpreterId = params.id;

  // Request do intérprete
  const {
    data: interpreter,
    loading: loadingInterpreter,
    error: errorInterpreter,
  } = useApiGet<UserResponse>(`/interpreters/${interpreterId}`);

  // Request dos schedules
  const {
    data: schedules,
    loading: loadingSchedule,
    error: errorSchedule,
  } = useApiGet<ScheduleResponse>('/schedules/available', {
    interpreterId: interpreterId,
    dateFrom: now.toISOString().split('T')[0],
    dateTo: then.toISOString().split('T')[0],
  });

  // Handler para criar agendamento
  const handleAppointmentCreate = () => {
    // @TODO: router.push('/(app)/appointment/create');
  };

  if (loadingInterpreter) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primaryBlue} />
      </View>
    );
  }

  if (errorInterpreter || !interpreter) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          {errorInterpreter ?? 'Intérprete não encontrado'}
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Header */}
      <View className="mt-12">
        <Header
          title={Strings.search.title}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      {/* Name and photo section */}
      <ScrollView className="px-8">
        <View className="items-center flex-row w-full justify-center gap-4">
          <Image
            className="w-24 h-24 rounded-full"
            source={{
              uri:
                interpreter.data.picture ??
                'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
            }}
          />

          <View className="flex-col gap-1">
            <Text className="font-ifood-bold text-lg text-text-light dark:text-text-dark">
              {interpreter.data.name}
            </Text>
            <Text className="font-ifood-normal text-lg text-text-light dark:text-text-dark">
              {interpreter.data.specialties[0].name}
            </Text>
            <StarRating
              rating={interpreter.data.professional_data.rating}
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
              {interpreter.data.professional_data.description}
            </Text>
            <View className="flex-row items-center gap-2 mt-6">
              <InfoIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.modality}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.data.professional_data.modality}
            </Text>
            <View className="flex-row items-center gap-2 mt-6">
              <MapPinIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.localization}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.data.locations
                .map((loc) => loc.neighborhood)
                .join(', ')}
            </Text>

            <View className="flex-row items-center gap-2 mt-6">
              <CameraIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.search.imageRights}
              </Text>
            </View>
            <Text className="px-7">
              {interpreter.data.professional_data.image_rights
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
                interpreter.data.professional_data.min_value +
                '-' +
                interpreter.data.professional_data.max_value}
            </Text>

            {loadingSchedule ? (
              <View className="h-12 items-center justify-center">
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
          className="w-4/5 bg-primary-orange-light rounded-md py-3 px-6 "
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
