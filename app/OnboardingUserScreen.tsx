import Logo from '@/src/assets/svg/logo'
import OnboardingUser from '@/src/assets/svg/OnboardingUser'
import { Colors } from '@/src/constants/Colors'
import { Strings } from '@/src/constants/Strings'
import { Button, ButtonText } from '@gluestack-ui/themed'
import { router, type Href } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useMemo } from 'react'
import { StyleSheet, Text, View, useColorScheme } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const NEXT_ROUTE = '/(tabs)' satisfies Href

export default function OnboardingUserScreen() {
  const scheme = useColorScheme()
  const palette = scheme === 'dark' ? Colors.dark : Colors.light
  const textColor = palette.onPrimary

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: palette.primaryBlue }],
    [palette.primaryBlue]
  )

  function handlePress() {
    router.replace(NEXT_ROUTE)
  }

  const t = Strings.onboarding

  return (
    <View style={containerStyle}>
      <StatusBar style="light" />
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-between px-6 pb-8">
          <View className="flex-1 items-center justify-center w-full">
            {/* Título */}
            <View style={styles.titleRow}>
              <Logo width={120} height={120} accessibilityLabel={t.logoAlt} />
              <Text
                style={[styles.titleText, { color: textColor }]}
                className="text-xl leading-7 font-bold"
                numberOfLines={0}
              >
                {t.title}
              </Text>
            </View>

            {/* Ilustração */}
            <OnboardingUser
              width={320}   // ~ w-80
              height={288}  // ~ h-72
              accessibilityLabel={t.illoAlt}
            />

            {/* Subtítulo */}
            <Text
              style={[styles.subtitle, { color: textColor }]}
              className="text-lg font-normal"
            >
              {t.subtitle}
            </Text>
          </View>

          {/* CTA */}
          <Button
            onPress={handlePress}
            accessibilityLabel={t.cta}
            className="w-full max-w-md h-14 rounded-xl shadow-soft-2 justify-center"
            style={{ backgroundColor: palette.primaryOrange }}
          >
            <ButtonText
              style={{ color: textColor }}
              className="text-lg font-bold text-center"
            >
              {t.cta}
            </ButtonText>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // centraliza o bloco (logo + título) e limita a largura para o logo não colar na borda   ------- (talvez tenha um jeito melhor)
  titleRow: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginVertical: 32,
  },
  // garante quebra de linha e afasta do logo
  titleText: {
    flexShrink: 1,
    marginLeft: 12,
    textAlign: 'left',
  },
  // subtítulo sempre inteiro, centralizado e com largura controlada
  subtitle: {
    marginTop: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
    alignSelf: 'center',
    maxWidth: 360,
  },
})
