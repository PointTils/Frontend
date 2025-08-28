import DarkBlueLogo from '@/src/assets/svgs/DarkBlueLogo';
import HapticTab from '@/src/components/HapticTab';
import { Button } from '@/src/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/src/components/ui/form-control';
import { Input, InputField } from '@/src/components/ui/input';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function LoginScreen() {
  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      extraScrollHeight={-300}
      contentContainerClassName="flex-grow"
      keyboardOpeningTime={0}
      enableOnAndroid={true}
    >
      <View
        className="flex-1 items-center justify-center"
        accessibilityLabel={Strings.auth.login}
      >
        {/* Logo */}
        <View className=" mb-12 items-center justify-center">
          <DarkBlueLogo />
          <Text className="mt-2 font-ifood-regular text-text-light dark:text-text-dark">
            {Strings.common.slogan}
          </Text>
        </View>

        {/* Forms */}
        <View className="py-4">
          <FormControl
            size="md"
            accessibilityLabel={Strings.auth.email}
            isRequired={true}
          >
            <FormControlLabel>
              <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.auth.email}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md" className="w-[300px]">
              <InputField type="text" placeholder="email@example.com" />
            </Input>
            <FormControlHelper>
              <FormControlHelperText />
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon />
              <FormControlErrorText />
            </FormControlError>
          </FormControl>

          <FormControl
            size="md"
            accessibilityLabel={Strings.auth.password}
            isRequired={true}
          >
            <FormControlLabel className="font-ifood-medium text-text-light dark:text-text-dark">
              <FormControlLabelText>
                {Strings.auth.password}
              </FormControlLabelText>
            </FormControlLabel>
            <Input size="md" className="w-[300px]">
              <InputField type="password" placeholder="senha" />
            </Input>
            <FormControlHelper>
              <FormControlHelperText />
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon />
              <FormControlErrorText />
            </FormControlError>
          </FormControl>
        </View>

        {/* bottom buttons */}
        <Button
          size="md"
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
      </View>
    </KeyboardAwareScrollView>
  );
}
