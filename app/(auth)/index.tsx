import DarkBlueLogo from '@/src/assets/svgs/DarkBlueLogo';
import HapticTab from '@/src/components/HapticTab';
import ModalWarning from '@/src/components/ModalWarning';
import { Button } from '@/src/components/ui/button';
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
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useColors } from '@/src/hooks/useColors';
import { useFormValidation } from '@/src/hooks/useFormValidation';
import type { LoginCredentials } from '@/src/types/api';
import {
  buildInvalidFieldError,
  buildRequiredFieldError,
  toBoolean,
} from '@/src/utils/helpers';
import { validateEmail } from '@/src/utils/masks';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircleIcon, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function LoginScreen() {
  const { login, isLoggingIn, loginError, setLoginError } = useAuth();
  const colors = useColors();
  const { registeredAsInterpreter } = useLocalSearchParams<{
    registeredAsInterpreter?: string;
  }>();

  const [showPassword, setShowPassword] = useState(false);
  const [isInterpreterModalVisible, setInterpreterModalVisibility] =
    useState(false);

  useEffect(() => {
    // Show interpreter modal if the user just registered as an interpreter
    if (toBoolean(registeredAsInterpreter)) {
      setInterpreterModalVisibility(true);
    }
  }, [registeredAsInterpreter]);

  useEffect(() => {
    if (loginError) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.toast.errorTitle,
        text2: Strings.auth.toast.errorDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1, // To "hide" the close icon
        onHide: () => setLoginError(null),
      });
    }
  }, [loginError, setLoginError]);

  const { fields, setValue, validateForm, clearErrors } = useFormValidation({
    email: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('email');
        if (!validateEmail(value)) return buildInvalidFieldError('email');
        return null;
      },
    },
    password: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('password');
        return null;
      },
    },
  });

  async function handleLogin() {
    if (!validateForm()) {
      return;
    }

    const data: LoginCredentials = {
      email: fields.email.value,
      password: fields.password.value,
    };

    await login(data);
  }

  return (
    <View
      className="flex-1 items-center justify-center"
      accessibilityLabel={Strings.auth.login}
    >
      <ModalWarning
        visible={isInterpreterModalVisible}
        onClose={() => setInterpreterModalVisibility(false)}
        title={Strings.auth.toast.interpreterRegisterTitle}
        text={Strings.auth.toast.interpreterRegisterDescription}
        buttonTitle={Strings.common.buttons.understood}
      />

      {/* Main content */}
      <KeyboardAvoidingView
        className="items-center justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo */}
        <View className="mb-12 items-center justify-center">
          <DarkBlueLogo />
          <Text className="mt-2 font-ifood-regular text-text-light dark:text-text-dark">
            {Strings.auth.slogan}
          </Text>
        </View>

        {/* Forms */}
        <View className="py-4 gap-4">
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
            <Input size="md" className="w-[300px]">
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

          <FormControl
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
            <Input size="md" className="w-[300px]">
              <InputField
                className="font-ifood-regular"
                testID="password-input"
                placeholder="********"
                onChangeText={(text) => setValue('password', text)}
                value={fields.password.value}
                secureTextEntry={!showPassword}
                maxLength={25}
                autoCapitalize="none"
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
        </View>

        {/* bottom buttons */}
        <Button
          size="md"
          testID="sign-in-button"
          onPress={handleLogin}
          className="mb-10 mt-2 w-[300px] bg-primary-blue-light dark:bg-primary-blue-dark data-[active=true]:bg-primary-blue-press-light"
        >
          {isLoggingIn ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className="font-ifood-regular text-text-dark">
              {Strings.auth.signIn}
            </Text>
          )}
        </Button>

        <View className="flex-row mb-12">
          <Text className="font-ifood-regular text-text-light dark:text-text-dark">
            {Strings.auth.signUpPrefix}{' '}
          </Text>
          <HapticTab
            testID="sign-up-link"
            onPress={() => {
              router.push('/register');
              clearErrors();
            }}
          >
            <Text className="font-ifood-regular text-primary-blue-light dark:text-primary-blue-dark underline">
              {Strings.auth.signUpAction}
            </Text>
          </HapticTab>
        </View>

        <HapticTab
          testID="forgot-password-link"
          onPress={() => {
            router.push('/forgot-password/step-one');
            clearErrors();
          }}
        >
          <Text className="font-ifood-regular text-primary-blue-light dark:text-primary-blue-dark">
            {Strings.auth.forgotPassword}
          </Text>
        </HapticTab>
      </KeyboardAvoidingView>
    </View>
  );
}
