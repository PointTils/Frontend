import { Strings } from '@/src/constants/Strings';
import { Button, ButtonText } from '@gluestack-ui/themed';
import { router, useNavigation, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
    <View style={s.root}>
      <StatusBar style="light" />
      <SafeAreaView style={s.safe}>
        <View style={s.container}>
          <View style={s.centerBlock}>
            <View style={s.header}>
              <View style={s.headerRow}>
                <Image
                  source={require('@/src/assets/images/logo.png')}
                  accessibilityLabel="Point Tils"
                  resizeMode="contain"
                  style={s.logo}
                />
                <View style={s.titleWrap}>
                  <Text style={s.titleText}>{Strings.onboarding.title}</Text>
                </View>
              </View>
            </View>

            <Image
              source={require('@/src/assets/images/onboarding/onboarding-user.png')}
              accessibilityLabel="Ilustração de usuários e intérprete"
              resizeMode="contain"
              style={s.illustration}
            />

            <Text style={s.subtitle}>{Strings.onboarding.subtitle}</Text>
          </View>

          <View style={s.ctaWrap}>
            <Button
              size="lg"
              variant="solid"
              action="primary"
              onPress={handlePress}
              accessibilityRole="button"
              accessibilityLabel={Strings.onboarding.cta}
              accessibilityHint="Avança para o próximo passo do fluxo"
              style={s.ctaButton}
            >
              <ButtonText style={s.ctaText}>
                {Strings.onboarding.cta}
              </ButtonText>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#4BA3E6',
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 48,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginRight: 12,
  },
  titleWrap: {
    maxWidth: 220,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  illustration: {
    width: 320,
    height: 280,
  },
  subtitle: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '400',
  },
  ctaWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
  },
  ctaButton: {
    width: '100%',
    maxWidth: 320,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F7941D',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
