import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect } from 'react';
import { Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NEXT_ROUTE = '/(find)/search';

export default function OnboardingUserScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  function handlePress() {
    router.replace(NEXT_ROUTE);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#4BA3E6' }}>
      <StatusBar style="light" />
      <View className="flex-1 bg-[#4BA3E6] px-6 pb-8 items-center justify-between">
        <View className="flex-1 items-center justify-center">
          <View className="w-full items-center justify-center mb-6 mt-12 px-6">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={require('@/src/assets/images/logo.png')}
                accessibilityLabel="Point Tils"
                style={{ width: 120, height: 120, resizeMode: 'contain', marginRight: 12 }}
              />
              <View style={{ maxWidth: 220 }}>
                <Text
                  className="font-ifood-bold"
                  style={{ color: 'white', fontSize: 22, lineHeight: 28 }}
                >
                  Conecte-se a intérpretes de forma rápida e simples
                </Text>
              </View>
            </View>
          </View>

          <Image
            source={require('@/src/assets/images/onboarding/onboarding-user.png')}
            accessibilityLabel="Ilustração de usuários e intérprete"
            style={{ width: 320, height: 280, resizeMode: 'contain' }}
          />

          <Text
            className="font-ifood-regular text-center mt-6"
            style={{ color: 'white', fontSize: 20 }}
          >
            Encontre intérpretes próximos, verifique{'\n'}
            disponibilidade e agende atendimentos para{'\n'}
            situações urgentes ou momentos importantes.
          </Text>
        </View>

      <View className="w-full items-center px-4">
        <Pressable
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel="Encontrar intérprete agora"
          accessibilityHint="Avança para o próximo passo do fluxo"
          style={{
            width: 260,
            height: 52,
            borderRadius: 12,
            backgroundColor: '#F7941D',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 3,
          }}
        >
          <Text
            className="font-ifood-bold text-center"
            style={{ color: '#fff', fontSize: 18 }}
          >
            Encontrar intérprete agora
          </Text>
        </Pressable>
      </View>


        <View className="w-full items-center mt-5">
          <View className="h-1.5 w-24 rounded-full bg-white/70" />
        </View>
      </View>
    </SafeAreaView>
  );
}
