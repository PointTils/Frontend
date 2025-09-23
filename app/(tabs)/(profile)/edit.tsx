import HapticTab from '@/src/components/HapticTab';
import Header from '@/src/components/Header';
import ModalMultipleSelection from '@/src/components/ModalMultipleSelection';
import ModalSingleSelection from '@/src/components/ModalSingleSelection';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '@/src/components/ui/checkbox';
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
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from '@/src/components/ui/radio';
import { Text } from '@/src/components/ui/text';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { specialties, genders } from '@/src/constants/ItemsSelection';
import { Strings } from '@/src/constants/Strings';
import { useApiPatch } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { useFormValidation } from '@/src/hooks/useFormValidation';
import type { FormFields } from '@/src/hooks/useFormValidation';
import type {
  UserRequest,
  UserResponse,
  UserResponseData,
} from '@/src/types/api';
import { Modality, UserType } from '@/src/types/common';
import {
  buildEditPayload,
  buildInvalidFieldError,
  buildRequiredFieldError,
  getModality,
} from '@/src/utils/helpers';
import {
  formatDate,
  formatPhone,
  handlePhoneChange,
  mapImageRights,
  validateBirthday,
  validateEmail,
  validatePhone,
} from '@/src/utils/masks';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import {
  FileText,
  Bookmark,
  BriefcaseBusiness,
  CircleIcon,
  CheckIcon,
  XIcon,
  AlertCircleIcon,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Toast } from 'toastify-react-native';

