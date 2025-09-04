import Logo from '@/src/assets/svgs/LightOrangeLogo';
import OnboardingCompany from '@/src/assets/svgs/OnBoardingCompany';
import OnboardingTil from '@/src/assets/svgs/OnboardingTil';
import OnboardingUser from '@/src/assets/svgs/OnboardingUser';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const options = { headerShown: false };

type OnboardingKey = keyof typeof Strings.onboarding;
const NEXT_ROUTE: Href = '/(tabs)';

export default function Onboarding() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
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

  function handlePress() {
    router.replace(NEXT_ROUTE);
  }

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.primaryBlue,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Logo
            width={120}
            height={120}
            accessibilityLabel={data.logoAlt}
            fillPrimary={colors.text}
            fillAccent={colors.primaryOrange}
          />
          <Text
            style={[styles.title, { color: colors.text }]}
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

        <Text style={[styles.subtitle, { color: colors.text }]}>
          {data.subtitle}
        </Text>

        <Pressable
          onPress={handlePress}
          accessibilityLabel={data.cta}
          style={[styles.cta, { backgroundColor: colors.primaryOrange }]}
        >
          <Text style={[styles.ctaText, { color: colors.text }]}>
            {data.cta}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1 },
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
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  ctaText: {
    fontSize: 18,
    fontFamily: 'iFoodRCTextos-Bold',
  },
});
