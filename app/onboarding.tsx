import Logo from '@/src/assets/svgs/LightOrangeLogo';
import OnboardingCompany from '@/src/assets/svgs/OnBoardingCompany';
import OnboardingPerson from '@/src/assets/svgs/OnboardingPerson';
import OnboardingTil from '@/src/assets/svgs/OnboardingTil';
import { Button } from '@/src/components/ui/button';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useColors } from '@/src/hooks/useColors';
import { UserType } from '@/src/types/common';
import { router } from 'expo-router';
import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const colors = useColors();
  const { user, completeOnboarding } = useAuth();

  // Get user type from authenticated user or default to CLIENT
  const userType = (user?.type as UserType) || UserType.PERSON;

  // Define content based on user type
  const data = Strings.onboarding[userType];
  const title = data.title;
  const subtitle = data.subtitle;
  const cta = data.cta;
  const illoAlt = data.illoAlt;

  let IllustrationComponent;
  switch (userType) {
    case UserType.ENTERPRISE:
      IllustrationComponent = OnboardingCompany;
      break;
    case UserType.INTERPRETER:
      IllustrationComponent = OnboardingTil;
      break;
    case UserType.PERSON:
    default:
      IllustrationComponent = OnboardingPerson;
      break;
  }

  async function handleContinue() {
    await completeOnboarding();
    router.replace('/(tabs)');
  }

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.primaryBlue,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Logo
            width={120}
            height={120}
            primaryColor={colors.white}
            accentColor={colors.primaryOrange}
          />
          <Text
            style={[styles.title, { color: colors.white }]}
            numberOfLines={0}
          >
            {title}
          </Text>
        </View>

        <View style={styles.illoWrap}>
          <IllustrationComponent accessibilityLabel={illoAlt} />
        </View>

        <Text style={[styles.subtitle, { color: colors.white }]}>
          {subtitle}
        </Text>
      </View>

      <View className="absolute bottom-10 w-full px-6">
        <Button
          className="w-full"
          onPress={handleContinue}
          accessibilityLabel={cta}
          size="lg"
        >
          <Text style={[styles.ctaText, { color: colors.white }]}>{cta}</Text>
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: height * 0.12,
    paddingBottom: height * 0.15,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  topRow: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    textAlign: 'left',
    flexShrink: 1,
    fontFamily: 'iFoodRC-Medium',
  },
  illoWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: 24,
    fontFamily: 'iFoodRC-Regular',
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'iFoodRC-Medium',
  },
});