export default function EditScreen() {
  const params = useLocalSearchParams();
  const colors = useColors();

  // Parse the profile data from params if available
  let profile = params.data
    ? (JSON.parse(params.data as string) as UserResponseData)
    : null;
  console.log('Params recebidos:', profile);

  // API hooks for different user types
  const personApi = useApiPatch<UserResponse, UserRequest>(
    ApiRoutes.person.profile(profile?.id || ''),
  );
  const enterpriseApi = useApiPatch<UserResponse, UserRequest>(
    ApiRoutes.enterprises.profile(profile?.id || ''),
  );
  const interpreterApi = useApiPatch<UserResponse, UserRequest>(
    ApiRoutes.interpreters.profile(profile?.id || ''),
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue('birthday', formatDate(selectedDate));
    }
  };

  function handleBack() {
    clearErrors();
    router.back();
  }

  // Forms validation - verify each field based on user type
  const { fields, setValue, validateForm, clearErrors } = useFormValidation<
    FormFields<{ type: string }>,
    { type: string }
  >({
    name: {
      value: profile?.type !== UserType.ENTERPRISE ? profile?.name : '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        ctx?.type !== UserType.ENTERPRISE && value.trim().length < 5
          ? buildRequiredFieldError('name')
          : null,
    },
    reason: {
      value:
        profile?.type === UserType.ENTERPRISE ? profile?.corporate_reason : '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        ctx?.type === UserType.ENTERPRISE && !value.trim()
          ? buildRequiredFieldError('reason')
          : null,
    },
    birthday: {
      value:
        profile?.type !== UserType.ENTERPRISE
          ? formatDate(profile?.birthday)
          : '',
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
      value: profile?.type !== UserType.ENTERPRISE ? profile?.gender : '',
      error: '',
      validate: (value: string, ctx?: { type: string }) =>
        (ctx?.type === UserType.PERSON || ctx?.type === UserType.INTERPRETER) &&
        !value.trim()
          ? buildRequiredFieldError('gender')
          : null,
    },
    phone: {
      value: formatPhone(profile?.phone) || '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('phone');
        if (!validatePhone(value)) return buildInvalidFieldError('phone');
        return null;
      },
    },
    email: {
      value: profile?.email || '',
      error: '',
      validate: (value: string) => {
        if (!value.trim()) return buildRequiredFieldError('email');
        if (!validateEmail(value)) return buildInvalidFieldError('email');
        return null;
      },
    },
    selectedSpecialties: {
      value:
        profile?.type === UserType.INTERPRETER
          ? (profile?.specialties?.map((item) => item.id!).filter(Boolean) ??
            [])
          : [],
      error: '',
      validate: (value: string[], ctx?: { type: string }) =>
        ctx?.type === UserType.INTERPRETER && (!value || value.length === 0)
          ? buildRequiredFieldError('specialties')
          : null,
    },
    modality: {
      value:
        profile?.type === UserType.INTERPRETER
          ? getModality(profile?.professional_data?.modality)
          : [],
      error: '',
      validate: (value: Modality[], ctx?: { type: string }) =>
        ctx?.type === UserType.INTERPRETER && (!value || value.length === 0)
          ? buildRequiredFieldError('modality')
          : null,
    },
    description: {
      value:
        profile?.type === UserType.INTERPRETER
          ? profile?.professional_data?.description
          : '',
      error: '',
      validate: (value: string, ctx?: { type: string }) => {
        if (ctx?.type === UserType.INTERPRETER && !value.trim())
          return buildRequiredFieldError('description');
        return null;
      },
    },
    imageRight: {
      value:
        profile?.type === UserType.INTERPRETER
          ? mapImageRights(profile?.professional_data?.image_rights)
          : '',
      error: '',
      validate: (_value: string, _ctx?: { type: string }) => null,
    },
    minPrice: {
      value:
        profile?.type === UserType.INTERPRETER
          ? (profile?.professional_data?.min_value?.toString() ?? '')
          : '',
      error: '',
      validate: (_value: string, _ctx?: { type: string }) => null,
    },
    maxPrice: {
      value:
        profile?.type === UserType.INTERPRETER
          ? (profile?.professional_data?.max_value?.toString() ?? '')
          : '',
      error: '',
      validate: (_value: string, _ctx?: { type: string }) => null,
    },
  });

  // Early return if no profile data
  if (!profile) {
    console.error('No profile data provided in params');
    router.back();
    Toast.show({
      type: 'error',
      text1: Strings.edit.toast.errorTitle,
      text2: Strings.edit.toast.errorDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1, // To "hide" the close icon
    });
    return null;
  }

  async function handleUpdate() {
    if (!profile) return;
    if (!validateForm({ type: profile.type })) return;

    const payload = buildEditPayload(profile.type, fields);
    if (!payload) return;

    let api;
    switch (profile.type) {
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

    console.log('Submitting payload:', payload);
    const result = await api.patch(payload);

    if (!result?.success || !result?.data) {
      console.error('Update error:', api.error || 'Unknown error');
      Toast.show({
        type: 'error',
        text1: Strings.edit.toast.errorApiTitle,
        text2: Strings.edit.toast.errorApiDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1, // To "hide" the close icon
      });
      return;
    }

    // Successful update logic (e.g., navigate to login)
    console.log('Update successful:', result.data);
    router.back();
    await new Promise((resolve) => setTimeout(resolve, 300));
    Toast.show({
      type: 'success',
      text1: Strings.edit.toast.successTitle,
      text2: Strings.edit.toast.successDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1, // To "hide" the close icon
    });
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.edit.header}
          showBackButton={true}
          handleBack={handleBack}
        />
      </View>
      <KeyboardAvoidingView
        className="flex-1 w-full px-10"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-8">
            <View className="w-full flex-row self-start items-center gap-2 mb-4">
              <FileText />
              <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                {Strings.edit.basicData}
              </Text>
            </View>

            <View className="flex-1 justify-between">
              {/* Enterprise fields */}
              {profile?.type === UserType.ENTERPRISE && (
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
                </View>
              )}

              {/* Person and Interpreter fields */}
              {(profile?.type === UserType.PERSON ||
                profile?.type === UserType.INTERPRETER) && (
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
                        display="default"
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
              </View>

              {/* Preferências ou Área Profissional */}
              <View className="flex-row self-start mt-12 gap-2">
                {profile?.type === UserType.INTERPRETER ? (
                  <>
                    <BriefcaseBusiness />
                    <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.professionalArea}
                    </Text>
                  </>
                ) : (
                  <>
                    <Bookmark />
                    <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.preferences}
                    </Text>
                  </>
                )}
              </View>

              <FormControl
                isRequired
                isInvalid={!!fields.gender.error}
                className="mt-4"
              >
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.common.fields.specialties}
                  </FormControlLabelText>
                </FormControlLabel>
                <ModalMultipleSelection
                  items={specialties}
                  selectedValues={fields.selectedSpecialties.value}
                  onSelectionChange={(value) =>
                    setValue('selectedSpecialties', value)
                  }
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

              {profile?.type === UserType.INTERPRETER && (
                <>
                  <View className="my-4">
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.description}
                    </Text>
                    <TextInput
                      className="w-90 border rounded border-primary-0 focus:border-primary-950 p-2"
                      multiline
                      numberOfLines={7}
                      placeholder=""
                      value={fields.description.value}
                      onChangeText={(text) => setValue('description', text)}
                    />
                  </View>

                  <View>
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.modality}
                    </Text>
                    <CheckboxGroup
                      value={fields.modality.value}
                      onChange={(keys: string[]) => {
                        setValue('modality', keys as Modality[]);
                      }}
                      className="flex-row justify-around w-80 py-2"
                    >
                      <Checkbox value={Modality.PERSONALLY}>
                        <CheckboxIndicator className="border w-6 h-6">
                          <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>
                          {Strings.common.options.inPerson}
                        </CheckboxLabel>
                      </Checkbox>
                      <Checkbox value={Modality.ONLINE}>
                        <CheckboxIndicator className="border w-6 h-6">
                          <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>
                          {Strings.common.options.online}
                        </CheckboxLabel>
                      </Checkbox>
                    </CheckboxGroup>
                  </View>

                  {/* Localização */}
                  <View>
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.location}
                    </Text>

                    <View className="flex-row justify-between mt-2 mb-4">
                      {/* UF */}
                      <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.state}
                      </Text>

                      {/* Cidade */}
                      <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.cities}
                      </Text>
                    </View>

                    {/* Bairro */}
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.neighborhoods}
                    </Text>
                  </View>

                  {/* Direito de Imagem */}
                  <View className="w-80 my-4">
                    <Text className="font-ifood-medium text-text-light mb-2 dark:text-text-dark">
                      {Strings.common.fields.imageRights}
                    </Text>
                    <RadioGroup
                      value={fields.imageRight.value}
                      onChange={(value) => setValue('imageRight', value)}
                      className="flex-row items-center justify-around"
                    >
                      <Radio value={Strings.common.options.authorize}>
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>
                          <Text
                            className="font-ifood-regular"
                            style={{
                              color:
                                fields.imageRight.value ===
                                Strings.common.options.authorize
                                  ? colors.text
                                  : colors.disabled,
                            }}
                          >
                            {Strings.common.options.authorize}
                          </Text>
                        </RadioLabel>
                      </Radio>
                      <Radio value={Strings.common.options.deny}>
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>
                          <Text
                            className="font-ifood-regular"
                            style={{
                              color:
                                fields.imageRight.value ===
                                Strings.common.options.deny
                                  ? colors.text
                                  : colors.disabled,
                            }}
                          >
                            {Strings.common.options.deny}
                          </Text>
                        </RadioLabel>
                      </Radio>
                    </RadioGroup>
                  </View>

                  {/* Valores Max/Min */}
                  <View className="w-80">
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.common.fields.valueRange}
                    </Text>
                    <View className="flex-row justify-between">
                      <View>
                        <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.common.fields.min}
                        </Text>
                        <Input size="lg" className="w-36">
                          <InputField
                            type="text"
                            placeholder="100"
                            value={fields.minPrice.value}
                            onChangeText={(text) => setValue('minPrice', text)}
                            keyboardType="numeric"
                          />
                        </Input>
                      </View>
                      <View>
                        <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.common.fields.max}
                        </Text>
                        <Input size="lg" className="w-36">
                          <InputField
                            type="text"
                            placeholder="1000"
                            value={fields.maxPrice.value}
                            onChangeText={(text) => setValue('maxPrice', text)}
                            keyboardType="numeric"
                          />
                        </Input>
                      </View>
                    </View>
                  </View>

                  {/* Horários */}
                  <View className="w-80 mt-4">
                    <Text className="font-ifood-large text-text-light dark:text-text-dark">
                      {Strings.hours.title}
                    </Text>
                    {/** TO DO: Add week hours inputs */}
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Bottom buttons */}
          <View className="mt-8 pb-4 gap-4">
            <Button
              size="md"
              onPress={handleUpdate}
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={CheckIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                {Strings.common.buttons.save}
              </Text>
            </Button>

            <HapticTab
              onPress={handleBack}
              className="flex-row justify-center gap-2 py-2"
            >
              <XIcon color={colors.primaryOrange} />
              <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                {Strings.common.buttons.cancel}
              </Text>
            </HapticTab>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
