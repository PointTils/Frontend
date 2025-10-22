import Header from '@/src/components/Header';
import InfoRow from '@/src/components/InfoRow';
import InterpreterCalendar from '@/src/components/InterpreterCalendar';
import InterpreterReviewCard from '@/src/components/InterpreterReviewCard';
import { StarRating } from '@/src/components/Rating';
import { Avatar } from '@/src/components/ui/avatar';
import { AvatarImage } from '@/src/components/ui/avatar/avatar-image';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { SCHEDULE_ENABLED } from '@/src/constants/Config';
import { Strings } from '@/src/constants/Strings';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { Modality } from '@/src/types/api';
import type {
  ScheduleResponse,
  InterpreterResponseData,
  UserResponse,
  RatingsResponse,
} from '@/src/types/api';
import type { DateTimeSelection } from '@/src/types/ui';
import { getSafeAvatarUri } from '@/src/utils/helpers';
import { mapImageRights, mapModality } from '@/src/utils/masks';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import {
  BriefcaseBusinessIcon,
  StarIcon,
  PlusIcon,
  Clock,
  FileTextIcon,
  PenSquareIcon,
  InfoIcon,
  MapPinIcon,
  PackageSearchIcon,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

type TabKey = keyof typeof Strings.search.tabs;

export default function InterpreterDetails() {
  const params = useLocalSearchParams<{ id: string }>();
  const interpreterId = params.id;

  const colors = useColors();
  const router = useRouter();

  const [section, setSection] = useState<TabKey>('details');

  const now = new Date();
  const then = new Date(now);
  then.setDate(now.getDate() + 30);

  // Interpreter request
  const {
    data: interpreterData,
    loading: loadingInterpreter,
    error: errorInterpreter,
  } = useApiGet<UserResponse>(ApiRoutes.interpreters.profile(interpreterId));

  // Schedule request
  const {
    data: schedules,
    loading: loadingSchedule,
    error: errorSchedule,
  } = useApiGet<ScheduleResponse>(
    ApiRoutes.schedules.interpreterSchedule(
      interpreterId,
      now.toISOString().split('T')[0],
      then.toISOString().split('T')[0],
    ),
  );

  // Reviews request
  const {
    data: reviews,
    loading: loadingReviews,
    error: errorReviews,
  } = useApiGet<RatingsResponse>(
    ApiRoutes.ratings.byInterpreter(interpreterId),
  );

  const isLoading = loadingInterpreter || loadingReviews || loadingSchedule;
  const isError = errorInterpreter || errorSchedule || errorReviews;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={colors.primaryBlue} />
        <Text className="mt-2 font-ifood-regular text-primary-blue-light">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">{Strings.common.noResults}</Text>
      </View>
    );
  }

  const handleSelectedTime = (dateTime: DateTimeSelection) => {
    router.push({
      pathname: '/interpreters/[id]/to-schedule',
      params: {
        id: interpreterId,
        startTime: new Date(`${dateTime.date}T${dateTime.time}`).toISOString(),
      },
    });
  };

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

      {/* For alignment purposes */}
      <View className="w-full h-6" />

      <View className="items-center flex-row w-full justify-center gap-4 px-6">
        {/* Avatar */}
        <Avatar size="lg" borderRadius="full" className="h-28 w-28">
          <AvatarImage
            source={{
              uri: getSafeAvatarUri({
                remoteUrl: interpreter?.picture,
              }),
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
            rating={interpreter.professional_data?.rating || 0}
            size={18}
          />
        </View>
      </View>

      {/* Section selector */}
      <View className="flex-row w-full mt-8 px-6">
        <TouchableOpacity
          activeOpacity={1}
          className={`basis-1/2 pb-2 items-center ${section === 'details' ? 'border-b-2 border-primary-blue-light' : ''}`}
          onPress={() => setSection('details')}
        >
          <View className="flex-row items-center gap-2">
            <BriefcaseBusinessIcon
              size={20}
              color={
                section === 'details' ? colors.primaryBlue : colors.disabled
              }
            />
            <Text
              className={`font-ifood-medium text-md ${section === 'details' ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
            >
              {Strings.search.tabs.details}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          className={`basis-1/2 pb-2 items-center ${section === 'reviews' ? 'border-b-2 border-primary-blue-light' : ''}`}
          onPress={() => setSection('reviews')}
        >
          <View className="flex-row items-center gap-2">
            <StarIcon
              size={20}
              color={
                section === 'reviews' ? colors.primaryBlue : colors.disabled
              }
            />
            <Text
              className={`font-ifood-medium text-md ${section === 'reviews' ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
            >
              {Strings.search.tabs.reviews}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="pt-6 px-6"
        contentContainerClassName="grow"
        showsVerticalScrollIndicator={false}
      >
        {/* Information section */}
        {section === 'details' && (
          <>
            <InfoRow
              icon={<PenSquareIcon size={16} color={colors.text} />}
              label={Strings.search.description}
              value={interpreter.professional_data?.description || undefined}
              valueColor="text-typography-600"
            />

            <InfoRow
              icon={<InfoIcon size={16} color={colors.text} />}
              label={Strings.common.fields.modality}
              value={mapModality(interpreter.professional_data?.modality)}
              valueColor="text-typography-600"
            />

            {interpreter.professional_data?.modality !== Modality.ONLINE && (
              <InfoRow
                icon={<MapPinIcon size={16} color={colors.text} />}
                label={Strings.common.fields.location}
                value={interpreter.locations
                  ?.map((loc) => loc.neighborhood)
                  .join(', ')}
                valueColor="text-typography-600"
              />
            )}

            <InfoRow
              icon={<FileTextIcon size={16} color={colors.text} />}
              label={Strings.common.fields.imageRights}
              value={mapImageRights(
                interpreter.professional_data?.image_rights,
              )}
              valueColor="text-typography-600"
            />

            {SCHEDULE_ENABLED && (
              <View className="mt-6">
                <InfoRow
                  icon={<Clock size={16} color={colors.text} />}
                  label={Strings.hours.title}
                  onlyLabel={true}
                />

                {loadingSchedule ? (
                  <View className="h-12 items-center justify-center">
                    <ActivityIndicator
                      size="small"
                      color={colors.primaryBlue}
                    />
                  </View>
                ) : (
                  <View className="mb-4">
                    <InterpreterCalendar
                      schedules={schedules?.data ?? []}
                      onTimeSelect={handleSelectedTime}
                    />
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {section === 'reviews' &&
          (reviews && reviews.data.length > 0 ? (
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
            <View className="flex-1 justify-center gap-y-4 items-center">
              <PackageSearchIcon size={38} color={colors.detailsGray} />
              <Text className="font-ifood-regular text-typography-400 text-md">
                {Strings.search.noReviewsFound}
              </Text>
            </View>
          ))}
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
