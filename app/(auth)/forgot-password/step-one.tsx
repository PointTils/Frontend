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
import type { PasswordResetEmailResponse } from '@/src/types/api/auth';
import {
  buildInvalidFieldError,
  buildRequiredFieldError,
} from '@/src/utils/helpers';
import { validateEmail } from '@/src/utils/masks';
import { router } from 'expo-router';
import { AlertCircleIcon, MailIcon, XIcon } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function ForgotPasswordStepOne() {
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const colors = useColors();

  const { fields, setValue, validateForm } = useFormValidation({
    email: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('email');
        if (!validateEmail(value)) return buildInvalidFieldError('email');
        return null;
      },
    },
  });

  const { post: sendResetEmail } = useApiPost<PasswordResetEmailResponse, void>(
    ApiRoutes.auth.passwordReset(
      encodeURIComponent((fields.email.value || '').trim()),
    ),
  );

  const handleSendCode = async () => {
    if (!validateForm()) return;

    const email = (fields.email.value || '').trim();
    if (!email) return;

    setIsSendingEmail(true);
    try {
      const result = (await sendResetEmail()) as PasswordResetEmailResponse;

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

      router.push({
        pathname: '/forgot-password/step-two',
        params: { email: result.data?.to },
      });

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
      console.error('Erro ao enviar email de redefinição de senha:', err);
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
      setIsSendingEmail(false);
    }
  };

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
              {Strings.forgotPassword.step} 1 {Strings.forgotPassword.of} 3
            </Text>

            <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-3">
              {Strings.forgotPassword.forgotTitle}
            </Text>
            <Text className="font-ifood-regular text-typography-700 mb-6">
              {Strings.forgotPassword.forgotDesc}
            </Text>
          </View>

          <FormControl
            size="md"
            accessibilityLabel={Strings.common.fields.email}
            isRequired={true}
            isInvalid={!!fields.email.error}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.common.fields.email}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                type="text"
                testID="email-input"
                className="font-ifood-regular"
                placeholder="email@example.com"
                onChangeText={(text) => setValue('email', text)}
                value={fields.email.value}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isSendingEmail}
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-600"
              />
              <FormControlErrorText className="text-red-600">
                {fields.email.error}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Bottom buttons */}
          <View className="mt-auto pb-6 gap-4">
            <Button
              size="md"
              onPress={handleSendCode}
              className="data-[active=true]:bg-primary-orange-press-light"
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <ButtonIcon as={MailIcon} className="text-white" />
                  <Text className="font-ifood-regular text-text-dark">
                    {Strings.forgotPassword.sendCodeCta}
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
