import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/src/components/ui/form-control';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { useFormValidation } from '@/src/hooks/useFormValidation';
import type {
  PasswordResetEmailResponse,
  ValidateMailTokenResponse,
} from '@/src/types/api';
import { buildRequiredFieldError } from '@/src/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AlertCircleIcon,
  LockIcon,
  MailIcon,
  XIcon,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from 'toastify-react-native';

export default function ForgotPasswordStepTwo() {
  const { email: emailFromUrl } = useLocalSearchParams<{ email: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [isVerifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const { fields, setValue, validateForm } = useFormValidation({
    token: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('token');
        return null;
      },
    },
  });

  const { post: resendEmail } = useApiPost<PasswordResetEmailResponse, void>(
    ApiRoutes.auth.passwordReset(
      encodeURIComponent((emailFromUrl || '').trim()),
    ),
  );

  const { post: validateToken } = useApiPost<ValidateMailTokenResponse, void>(
    ApiRoutes.auth.validateMailToken(
      encodeURIComponent((fields.token.value || '').trim()),
    ),
  );

  const handleVerify = async () => {
    if (!validateForm()) return;

    const resetToken = (fields.token.value || '').trim();
    if (!resetToken) return;

    setVerifying(true);
    try {
      const response = (await validateToken()) as ValidateMailTokenResponse;

      if (!response?.success) {
        Toast.show({
          type: 'error',
          text1: Strings.forgotPassword.toast.invalidTokenTitle,
          text2: Strings.forgotPassword.toast.invalidTokenDesc,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          closeIconSize: 1,
        });
        return;
      }

      router.push({
        pathname: '/forgot-password/step-three',
        params: { token: resetToken },
      });
    } catch (err) {
      console.error('Erro ao verificar token:', err);
      Toast.show({
        type: 'error',
        text1: Strings.common.toast.errorUnknownTitle,
        text2: Strings.common.toast.errorUnknownDescription,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        closeIconSize: 1,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    const email = (emailFromUrl || '').trim();
    if (!email) return;

    setResending(true);
    try {
      const result = (await resendEmail()) as PasswordResetEmailResponse;

      if (!result?.success) {
        Toast.show({
          type: 'error',
          text1: Strings.forgotPassword.toast.emailFailedTitle,
          text2: Strings.forgotPassword.toast.emailFailedDesc,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          closeIconSize: 1,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: Strings.forgotPassword.toast.emailSentTitle,
        text2: Strings.forgotPassword.toast.emailSentDesc,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
    } catch (err) {
      console.error('Erro ao reenviar email de redefinição de senha:', err);
      Toast.show({
        type: 'error',
        text1: Strings.common.toast.errorUnknownTitle,
        text2: Strings.common.toast.errorUnknownDescription,
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        closeIconSize: 1,
      });
    } finally {
      setResending(false);
    }
  };

  const bottomInset = Math.max(Math.ceil(insets.bottom), 20);

  return (
    <View className="flex-1 justify-center">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.forgotPassword.header}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-8">
          <View className="mt-10 mb-6">
            <Text className="text-text-light dark:text-text-dark font-ifood-medium mb-1">
              {Strings.forgotPassword.step} 2 {Strings.forgotPassword.of} 3
            </Text>

            <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-3">
              {Strings.forgotPassword.authTitle}
            </Text>
            <Text className="font-ifood-regular text-typography-700 mb-6">
              {Strings.forgotPassword.authDesc}
            </Text>
          </View>

          <FormControl
            size="md"
            accessibilityLabel={Strings.common.fields.token}
            isRequired={true}
            isInvalid={!!fields.token.error}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.common.fields.token}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                type="text"
                testID="token-input"
                className="font-ifood-regular"
                placeholder="Digite seu código"
                onChangeText={(text) => setValue('token', text)}
                value={fields.token.value}
                keyboardType="default"
                autoCapitalize="none"
                editable={!isVerifying}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-600"
              />
              <FormControlErrorText className="text-red-600">
                {fields.token.error}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <HapticTab
            onPress={handleResendEmail}
            className="flex-row justify-center gap-2 py-2 mt-8"
            disabled={resending}
          >
            {resending ? (
              <ActivityIndicator color={colors.primaryBlue} size={20} />
            ) : (
              <MailIcon className="mr-2" color={colors.primaryBlue} size={20} />
            )}

            <Text className="font-ifood-regular text-primary-blue-light dark:text-primary-blue-dark">
              {Strings.forgotPassword.resend}
            </Text>
          </HapticTab>

          {/* Bottom buttons */}
          <View
            className="mt-auto gap-4"
            style={{ paddingBottom: bottomInset }}
          >
            <Button
              onPress={handleVerify}
              className="data-[active=true]:bg-primary-orange-press-light"
              disabled={isVerifying || resending}
            >
              {isVerifying ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <ButtonIcon as={LockIcon} className="text-white" />
                  <Text className="font-ifood-regular text-text-dark">
                    {Strings.forgotPassword.verifyCta}
                  </Text>
                </>
              )}
            </Button>

            <HapticTab
              onPress={() => router.replace('/(auth)')}
              className="flex-row justify-center gap-2 py-2"
            >
              <XIcon color={colors.primaryOrange} />
              <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                {Strings.common.buttons.cancel}
              </Text>
            </HapticTab>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
