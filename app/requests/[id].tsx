import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { InfoRow } from '@/src/components/ui/infoRow';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { getSafeAvatarUri } from '@/src/utils/helpers';
import { router } from 'expo-router';
import {
  SquarePen,
  CalendarDays,
  MapPin,
  XIcon,
  CheckIcon,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function RequestDetailsScreen() {
  const colors = useColors();

  const handleBack = () => {
    router.back();
  };

  const handleAccept = () => {
    // Show success toast
    Toast.show({
      type: 'success',
      text1: Strings.requests.toast.acceptTitle,
      text2: Strings.requests.toast.acceptDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1,
    });

    // Go back to previous screen
    handleBack();
  };

  const handleReject = () => {
    // Show info toast
    Toast.show({
      type: 'info',
      text1: Strings.requests.toast.rejectTitle,
      text2: Strings.requests.toast.rejectDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1,
    });

    // Go back to previous screen
    handleBack();
  };

  return (
    <View className="flex-1 justify-center">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.requests.request}
          showBackButton={true}
          handleBack={handleBack}
        />
      </View>

      <ScrollView
        className="w-full"
        contentContainerClassName="grow px-6 pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Requester information */}
        <View className="flex-row items-center justify-center mb-6 pt-4">
          <Avatar size="lg" borderRadius="full" className="mr-4 h-24 w-24">
            <AvatarImage
              source={{
                uri: getSafeAvatarUri({
                  remoteUrl: '',
                }),
              }}
            />
          </Avatar>

          <View>
            <Text className="text-typography-900 font-ifood-medium mb-1">
              Nome Sobrenome
            </Text>
            <Text className="text-typography-600 font-ifood-regular text-sm">
              XXX.XXX.XXX-XX
            </Text>
          </View>
        </View>

        {/* Appointment data */}
        <View className="mt-4">
          <Text className="text-text-light font-ifood-medium text-lg mb-2">
            {Strings.requests.details}
          </Text>

          {/* Separator line */}
          <View className="h-px bg-typography-200 mb-6" />

          {/* Description */}
          <InfoRow
            icon={<SquarePen size={16} color={colors.text} />}
            label={Strings.common.fields.description}
            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris."
          />

          {/* Date */}
          <InfoRow
            icon={<CalendarDays size={16} color={colors.text} />}
            label={Strings.common.fields.date}
            value="20/08/2025 11:30 - 12:30"
          />

          {/* Location */}
          <InfoRow
            icon={<MapPin size={16} color={colors.text} />}
            label={Strings.common.fields.location}
            value="Av. Ipiranga 6681, Partenon - Porto Alegre/RS"
          />
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View className="px-6 pb-6 gap-4">
        <Button
          size="md"
          onPress={handleAccept}
          className="data-[active=true]:bg-primary-orange-press-light"
        >
          <ButtonIcon as={CheckIcon} className="text-white" />
          <Text className="font-ifood-regular text-text-dark">
            {Strings.requests.accept}
          </Text>
        </Button>

        <HapticTab
          onPress={handleReject}
          className="flex-row justify-center gap-2 py-2"
        >
          <XIcon color={colors.primaryOrange} />
          <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
            {Strings.requests.reject}
          </Text>
        </HapticTab>
      </View>
    </View>
  );
}
