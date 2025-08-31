// app/onboarding.tsx
import Logo from '@/src/assets/svg/LightOrangeLogo';
import OnboardingCompany from '@/src/assets/svg/OnBoardingCompany';
import OnboardingUser from '@/src/assets/svg/OnboardingUser';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type OnboardingKey = keyof typeof Strings.onboarding;

const NEXT_ROUTE = '/(tabs)' satisfies Href;

export default function Onboarding() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { type } = useLocalSearchParams<{ type?: string | string[] }>();

  // normaliza "type" e mapeia explicitamente
  const rawType = Array.isArray(type) ? type[0] : type;
  const userType: OnboardingKey =
    rawType === 'company' ? 'company' : rawType === 'til' ? 'til' : 'default';

  const t = Strings.onboarding[userType];

  // define a ilustração conforme o tipo
  const Illustration =
    userType === 'company' ? OnboardingCompany : OnboardingUser;

  // textos auxiliares (evita campos inexistentes no Strings)
  const logoAlt =
    userType === 'company'
      ? 'Logomarca – empresa'
      : userType === 'til'
        ? 'Logomarca – intérprete'
        : 'Logomarca – aplicativo';
  const illoAlt =
    userType === 'company'
      ? 'Ilustração onboarding empresa'
      : userType === 'til'
        ? 'Ilustração onboarding intérprete'
        : 'Ilustração onboarding';

  // como o background é primaryBlue, o texto precisa ser branco
  const textOnPrimary = '#fff';

  function handlePress() {
    router.replace(NEXT_ROUTE);
  }

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.primaryBlue,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 items-center justify-between px-6 pb-[95px]">
        <View className="flex-1 items-center justify-center w-full">
          <View className="w-full max-w-[360px] self-center flex-row items-center justify-center px-4 my-8">
            <Logo width={120} height={120} accessibilityLabel={logoAlt} />
            <Text
              className="text-xl leading-7 font-bold ml-3 text-left flex-shrink"
              style={{ color: textOnPrimary }}
              numberOfLines={0}
            >
              {t.title}
            </Text>
          </View>

          <Illustration width={320} height={260} accessibilityLabel={illoAlt} />

          <Text
            className="text-lg font-normal text-center mt-4 px-4 self-center max-w-[360px]"
            style={{ color: textOnPrimary }}
          >
            {t.description}
          </Text>
        </View>

        <Button
          onPress={handlePress}
          accessibilityLabel="Continuar"
          className="w-full max-w-[360px] self-center mt-6 h-14 rounded-xl shadow-soft-2 justify-center"
          style={{ backgroundColor: colors.primaryOrange }}
        >
          <ButtonText
            className="text-lg font-bold text-center"
            style={{ color: textOnPrimary }}
          >
            Continuar
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
