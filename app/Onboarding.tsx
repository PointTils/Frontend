import Logo from '@/src/assets/svgs/LightOrangeLogo';
import OnboardingCompany from '@/src/assets/svgs/OnBoardingCompany';
import OnboardingTil from '@/src/assets/svgs/OnboardingTil';
import OnboardingUser from '@/src/assets/svgs/OnboardingUser';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Pressable, Text, View, StyleSheet, Dimensions } from 'react-native';

export const options = { headerShown: false };
const { height } = Dimensions.get('window');

type OnboardingKey = keyof typeof Strings.onboarding;

export default function Onboarding() {
  const colors = useColors();
  const { type } = useLocalSearchParams<{ type?: OnboardingKey }>();

  const userType: OnboardingKey =
    type === 'company' ? 'company' : type === 'user' ? 'user' : 'til';
  const data = Strings.onboarding[userType];

  const Illustration =
    userType === 'company'
      ? OnboardingCompany
      : userType === 'til'
        ? OnboardingTil
        : OnboardingUser;

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
            fillPrimary={colors.onboardingText}
            fillAccent={colors.primaryOrange}
          />
          <Text
            style={[styles.title, { color: colors.onboardingText }]}
            numberOfLines={0}
          >
            {data.title}
          </Text>
        </View>

        <View style={styles.illoWrap}>
          <Illustration
            width={320}
            height={260}
            accessibilityLabel={data.illoAlt}
          />
        </View>

        <Text style={[styles.subtitle, { color: colors.onboardingText }]}>
          {data.subtitle}
        </Text>

        <Pressable
          onPress={() => router.replace('/(tabs)')}
          accessibilityLabel={data.cta}
          style={[styles.cta, { backgroundColor: colors.primaryOrange }]}
        >
          <Text style={[styles.ctaText, { color: colors.onboardingText }]}>
            {data.cta}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: height * 0.12, paddingBottom: height * 0.15 },
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
    fontFamily: 'iFoodRCTextos-Bold',
    textAlign: 'left',
    flexShrink: 1,
  },
  illoWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'iFoodRCTextos-Regular',
    textAlign: 'center',
    maxWidth: 360,
    marginBottom: 24,
  },
  cta: {
    width: '90%',
    maxWidth: 360,
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginTop: height * 0.1,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: 'iFoodRCTextos-Bold',
  },
});
