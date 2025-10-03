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
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet, useApiPost } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import {
  type FormFields,
  useFormValidation,
} from '@/src/hooks/useFormValidation';
import {
  type StateAndCityResponse,
  AppointmentRequest,
  AppointmentResponse,
  Modality,
} from '@/src/types/api';
import type { OptionItem } from '@/src/types/ui';
import {
  buildAppointmentPayload,
  buildRequiredFieldError,
} from '@/src/utils/helpers';
import { formatDate, formatTime } from '@/src/utils/masks';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import {
  XIcon,
  CheckIcon,
  CircleIcon,
  AlertCircleIcon,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Toast } from 'toastify-react-native';

type ScheduleValidationContext = {
  state: string;
  modality: Modality[];
};

export default function ToScheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Interpreter ID from route params
  const { user } = useAuth();
  const colors = useColors();

  console.log('Interpreter ID:', id);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [time, setTime] = useState(new Date());

  const appointmentApi = useApiPost<AppointmentResponse, AppointmentRequest>(
    ApiRoutes.appointments.base,
  );

  // Disallow today and past dates
  const minDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    return d;
  }, []);

  const { fields, setValue, validateForm, clearErrors } = useFormValidation<
    FormFields<ScheduleValidationContext>,
    ScheduleValidationContext
  >({
    description: {
      value: '',
      error: '',
      validate: (value: string): string | null =>
        !value.trim() ? buildRequiredFieldError('description') : null,
    },
    date: {
      value: '',
      error: '',
      validate: (value: string): string | null =>
        !value.trim() ? buildRequiredFieldError('date') : null,
    },
    time: {
      value: '',
      error: '',
      validate: (value: string): string | null =>
        !value.trim() ? buildRequiredFieldError('time') : null,
    },
    modality: {
      value: [Modality.PERSONALLY],
      error: '',
      validate: (_value: string, _ctx?: ScheduleValidationContext): null =>
        null,
    },
    state: {
      value: '',
      error: '',
      validate: (
        value: string,
        ctx?: ScheduleValidationContext,
      ): string | null =>
        ctx?.modality.includes(Modality.PERSONALLY) && !value.trim()
          ? buildRequiredFieldError('state')
          : null,
    },
    city: {
      value: '',
      error: '',
      validate: (
        value: string,
        ctx?: ScheduleValidationContext,
      ): string | null =>
        ctx?.modality.includes(Modality.PERSONALLY) && !value.trim()
          ? buildRequiredFieldError('city')
          : null,
    },
    neighborhood: {
      value: '',
      error: '',
      validate: (
        value: string,
        ctx?: ScheduleValidationContext,
      ): string | null =>
        ctx?.modality.includes(Modality.PERSONALLY) && !value.trim()
          ? buildRequiredFieldError('neighborhood')
          : null,
    },
    street: {
      value: '',
      error: '',
      validate: (
        value: string,
        ctx?: ScheduleValidationContext,
      ): string | null =>
        ctx?.modality.includes(Modality.PERSONALLY) && !value.trim()
          ? buildRequiredFieldError('street')
          : null,
    },
    number: {
      value: '',
      error: '',
      validate: (
        value: string,
        ctx?: ScheduleValidationContext,
      ): string | null =>
        ctx?.modality.includes(Modality.PERSONALLY) && !value.trim()
          ? buildRequiredFieldError('number')
          : null,
    },
    floor: {
      value: '',
      error: '',
      validate: (_value: string, _ctx?: ScheduleValidationContext): null =>
        null,
    },
  });

  // Fetch all states
  const [selectedState, setselectedState] = useState(fields.state.value);
  const { data: states } = useApiGet<StateAndCityResponse>(
    ApiRoutes.states.base,
  );

  let stateOptions: OptionItem[] = [];
  if (states?.success && states?.data) {
    stateOptions = states.data.map((state) => ({
      label: state.name,
      value: state.name,
    }));
  }

  // Fetch cities based on selected state
  const { data: cities } = useApiGet<StateAndCityResponse>(
    ApiRoutes.states.cities(selectedState),
  );

  let cityOptions: OptionItem[] = [];
  if (cities?.success && cities?.data) {
    cityOptions = cities.data.map((city) => ({
      label: city.name,
      value: city.name,
    }));
  }

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue('date', formatDate(selectedDate));
    }
  };

  const handleTimeChange = (_event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
      setValue('time', formatTime(selectedTime));
    }
  };

  function handleBack() {
    clearErrors();
    router.back();
  }

  async function handleSubmit() {
    if (
      !validateForm({
        state: selectedState,
        modality: fields.modality.value,
      })
    )
      return;

    try {
      const payload = buildAppointmentPayload(
        fields,
        id,
        user?.id || '', // Use the authenticated user's ID
      );

      console.log('📤 Enviando payload:', JSON.stringify(payload, null, 2));
      const result = await appointmentApi.post(payload);

      console.log('📥 Resposta da API:', JSON.stringify(result, null, 2));

      if (!result?.success || !result?.data) {
        console.error('❌ Erro na resposta:', {
          success: result?.success,
          message: result?.message,
          data: result?.data,
          fullResult: result,
        });

        Toast.show({
          type: 'error',
          text1: Strings.toSchedule.toast.errorTitle,
          text2: result?.message || Strings.toSchedule.toast.errorDescription,
          position: 'top',
          visibilityTime: 3000,
          autoHide: true,
          closeIconSize: 1,
        });
        return;
      }
    } catch (error: any) {
      console.error('Failed to submit appointment:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro de Conexão',
        text2: error?.message || 'Não foi possível conectar com o servidor',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        closeIconSize: 1,
      });
      return;
    }

    router.replace('/onboarding');
    Toast.show({
      type: 'success',
      text1: Strings.toSchedule.toast.successTitle,
      text2: Strings.toSchedule.toast.successDescription,
      position: 'center',
      visibilityTime: 4000,
      autoHide: false,
      topOffset: 50,
    });
  }

  return (
    <View className="flex-1">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.toSchedule.header}
          showBackButton={true}
          handleBack={handleBack}
        />
      </View>

      <KeyboardAvoidingView
        className="flex-1 px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="grow pb-4"
        >
          <View className="mt-4 py-4 px-4">
            <Text className="font-ifood-medium mb-3 text-[18px] text-left text-primary-800">
              {Strings.toSchedule.title}
            </Text>
            <Text className="font-ifood-regular text-left text-primary-800">
              {Strings.toSchedule.subtitle}
            </Text>
          </View>

          <View className="flex-1 px-4 mt-4">
            {/* Description */}
            <FormControl
              isRequired
              isInvalid={!!fields.description.error}
              className="mb-4"
            >
              <FormControlLabel>
                <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.common.fields.description}
                </FormControlLabelText>
              </FormControlLabel>
              <TextInput
                className={`w-90 border rounded p-2 ${
                  fields.description.error
                    ? 'border-error-700'
                    : 'border-primary-0 focus:border-primary-950'
                }`}
                multiline
                numberOfLines={7}
                value={fields.description.value}
                onChangeText={(text) => setValue('description', text)}
                inputMode="text"
                maxLength={400}
              />
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-600"
                />
                <FormControlErrorText>
                  {fields.description.error}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>

            <View className="flex-row justify-between gap-2 mb-4">
              {/* Date */}
              <FormControl
                isRequired
                isInvalid={!!fields.date.error}
                className="flex-1"
              >
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.common.fields.date}
                  </FormControlLabelText>
                </FormControlLabel>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Input pointerEvents="none">
                    <InputField
                      placeholder="DD/MM/AAAA"
                      className="font-ifood-regular"
                      value={fields.date.value}
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
                    {fields.date.error}
                  </FormControlErrorText>
                </FormControlError>
                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="calendar"
                    minimumDate={minDate}
                    onChange={handleDateChange}
                  />
                )}
              </FormControl>

              {/* Time */}
              <FormControl
                isRequired
                isInvalid={!!fields.time.error}
                className="w-28"
              >
                <FormControlLabel>
                  <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                    {Strings.common.fields.time}
                  </FormControlLabelText>
                </FormControlLabel>
                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                  <Input pointerEvents="none">
                    <InputField
                      placeholder="HH:MM"
                      className="font-ifood-regular"
                      value={fields.time.value}
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
                    {fields.time.error}
                  </FormControlErrorText>
                </FormControlError>
                {showTimePicker && (
                  <DateTimePicker
                    value={time}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                )}
              </FormControl>
            </View>

            {/* Modality */}
            <View className="w-80 mt-2 mb-6">
              <Text className="font-ifood-medium text-text-light mb-2 dark:text-text-dark">
                {Strings.common.fields.modality}*
              </Text>
              <RadioGroup
                value={fields.modality.value[0] || Modality.PERSONALLY}
                onChange={(value) => setValue('modality', [value as Modality])}
                className="flex-row items-center justify-around"
              >
                <Radio value={Modality.PERSONALLY}>
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel>
                    <Text
                      className="font-ifood-regular"
                      style={{
                        color: fields.modality.value.includes(
                          Modality.PERSONALLY,
                        )
                          ? colors.text
                          : colors.disabled,
                      }}
                    >
                      {Strings.common.options.inPerson}
                    </Text>
                  </RadioLabel>
                </Radio>
                <Radio value={Modality.ONLINE}>
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                  <RadioLabel>
                    <Text
                      className="font-ifood-regular"
                      style={{
                        color: fields.modality.value.includes(Modality.ONLINE)
                          ? colors.text
                          : colors.disabled,
                      }}
                    >
                      {Strings.common.options.online}
                    </Text>
                  </RadioLabel>
                </Radio>
              </RadioGroup>
            </View>

            {/* Location */}
            {fields.modality.value.includes(Modality.PERSONALLY) && (
              <View className="mb-12">
                <Text className="mb-2 font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.common.fields.location}*
                </Text>

                <View className="gap-2">
                  <View className="flex-row justify-between">
                    {/* State */}
                    <FormControl
                      isInvalid={!!fields.state.error}
                      className="w-24"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.common.fields.state}
                        </FormControlLabelText>
                      </FormControlLabel>
                      <ModalSingleSelection
                        items={stateOptions}
                        selectedValue={fields.state.value}
                        onSelectionChange={(value) => {
                          setValue('state', value);
                          setselectedState(value);
                          setValue('city', '');
                        }}
                        placeholderText={Strings.common.fields.state}
                        hasError={!!fields.state.error}
                      />
                      <FormControlError>
                        <FormControlErrorIcon
                          as={AlertCircleIcon}
                          className="text-red-600"
                        />
                        <FormControlErrorText>
                          {fields.state.error}
                        </FormControlErrorText>
                      </FormControlError>
                    </FormControl>

                    {/* City */}
                    <FormControl
                      isInvalid={!!fields.city.error}
                      className="w-56"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.common.fields.city}
                        </FormControlLabelText>
                      </FormControlLabel>
                      <ModalSingleSelection
                        items={cityOptions}
                        selectedValue={fields.city.value}
                        onSelectionChange={(value) => {
                          setValue('city', value);
                        }}
                        placeholderText={Strings.common.fields.city}
                        hasError={!!fields.city.error}
                      />
                      <FormControlError>
                        <FormControlErrorIcon
                          as={AlertCircleIcon}
                          className="text-red-600"
                        />
                        <FormControlErrorText>
                          {fields.city.error}
                        </FormControlErrorText>
                      </FormControlError>
                    </FormControl>
                  </View>

                  {/* Neighborhood */}
                  <FormControl isInvalid={!!fields.neighborhood.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.neighborhood}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder={Strings.common.fields.neighborhood}
                        className="font-ifood-regular"
                        value={fields.neighborhood.value}
                        autoCapitalize="none"
                        onChangeText={(v) => setValue('neighborhood', v)}
                        keyboardType="default"
                        maxLength={100}
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.neighborhood.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  {/* Street */}
                  <FormControl isInvalid={!!fields.street.error}>
                    <FormControlLabel>
                      <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                        {Strings.common.fields.street}
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder={Strings.common.fields.street}
                        className="font-ifood-regular"
                        value={fields.street.value}
                        autoCapitalize="none"
                        onChangeText={(v) => setValue('street', v)}
                        keyboardType="default"
                        maxLength={100}
                      />
                    </Input>
                    <FormControlError>
                      <FormControlErrorIcon
                        as={AlertCircleIcon}
                        className="text-red-600"
                      />
                      <FormControlErrorText>
                        {fields.street.error}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>

                  <View className="flex-row justify-between">
                    {/* Number */}
                    <FormControl
                      isInvalid={!!fields.number.error}
                      className="w-24"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.common.fields.number}
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder={Strings.common.fields.number}
                          className="font-ifood-regular"
                          value={fields.number.value}
                          autoCapitalize="none"
                          onChangeText={(v) => setValue('number', v)}
                          keyboardType="numeric"
                          maxLength={50}
                        />
                      </Input>
                      <FormControlError>
                        <FormControlErrorIcon
                          as={AlertCircleIcon}
                          className="text-red-600"
                        />
                        <FormControlErrorText>
                          {fields.number.error}
                        </FormControlErrorText>
                      </FormControlError>
                    </FormControl>

                    {/* Floor */}
                    <FormControl
                      isInvalid={!!fields.floor.error}
                      className="w-56"
                    >
                      <FormControlLabel>
                        <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                          {Strings.common.fields.floor}
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder={Strings.common.fields.floor}
                          className="font-ifood-regular"
                          value={fields.floor.value}
                          autoCapitalize="none"
                          onChangeText={(v) => setValue('floor', v)}
                          keyboardType="default"
                          maxLength={200}
                        />
                      </Input>
                      <FormControlError>
                        <FormControlErrorIcon
                          as={AlertCircleIcon}
                          className="text-red-600"
                        />
                        <FormControlErrorText>
                          {fields.floor.error}
                        </FormControlErrorText>
                      </FormControlError>
                    </FormControl>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Bottom buttons */}
          <View className="mt-auto pb-2 gap-4 px-4">
            <Button
              size="md"
              onPress={handleSubmit}
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={CheckIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                {Strings.common.buttons.confirm}
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
