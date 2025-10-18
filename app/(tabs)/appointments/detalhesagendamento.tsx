import Header from '@/src/components/Header';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet, useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { Modality, AppointmentStatus } from '@/src/types/api/common';
import { getSafeAvatarUri } from '@/src/utils/helpers';
import {
  formatDate,
  formatTime,
  formatPhoneOnlyDigits,
} from '@/src/utils/masks';
import type { AppointmentResponse } from '@/src/types/api/appointment';
import type {
  PersonResponseData,
  UserResponse,
} from '@/src/types/api/user';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AtSign,
  Calendar as CalendarIcon,
  FileText,
  MapPin,
  Phone,
  PlusIcon,
  User as UserIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Toast } from 'toastify-react-native';

const { height } = Dimensions.get('window');

type TabKey = 'agendamento' | 'solicitante';

// Tipagem para auxiliar na função de formatação de endereço
type Endereco = {
  uf?: string | null;
  city?: string | null;
  neighborhood?: string | null;
  street?: string | null;
  streetNumber?: number | null;
  addressDetails?: string | null;
};

/**
 * Função utilitária para formatar endereço
 */
function formatEndereco(endereco?: Endereco) {
  if (!endereco) return '';

  const { street, streetNumber, neighborhood, city, uf, addressDetails } =
    endereco;

  return [
    street && `${street}${streetNumber ? `, ${streetNumber}` : ''}`,
    neighborhood,
    city && uf ? `${city}/${uf}` : city || uf,
    addressDetails,
  ]
    .filter(Boolean)
    .join(' - ');
}

