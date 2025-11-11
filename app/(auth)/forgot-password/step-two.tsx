import Header from '@/src/components/Header';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams } from 'expo-router';
import { Lock } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';

const TOKEN_LENGTH = 6;

export default function ForgotPasswordStepTwo() {
  const colors = useColors();
  const { email: emailFromUrl } = useLocalSearchParams<{ email?: string }>();

  const [resetToken, setResetToken] = useState<string>('');
  const [resending, setResending] = useState(false);

  const { post: resendEmail } = useApiPost(
    ApiRoutes.auth.passwordResetEmail(
      encodeURIComponent((emailFromUrl || '').trim()),
    ),
  );

  const Title = useMemo(() => Strings.auth.reset.title, []);
  const handleBack = () => router.replace('/login' as any);

  const handleVerify = () => {
    const clean = (resetToken || '').trim();
    if (clean.length !== TOKEN_LENGTH) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.tokenMissingTitle,
        text2: `${Strings.auth.reset.tokenMissingDesc} (${TOKEN_LENGTH} dígitos)`,
        position: 'top',
      });
      return;
    }

    router.push(`/forgot-password/step-three?token=${encodeURIComponent(clean)}`);
  };

  const handleResend = async () => {
    const email = (emailFromUrl || '').trim();
    if (!email) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.invalidEmailTitle,
        text2: Strings.auth.reset.invalidEmailDesc,
        position: 'top',
      });
      return;
    }

    try {
      setResending(true);
      await resendEmail();
      Toast.show({
        type: 'success',
        text1: Strings.auth.reset.emailSentTitle,
        text2: Strings.auth.reset.emailSentDesc,
        position: 'top',
        visibilityTime: 1600,
      });
    } catch (e: any) {
      const msg =
        e?.message && typeof e.message === 'string'
          ? e.message
          : Strings.auth.reset.emailFailedDesc;

      Toast.show({
        type: 'error',
        text1: Strings.auth.reset.emailFailedTitle,
        text2: msg,
        position: 'top',
      });
    } finally {
      setResending(false);
    }
  };

  if (resending) {
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
          {Strings.auth.reset.step} 2 {Strings.auth.reset.of} 3
        </Text>

        <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-1">
          {Strings.auth.reset.authTitle}
        </Text>
        <Text className="font-ifood-regular text-typography-600 mb-6">
          {Strings.auth.reset.authDesc}
        </Text>

        <Text className="font-ifood-medium mb-2">
          {Strings.auth.reset.codeLabel}
        </Text>
        <Input className="mb-1">
          <InputField
            value={resetToken}
            onChangeText={(v: string) =>
              setResetToken(v.replace(/[^0-9]/g, '').slice(0, TOKEN_LENGTH))
            }
            placeholder={Strings.auth.reset.codePlaceholder}
            keyboardType="numeric"
            autoCapitalize="none"
          />
        </Input>

        <Pressable onPress={handleResend} className="mb-8">
          <Text className="text-primary-orange-light dark:text-primary-orange-dark underline">
            {Strings.auth.reset.resendDesc}
          </Text>
        </Pressable>

        <View className="mt-6 gap-3">
          <Button
            size="md"
            onPress={handleVerify}
            disabled={resetToken.trim().length !== TOKEN_LENGTH}
            className="data-[active=true]:bg-primary-orange-press-light"
          >
            <ButtonIcon as={Lock} className="text-white" />
            <Text className="font-ifood-regular text-text-dark">
              {Strings.auth.reset.verifyCta}
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
