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
  RecoverPasswordRequest,
  RecoverPasswordResponse,
} from '@/src/types/api/auth';
import { buildRequiredFieldError } from '@/src/utils/helpers';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AlertCircleIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  XIcon,
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function ForgotPasswordStepThree() {
  const [isLoading, setIsLoading] = React.useState(false);
  const colors = useColors();
  const { token } = useLocalSearchParams<{ token: string }>();

  const passwordValueRef = React.useRef('');

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { fields, setValue, validateForm } = useFormValidation({
    password: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('password');
        return null;
      },
    },
    confirmPassword: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('confirmPassword');
        if (value !== passwordValueRef.current)
          return Strings.common.fields.errors.passwordsDoNotMatch;
        return null;
      },
    },
  });

  passwordValueRef.current = fields.password.value;

  const { post: recoverPassword } = useApiPost<
    RecoverPasswordResponse,
    RecoverPasswordRequest
  >(ApiRoutes.auth.recoverPassword);

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = (await recoverPassword({
        reset_token: token,
        new_password: fields.confirmPassword.value,
      })) as RecoverPasswordResponse;

      if (!result?.success) {
        Toast.show({
          type: 'error',
          text1: Strings.forgotPassword.toast.failedTitle,
          text2: Strings.forgotPassword.toast.failedDesc,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          closeIconSize: 1,
        });
        return;
      }

      router.push('/(auth)');

      Toast.show({
        type: 'success',
        text1: Strings.forgotPassword.toast.successTitle,
        text2: Strings.forgotPassword.toast.successDesc,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
    } catch (err) {
      console.error('Erro ao definir nova senha:', err);
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
      setIsLoading(false);
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
              {Strings.forgotPassword.step} 3 {Strings.forgotPassword.of} 3
            </Text>

            <Text className="font-ifood-medium text-xl text-text-light dark:text-text-dark mb-3">
              {Strings.forgotPassword.resetTitle}
            </Text>
            <Text className="font-ifood-regular text-typography-700 mb-6">
              {Strings.forgotPassword.resetDesc}
            </Text>
          </View>

          <FormControl
            className="mb-4"
            size="md"
            accessibilityLabel={Strings.common.fields.password}
            isRequired={true}
            isInvalid={!!fields.password.error}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.common.fields.password}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                testID="password-input"
                className="font-ifood-regular"
                placeholder="********"
                onChangeText={(text) => setValue('password', text)}
                value={fields.password.value}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
            </Input>
            <TouchableOpacity
              testID="toggle-password-visibility"
              onPress={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-9"
            >
              {showPassword ? (
                <EyeOffIcon color={colors.disabled} />
              ) : (
                <EyeIcon color={colors.disabled} />
              )}
            </TouchableOpacity>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-600"
              />
              <FormControlErrorText className="text-red-600">
                {fields.password.error}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl
            size="md"
            accessibilityLabel={Strings.common.fields.confirmPassword}
            isRequired={true}
            isInvalid={!!fields.confirmPassword.error}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.common.fields.confirmPassword}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md">
              <InputField
                testID="confirmPassword-input"
                className="font-ifood-regular"
                placeholder="********"
                onChangeText={(text) => setValue('confirmPassword', text)}
                value={fields.confirmPassword.value}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
            </Input>
            <TouchableOpacity
              testID="toggle-confirmPassword-visibility"
              onPress={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-9"
            >
              {showConfirmPassword ? (
                <EyeOffIcon color={colors.disabled} />
              ) : (
                <EyeIcon color={colors.disabled} />
              )}
            </TouchableOpacity>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                className="text-red-600"
              />
              <FormControlErrorText className="text-red-600">
                {fields.confirmPassword.error}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* Bottom buttons */}
          <View className="mt-auto pb-6 gap-4">
            <Button
              size="md"
              onPress={handleSubmit}
              className="data-[active=true]:bg-primary-orange-press-light"
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <>
                  <ButtonIcon as={CheckIcon} className="text-white" />
                  <Text className="font-ifood-regular text-text-dark">
                    {Strings.forgotPassword.recoverPasswordCta}
                  </Text>
                </>
              )}
            </Button>

            <HapticTab
              onPress={() => router.replace('/(auth)')}
              className="flex-row justify-center gap-2 py-2"
              disabled={isLoading}
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
