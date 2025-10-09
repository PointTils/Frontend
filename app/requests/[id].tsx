import Header from '@/src/components/Header';
import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonText, ButtonIcon } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import { router } from 'expo-router';
import { SquarePen, CalendarDays, MapPin, Check, X } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

export default function RequestDetailsScreen() {
  const colors = useColors() || {
    primaryOrange: '#F28D22',
    primaryBlue: '#43A2DB',
  };

  const handleBack = () => {
    router.back();
  };

  const handleAccept = () => {
    // Mostrar toast de sucesso
    Toast.show({
      type: 'success',
      text1: 'Solicitação Aprovada',
      text2: 'A solicitação foi aceita com sucesso!',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      closeIconSize: 1,
    });

    // Voltar para a tela anterior
    router.back();
  };

  const handleReject = () => {
    // Mostrar toast de informação
    Toast.show({
      type: 'info',
      text1: 'Solicitação Recusada',
      text2: 'A solicitação foi recusada.',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      closeIconSize: 1,
    });

    // Voltar para a tela anterior
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <Header
        title="SOLICITAÇÃO"
        showBackButton={true}
        handleBack={handleBack}
      />

      <ScrollView className="flex-1 px-6 ">
        {/* Informações do solicitante */}
        <View className="flex-row items-center justify-center mb-6 pt-4">
          <Avatar size="2xl" borderRadius="full" className="mr-4">
            <AvatarImage
              source={{
                uri: 'https://img.freepik.com/fotos-premium/beleza-e-feminilidade-linda-mulher-loira-com-longos-cabelos-loiros-sorrindo-retrato-natural_360074-56804.jpg',
              }}
            />
          </Avatar>

          <View>
            <Text className="text-typography-900 font-medium text-base mb-1">
              Nome Sobrenome
            </Text>
            <Text className="text-typography-600 font-regular text-sm">
              XXX.XXX.XXX-XX
            </Text>
          </View>
        </View>

        {/* Dados do agendamento */}
        <View className="mb-8">
          <Text className="text-typography-900 font-medium text-base mb-6">
            Dados do agendamento
          </Text>

          {/* Linha separadora */}
          <View className="h-px bg-typography-200 mb-6" />

          {/* Descrição */}
          <View className="flex-row items-start mb-6">
            <SquarePen size={16} color="#000000" className="mr-1 mt-0.5" />
            <View className="flex-1">
              <Text className="text-typography-900 font-medium text-sm mb-2">
                Descrição
              </Text>
              <Text className="text-typography-600 font-regular text-sm leading-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </Text>
            </View>
          </View>

          {/* Data */}
          <View className="flex-row items-start mb-6">
            <CalendarDays size={16} color="#000000" className="mr-1 mt-0.5" />
            <View className="flex-1">
              <Text className="text-typography-900 font-medium text-sm mb-2">
                Data
              </Text>
              <Text className="text-typography-600 font-regular text-sm">
                20/08/2025 11:30 - 12:30
              </Text>
            </View>
          </View>

          {/* Localização */}
          <View className="flex-row items-start">
            <MapPin size={16} color="#000000" className="mr-1 mt-0.5" />
            <View className="flex-1">
              <Text className="text-typography-900 font-medium text-sm mb-2">
                Localização
              </Text>
              <Text className="text-typography-600 font-regular text-sm">
                Av. Ipiranga 6681, Partenon - Porto Alegre/RS
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botões de ação */}
      <View className="px-6 pb-6 pt-4 bg-background-0">
        <Button
          size="lg"
          action="primary"
          onPress={handleAccept}
          className="w-full mb-4"
          style={{ backgroundColor: colors.primaryOrange }}
        >
          <ButtonIcon as={Check} size={20} color="white" />
          <ButtonText className="text-white font-medium">Aceitar</ButtonText>
        </Button>

        <Button
          size="lg"
          variant="link"
          action="primary"
          onPress={handleReject}
          className="w-full"
        >
          <ButtonIcon as={X} size={20} color={colors.primaryOrange} />
          <ButtonText
            className="font-medium"
            style={{ color: colors.primaryOrange }}
          >
            Recusar
          </ButtonText>
        </Button>
      </View>
    </SafeAreaView>
  );
}
