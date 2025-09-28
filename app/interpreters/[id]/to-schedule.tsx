import Header from '@/src/components/Header';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import { router, useLocalSearchParams } from 'expo-router';
import {
  PlusIcon,
  XIcon,
  CheckIcon,
  SquareIcon,
  CircleIcon,
} from 'lucide-react-native';
import { Strings } from '@/src/constants/Strings';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modality, StateAndCityResponse, UserType } from '@/src/types/common';
import ModalSingleSelection from '@/src/components/ModalSingleSelection';
import type { OptionItem } from '@/src/types/ui';
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
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import HapticTab from '@/src/components/HapticTab';
import {
  type FormFields,
  useFormValidation,
} from '@/src/hooks/useFormValidation';
import { AlertCircleIcon } from 'lucide-react-native';
import { formatDate } from '@/src/utils/masks';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { useApiGet } from '@/src/hooks/useApi';
import { buildRequiredFieldError } from '@/src/utils/helpers';
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from '@/src/components/ui/radio';

type ScheduleValidationContext = {
  state: string;
  modality: Modality[];
};

export default function ToScheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Interpreter ID from route params

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const colors = useColors();
  const [type, setType] = useState(Modality.PERSONALLY);

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

  function handleBack() {
    clearErrors();
    router.back();
  }

  function handleSubmit() {
    if (
      !validateForm({
        state: selectedState,
        modality: fields.modality.value,
      })
    )
      return;

    console.log('Form is valid, proceed with submission');
  }

  // Mock para localização - ajustar na integração
  const ufChoices: OptionItem[] = [
    { label: 'RS', value: 'RS' },
    { label: 'SP', value: 'SP' },
    { label: 'MG', value: 'MG' },
  ];

  const cityChoices: OptionItem[] = [
    { label: 'Porto Alegre', value: 'PORTO_ALEGRE' },
    { label: 'Canoas', value: 'CANOAS' },
    { label: 'Cachoeirinha', value: 'CACHOEIRINHA' },
  ];

  return (
    <View className="flex-1">
      <View className="mt-12 pb-2">
        <Header title="AGENDAR" showBackButton={true} handleBack={handleBack} />
      </View>

      <KeyboardAvoidingView
        className="flex-1 px-6"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mt-4 py-4 px-4">
            <Text className="font-ifood-medium mb-3 text-[18px] text-left text-primary-800">
              Solicitação de agendamento
            </Text>
            <Text className="font-ifood-regular text-left text-primary-800">
              Informar uma descrição detalhada aumenta as chances do intérprete
              aceitar a sua solicitação.
            </Text>
          </View>

          <View className="flex-1 px-4 mt-4">
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

            <FormControl
              isRequired
              isInvalid={!!fields.date.error}
              className="mb-4"
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
                <FormControlErrorText>{fields.date.error}</FormControlErrorText>
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

            {/* Modality */}
            <View className="w-80 my-2">
              <Text className="font-ifood-medium text-text-light mb-2 dark:text-text-dark">
                {Strings.common.fields.modality}*
              </Text>
              <RadioGroup
                value={fields.modality.value}
                onChange={(value) => setValue('modality', value)}
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
                        color:
                          fields.modality.value === Modality.PERSONALLY
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
                        color:
                          fields.modality.value === Modality.ONLINE
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
              <View>
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
                      className="w-52"
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
          <View className="mt-14 pb-4 gap-4">
            <Button
              size="md"
              onPress={handleSubmit}
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
