import DarkBlueLogo from '@/src/assets/svgs/DarkBlueLogo';
import HapticTab from '@/src/components/HapticTab';
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
import { validateEmail } from '@/src/utils/masks';
import { router } from 'expo-router';
import { AlertCircleIcon } from 'lucide-react-native';
import { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function LoginScreen() {
  const { login, isLoggingIn, loginError, setLoginError } = useAuth();
  const colors = useColors();

  useEffect(() => {
    if (loginError) {
      Toast.show({
        type: 'error',
        text1: Strings.auth.loginFailed,
        text2: Strings.auth.invalidCredentials,
        position: 'top',
        visibilityTime: 2500,
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
        if (!value.trim())
          return Strings.common.email + ' ' + Strings.common.required;
        if (!validateEmail(value))
          return Strings.common.email + ' ' + Strings.common.invalid;
        return null;
      },
    },
    password: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim())
          return Strings.common.password + ' ' + Strings.common.required;
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
      <KeyboardAvoidingView
        className="items-center justify-center"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Logo */}
        <View className=" mb-12 items-center justify-center">
          <DarkBlueLogo />
          <Text className="mt-2 font-ifood-regular text-text-light dark:text-text-dark">
            {Strings.common.slogan}
          </Text>
        </View>

        {/* Forms */}
        <View className="py-4 gap-4">
          <FormControl
            size="md"
            accessibilityLabel={Strings.common.email}
            isRequired={true}
            isInvalid={!!fields.email.error}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.common.email}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md" className="w-[300px]">
              <InputField
                type="text"
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
            accessibilityLabel={Strings.common.password}
            isRequired={true}
            isInvalid={!!fields.password.error}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.common.password}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md" className="w-[300px]">
              <InputField
                type="password"
                className="font-ifood-regular"
                placeholder="********"
                onChangeText={(text) => setValue('password', text)}
                value={fields.password.value}
                autoCapitalize="none"
                autoComplete="password"
              />
            </Input>
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
          onPress={() => {
            console.warn('Navegar para recuperação de senha');
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
