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
import { useFormValidation } from '@/src/hooks/useFormValidation';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { LoginCredentials } from '@/src/types/api';
import { validateEmail } from '@/src/utils/mask';
import { AlertCircleIcon } from 'lucide-react-native';

export default function LoginScreen() {
  const { login } = useAuth();

  const { fields, setValue, validateForm } = useFormValidation({
    email: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return Strings.common.requiredEmail;
        if (!validateEmail(value)) return Strings.common.invalidEmail;
        return null;
      },
    },
    password: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return Strings.common.requiredPassword;
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
            accessibilityLabel={Strings.auth.email}
            isRequired={true}
            isInvalid={!!fields.email.error}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.auth.email}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md" className="w-[300px]">
              <InputField
                type="text"
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
            accessibilityLabel={Strings.auth.password}
            isRequired={true}
            isInvalid={!!fields.password.error}
          >
            <FormControlLabel className="font-ifood-medium text-text-light dark:text-text-dark">
              <FormControlLabelText>
                {Strings.auth.password}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md" className="w-[300px]">
              <InputField
                type="password"
                placeholder="senha"
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
          <Text className="font-ifood-regular text-text-dark">
            {Strings.auth.signIn}
          </Text>
        </Button>

        <View className="flex-row mb-12">
          <Text className="font-ifood-regular text-text-light dark:text-text-dark">
            {Strings.auth.signUpPrefix}{' '}
          </Text>
          <HapticTab onPress={() => console.warn('Navegar para cadastro')}>
            <Text className="font-ifood-regular text-primary-blue-light dark:text-primary-blue-dark underline">
              {Strings.auth.signUpAction}
            </Text>
          </HapticTab>
        </View>

        <HapticTab
          onPress={() => console.warn('Navegar para recuperação de senha')}
        >
          <Text className="font-ifood-regular text-primary-blue-light dark:text-primary-blue-dark">
            {Strings.auth.forgotPassword}
          </Text>
        </HapticTab>
      </KeyboardAvoidingView>
    </View>
  );
}
