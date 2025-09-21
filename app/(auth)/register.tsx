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
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import {
  type FormFields,
  useFormValidation,
} from '@/src/hooks/useFormValidation';
import {
  type InterpreterRegisterResponse,
  type EnterpriseRegisterResponse,
  type EnterpriseRegisterData,
  type InterpreterRegisterData,
  type PersonRegisterResponse,
  type PersonRegisterData,
} from '@/src/types/api';
import { Gender, UserType } from '@/src/types/common';
import type { OptionItem } from '@/src/types/ui';
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
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
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

  const genderChoices: OptionItem[] = [
    { label: Strings.gender.male, value: Gender.MALE },
    { label: Strings.gender.female, value: Gender.FEMALE },
    { label: Strings.gender.others, value: Gender.OTHERS },
  ];

  const handleChangeType = (newType: UserType) => {
    setType(newType);
    clearErrors();

    // Reset all fields
    (Object.keys(fields) as (keyof typeof fields)[]).forEach((key) =>
      setValue(key, ''),
    );
    setDate(new Date());
  };

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
          ? Strings.register.name + ' ' + Strings.common.required
          : null,
    },
    reason: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        ctx?.type === UserType.ENTERPRISE && !value.trim()
          ? Strings.register.socialReason + ' ' + Strings.common.required
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
          return Strings.register.cpf + ' ' + Strings.common.required;
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !validateCpf(value)
        )
          return Strings.register.cpf + ' ' + Strings.common.invalid;
        return null;
      },
    },
    cnpj: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) => {
        if (ctx?.type === UserType.ENTERPRISE && !value.trim())
          return Strings.register.cnpj + ' ' + Strings.common.required;
        if (ctx?.type === UserType.ENTERPRISE && !validateCnpj(value))
          return Strings.register.cnpj + ' ' + Strings.common.invalid;
        if (
          ctx?.type === UserType.INTERPRETER &&
          value.trim() &&
          !validateCnpj(value)
        )
          return Strings.register.cnpj + ' ' + Strings.common.invalid;
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
          return Strings.register.birthday + ' ' + Strings.common.required;
        if (
          (ctx?.type === UserType.PERSON ||
            ctx?.type === UserType.INTERPRETER) &&
          !validateBirthday(value)
        )
          return Strings.register.birthday + ' ' + Strings.common.invalid;
        return null;
      },
    },
    gender: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        (ctx?.type === UserType.PERSON || ctx?.type === UserType.INTERPRETER) &&
        !value.trim()
          ? Strings.register.gender + ' ' + Strings.common.required
          : null,
    },
    phone: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value.trim())
          return Strings.register.phone + ' ' + Strings.common.required;
        if (!validatePhone(value))
          return Strings.register.phone + ' ' + Strings.common.invalid;
        return null;
      },
    },
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
        if (value.length < 8) return Strings.common.minPassword;
        return null;
      },
    },
  });

  // Helper to build payload based on user type
  const buildRegisterPayload = () => {
    switch (type) {
      case UserType.PERSON:
        return {
          name: fields.name.value,
          email: fields.email.value,
          password: fields.password.value,
          phone: fields.phone.value.replace(/\D/g, ''),
          gender: fields.gender.value,
          birthday: fields.birthday.value,
          cpf: fields.cpf.value.replace(/\D/g, ''),
        } as PersonRegisterData;
      case UserType.ENTERPRISE:
        return {
          corporate_reason: fields.reason.value,
          cnpj: fields.cnpj.value.replace(/\D/g, ''),
          email: fields.email.value,
          password: fields.password.value,
          phone: fields.phone.value.replace(/\D/g, ''),
        } as EnterpriseRegisterData;
      case UserType.INTERPRETER:
        return {
          name: fields.name.value,
          email: fields.email.value,
          password: fields.password.value,
          phone: fields.phone.value.replace(/\D/g, ''),
          gender: fields.gender.value,
          birthday: fields.birthday.value,
          cpf: fields.cpf.value.replace(/\D/g, ''),
          professional_info: {
            cnpj: fields.cnpj.value
              ? fields.cnpj.value.replace(/\D/g, '')
              : null,
          },
        } as InterpreterRegisterData;
      default:
        return null; // Unknown type
    }
  };

  // UseApiPost hooks for each type of registration
  const personApi = useApiPost<PersonRegisterResponse, PersonRegisterData>(
    ApiRoutes.persons.register,
  );
  const enterpriseApi = useApiPost<
    EnterpriseRegisterResponse,
    EnterpriseRegisterData
  >(ApiRoutes.enterprises.register);
  const interpreterApi = useApiPost<
    InterpreterRegisterResponse,
    InterpreterRegisterData
  >(ApiRoutes.interpreters.register);

  // Handle form submission - API call and response handling
  async function handleRegister() {
    if (!validateForm({ type })) return;

    const payload = buildRegisterPayload();
    if (!payload) return;

    let api: any;
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

    console.warn('Submitting payload:', payload);
    await api.post(payload);

    if (api.loading) return;

    if (api.error || !api.data?.success || !api.data.data) {
      console.error('Registration error:', api.error || 'Unknown error');
      Toast.show({
        type: 'error',
        text1: Strings.register.toast.errorTitle,
        text2: Strings.register.toast.errorDescription,
        position: 'top',
        visibilityTime: 2500,
        autoHide: true,
        closeIconSize: 1, // To "hide" the close icon
      });
      return;
    }

    // Successful registration logic (e.g., navigate to login)
    console.warn('Registration successful:', api.data.data);
    router.back();
    await new Promise((resolve) => setTimeout(resolve, 300));
    Toast.show({
      type: 'success',
      text1: Strings.register.toast.successTitle,
      text2: Strings.register.toast.successDescription,
      position: 'top',
      visibilityTime: 2500,
      autoHide: true,
      closeIconSize: 1, // To "hide" the close icon
    });
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
                    {Strings.register.client}
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
                    {Strings.register.enterprise}
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
                    {Strings.register.interpreter}
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
                      {Strings.register.socialReason}
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
                      {Strings.register.cnpj}
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
                      {Strings.register.name}
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
                      {Strings.register.cpf}
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
                      {Strings.register.birthday}
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
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!!fields.gender.error}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.register.gender}
                    </FormControlLabelText>
                  </FormControlLabel>
                  <ModalSingleSelection
                    items={genderChoices}
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
                      {Strings.register.cnpj} ({Strings.common.optional})
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
                    {Strings.register.phone}
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
                    {Strings.common.email}
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
                    {Strings.common.password}
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="********"
                    className="font-ifood-regular"
                    autoCapitalize="none"
                    value={fields.password.value}
                    onChangeText={(v) => setValue('password', v)}
                    secureTextEntry
                    maxLength={25}
                  />
                </Input>
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
            </View>

            {/* Bottom buttons */}
            <View className="mt-14 pb-4 gap-4">
              <Button
                onPress={handleRegister}
                size="md"
                className="data-[active=true]:bg-primary-orange-press-light"
              >
                <ButtonIcon as={PlusIcon} className="text-white" />
                <Text className="font-ifood-regular text-text-dark">
                  {Strings.register.create}
                </Text>
              </Button>

              <HapticTab
                onPress={() => {
                  clearErrors();
                  router.back();
                }}
                className="flex-row justify-center gap-2 py-2"
              >
                <XIcon color={colors.primaryOrange} />
                <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                  {Strings.common.cancel}
                </Text>
              </HapticTab>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