export default function DetalhesAgendamento() {
  const colors = useColors();
  const [tab, setTab] = React.useState<TabKey>('agendamento');
  const { user: _user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      Toast.show({
        type: 'error',
        text1: Strings.detalhesAgendamento.toast.errorNoIdTitle,
        text2: Strings.detalhesAgendamento.toast.errorNoIdDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
      });
      router.back();
    }
  }, [id]);

  const {
    data: appointmentData,
    loading: loadingAppointment,
    error: errorAppointment,
  } = useApiGet<AppointmentResponse>(ApiRoutes.appointments.detail(id || ''));

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (appointmentData?.success && appointmentData.data?.user_id) {
      setUserId(appointmentData.data.user_id.toString());
    }
  }, [appointmentData]);

  const {
    data: personData,
    loading: personLoading,
    error: personError,
  } = useApiGet<UserResponse>(
    userId ? ApiRoutes.person.profile(userId) : 'No user ID',
    { enabled: !!userId },
  );

  // MUTAÇÕES: Aceitar e Recusar Agendamento
  const { post: acceptPost, loading: isAccepting } = useApiPost<
    AppointmentResponse,
    unknown
  >(`/appointments/${id}/accept`);
  const { post: rejectPost, loading: isRejecting } = useApiPost<
    AppointmentResponse,
    unknown
  >(`/appointments/${id}/reject`);

  // Lógica de Carregamento Principal
  if (loadingAppointment || personLoading || isAccepting || isRejecting) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primaryBlue} />
        <Text className="font-ifood-regular text-text-light dark:text-text-dark mt-2">
          {loadingAppointment || personLoading
            ? 'Carregando detalhes...'
            : 'Atualizando agendamento...'}
        </Text>
      </View>
    );
  }

  // Lógica de Erro
  if (
    errorAppointment ||
    !appointmentData?.success ||
    personError ||
    personData === null
  ) {
    Toast.show({
      type: 'error',
      text1: Strings.detalhesAgendamento.toast.errorLoadTitle,
      text2:
        errorAppointment ||
        personError ||
        Strings.detalhesAgendamento.toast.errorLoadDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
    });
  }

  const appointment = appointmentData?.data;
  const person = personData?.data as PersonResponseData;

  const date = `${formatDate(appointment?.date)}  ${formatTime(appointment?.start_time as string)} - ${formatTime(appointment?.end_time as string)} `;
  console.log(date);

  const address =
    appointment?.modality === Modality.ONLINE
      ? Strings.common.options.online
      : formatEndereco({
          uf: appointment?.uf,
          city: appointment?.city,
          neighborhood: appointment?.neighborhood,
          street: appointment?.street,
          streetNumber: appointment?.street_number ?? null,
          addressDetails: appointment?.address_details ?? null,
        }) || 'Endereço não informado';

  const openWhatsApp = () => {
    const phone = formatPhoneOnlyDigits(person.phone);
    const message = `Olá, ${person.name}.`;
    Linking.openURL(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
    );
  };

  console.log(formatPhoneOnlyDigits(person.phone));
  const handleCancelar = () => router.back();

  const isAgendamento = tab === 'agendamento';
  const agendamentoColor = isAgendamento ? colors.primaryBlue : colors.disabled;
  const solicitanteColor = !isAgendamento
    ? colors.primaryBlue
    : colors.disabled;

  return (
    <View>
      <View className="gap-8">
        <View className="mt-12">
          <Header
            title={Strings.detalhesAgendamento.header}
            showBackButton={true}
            handleBack={() => router.back()}
          />
        </View>

        <View className="flex-row justify-center gap-8 align-center">
          <Avatar size="lg" borderRadius="full" className="h-28 w-28">
            <AvatarImage
              source={{
                uri: getSafeAvatarUri({
                  remoteUrl: person?.picture,
                }),
              }}
            />
          </Avatar>
          <View className="flex-col gap-2">
            <Text className="font-ifood-medium text-lg" numberOfLines={1}>
              {person.name}
            </Text>
            <Text>{person.cpf}</Text>
          </View>
        </View>

        {/* Section selector */}
        <View className="flex-row justify-around px-8">
          <Pressable
            className={`basis-1/2 pb-2 items-center ${tab === 'agendamento' ? 'border-b-2 border-primary-blue-light' : ''}`}
            onPress={() => setTab('agendamento')}
            accessibilityLabel={Strings.detalhesAgendamento.tabs.agendamento}
          >
            <View className="flex-row gap-4">
              <CalendarIcon size={16} color={agendamentoColor} />
              <Text
                className={`font-ifood-medium text-md ${tab === 'agendamento' ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.detalhesAgendamento.tabs.agendamento}
              </Text>
            </View>
            <View />
          </Pressable>

          <Pressable
            className={`basis-1/2 pb-2 items-center ${tab === 'solicitante' ? 'border-b-2 border-primary-blue-light' : ''}`}
            onPress={() => setTab('solicitante')}
            accessibilityLabel={Strings.detalhesAgendamento.tabs.solicitante}
          >
            <View className="flex-row gap-4">
              <UserIcon size={16} color={solicitanteColor} />
              <Text
                className={`font-ifood-medium text-md ${tab === 'solicitante' ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.detalhesAgendamento.tabs.solicitante}
              </Text>
            </View>
            <View />
          </Pressable>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {isAgendamento ? (
            <View className="px-8 gap-8">
              {/* Description */}
              <View>
                <View className="flex-row gap-3 items-center">
                  <FileText size={18} color={'#000'} />
                  <Text className="font-ifood-medium text-lg">
                    {Strings.detalhesAgendamento.sections.description}
                  </Text>
                </View>
                <Text className="mx-8 text-justify">
                  {appointment?.description}
                </Text>
              </View>

              {/* Data */}
              <View>
                <View className="flex-row gap-3 items-center">
                  <CalendarIcon size={18} color={'#000'} />
                  <Text className="font-ifood-medium text-lg">
                    {Strings.detalhesAgendamento.sections.date}
                  </Text>
                </View>
                <Text className="mx-8 text-justify">{date}</Text>
              </View>
              {/* Localization */}
              <View>
                <View className="flex-row gap-3 items-center">
                  <MapPin size={18} color={'#000'} />
                  <Text className="font-ifood-medium text-lg">
                    {Strings.detalhesAgendamento.sections.location}
                  </Text>
                </View>
                <Text className="mx-8 text-justify">{address}</Text>
              </View>
            </View>
          ) : (
            <View className="px-8 gap-8">
              <View>
                <View>
                  <View className="flex-row gap-3 items-center">
                    <Phone size={18} color={'#000'} />
                    <Text className="font-ifood-medium text-lg">
                      {Strings.detalhesAgendamento.sections.phone}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center ml-8">
                    <Text>{person.phone}</Text>

                    <Pressable
                      onPress={openWhatsApp}
                      accessibilityLabel={
                        Strings.detalhesAgendamento.cta.whatsapp
                      }
                    >
                      <Text className="text-success-300 border-success-300 px-4 py-2 border rounded">
                        {Strings.detalhesAgendamento.cta.whatsapp}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>

              <View>
                <View className="flex-row gap-3 items-center">
                  <AtSign size={18} color={'#000'} />
                  <Text className="font-ifood-medium text-lg">
                    {Strings.detalhesAgendamento.sections.email}
                  </Text>
                </View>
                <Text className="mx-8">{person.email}</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View className="px-8">
          <Button
            size="md"
            onPress={() => {
              /* handleCancel */
            }}
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <ButtonIcon as={PlusIcon} className="text-white" />
            <Text className="font-ifood-regular text-text-dark">
              {Strings.detalhesAgendamento.cta.cancel}
            </Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
