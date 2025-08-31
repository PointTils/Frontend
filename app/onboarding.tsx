// app/onboarding.tsx
import Logo from '@/src/assets/svg/LightOrangeLogo';
import OnboardingCompany from '@/src/assets/svg/OnBoardingCompany';
import OnboardingUser from '@/src/assets/svg/OnboardingUser'; // usado para default e til por enquanto
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
  const { type } = useLocalSearchParams<{ type?: string }>();

  // mapeia explicitamente os 3 tipos de usuário (company, til, default)
  const userType: OnboardingKey =
    type === 'company' ? 'company' : type === 'til' ? 'til' : 'default';

  const t = Strings.onboarding[userType];

  // define a ilustração conforme o tipo
  let Illustration: React.ComponentType<any>;
  switch (userType) {
    case 'company':
      Illustration = OnboardingCompany;
      break;
    case 'til':
      Illustration = OnboardingUser;
      // TODO: quando existir OnboardingInterpreter, trocar aqui
      break;
    default:
      Illustration = OnboardingUser;
  }

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
            <Logo width={120} height={120} accessibilityLabel={t.logoAlt} />
            <Text
              className="text-xl leading-7 font-bold ml-3 text-left flex-shrink"
              style={{ color: colors.onPrimary }}
              numberOfLines={0}
            >
              {t.title}
            </Text>
          </View>

          <Illustration
            width={320}
            height={260}
            accessibilityLabel={t.illoAlt}
          />

          <Text
            className="text-lg font-normal text-center mt-4 px-4 self-center max-w-[360px]"
            style={{ color: colors.onPrimary }}
          >
            {t.subtitle}
          </Text>
        </View>

        <Button
          onPress={handlePress}
          accessibilityLabel={t.cta}
          className="w-full max-w-[360px] self-center mt-6 h-14 rounded-xl shadow-soft-2 justify-center"
          style={{ backgroundColor: colors.primaryOrange }}
        >
          <ButtonText
            className="text-lg font-bold text-center"
            style={{ color: colors.onPrimary }}
          >
            {t.cta}
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
