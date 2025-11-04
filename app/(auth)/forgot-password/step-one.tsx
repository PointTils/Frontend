import Header from '@/src/components/Header';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Input, InputField, InputIcon } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Mail } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function ForgotPasswordStepOne() {
  const colors = useColors();
  const [email, setEmail] = useState<string>('');

  const { post: sendResetEmail, loading: sendingEmail } = useApiPost(
    ApiRoutes.auth.passwordResetEmail(encodeURIComponent(email || '')),
  );

  const Title = useMemo(() => Strings.auth.reset.title, []);

  const handleBack = () => router.replace('/login' as any);

  const handleSendCode = async () => {
    if (!email || !email.includes('@')) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.invalidEmailTitle,
        text2: Strings.auth.reset.invalidEmailDesc,
        position: 'top',
      });
      return;
    }

    try {
      await sendResetEmail(undefined as any);

      Toast.show({
        type: 'success',
        text1: Strings.auth.reset.emailSentTitle,
        text2: Strings.auth.reset.emailSentDesc,
        position: 'top',
        visibilityTime: 2000,
      });

      const toStepTwo = (`/(auth)/forgot-password/step-two?email=${encodeURIComponent(
        email,
      )}`) as Href;
      router.push(toStepTwo);
    } catch {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.emailFailedTitle,
        text2: Strings.auth.reset.emailFailedDesc,
        position: 'top',
      });
    }
  };

  if (sendingEmail) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.primaryOrange} />
        <Text className="text-typography-600 font-ifood-regular mt-4">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  return (
    <>
      <View className="mt-12 pb-2">
        <Header title={Title} showBackButton handleBack={handleBack} />
      </View>

      <View className="w-full h-6" />

      <ScrollView
        className="w-full"
        contentContainerClassName="grow px-6 pb-4 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-typography-500 font-ifood-regular mb-2">
          {Strings.auth.reset.step} 1 {Strings.auth.reset.of} 3
        </Text>

        <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-1">
          {Strings.auth.reset.forgotTitle}
        </Text>
        <Text className="font-ifood-regular text-typography-600 mb-6">
          {Strings.auth.reset.forgotDesc}
        </Text>

        <Text className="font-ifood-medium mb-2">
          {Strings.common.fields.email}
        </Text>

        <Input className="mb-2">
          <InputIcon as={Mail} />
          <InputField
            value={email}
            onChangeText={(v: string) => setEmail(v)}
            placeholder="example@empresa.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Input>

        <View className="mt-10 gap-3">
          <Button
            size="md"
            onPress={handleSendCode}
            disabled={!email || sendingEmail}
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <ButtonIcon as={Mail} className="text-white" />
            <Text className="font-ifood-regular text-text-dark">
              {Strings.auth.reset.sendCodeCta}
            </Text>
          </Button>

          <Pressable onPress={handleBack} className="items-center">
            <Text className="text-primary-orange-light dark:text-primary-orange-dark">
              {Strings.common.buttons.cancel}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
