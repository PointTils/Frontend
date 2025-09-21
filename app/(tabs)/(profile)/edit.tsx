import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { Text } from '@/src/components/ui/text';
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  RadioIcon,
} from '@/src/components/ui/radio';
import {
  FileText,
  Bookmark,
  BriefcaseBusiness,
  CircleIcon,
  CheckIcon,
  XIcon,
  AlertCircleIcon,
  User,
} from 'lucide-react-native';
import {
  formatDate,
  formatPhone,
  handlePhoneChange,
  validateBirthday,
  validateEmail,
  validatePhone,
} from '@/src/utils/masks';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
} from '@/src/components/ui/checkbox';
import Header from '@/src/components/Header';
import HapticTab from '@/src/components/HapticTab';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Profile } from '@/src/types/api';
import { FormFields, useFormValidation } from '@/src/hooks/useFormValidation';
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from '@/src/components/ui/form-control';
import { Input, InputField } from '@/src/components/ui/input';
import ModalSingleSelection from '@/src/components/ModalSingleSelection';
import DateTimePicker from '@react-native-community/datetimepicker';
import { OptionItem } from '@/src/types/ui';
import { Gender, UserType } from '@/src/types/common';

type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';
type TimeRange = [string, string];

export default function EditScreen() {
  const params = useLocalSearchParams();
  const colors = useColors();

  // Parse the profile data from params if available
  const profile = params.data
    ? (JSON.parse(params.data as string) as Profile)
    : null;
  console.log('Params recebidos:', profile);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const genderChoices: OptionItem[] = [
    { label: Strings.gender.male, value: Gender.MALE },
    { label: Strings.gender.female, value: Gender.FEMALE },
    { label: Strings.gender.others, value: Gender.OTHERS },
  ];

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue('birthday', formatDate(selectedDate));
    }
  };

  const [description, setDescription] = useState(
    'Descreva o seu trabalho, como tipos de serviços prestados e experiências.',
  );
  const [modality, setModality] = useState<string[]>([]);
  const [imageRight, setImageRight] = useState('authorize');
  const [minPrice, setMinPrice] = useState('100');
  const [maxPrice, setMaxPrice] = useState('1000');

  const [weekHours, setWeekHours] = useState<Record<Day, TimeRange>>({
    monday: ['12:30', '19:30'],
    tuesday: ['12:30', '19:30'],
    wednesday: ['12:30', '19:30'],
    thursday: ['12:30', '19:30'],
    friday: ['12:30', '19:30'],
    saturday: ['12:30', '19:30'],
    sunday: ['12:30', '19:30'],
  });

  function handleBack() {
    clearErrors();
    router.back();
  }

  const { fields, setValue, validateForm, clearErrors } = useFormValidation<
    FormFields<{ profile: Profile }>,
    { profile: Profile }
  >({
    name: {
      value: profile?.name || '',
      error: '',
      validate: (value: string, ctx?: { profile: Profile }) =>
        ctx?.profile.type !== UserType.ENTERPRISE && value.trim().length < 5
          ? Strings.register.name + ' ' + Strings.common.required
          : null,
    },
    reason: {
      value: profile?.corporate_reason || '',
      error: '',
      validate: (value: string, ctx?: { profile: Profile }) =>
        ctx?.profile.type === UserType.ENTERPRISE && !value.trim()
          ? Strings.register.socialReason + ' ' + Strings.common.required
          : null,
    },
    birthday: {
      value: formatDate(profile?.birthday) || '',
      error: '',
      validate: (value: string, ctx?: { profile: Profile }) => {
        if (
          (ctx?.profile.type === UserType.PERSON ||
            ctx?.profile.type === UserType.INTERPRETER) &&
          !value.trim()
        )
          return Strings.register.birthday + ' ' + Strings.common.required;
        if (
          (ctx?.profile.type === UserType.PERSON ||
            ctx?.profile.type === UserType.INTERPRETER) &&
          !validateBirthday(value)
        )
          return Strings.register.birthday + ' ' + Strings.common.invalid;
        return null;
      },
    },
    gender: {
      value: profile?.gender || '',
      error: '',
      validate: (value: string, ctx?: { profile: Profile }) =>
        (ctx?.profile.type === UserType.PERSON ||
          ctx?.profile.type === UserType.INTERPRETER) &&
        !value.trim()
          ? Strings.register.gender + ' ' + Strings.common.required
          : null,
    },
    phone: {
      value: formatPhone(profile?.phone) || '',
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
      value: profile?.email || '',
      error: '',
      validate: (value: string) => {
        if (!value.trim())
          return Strings.common.email + ' ' + Strings.common.required;
        if (!validateEmail(value))
          return Strings.common.email + ' ' + Strings.common.invalid;
        return null;
      },
    },
  });

  function handleUpdate() {
    if (!profile) return;
    if (!validateForm({ profile: profile })) return;

    // Todo: implement API call to update profile
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
                </View>
              )}

              {/* Person and Interpreter fields */}
              {(profile?.type === UserType.PERSON ||
                profile?.type === UserType.INTERPRETER) && (
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
              </View>

              {/* Preferências ou Área Profissional */}
              <View className="flex-row self-start pt-8 gap-2">
                {profile?.type === UserType.INTERPRETER ? (
                  <>
                    <BriefcaseBusiness />
                    <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.professionalArea}
                    </Text>
                  </>
                ) : (
                  <>
                    <Bookmark />
                    <Text className="text-lg font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.preferences}
                    </Text>
                  </>
                )}
              </View>

              <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                Especialidades
              </Text>

              {/* Intérprete */}
              {profile?.type === UserType.INTERPRETER && (
                <>
                  {/* Descrição */}
                  <View>
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.description}
                    </Text>
                    <TextInput
                      className="w-80 border rounded border-primary-0 focus:border-primary-950 p-2"
                      multiline
                      numberOfLines={4}
                      placeholder=""
                      value={description}
                      onChangeText={setDescription}
                    />
                  </View>

                  {/* Modalidade */}
                  <View>
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.modality}
                    </Text>
                    <CheckboxGroup
                      value={modality}
                      onChange={(keys: string[]) => {
                        setModality(keys);
                      }}
                      className="flex-row justify-around w-80 py-2"
                    >
                      <Checkbox value="Presencial">
                        <CheckboxIndicator className="border w-6 h-6">
                          <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>{Strings.edit.inPerson}</CheckboxLabel>
                      </Checkbox>
                      <Checkbox value="Online">
                        <CheckboxIndicator className="border w-6 h-6">
                          <CheckboxIcon className="w-6 h-6" as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>{Strings.edit.online}</CheckboxLabel>
                      </Checkbox>
                    </CheckboxGroup>
                  </View>

                  {/* Localização */}
                  <View>
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.location}
                    </Text>

                    <View className="flex-row justify-between mt-2 mb-4">
                      {/* UF */}
                      <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                        UF
                      </Text>

                      {/* Cidade */}
                      <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                        Cidades
                      </Text>
                    </View>

                    {/* Bairro */}
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      Bairros
                    </Text>
                  </View>

                  {/* Direito de Imagem */}
                  <View className="w-80">
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.imageRight}
                    </Text>
                    <RadioGroup
                      value={imageRight}
                      onChange={setImageRight}
                      className="flex-row items-center justify-around"
                    >
                      <Radio value="authorize">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>
                          <Text className="font-ifood-regular">
                            {Strings.edit.authorize}
                          </Text>
                        </RadioLabel>
                      </Radio>
                      <Radio value="deny">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>
                          <Text className="font-ifood-regular">
                            {Strings.edit.deny}
                          </Text>
                        </RadioLabel>
                      </Radio>
                    </RadioGroup>
                  </View>

                  {/* Valores Max/Min */}
                  <View className="w-80">
                    <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.edit.valueRange}
                    </Text>
                    <View className="flex-row justify-between">
                      <View>
                        <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.edit.min}
                        </Text>
                        <Input size="lg" className="w-36">
                          <InputField
                            type="text"
                            placeholder="100"
                            value={minPrice}
                            onChangeText={setMinPrice}
                          />
                        </Input>
                      </View>
                      <View>
                        <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.edit.max}
                        </Text>
                        <Input size="lg" className="w-36">
                          <InputField
                            type="text"
                            placeholder="1000"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                          />
                        </Input>
                      </View>
                    </View>
                  </View>

                  {/* Horários */}
                  <View className="w-80 mt-4">
                    <Text className="font-ifood-large text-text-light dark:text-text-dark">
                      {Strings.edit.workingHours}
                    </Text>
                    {/* {(Object.keys(weekHours) as Day[]).map((day) => (
                    <View key={day} className="mb-4">
                      <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.edit[day]}
                      </Text>

                      <View className="flex-row w-80 justify-between">
                        <View>
                          <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                            {Strings.edit.from}
                          </Text>
                          <Input size="lg" className="w-36">
                            <InputField
                              type="text"
                              placeholder="hh:mm"
                              value={weekHours[day][0]}
                              onChangeText={(text) =>
                                setWeekHours((prev) => ({
                                  ...prev,
                                  [day]: [handleTimeChange(text), prev[day][1]],
                                }))
                              }
                              onBlur={() => {
                                if (!validateTime(weekHours[day][0])) {
                                  // alert('Horário inválido! Use o formato hh:mm');
                                }
                              }}
                            />
                          </Input>
                        </View>

                        <View>
                          <Text className="font-ifood-medium text-text-light dark:text-text-dark">
                            {Strings.edit.to}
                          </Text>
                          <Input size="lg" className="w-36">
                            <InputField
                              type="text"
                              placeholder="hh:mm"
                              value={weekHours[day][1]}
                              onChangeText={(text) =>
                                setWeekHours((prev) => ({
                                  ...prev,
                                  [day]: [prev[day][0], handleTimeChange(text)],
                                }))
                              }
                              onBlur={() => {
                                if (!validateTime(weekHours[day][1])) {
                                  // alert('Horário inválido! Use o formato hh:mm');
                                }
                              }}
                            />
                          </Input>
                        </View>
                      </View>
                    </View>
                  ))} */}
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
                {Strings.common.save}
              </Text>
            </Button>

            <HapticTab
              onPress={handleBack}
              className="flex-row justify-center gap-2 py-2"
            >
              <XIcon color={colors.primaryOrange} />
              <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                {Strings.common.cancel}
              </Text>
            </HapticTab>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
