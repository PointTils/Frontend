import Header from '@/src/components/Header';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import { router } from 'expo-router';
import { PlusIcon, XIcon, CheckIcon, SquareIcon } from 'lucide-react-native';
import { Strings } from '@/src/constants/Strings';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modality } from '@/src/types/common';
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
  TouchableOpacity,
} from 'react-native';
import HapticTab from '@/src/components/HapticTab';
import {
  type FormFields,
  useFormValidation,
} from '@/src/hooks/useFormValidation';
import {
  AlertCircleIcon,
} from 'lucide-react-native';
import { formatDate } from '@/src/utils/masks';
export default function ExampleScreen() {
  const [show, setShow] = useState(false);
  const colors = useColors();
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState(Modality.PERSONALLY);
  const { fields, setValue, validateForm, clearErrors } = useFormValidation<
    FormFields<{ type: string }>,
    { type: string }
  >({
    description: {
      value: '',
      error: '',
      validate: (value: string, ctx?: { type: string }) => {
        return Strings.common.fields.cpf + ' ' + Strings.common.fields.errors.invalid;
        return null;
      },
    },
    appointmentDateTime: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value) {
          return 'Data e hora do agendamento são obrigatórias';
        }
        return null;
      },
    },
    uf: {
      value: '',
      error: '',
      validate: (value: string) => {
        if (!value) return 'UF é obrigatória';
        return null;
      },
    },
    neighborhood: { value: '', error: '', validate: (v) => (!v ? 'Bairro obrigatório' : null) },
    number: { value: '', error: '', validate: (v) => (!v ? 'Número obrigatório' : null) },
    street: { value: '', error: '', validate: (v) => (!v ? 'Número obrigatório' : null) },
    floor: { value: '', error: '', validate: () => null },
  })
  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      setValue('birthday', formatDate(selectedDate));
    }
  };
  const handleChangeType = (newType: Modality) => {
    setType(newType);
    clearErrors();

    (Object.keys(fields) as (keyof typeof fields)[]).forEach((key) =>
      setValue(key, ''),
    );
    setDate(new Date());
  };

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
        <Header
          title="AGENDAR"
          showBackButton={true}
          handleBack={() => router.back()}
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
              Solicitação de agendamento
            </Text>
            <Text className="font-ifood-regular mb-6 text-left text-primary-800">
              Informar uma descrição detalhada aumenta as chances do intérprete aceitar a sua solicitação.
            </Text>
          </View>

          <View className="flex-1 px-4 gap-4">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                  Descrição
                </FormControlLabelText>
              </FormControlLabel>

              <Input className="h-28">
                <InputField
                  placeholder="Descreva a finalidade de seu agendamento"
                  className="font-ifood-regular pt-2"
                  value={fields.description.value}
                  onChangeText={(v) => setValue('description', v)}
                  maxLength={255}
                  keyboardType="default"
                  multiline
                  textAlignVertical="top"
                />

              </Input>
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

            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                  {Strings.appointment_solicitation.date}
                </FormControlLabelText>
              </FormControlLabel>
              <TouchableOpacity onPress={() => setShow(true)}>
                <Input pointerEvents="none">
                  <InputField
                    placeholder="Selecione a data e hora"
                    className="font-ifood-regular"
                    value={fields.appointmentDateTime.value}
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
                  {fields.appointmentDateTime.error}
                </FormControlErrorText>
              </FormControlError>
              {show && (
                <DateTimePicker
                  value={date}
                  mode='datetime'
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </FormControl>

            <Text className="font-ifood-medium mb-0 text-left text-primary-800">
              {Strings.appointment_solicitation.modality}
            </Text>
            <View className="flex-row items-center justify-center gap-x-8">
              <Checkbox
                isChecked={type === Modality.PERSONALLY}
                onChange={() => setType(Modality.PERSONALLY)} value={''}  >
                <CheckboxIndicator>
                  <CheckboxIcon as={SquareIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>
                  <Text
                    style={{
                      color:
                        type === Modality.PERSONALLY ? colors.text : colors.disabled,
                    }}
                    className="font-ifood-regular"
                  >
                    {Strings.appointment_solicitation.presencial}
                  </Text>
                </CheckboxLabel>
              </Checkbox>

              <Checkbox
                isChecked={type === Modality.ONLINE}
                onChange={() => setType(Modality.ONLINE)} value={''}  >
                <CheckboxIndicator>
                  <CheckboxIcon as={SquareIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>
                  <Text
                    style={{
                      color: type === Modality.ONLINE ? colors.text : colors.disabled,
                    }}
                    className="font-ifood-regular"
                  >
                    {Strings.appointment_solicitation.online}
                  </Text>
                </CheckboxLabel>
              </Checkbox>
            </View>


            {type === Modality.PERSONALLY && (
              <View className="gap-3">
                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText className="font-ifood-medium text-text-light dark:text-text-dark">
                      {Strings.appointment_solicitation.location.location}
                    </FormControlLabelText>
                  </FormControlLabel>

                  <View className="flex-row gap-3">
                    <View className="flex-1">
                      <ModalSingleSelection
                        items={ufChoices}
                        selectedValue={fields.uf.value}
                        onSelectionChange={(value) => setValue('uf', value)}
                        placeholderText={Strings.appointment_solicitation.location.uf}
                      />
                    </View>

                    <View className="flex-[2]">
                      <ModalSingleSelection
                        items={cityChoices}
                        selectedValue={fields.city?.value}
                        onSelectionChange={(value) => setValue('city', value)}
                        placeholderText={Strings.appointment_solicitation.location.city}
                      />
                    </View>
                  </View>
                </FormControl>

                <View>
                  <FormControl isRequired>
                    <Input>
                      <InputField
                        placeholder={Strings.appointment_solicitation.location.neighborhood}
                        className="font-ifood-regular"
                        value={fields.neighborhood.value}
                        autoCapitalize="none"
                        onChangeText={(v) => setValue('neighborhood', v)}
                        keyboardType="default"
                        maxLength={250}
                      />
                    </Input>
                  </FormControl>
                </View>

                <FormControl isRequired>
                  <Input>
                    <InputField
                      placeholder={Strings.appointment_solicitation.location.street}
                      className="font-ifood-regular"
                      value={fields.street.value}
                      autoCapitalize="none"
                      onChangeText={(v) => setValue('street', v)}
                      keyboardType='default'
                      maxLength={250}
                    />
                  </Input>
                </FormControl>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <FormControl>
                      <Input>
                        <InputField
                          placeholder={Strings.appointment_solicitation.location.number}
                          className="font-ifood-regular"
                          value={fields.number.value}
                          maxLength={14}
                          keyboardType="numeric"
                          onChangeText={(v) => setValue('number', v)}
                        />
                      </Input>
                    </FormControl>
                  </View>

                  <View className="flex-[2]">
                    <FormControl isRequired>
                      <Input>
                        <InputField
                          placeholder={Strings.appointment_solicitation.location.floor}
                          className="font-ifood-regular"
                          value={fields.floor.value}
                          autoCapitalize="none"
                          onChangeText={(v) => setValue('floor', v)}
                          keyboardType="default"
                          maxLength={250}
                        />
                      </Input>
                    </FormControl>
                  </View>
                </View>
              </View>
            )}
          </View>

          <View className="mt-14 pb-4 gap-4">
            <Button
              onPress={() => console.log('Confirmar')}
              size="md"
              className="data-[active=true]:bg-primary-orange-press-light"
            >
              <ButtonIcon as={PlusIcon} className="text-white" />
              <Text className="font-ifood-regular text-text-dark">
                Solicitar
              </Text>
            </Button>

            <HapticTab
              onPress={() => router.back()}
              className="flex-row justify-center gap-2 py-2"
            >
              <XIcon color={colors.primaryOrange} />
              <Text className="font-ifood-regular text-primary-orange-light dark:text-primary-orange-dark">
                Cancelar
              </Text>
            </HapticTab>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
