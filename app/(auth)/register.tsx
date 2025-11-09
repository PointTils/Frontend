import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import ModalSingleSelection from '@/src/components/ModalSingleSelection';
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
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/src/components/ui/radio';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import UploadInput from '@/src/components/UploadInput';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { genders } from '@/src/constants/ItemsSelection';
import { Strings } from '@/src/constants/Strings';
import { useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import {
  type FormFields,
  useFormValidation,
} from '@/src/hooks/useFormValidation';
import {
  type DocumentResponse,
  type UserRequest,
  type UserResponse,
  UserType,
} from '@/src/types/api';
import {
  buildInvalidFieldError,
  buildRegisterPayload,
  buildRequiredFieldError,
  buildDocumentFormData,
} from '@/src/utils/helpers';
import {
  formatDate,
  handleCnpjChange,
  handleCpfChange,
  handlePhoneChange,
  validateBirthday,
  validateCnpj,
  validateCpf,
  validateEmail,
  validatePhone,
} from '@/src/utils/masks';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import {
  AlertCircleIcon,
  XIcon,
  PlusIcon,
  CircleIcon,
  EyeOffIcon,
  EyeIcon,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function RegisterScreen() {
  const colors = useColors();

  const [type, setType] = useState(UserType.PERSON);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [document, setDocument] = useState<any[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  // API hooks for different user types
  const personApi = useApiPost<UserResponse, UserRequest>(
    ApiRoutes.person.register,
  );
  const enterpriseApi = useApiPost<UserResponse, UserRequest>(
    ApiRoutes.enterprises.register,
  );
  const interpreterApi = useApiPost<UserResponse, UserRequest>(
    ApiRoutes.interpreters.register,
  );
  const uploadApi = useApiPost<DocumentResponse, FormData>('');

  const handleChangeType = (newType: UserType) => {
    setType(newType);
    clearErrors();

    // Reset all fields
    (Object.keys(fields) as (keyof typeof fields)[]).forEach((key) =>
      setValue(key, ''),
    );
    setDate(new Date());

    if (newType !== UserType.INTERPRETER) {
      setDocument([]);
    }
  };

  // Forms validation - verify each field based on user type
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue('birthday', formatDate(selectedDate));
    }
  };

  const { fields, setValue, validateForm, clearErrors } = useFormValidation<
    FormFields<{ type: string }>,
    { type: string }
  >({
    name: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        ctx?.type !== UserType.ENTERPRISE && value.trim().length < 5
          ? buildRequiredFieldError('name')
          : null,
    },
    reason: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        ctx?.type === UserType.ENTERPRISE && !value.trim()
          ? buildRequiredFieldError('reason')
          : null,
    },
    cpf: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) => {
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !value.trim()
        )
          return buildRequiredFieldError('cpf');
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !validateCpf(value)
        )
          return buildInvalidFieldError('cpf');
        return null;
      },
    },
    cnpj: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) => {
        if (ctx?.type === UserType.ENTERPRISE && !value.trim())
          return buildRequiredFieldError('cnpj');
        if (ctx?.type === UserType.ENTERPRISE && !validateCnpj(value))
          return buildInvalidFieldError('cnpj');
        if (
          ctx?.type === UserType.INTERPRETER &&
          value.trim() &&
          !validateCnpj(value)
        )
          return buildInvalidFieldError('cnpj');
        return null;
      },
    },
    birthday: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) => {
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !value.trim()
        )
          return buildRequiredFieldError('birthday');
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !validateBirthday(value)
        )
          return buildInvalidFieldError('birthday');
        return null;
      },
    },
    gender: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        (ctx?.type === UserType.PERSON || ctx?.type === UserType.INTERPRETER) &&
          !value.trim()
          ? buildRequiredFieldError('gender')
          : null,
    },
    phone: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('phone');
        if (!validatePhone(value)) return buildInvalidFieldError('phone');
        return null;
      },
    },
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
        if (value.length < 8) return Strings.common.fields.errors.minPassword;
        return null;
      },
    },
  });

  const maxDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 1);
    return d;
  }, []);

  // Handle form submission - API call and response handling
  async function handleRegister() {
    if (isRegistering) return;

    const isValid = validateForm({ type });
    if (!isValid) return;

    setIsRegistering(true);

    try {
      const payload = buildRegisterPayload(type, fields);
      if (!payload) return;

      let api;
      switch (type) {
        case UserType.PERSON:
          api = personApi;
          break;
        case UserType.ENTERPRISE:
          api = enterpriseApi;
          break;
        case UserType.INTERPRETER:
          api = interpreterApi;
          break;
        default:
          return;
      }
      if (!api) return;

      const result = await api.post(payload);

      if (!result?.success || !result?.data) {
        console.error('Registration error:', api.error || 'Unknown error');
        Toast.show({
          type: 'error',
          text1: Strings.register.toast.errorTitle,
          text2: Strings.register.toast.errorDescription,
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          closeIconSize: 1,
        });
        return;
      }

      if (type === UserType.INTERPRETER && document?.length) {
        try {
          const formData = buildDocumentFormData(document);
          await uploadApi.postAt(
            ApiRoutes.interpreterDocument.upload(result.data.id, false),
            formData
          );
        } catch (err) {
          console.error('Erro no upload de documentos:', err);
        }
      }
      router.replace({
        pathname: '/(auth)',
        params: {
          registeredAsInterpreter: String(type === UserType.INTERPRETER),
        },
      });

      await new Promise((resolve) => setTimeout(resolve, 300));

      Toast.show({
        type: 'success',
        text1: Strings.register.toast.successTitle,
        text2: Strings.register.toast.successDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
    } catch (err) {
      console.error('Erro no registro:', err);
      Toast.show({
        type: 'error',
        text1: Strings.register.toast.errorTitle,
        text2: Strings.register.toast.errorDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <View className="flex-1">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.register.header}
          showBackButton={true}
          handleBack={() => router.replace('/(tabs)')}
        />
      </View>
      <KeyboardAvoidingView
        className="flex-1 px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-4 py-8 px-4">
            <Text className="font-ifood-medium mb-3 text-[18px] text-left text-primary-800">
              {Strings.register.title}
            </Text>
            <Text className="font-ifood-regular mb-6 text-left text-primary-800">
              {Strings.register.subtitle}
            </Text>

            <Text className="font-ifood-medium mb-2 text-left text-primary-800">
              {Strings.register.typeSelect}
            </Text>
            <RadioGroup
              value={type}
              onChange={handleChangeType}
              className="flex-row items-center justify-between"
            >
              <Radio value={UserType.PERSON}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>
                  <Text
                    style={{
                      color:
                        type === UserType.PERSON
                          ? colors.text
                          : colors.disabled,
                    }}
                    className="font-ifood-regular"
                  >
                    {Strings.common.options.person}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value={UserType.ENTERPRISE}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>
                  <Text
                    style={{
                      color:
                        type === UserType.ENTERPRISE
                          ? colors.text
                          : colors.disabled,
                    }}
                    className="font-ifood-regular"
                  >
                    {Strings.common.options.enterprise}
                  </Text>
                </RadioLabel>
              </Radio>
              <Radio value={UserType.INTERPRETER}>
                <RadioIndicator>
                  <RadioIcon as={CircleIcon} />
                </RadioIndicator>
                <RadioLabel>
                  <Text
                    style={{
                      color:
                        type === UserType.INTERPRETER
                          ? colors.text
                          : colors.disabled,
                    }}
                    className="font-ifood-regular"
                  >
                    {Strings.common.options.interpreter}
                  </Text>
                </RadioLabel>
              </Radio>
            </RadioGroup>
          </View>

          <View className="flex-1 px-4 justify-between">
            {/* Enterprise fields */}
            {type === UserType.ENTERPRISE && (
              <View className="gap-3">
                <FormControl isRequired isInvalid={!!fields.reason.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.reason}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Empresa X"
                      className="font-ifood-regular"
                      value={fields.reason.value}
                      onChangeText={(v) => setValue('reason', v)}
                      maxLength={100}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.reason.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <FormControl isRequired isInvalid={!!fields.cnpj.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.cnpj}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="00.000.000/0001-00"
                      className="font-ifood-regular"
                      value={fields.cnpj.value}
                      onChangeText={(v) =>
                        setValue('cnpj', handleCnpjChange(v))
                      }
                      maxLength={18}
                      keyboardType="numeric"
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.cnpj.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </View>
            )}

            {/* Person and Interpreter fields */}
            {(type === UserType.PERSON || type === UserType.INTERPRETER) && (
              <View className="gap-3">
                <FormControl isRequired isInvalid={!!fields.name.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.name}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Nome X"
                      className="font-ifood-regular"
                      value={fields.name.value}
                      onChangeText={(v) => setValue('name', v)}
                      maxLength={100}
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.name.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <FormControl isRequired isInvalid={!!fields.cpf.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.cpf}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="000.000.000-00"
                      className="font-ifood-regular"
                      value={fields.cpf.value}
                      onChangeText={(v) => setValue('cpf', handleCpfChange(v))}
                      maxLength={14}
                      keyboardType="numeric"
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.cpf.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>

                <FormControl isRequired isInvalid={!!fields.birthday.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.birthday}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Input pointerEvents="none">
                      <InputField
                        placeholder="DD/MM/AAAA"
                        className="font-ifood-regular"
                        value={fields.birthday.value}
                        editable={false}
                      />
                    </Input>
                  </TouchableOpacity>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.birthday.error}
                    </FormControlErrorText>
                  </FormControlError>
                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="calendar"
                      maximumDate={maxDate}
                      onChange={handleDateChange}
                    />
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!!fields.gender.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.gender}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <ModalSingleSelection
                    items={genders}
                    selectedValue={fields.gender.value}
                    onSelectionChange={(value) => setValue('gender', value)}
                    hasError={!!fields.gender.error}
                  />
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.gender.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </View>
            )}

            {/* Interpreter CNPJ */}
            {type === UserType.INTERPRETER && (
              <View className="gap-3 mt-3">
                <FormControl isInvalid={!!fields.cnpj.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.cnpj} (
                      {Strings.common.fields.optional})
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="00.000.000/0001-00"
                      className="font-ifood-regular"
                      value={fields.cnpj.value}
                      onChangeText={(v) =>
                        setValue('cnpj', handleCnpjChange(v))
                      }
                      maxLength={18}
                      keyboardType="numeric"
                    />
                  </Input>
                  <FormControlError>
                    <FormControlErrorIcon
                      as={AlertCircleIcon}
                      className="text-red-600"
                    />
                    <FormControlErrorText>
                      {fields.cnpj.error}
                    </FormControlErrorText>
                  </FormControlError>
                </FormControl>
              </View>
            )}

            {/* Common fields */}
            <View className="gap-3 mt-4">
              <FormControl isRequired isInvalid={!!fields.phone.error}>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.common.fields.phone}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="(00) 00000-0000"
                    className="font-ifood-regular"
                    value={fields.phone.value}
                    onChangeText={(v) =>
                      setValue('phone', handlePhoneChange(v))
                    }
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-600"
                  />
                  <FormControlErrorText>
                    {fields.phone.error}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isRequired isInvalid={!!fields.email.error}>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.common.fields.email}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="example@gmail.com"
                    className="font-ifood-regular"
                    value={fields.email.value}
                    autoCapitalize="none"
                    onChangeText={(v) => setValue('email', v)}
                    keyboardType="email-address"
                    maxLength={250}
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon
                    as={AlertCircleIcon}
                    className="text-red-600"
                  />
                  <FormControlErrorText>
                    {fields.email.error}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isRequired isInvalid={!!fields.password.error}>
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.common.fields.password}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="********"
                    className="font-ifood-regular"
                    autoCapitalize="none"
                    value={fields.password.value}
                    onChangeText={(v) => setValue('password', v)}
                    secureTextEntry={!showPassword}
                    maxLength={25}
                  />
                </Input>
                <TouchableOpacity
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
                  <FormControlErrorText>
                    {fields.password.error}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              {/* Interpreter Load File */}
              {type === UserType.INTERPRETER && (
                <View className="gap-3 mt-3">
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.certificate}
                      </FormControlLabelText>
                    </FormControlLabel>

                    <UploadInput
                      multiple={false}
                      maxFiles={1}
                      onChange={(files) => setDocument(files)}
                    />

                    {document?.length > 0 && (
                      <Text className="text-text-light dark:text-text-dark mt-2">
                        Arquivo selecionado: {document[0].name}
                      </Text>
                    )}
                  </FormControl>
                </View>
              )}
            </View>

            {/* Bottom buttons */}
            <View className="mt-14 pb-4 gap-4">
              <Button
                onPress={handleRegister}
                size="md"
                isDisabled={isRegistering}
                className="data-[active=true]:bg-primary-orange-press-light"
              >
                {isRegistering ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <>
                    <ButtonIcon as={PlusIcon} className="text-white" />
                    <Text className="font-ifood-regular text-text-dark">
                      {Strings.auth.signUpAction}
                    </Text>
                  </>
                )}
              </Button>
              {!isRegistering && (
                <HapticTab
                  onPress={() => {
                    clearErrors();
                    router.back();
                  }}
                  className="flex-row justify-center gap-2 py-2"
                >
                  <XIcon color={colors.primaryOrange} />
                  <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                    {Strings.common.buttons.cancel}
                  </Text>
                </HapticTab>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
