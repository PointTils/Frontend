import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import InfoRow from '@/src/components/InfoRow';
import { StarRating } from '@/src/components/Rating';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useColors } from '@/src/hooks/useColors';
import { UserType } from '@/src/types/api';
import { getSafeAvatarUri } from '@/src/utils/helpers';
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
} from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Toast } from 'toastify-react-native';

type TabKey = keyof typeof Strings.appointments.tabs;

export default function AppointmentDetailsScreen() {
  const colors = useColors();
  const { user } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, isPending, isActive, returnTo } = useLocalSearchParams<{
    id: string;
    isPending?: string;
    isActive?: string;
    returnTo?: string;
  }>(); // Appointment ID from route params

  const isPendingBool =
    typeof isPending === 'string' &&
    ['true', '1', 'yes'].includes(isPending.toLowerCase());

  const isActiveBool =
    typeof isActive === 'string' &&
    ['true', '1', 'yes'].includes(isActive.toLowerCase());

  const [section, setSection] = useState<TabKey>('appointment');

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

  const handleAcceptPending = () => {
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

    // Go back to previous screen
    handleBack(returnTo || '');
  };

  const handleRejectPending = () => {
    // Show info toast
    Toast.show({
      type: 'info',
      text1: Strings.appointments.toast.rejectTitle,
      text2: Strings.appointments.toast.rejectDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1,
    });

    // Go back to previous screen
    handleBack(returnTo || '');
  };

  const handleCancelPending = () => {
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

    // Go back to previous screen
    handleBack(returnTo || '');
  };

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
                remoteUrl: '',
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
            Nome Sobrenome
          </Text>
          <Text
            className="font-ifood-regular text-md text-text-light dark:text-text-dark max-w-[180px]"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            XXX.XXX.XXX-XX
          </Text>
          {user?.type !== UserType.INTERPRETER && (
            <StarRating rating={0} size={18} />
          )}
        </View>
      </View>

      {/* Section selector */}
      {isPendingBool ? (
        <View className="w-full px-6">
          <Text className="text-text-light font-ifood-medium text-lg mb-2">
            {Strings.appointments.details}
          </Text>
          <View className="h-px bg-typography-200 mb-6" />
        </View>
      ) : (
        <View className="flex-row w-full px-6 pb-6">
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
        contentContainerClassName="grow px-6 pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Description */}
        <InfoRow
          icon={<SquarePen size={16} color={colors.text} />}
          label={Strings.common.fields.more}
          value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris."
          valueColor="text-typography-600"
        />

        {/* Date */}
        <InfoRow
          icon={<CalendarDays size={16} color={colors.text} />}
          label={Strings.common.fields.date}
          value="20/08/2025 11:30 - 12:30"
          valueColor="text-typography-600"
        />

        {/* Location */}
        <InfoRow
          icon={<MapPin size={16} color={colors.text} />}
          label={Strings.common.fields.location}
          value="Av. Ipiranga 6681, Partenon - Porto Alegre/RS"
          valueColor="text-typography-600"
        />
      </ScrollView>

      {isPendingBool ? (
        user?.type === UserType.INTERPRETER ? (
          <View className="px-6 pb-6 gap-4">
            <Button
              size="md"
              onPress={handleAcceptPending}
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={CheckIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                {Strings.appointments.accept}
              </Text>
            </Button>

            <HapticTab
              onPress={handleRejectPending}
              className="flex-row justify-center gap-2 py-2"
            >
              <XIcon color={colors.primaryOrange} />
              <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                {Strings.appointments.reject}
              </Text>
            </HapticTab>
          </View>
        ) : (
          <View className="px-6 pb-12">
            <Button
              size="md"
              onPress={handleCancelPending}
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={XCircleIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                {Strings.appointments.cancelAppointment}
              </Text>
            </Button>
          </View>
        )
      ) : isActiveBool ? (
        <View className="px-6 pb-12">
          <Button
            size="md"
            onPress={handleCancelPending}
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <ButtonIcon as={XCircleIcon} className="text-white" />
            <Text className="font-ifood-regular text-text-dark">
              {Strings.appointments.cancelAppointment}
            </Text>
          </Button>
        </View>
      ) : null}
    </>
  );
}
