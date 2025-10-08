import Header from '@/src/components/Header';
import InterpreterCalendar from '@/src/components/InterpreterCalendar';
import { StarRating } from '@/src/components/Rating';
import { Avatar } from '@/src/components/ui/avatar';
import { AvatarImage } from '@/src/components/ui/avatar/avatar-image';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { SCHEDULE_ENABLED } from '@/src/constants/Config';
import { Strings } from '@/src/constants/Strings';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { Modality } from '@/src/types/api';
import type { ScheduleResponse } from '@/src/types/api/schedule';
import type {
  InterpreterResponseData,
  UserResponse,
} from '@/src/types/api/user';
import { InfoRow } from '@/src/components/ui/infoRow';
import {
  mapImageRights,
  mapModality,
  formatValueRange,
} from '@/src/utils/masks';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import {
  BriefcaseBusinessIcon,
  StarIcon,
  PlusIcon,
  Clock,
  FileTextIcon,
  PencilIcon,
  PenSquareIcon,
  InfoIcon,
  MapPinIcon,
  DollarSign,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

type TimeSelection = { date: string; time: string } | null;

export default function InterpreterDetails() {
  const params = useLocalSearchParams<{ id: string }>();
  const interpreterId = params.id;

  const [section, setSection] = useState<'Avaliações' | 'Dados'>(
    Strings.search.details,
  );
  const [selectTime, setSelectedTime] = useState<TimeSelection>(null);
  const colors = useColors();
  const router = useRouter();
  const now = new Date();
  const then = new Date(now);
  then.setDate(now.getDate() + 30);

  // Interpreter request
  const {
    data: data,
    loading: loadingInterpreter,
    error: errorInterpreter,
  } = useApiGet<UserResponse>(`/interpreters/${interpreterId}`);

  // Schedule request
  const {
    data: schedules,
    loading: loadingSchedule,
    error: errorSchedule,
  } = useApiGet<ScheduleResponse>('/schedules/available', {
    interpreterId: interpreterId,
    dateFrom: now.toISOString().split('T')[0],
    dateTo: then.toISOString().split('T')[0],
  });

  if (loadingInterpreter || loadingSchedule) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={colors.primaryBlue} />
        <Text className="mt-2 font-ifood-regular text-primary-blue-light">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  if (errorInterpreter || errorSchedule || !data || !data.success) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          {errorInterpreter ?? 'Intérprete não encontrado'}
        </Text>
      </View>
    );
  }

  const interpreter = data.data as InterpreterResponseData;

  return (
    <>
      {/* Header */}
      <View className="mt-12 pb-2">
        <Header
          title={Strings.search.header}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      {/* Name and photo section */}
      <ScrollView className="px-8">
        {/* For alignment purposes */}
        <View className="w-full h-6" />

        <View className="items-center flex-row w-full justify-center gap-4">
          {/* Avatar */}
          <Avatar size="lg" borderRadius="full" className="h-28 w-28">
            <AvatarImage
              source={{
                uri:
                  interpreter.picture ||
                  'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
              }}
            />
          </Avatar>

          <View className="flex-col gap-1">
            <Text
              className="font-ifood-medium text-lg text-text-light dark:text-text-dark max-w-[180px]"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {interpreter.name}
            </Text>
            <Text
              className="font-ifood-regular text-md text-text-light dark:text-text-dark max-w-[180px]"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {interpreter.specialties.length > 0
                ? interpreter.specialties.map((s) => s.name).join(', ')
                : ''}
            </Text>
            <StarRating
              rating={interpreter.professional_data.rating}
              size={18}
            />
          </View>
        </View>

        {/* Section selector */}
        <View className="flex-row w-full mt-8 mb-4">
          <TouchableOpacity
            activeOpacity={1}
            className={`basis-1/2 pb-2 items-center ${section === Strings.search.details ? 'border-b-2 border-primary-blue-light' : ''}`}
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
                className={`font-ifood-medium text-md ${section === Strings.search.details ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.search.details}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            className={`basis-1/2 pb-2 items-center ${section === Strings.search.reviews ? 'border-b-2 border-primary-blue-light' : ''}`}
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
                className={`font-ifood-medium text-md ${section === Strings.search.reviews ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.search.reviews}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Information section */}
        {section === Strings.search.details && (
          <>
            <InfoRow
              icon={PenSquareIcon}
              label={Strings.search.description}
              value={interpreter.professional_data.description || undefined}
            />

            <InfoRow
              icon={InfoIcon}
              label={Strings.common.fields.modality}
              value={mapModality(interpreter.professional_data.modality)}
            />

            {interpreter.professional_data.modality !== Modality.ONLINE && (
              <InfoRow
                icon={MapPinIcon}
                label={Strings.common.fields.location}
                value={interpreter.locations
                  .map((loc) => loc.neighborhood)
                  .join(', ')}
              />
            )}

            <InfoRow
              icon={FileTextIcon}
              label={Strings.common.fields.imageRights}
              value={mapImageRights(interpreter.professional_data.image_rights)}
            />

            <InfoRow
              icon={DollarSign}
              label={Strings.common.fields.valueRange}
              value={formatValueRange(
                interpreter.professional_data.min_value,
                interpreter.professional_data.max_value,
              )}
            />

            {SCHEDULE_ENABLED && (
              <View className="mt-6">
                <InfoRow
                  icon={Clock}
                  label={Strings.hours.title}
                  value={undefined}
                />

                {loadingSchedule ? (
                  <View className="h-12 items-center justify-center">
                    <ActivityIndicator
                      size="small"
                      color={colors.primaryBlue}
                    />
                  </View>
                ) : (
                  <InterpreterCalendar
                    schedules={schedules?.data ?? []}
                    selectedTime={selectTime}
                    onTimeSelect={setSelectedTime}
                  />
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      <View className="w-full mb-8 pt-6 px-8 border-t border-typography-200 dark:border-typography-700">
        <Button
          size="md"
          onPress={() => {
            router.push({
              pathname: '/interpreters/[id]/to-schedule',
              params: { id: interpreterId },
            });
          }}
          className="data-[active=true]:bg-primary-orange-press-light"
        >
          <ButtonIcon as={PlusIcon} className="text-white" />
          <Text className="font-ifood-regular text-text-dark">
            {Strings.search.createAppointment}
          </Text>
        </Button>
      </View>
    </>
  );
}
