import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import InfoRow from '@/src/components/InfoRow';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { useApiGet } from '@/src/hooks/useApi';
import { getSafeAvatarUri } from '@/src/utils/helpers';
import { formatDate, formatTime, formatAppointmentLocation } from '@/src/utils/masks';
import { type AppointmentResponse } from '@/src/types/api/appointment';
import { router, useLocalSearchParams } from 'expo-router';
import {
  SquarePen,
  CalendarDays,
  MapPin,
  XIcon,
  CheckIcon,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function RequestDetailsScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Buscar dados do appointment
  const { data: appointmentData, loading, error } = useApiGet<AppointmentResponse>(
    `/appointments/${id}`
  );

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

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primaryOrange} />
        <Text className="text-typography-600 font-ifood-regular mt-4">
          Carregando solicitação...
        </Text>
      </View>
    );
  }

  // Error state
  if (error || !appointmentData?.data) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-typography-900 font-ifood-medium text-lg mb-2">
          Erro ao carregar solicitação
        </Text>
        <Text className="text-typography-600 font-ifood-regular text-center mb-6">
          {error || 'Não foi possível carregar os dados da solicitação'}
        </Text>
        <Button onPress={handleBack}>
          <Text className="font-ifood-regular text-text-dark">
            Voltar
          </Text>
        </Button>
      </View>
    );
  }

  const appointment = appointmentData.data;

  // Formatar dados para exibição
  const formattedDate = `${formatDate(appointment.date)} ${formatTime(appointment.start_time)} - ${formatTime(appointment.end_time)}`;
  const formattedLocation = formatAppointmentLocation(appointment);
  const formattedDescription = appointment.description || 'Nenhuma descrição fornecida';

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
            <Text className="text-typography-700 font-ifood-regular text-sm">
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
