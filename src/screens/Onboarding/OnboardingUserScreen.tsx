// src/screens/Onboarding/OnboardingUserScreen.tsx
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { router, useNavigation, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect } from 'react';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NEXT_ROUTE: Href = '/(tabs)/search';

export default function OnboardingUserScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  function handlePress() {
    router.replace(NEXT_ROUTE);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#4BA3E6]">
      <StatusBar style="light" />
      <View className="flex-1 px-6 pb-8 items-center justify-between">
        <View className="flex-1 items-center justify-center">
          <View className="w-full items-center justify-center mb-6 mt-12 px-6">
            <View className="flex-row items-center justify-center">
              <Image
                source={require('@/src/assets/images/logo.png')}
                accessibilityLabel="Point Tils"
                resizeMode="contain"
                className="w-[120px] h-[120px] mr-3"
              />
              <View className="max-w-[220px]">
                <Text className="font-ifood-bold text-white text-[22px] leading-7">
                  {Strings.onboarding.title}
                </Text>
              </View>
            </View>
          </View>

          <Image
            source={require('@/src/assets/images/onboarding/onboarding-user.png')}
            accessibilityLabel="Ilustração de usuários e intérprete"
            resizeMode="contain"
            className="w-[320px] h-[280px]"
          />

          <Text className="font-ifood-regular text-center mt-6 text-white text-[20px]">
            {Strings.onboarding.subtitle}
          </Text>
        </View>

        <View className="w-full items-center px-4">
          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={handlePress}
            className="rounded-xl w-[260px] h-[52px] bg-brand active:bg-brand-dark shadow-md"
            accessibilityRole="button"
            accessibilityLabel={Strings.onboarding.cta}
            accessibilityHint="Avança para o próximo passo do fluxo"
          >
            <ButtonText className="font-ifood-bold text-[18px] text-white">
              {Strings.onboarding.cta}
            </ButtonText>
          </Button>
        </View>

        <View className="w-full items-center mt-5">
          <View className="h-1.5 w-24 rounded-full bg-white/70" />
        </View>
      </View>
    </SafeAreaView>
  );
}
