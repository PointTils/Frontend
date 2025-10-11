import Header from '@/src/components/Header';
import InterpreterCalendar from '@/src/components/InterpreterCalendar';
import InterpreterReviewCard from '@/src/components/InterpreterReviewCard';
import { StarRating } from '@/src/components/Rating';
import { Avatar } from '@/src/components/ui/avatar';
import { AvatarImage } from '@/src/components/ui/avatar/avatar-image';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { SCHEDULE_ENABLED } from '@/src/constants/Config';
import { Strings } from '@/src/constants/Strings';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { Modality } from '@/src/types/api';
import type {
  ScheduleResponse,
  ReviewResponse,
  InterpreterResponseData,
  UserResponse,
} from '@/src/types/api';
import { mapImageRights, mapModality } from '@/src/utils/masks';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import {
  BriefcaseBusinessIcon,
  SquarePenIcon,
  StarIcon,
  InfoIcon,
  CameraIcon,
  MapPinIcon,
  BanknoteIcon,
  PlusIcon,
  Clock,
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
    data: interpreterData,
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

  // Reviews request
  const {
    data: reviews,
    loading: loadingReviews,
    error: errorReviews,
  } = useApiGet<ReviewResponse>(`/ratings?interpreterId=${interpreterId}`);

  if (loadingInterpreter || loadingReviews) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={colors.primaryBlue} />
        <Text className="mt-2 font-ifood-regular text-primary-blue-light">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  if (errorInterpreter || errorSchedule || errorReviews) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          {errorInterpreter || errorSchedule || errorReviews}
        </Text>
      </View>
    );
  }

  const interpreter = interpreterData?.data as InterpreterResponseData;

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
            <Text className="font-ifood-bold text-lg text-text-light dark:text-text-dark">
              {interpreter.name}
            </Text>
            <Text
              className="font-ifood-normal text-lg text-text-light dark:text-text-dark max-w-[180px]"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {interpreter.specialties.length > 0
                ? interpreter.specialties.map((s) => s.name).join(', ')
                : ''}
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
                className={`font-ifood-medium text-lg ${section === Strings.search.details ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
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
                {Strings.common.fields.modality}
              </Text>
            </View>
            <Text className="px-7">
              {mapModality(interpreter.professional_data.modality)}
            </Text>
            {interpreter.professional_data.modality !== Modality.ONLINE && (
              <>
                <View className="flex-row items-center gap-2 mt-6">
                  <MapPinIcon width={16} height={16} />
                  <Text className="font-ifood-medium text-lg">
                    {Strings.common.fields.location}
                  </Text>
                </View>
                <Text className="px-7">
                  {interpreter.locations
                    .map((loc) => loc.neighborhood)
                    .join(', ')}
                </Text>
              </>
            )}

            <View className="flex-row items-center gap-2 mt-6">
              <CameraIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.common.fields.imageRights}
              </Text>
            </View>
            <Text className="px-7">
              {mapImageRights(interpreter.professional_data.image_rights)}
            </Text>
            <View className="flex-row items-center gap-2 mt-6">
              <BanknoteIcon width={16} height={16} />
              <Text className="font-ifood-medium text-lg">
                {Strings.common.fields.valueRange}
              </Text>
            </View>
            <Text className="px-7">
              {'R$' +
                interpreter.professional_data.min_value +
                '-' +
                interpreter.professional_data.max_value}
            </Text>

            {SCHEDULE_ENABLED && (
              <>
                <View className="flex-row items-center gap-2 mt-6">
                  <Clock width={16} height={16} />
                  <Text className="font-ifood-medium text-lg">
                    {Strings.hours.title}
                  </Text>
                </View>

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
              </>
            )}
          </>
        )}

        {section === Strings.search.reviews && (
          <View>
            {reviews && reviews.data.length > 0 ? (
              reviews.data.map((review) => (
                <InterpreterReviewCard
                  key={review.id}
                  rating={review.stars}
                  reviewDate={review.date}
                  userName={review.user.name}
                  reviewText={review.description}
                  userPhoto={review.user.picture}
                />
              ))
            ) : (
              <Text className="font-iFood-regular mt-32 text-center text-typography-500">
                {Strings.search.noReviewsFound}
              </Text>
            )}
          </View>
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
