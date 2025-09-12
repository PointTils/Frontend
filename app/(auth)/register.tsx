import { Button } from '@/src/components/ui/button';
import {
  Radio,
  RadioGroup,
  RadioIndicator,
  RadioLabel,
} from '@/src/components/ui/radio';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/src/components/ui/select';
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/src/components/ui/toast';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import {
  formatDate,
  handleCnpjChange,
  handleCpfChange,
  handlePhoneChange,
  validateBirthday,
  validateCnpj,
  validateCpf,
  validateEmail,
} from '@/src/utils/mask';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ChevronDownIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RegisterScreen() {
  const [type, setType] = useState('enterprise');
  const [reason, setReason] = useState('');
  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [cpf, setCpf] = useState('');
  const [date, setDate] = useState(new Date());
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [reasonError, setReasonError] = useState(false);
  const [cnpjError, setCNPJError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [cpfError, setCpfError] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);
  const [genderError, setGenderError] = useState(false);

  const colors = useColors();
  const toast = useToast();
  const [isToastVisible, setIsToastVisible] = useState(false);

  const handleSubmit = () => {
    let hasError = false;
    setReasonError(false);
    setCNPJError(false);
    setPhoneError(false);
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);
    setCpfError(false);
    setBirthdayError(false);
    setGenderError(false);

    if (type === 'client') {
      if (name.length < 5) {
        hasError = true;
        setName('');
        setNameError(true);
      }
      if (!validateCpf(cpf)) {
        hasError = true;
        setCpf('');
        setCpfError(true);
      }
      if (!validateBirthday(birthday)) {
        hasError = true;
        setBirthday('');
        setBirthdayError(true);
      }
      if (gender === '') {
        hasError = true;
        setGender('');
        setGenderError(true);
      }
    } else if (type === 'enterprise') {
      if (reason.length < 5) {
        hasError = true;
        setReason('');
        setReasonError(true);
      }
      if (!validateCnpj(cnpj)) {
        hasError = true;
        setCnpj('');
        setCNPJError(true);
      }
    } else if (type === 'interpreter') {
      if (name.length < 5) {
        hasError = true;
        setName('');
        setNameError(true);
      }
      if (!validateCpf(cpf)) {
        hasError = true;
        setCpf('');
        setCpfError(true);
      }
      if (cnpj.length > 0) {
        if (!validateCnpj(cnpj)) {
          hasError = true;
          setCnpj('');
          setCNPJError(true);
        }
      }
      if (!validateBirthday(birthday)) {
        hasError = true;
        setBirthday('');
        setBirthdayError(true);
      }
    }

    if (phone.replace(/\D/g, '').length < 10) {
      hasError = true;
      setPhone('');
      setPhoneError(true);
    }
    if (!validateEmail(email)) {
      hasError = true;
      setEmail('');
      setEmailError(true);
    }
    if (password.length < 8) {
      hasError = true;
      setPassword('');
      setPasswordError(true);
    }

    if (isToastVisible) return; // bloqueia spam
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 2000);

    if (hasError) {
      toast.show({
        duration: 2000,
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast
              className="mt-12 w-[300px] rounded-none"
              nativeID={`toast-${id}`}
              action="error"
              variant="solid"
            >
              <ToastTitle>{Strings.register.obsTitle}</ToastTitle>
              <ToastDescription>{Strings.register.obsText}</ToastDescription>
            </Toast>
          );
        },
      });
      return;
    }
    toast.show({
      duration: 2000,
      placement: 'top',
      render: ({ id }) => {
        return (
          <Toast
            className="mt-12 w-[300px] rounded-none"
            nativeID={`toast-${id}`}
            action="success"
          >
            <ToastTitle>{Strings.register.successTitle}</ToastTitle>
            <ToastDescription>{Strings.register.successText}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handlerError = (error: boolean) => {
    return error ? 'border-red-300' : 'border-gray-300';
  };

  const handlerChangeType = (type: string) => {
    setReasonError(false);
    setCNPJError(false);
    setPhoneError(false);
    setEmailError(false);
    setPasswordError(false);
    setNameError(false);
    setCpfError(false);
    setBirthdayError(false);
    setGenderError(false);

    setReason('');
    setCnpj('');
    setPhone('');
    setEmail('');
    setPassword('');
    setName('');
    setCpf('');
    setBirthday('');
    setGender('');

    setType(type);
  };

  return (
    <>
      <KeyboardAvoidingView
        className="p-10 mt-10 pb-0"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          <Text className="font-ifood-medium text-lg mb-3 text-[18px]">
            {Strings.register.title}
          </Text>
          <Text className="font-ifood-regular mb-6">
            {Strings.register.subtitle}
          </Text>

          <Text className="font-ifood-medium mb-2">
            {Strings.register.typeSelect}
          </Text>
          <RadioGroup
            value={type}
            onChange={(value) => handlerChangeType(value)}
            className="flex-row items-center mb-4"
          >
            <Radio value="client">
              <RadioIndicator className="data-[checked=true]:bg-primary-blue-light data-[checked=true]:border-primary-blue-light" />
              <RadioLabel>
                <Text
                  style={{
                    color:
                      type === 'client' ? colors.primaryBlue : colors.disabled,
                  }}
                  className="font-ifood-regular"
                >
                  {Strings.register.client}
                </Text>
              </RadioLabel>
            </Radio>
            <Radio value="enterprise">
              <RadioIndicator className="data-[checked=true]:bg-primary-blue-light data-[checked=true]:border-primary-blue-light" />

            <RadioLabel>
              <Text
                style={{
                  color:
                    type === 'enterprise'
                      ? colors.primaryBlue
                      : colors.disabled,
                }}
                className="font-ifood-regular"
              >
                {Strings.register.enterprise}
              </Text>
            </RadioLabel>
          </Radio>
          <Radio value="interpreter">
            <RadioIndicator className="data-[checked=true]:bg-primary-blue-light data-[checked=true]:border-primary-blue-light" />
            <RadioLabel>
              <Text
                style={{
                  color:
                    type === 'interpreter'
                      ? colors.primaryBlue
                      : colors.disabled,
                }}
                className="font-ifood-regular"
              >
                {' '}
                {Strings.register.interpreter}
              </Text>
            </RadioLabel>
          </Radio>
        </RadioGroup>

          <View className="flex-1 px-4 pt-2 justify-between">
            {type === 'client' && (
              <>
                <View>
                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.name}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Nome X"
                    value={name}
                    onChangeText={setName}
                    maxLength={100}
                    className={`border ${handlerError(nameError)} rounded-lg px-4 py-3 mb-4`}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.cpf}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChangeText={(cpf) => setCpf(handleCpfChange(cpf))}
                    className={`border ${handlerError(cpfError)} rounded-lg px-4 py-3 mb-4`}
                    maxLength={14}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.birthday}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <>
                    <TouchableOpacity onPress={() => setShow(true)}>
                      <TextInput
                        placeholder="DD/MM/AAAA"
                        className={`border ${handlerError(birthdayError)} rounded-lg px-4 py-3 mb-4`}
                        value={birthday}
                        editable={false}
                      />
                    </TouchableOpacity>

                    {show && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShow(false); // fecha após escolher
                          if (selectedDate) {
                            setDate(selectedDate);
                            setBirthday(formatDate(selectedDate));
                          }
                        }}
                      />
                    )}
                  </>

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.gender}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <Select onValueChange={setGender}>
                    <SelectTrigger
                      className={`border ${handlerError(genderError)} h-[40px] rounded-lg px-2 mb-4`}
                    >
                      <SelectInput placeholder={Strings.register.select} />
                      <SelectIcon className="mr-3" as={ChevronDownIcon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem label={Strings.register.male} value="M" />
                        <SelectItem label={Strings.register.famale} value="F" />
                        <SelectItem label={Strings.register.others} value="O" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.phone}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChangeText={(text) => setPhone(handlePhoneChange(text))}
                    keyboardType="phone-pad"
                    className={`border ${handlerError(phoneError)} rounded-lg px-4 py-3 mb-4`}
                    maxLength={15}
                  />
                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.email}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    maxLength={250}
                    className={`border ${handlerError(emailError)} rounded-lg px-4 py-3 mb-4`}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.password}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="*******"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    maxLength={25}
                    className={`border ${handlerError(passwordError)} rounded-lg px-4 py-3 mb-6`}
                  />
                </View>
              </>
            )}
            {type === 'enterprise' && (
              <>
                <View>
                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.socialReason}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Empresa X"
                    value={reason}
                    onChangeText={setReason}
                    maxLength={100}
                    className={`border ${handlerError(reasonError)} rounded-lg px-4 py-3 mb-4`}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.cnpj}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChangeText={(cnpj) => setCnpj(handleCnpjChange(cnpj))}
                    className={`border ${handlerError(cnpjError)} rounded-lg px-4 py-3 mb-4`}
                    maxLength={18}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.phone}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChangeText={(text) => setPhone(handlePhoneChange(text))}
                    keyboardType="phone-pad"
                    className={`border ${handlerError(phoneError)} rounded-lg px-4 py-3 mb-4`}
                    maxLength={15}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.email}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    maxLength={250}
                    className={`border ${handlerError(emailError)} rounded-lg px-4 py-3 mb-4`}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.password}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="*******"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    maxLength={25}
                    className={`border ${handlerError(passwordError)} rounded-lg px-4 py-3 mb-6`}
                  />
                </View>
              </>
            )}
            {type === 'interpreter' && (
              <>
                <View>
                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.name}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="Nome X"
                    value={name}
                    onChangeText={setName}
                    maxLength={100}
                    className={`border ${handlerError(nameError)} rounded-lg px-4 py-3 mb-4`}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.cpf}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChangeText={(cpf) => setCpf(handleCpfChange(cpf))}
                    className={`border ${handlerError(cpfError)} rounded-lg px-4 py-3 mb-4`}
                    maxLength={14}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.cnpj} ({Strings.common.optional})
                  </Text>
                  <TextInput
                    placeholder="00.000.000/0001-00"
                    value={cnpj}
                    onChangeText={(cnpj) => setCnpj(handleCnpjChange(cnpj))}
                    className={`border ${handlerError(cnpjError)} rounded-lg px-4 py-3 mb-4`}
                    maxLength={18}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.birthday}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <>
                    <TouchableOpacity onPress={() => setShow(true)}>
                      <TextInput
                        placeholder="DD/MM/AAAA"
                        className={`border ${handlerError(birthdayError)} rounded-lg px-4 py-3 mb-4`}
                        value={birthday}
                        editable={false}
                      />
                    </TouchableOpacity>

                    {show && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShow(false); // fecha após escolher
                          if (selectedDate) {
                            setDate(selectedDate);
                            setBirthday(formatDate(selectedDate));
                          }
                        }}
                      />
                    )}
                  </>

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.phone}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChangeText={(text) => setPhone(handlePhoneChange(text))}
                    keyboardType="phone-pad"
                    className={`border ${handlerError(phoneError)} rounded-lg px-4 py-3 mb-4`}
                    maxLength={15}
                  />
                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.email}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="example@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    maxLength={250}
                    className={`border ${handlerError(emailError)} rounded-lg px-4 py-3 mb-4`}
                  />

                  <Text className="font-ifood-medium mb-2">
                    {Strings.register.password}
                    <Text style={{ color: colors.mandatory }}>*</Text>
                  </Text>
                  <TextInput
                    placeholder="*******"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    maxLength={25}
                    className={`border ${handlerError(passwordError)} rounded-lg px-4 py-3 mb-6`}
                  />
                </View>
              </>
            )}
            <View className="mt-5">
              <Button
                onPress={handleSubmit}
                size="xl"
                className="font-ifood-bold py-3 mb-3 text-center text-white text-lg data-[active=true]:bg-primary-orange-press-light"
              >
                <Text className="font-ifood-medium text-text-dark">
                  {Strings.register.create}
                </Text>
              </Button>

              <Button
                action={'default'}
                onPress={handleSubmit}
                size="lg"
                className="font-ifood-bold text-center text-blue text-lg"
              >
                <Text className="font-ifood-medium text-primary-orange-light data-[active=true]:text-text-primary-orange-press-dark">
                  {Strings.register.cancel}
                </Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
