import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import InfoRow from '@/src/components/InfoRow';
import { StarRating } from '@/src/components/Rating';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet, useApiPatch } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type {
  AppointmentRequest,
  AppointmentResponse,
  EnterpriseResponseData,
  InterpreterResponseData,
  PersonResponseData,
  UserResponse,
} from '@/src/types/api';
import { AppointmentStatus, UserType } from '@/src/types/api';
import {
  getSafeAvatarUri,
  showGenericErrorToast,
  toBoolean,
  toFloat,
} from '@/src/utils/helpers';
import {
  formatAppointmentLocation,
  formatDate,
  formatPhone,
  formatTime,
  validateCnpj,
} from '@/src/utils/masks';
import { router, useLocalSearchParams } from 'expo-router';
import {
  SquarePen,
  CalendarDays,
  MapPin,
  XIcon,
  CheckIcon,
  XCircleIcon,
  User,
  BriefcaseBusinessIcon,
  Phone,
  AtSign,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Toast } from 'toastify-react-native';

type TabKey = keyof typeof Strings.appointments.tabs;

export default function AppointmentDetailsScreen() {
  const colors = useColors();
  const { user } = useAuth();

  const [section, setSection] = useState<TabKey>('appointment');

  const {
    id,
    userPhoto,
    userName,
    userDocument,
    rating,
    isPending,
    isActive,
    returnTo,
  } = useLocalSearchParams<{
    id: string;
    userPhoto: string;
    userName: string;
    userDocument: string;
    rating?: string;
    isPending?: string;
    isActive?: string;
    returnTo?: string;
  }>();

  const ratingNumber = toFloat(rating, { min: 0, max: 5 }) ?? 0;
  const isPendingBool = toBoolean(isPending) ?? false;
  const isActiveBool = toBoolean(isActive) ?? false;

  // Fetch appointment data
  const {
    data: appointmentData,
    loading: loadingAppointment,
    error: appointmentError,
  } = useApiGet<AppointmentResponse>(ApiRoutes.appointments.byId(id));

  // Fetch interpreter data
  const {
    data: interpreterData,
    loading: loadingInterpreter,
    error: interpreterError,
  } = useApiGet<UserResponse>(
    ApiRoutes.interpreters.profile(appointmentData?.data?.interpreter_id!),
    {},
    {
      enabled:
        user?.type !== UserType.INTERPRETER &&
        !!appointmentData?.data?.interpreter_id &&
        !isPendingBool,
    },
  );
  const interpreter = interpreterData?.data as InterpreterResponseData;

  // Fetch Person or Enterprise data after appointment data is loaded
  const route =
    appointmentData?.data?.user_id && validateCnpj(userDocument)
      ? ApiRoutes.enterprises.profile(appointmentData.data.user_id)
      : appointmentData?.data?.user_id
        ? ApiRoutes.person.profile(appointmentData.data.user_id)
        : '';
  const {
    data: userData,
    loading: loadingUser,
    error: userError,
  } = useApiGet<UserResponse>(
    route,
    {},
    {
      enabled:
        user?.type === UserType.INTERPRETER &&
        !!appointmentData?.data?.user_id &&
        !isPendingBool,
    },
  );
  const userPerEnt =
    user?.type === UserType.ENTERPRISE
      ? (userData?.data as EnterpriseResponseData)
      : (userData?.data as PersonResponseData);

  // Hook to PATCH appointment
  const {
    patch,
    loading: patchLoading,
    error: patchError,
  } = useApiPatch<AppointmentResponse, AppointmentRequest>(
    ApiRoutes.appointments.byId(id),
  );

  // Determine loading state
  const isLoading =
    loadingAppointment || loadingInterpreter || loadingUser || patchLoading;

  // Handle errors
  useEffect(() => {
    if (isLoading) return;

    const appointment = appointmentData?.data;
    const hasApiError =
      appointmentError || userError || interpreterError || patchError;

    if (hasApiError || !appointment) {
      showGenericErrorToast();
      handleBack(returnTo || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, appointmentError, interpreterError, userError, patchError]);

  const handleBack = (returnTo: string) => {
    const target =
      typeof returnTo === 'string' && returnTo.length > 0
        ? returnTo === '/(tabs)'
          ? '/'
          : returnTo
        : '';

    if (target) {
      router.replace(target as any);
      return;
    }
    router.back();
  };

  const handleOpenWhatsApp = () => {
    const phone =
      user?.type === UserType.INTERPRETER
        ? userPerEnt?.phone
        : interpreter?.phone;

    const message = Strings.home.welcome.replace('{User}', userName);
    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    );
  };

  async function handleAcceptPending() {
    if (!appointmentData?.data) return;

    const patchData = {
      status: AppointmentStatus.ACCEPTED,
    };

    try {
      const response = await patch(patchData);

      if (response?.success) {
        // Show success toast
        Toast.show({
          type: 'success',
          text1: Strings.appointments.toast.acceptTitle,
          text2: Strings.appointments.toast.acceptDescription,
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          closeIconSize: 1,
        });
      }
    } catch {
      // Show error toast
      showGenericErrorToast();
    } finally {
      // Go back to previous screen
      handleBack(returnTo || '');
    }
  }

  async function handleRejectPending() {
    if (!appointmentData?.data) return;

    const patchData = {
      status: AppointmentStatus.CANCELED,
    };

    try {
      const response = await patch(patchData);

      if (response?.success) {
        // Show success toast
        Toast.show({
          type: 'success',
          text1: Strings.appointments.toast.rejectTitle,
          text2: Strings.appointments.toast.rejectDescription,
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          closeIconSize: 1,
        });
      }
    } catch {
      // Show error toast
      showGenericErrorToast();
    } finally {
      // Go back to previous screen
      handleBack(returnTo || '');
    }
  }

  const handleCancelPending = async () => {
    if (!appointmentData?.data) return;

    const patchData = {
      status: AppointmentStatus.CANCELED,
    };

    try {
      const response = await patch(patchData);

      if (response?.success) {
        // Show success toast
        Toast.show({
          type: 'success',
          text1: Strings.appointments.toast.cancelTitle,
          text2: Strings.appointments.toast.cancelDescription,
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          closeIconSize: 1,
        });
      }
    } catch {
      // Show error toast
      showGenericErrorToast();
    } finally {
      // Go back to previous screen
      handleBack(returnTo || '');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primaryOrange} />
        <Text className="text-typography-600 font-ifood-regular mt-4">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  if (!appointmentData?.data) {
    return null; // Or a fallback UI
  }

  const appointment = appointmentData.data;
  const formattedDate = `${formatDate(appointment.date)} ${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}`;
  const formattedLocation = formatAppointmentLocation(appointment);
  const formattedDescription =
    appointment.description || Strings.appointments.noDescription;

  return (
    <>
      <View className="mt-12 pb-2">
        <Header
          title={
            isPendingBool
              ? Strings.appointments.headers.request
              : Strings.appointments.headers.appointment
          }
          showBackButton={true}
          handleBack={() => handleBack(returnTo || '')}
        />
      </View>

      {/* For alignment purposes */}
      <View className="w-full h-6" />

      <View className="items-center flex-row w-full justify-center gap-4 px-6 mb-8">
        {/* User infos */}
        <Avatar size="lg" borderRadius="full" className="h-28 w-28">
          <AvatarImage
            source={{
              uri: getSafeAvatarUri({
                remoteUrl: userPhoto || '',
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
            {userName}
          </Text>
          <Text
            className="font-ifood-regular text-md text-text-light dark:text-text-dark max-w-[180px]"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {userDocument}
          </Text>
          {user?.type !== UserType.INTERPRETER && (
            <StarRating rating={ratingNumber} size={18} />
          )}
        </View>
      </View>

      {/* Section selector */}
      {isPendingBool ? (
        <View className="w-full px-6">
          <Text className="text-text-light font-ifood-medium text-lg mb-2">
            {Strings.appointments.details}
          </Text>
          <View className="h-px bg-typography-200" />
        </View>
      ) : (
        <View className="flex-row w-full px-6">
          <TouchableOpacity
            activeOpacity={1}
            className={`basis-1/2 pb-2 items-center ${section === 'appointment' ? 'border-b-2 border-primary-blue-light' : ''}`}
            onPress={() => setSection('appointment')}
          >
            <View className="flex-row items-center gap-2">
              <CalendarDays
                size={20}
                color={
                  section === 'appointment'
                    ? colors.primaryBlue
                    : colors.disabled
                }
              />
              <Text
                className={`font-ifood-medium text-md ${section === 'appointment' ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.appointments.tabs.appointment}
              </Text>
            </View>
          </TouchableOpacity>

          {user?.type === UserType.INTERPRETER ? (
            <TouchableOpacity
              activeOpacity={1}
              disabled={appointment.status !== AppointmentStatus.ACCEPTED}
              className={`basis-1/2 pb-2 items-center ${section === 'requester' ? 'border-b-2 border-primary-blue-light' : ''}`}
              onPress={() => setSection('requester')}
            >
              <View className="flex-row items-center gap-2">
                <User
                  size={20}
                  color={
                    section === 'requester'
                      ? colors.primaryBlue
                      : colors.disabled
                  }
                />
                <Text
                  className={`font-ifood-medium text-md ${section === 'requester' ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
                >
                  {Strings.appointments.tabs.requester}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              disabled={appointment.status !== AppointmentStatus.ACCEPTED}
              className={`basis-1/2 pb-2 items-center ${section === 'professional' ? 'border-b-2 border-primary-blue-light' : ''}`}
              onPress={() => setSection('professional')}
            >
              <View className="flex-row items-center gap-2">
                <BriefcaseBusinessIcon
                  size={20}
                  color={
                    section === 'professional'
                      ? colors.primaryBlue
                      : colors.disabled
                  }
                />
                <Text
                  className={`font-ifood-medium text-md ${section === 'professional' ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
                >
                  {Strings.appointments.tabs.professional}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView
        className="w-full"
        contentContainerClassName="grow px-6 pb-4 pt-6"
        showsVerticalScrollIndicator={false}
      >
        {section === 'appointment' ? (
          <>
            {/* Description */}
            <InfoRow
              icon={<SquarePen size={16} color={colors.text} />}
              label={Strings.common.fields.more}
              value={formattedDescription}
              valueColor="text-typography-600"
            />

            {/* Date */}
            <InfoRow
              icon={<CalendarDays size={16} color={colors.text} />}
              label={Strings.common.fields.date}
              value={formattedDate}
              valueColor="text-typography-600"
            />

            {/* Location */}
            <InfoRow
              icon={<MapPin size={16} color={colors.text} />}
              label={Strings.common.fields.location}
              value={formattedLocation}
              valueColor="text-typography-600"
            />
          </>
        ) : (
          <>
            {/* Interpreter Description */}
            {user?.type !== UserType.INTERPRETER && (
              <InfoRow
                icon={<SquarePen size={16} color={colors.text} />}
                label={Strings.appointments.description}
                value={interpreter?.professional_data?.description}
                valueColor="text-typography-600"
              />
            )}

            {/* Phone */}
            <View className="flex-row justify-between">
              <View className="w-1/2">
                <InfoRow
                  icon={<Phone size={16} color={colors.text} />}
                  label={Strings.common.fields.phone}
                  value={formatPhone(
                    user?.type === UserType.INTERPRETER
                      ? userPerEnt?.phone
                      : interpreter?.phone,
                  )}
                  valueColor="text-typography-600"
                />
              </View>

              <Pressable
                onPress={handleOpenWhatsApp}
                accessibilityLabel={Strings.appointments.cta.whatsapp}
              >
                <Text className="text-success-300 border-success-300 px-4 py-2 border rounded">
                  {Strings.appointments.cta.whatsapp}
                </Text>
              </Pressable>
            </View>
            {/* Email */}
            <InfoRow
              icon={<AtSign size={16} color={colors.text} />}
              label={Strings.common.fields.email}
              value={
                user?.type === UserType.INTERPRETER
                  ? userPerEnt?.email
                  : interpreter?.email
              }
              valueColor="text-typography-600"
            />
          </>
        )}
      </ScrollView>
      {isPendingBool ? (
        user?.type === UserType.INTERPRETER ? (
          <View className="w-full px-6 pt-6 pb-2 gap-4 border-t border-typography-200 dark:border-typography-700">
            <Button
              size="md"
              onPress={handleAcceptPending}
              disabled={patchLoading}
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={CheckIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                {Strings.appointments.cta.accept}
              </Text>
            </Button>

            <HapticTab
              onPress={handleRejectPending}
              disabled={patchLoading}
              className="flex-row justify-center gap-2 py-2"
            >
              <XIcon color={colors.primaryOrange} />
              <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                {Strings.appointments.cta.reject}
              </Text>
            </HapticTab>
          </View>
        ) : (
          <View className="w-full p-6 gap-4 border-t border-typography-200 dark:border-typography-700">
            <Button
              size="md"
              onPress={handleCancelPending}
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={XCircleIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                {Strings.appointments.cta.cancel}
              </Text>
            </Button>
          </View>
        )
      ) : isActiveBool ? (
        <View className="w-full p-6 gap-4 border-t border-typography-200 dark:border-typography-700">
          <Button
            size="md"
            onPress={handleCancelPending}
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <ButtonIcon as={XCircleIcon} className="text-white" />
            <Text className="font-ifood-regular text-text-dark">
              {Strings.appointments.cta.cancel}
            </Text>
          </Button>
        </View>
      ) : null}
    </>
  );
}
