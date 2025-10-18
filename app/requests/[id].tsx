import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import InfoRow from '@/src/components/InfoRow';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { useApiGet, useApiPatch } from '@/src/hooks/useApi';
import { getSafeAvatarUri } from '@/src/utils/helpers';
import { formatDate, formatTime, formatAppointmentLocation, formatCpfOrCnpj } from '@/src/utils/masks';
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
  const { id, userPhoto, userName, userDocument } = useLocalSearchParams<{ 
    id: string;
    userPhoto: string;
    userName: string;
    userDocument: string;
  }>();

  // Buscar dados do appointment
  const { data: appointmentData, loading, error } = useApiGet<AppointmentResponse>(
    `/appointments/${id}`
  );

  // Hook para fazer PATCH no appointment
  const { patch, loading: patchLoading } = useApiPatch<AppointmentResponse, any>(
    `/appointments/${id}`
  );

  const handleBack = () => {
    router.back();
  };

  const handleAccept = async () => {
    if (!appointmentData?.data) return;

    const appointment = appointmentData.data;
    
    // Preparar dados para o PATCH com status ACCEPTED
    const patchData = {
      uf: appointment.uf,
      city: appointment.city,
      neighborhood: appointment.neighborhood,
      street: appointment.street,
      modality: appointment.modality,
      date: appointment.date,
      description: appointment.description,
      status: "ACCEPTED",
      street_number: appointment.street_number,
      address_details: appointment.address_details,
      interpreter_id: appointment.interpreter_id,
      user_id: appointment.user_id,
      start_time: appointment.start_time,
      end_time: appointment.end_time
    };

    try {
      const result = await patch(patchData);
      
      if (result) {
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
      }
    } catch (error) {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível aceitar a solicitação',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
    }
  };

  const handleReject = async () => {
    if (!appointmentData?.data) return;

    const appointment = appointmentData.data;
    
    // Preparar dados para o PATCH com status CANCELED
    const patchData = {
      uf: appointment.uf,
      city: appointment.city,
      neighborhood: appointment.neighborhood,
      street: appointment.street,
      modality: appointment.modality,
      date: appointment.date,
      description: appointment.description,
      status: "CANCELED",
      street_number: appointment.street_number,
      address_details: appointment.address_details,
      interpreter_id: appointment.interpreter_id,
      user_id: appointment.user_id,
      start_time: appointment.start_time,
      end_time: appointment.end_time
    };

    try {
      const result = await patch(patchData);
      
      if (result) {
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
      }
    } catch (error) {
      // Show error toast
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível recusar a solicitação',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
    }
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
                  remoteUrl: userPhoto || '',
                }),
              }}
            />
          </Avatar>

          <View>
            <Text className="text-typography-900 font-ifood-medium mb-1">
              {userName || 'Nome não informado'}
            </Text>
            <Text className="text-typography-700 font-ifood-regular text-sm">
              {formatCpfOrCnpj(userDocument) || 'Documento não informado'}
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
          disabled={patchLoading}
          className="data-[active=true]:bg-primary-orange-press-light"
        >
          <ButtonIcon as={CheckIcon} className="text-white" />
          <Text className="font-ifood-regular text-text-dark">
            {patchLoading ? 'Processando...' : Strings.requests.accept}
          </Text>
        </Button>

        <HapticTab
          onPress={handleReject}
          disabled={patchLoading}
          className="flex-row justify-center gap-2 py-2"
        >
          <XIcon color={patchLoading ? colors.detailsGray : colors.primaryOrange} />
          <Text className={`font-ifood-regular ${patchLoading ? 'text-typography-400' : 'text-primary-orange-light dark:text-primary-orange-dark'}`}>
            {patchLoading ? 'Processando...' : Strings.requests.reject}
          </Text>
        </HapticTab>
      </View>
    </View>
  );
}
