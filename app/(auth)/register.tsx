import { useColors } from '@/src/hooks/useColors';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import Toast from 'react-native-toast-message';

export default function RegisterScreen() {
  const [type, setType] = useState('enterprise');
  const [reason, setReason] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reasonError, setReasonError] = useState(false);
  const [cnpjError, setCNPJError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const colors = useColors();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 11);

    const formatted = cleaned
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    setPhone(formatted);
  };

  const handleCnpjChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 14);

    const formatted = cleaned
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    setCnpj(formatted);
  };

  const validateCnpj = (cnpj: string) => {
    return cnpj.replace(/\D/g, '').length === 14;
  };

  const handleSubmit = () => {
    let hasError = false;
    setReasonError(false);
    setCNPJError(false);
    setPhoneError(false);
    setEmailError(false);
    setPasswordError(false);

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
    if (hasError) {
      Toast.show({
        type: 'error',
        text1: 'Formulario Invalido',
        text2: 'Verifique os campos preenchidos',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }
    Toast.show({
      type: 'success',
      text1: 'Sucesso',
      text2: 'Você criou o usuario com exito',
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const handlerError = (error: boolean) => {
    return error ? 'border-red-300' : 'border-gray-300';
  };

  return (
    <>
      <View style={{ zIndex: 999 }}>
        <Toast />
      </View>
      <ScrollView className="flex-1 p-10 mt-10">
        <Text className="font-ifood-medium text-lg mb-3 text-[18px]">
          Boas-vindas!
        </Text>
        <Text className="font-ifood-regular mb-6">
          Precisamos de algumas informações básicas para criar sua conta.
        </Text>

        <Text className="font-ifood-medium mb-2">Quem é você?</Text>
        <View className="flex-row mb-2">
          <View className="flex-row items-center">
            <RadioButton
              value="client"
              status={type === 'client' ? 'checked' : 'unchecked'}
              onPress={() => setType('client')}
              color={colors.primaryBlue}
              uncheckedColor={colors.disabled}
            />
            <Text
              style={{
                color: type === 'client' ? colors.primaryBlue : colors.disabled,
              }}
              className="font-ifood-regular"
            >
              {' '}
              Solicitante
            </Text>
          </View>
          <View className="flex-row items-center">
            <RadioButton
              value="enterprise"
              status={type === 'enterprise' ? 'checked' : 'unchecked'}
              onPress={() => setType('enterprise')}
              color={colors.primaryBlue}
              uncheckedColor={colors.disabled}
            />
            <Text
              style={{
                color:
                  type === 'enterprise' ? colors.primaryBlue : colors.disabled,
              }}
              className="font-ifood-regular"
            >
              Empresa
            </Text>
          </View>
          <View className="flex-row items-center">
            <RadioButton
              value="interpreter"
              status={type === 'interpreter' ? 'checked' : 'unchecked'}
              onPress={() => setType('interpreter')}
              color={colors.primaryBlue}
              uncheckedColor={colors.disabled}
            />
            <Text
              style={{
                color:
                  type === 'interpreter' ? colors.primaryBlue : colors.disabled,
              }}
              className="font-ifood-regular"
            >
              Intérprete
            </Text>
          </View>
        </View>
        <View className="flex-1 px-4 pt-2 justify-between">
          <View>
            <Text className="font-ifood-medium mb-2">
              Razão Social
              <Text style={{ color: '#B91C1C' }}>*</Text>
            </Text>
            <TextInput
              placeholder="Empresa X"
              value={reason}
              onChangeText={setReason}
              maxLength={100}
              className={`border ${handlerError(reasonError)} rounded-lg px-4 py-3 mb-4`}
            />

            <Text className="font-ifood-medium mb-2">
              CNPJ
              <Text style={{ color: '#B91C1C' }}>*</Text>
            </Text>
            <TextInput
              placeholder="00.000.000/0001-00"
              value={cnpj}
              onChangeText={handleCnpjChange}
              className={`border ${handlerError(cnpjError)} rounded-lg px-4 py-3 mb-4`}
              maxLength={18}
            />

            <Text className="font-ifood-medium mb-2">
              Telefone
              <Text style={{ color: '#B91C1C' }}>*</Text>
            </Text>
            <TextInput
              placeholder="(00) 00000-0000"
              value={phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              className={`border ${handlerError(phoneError)} rounded-lg px-4 py-3 mb-4`}
              maxLength={15}
            />

            <Text className="font-ifood-medium mb-2">
              Email
              <Text style={{ color: '#B91C1C' }}>*</Text>
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
              Senha
              <Text style={{ color: '#B91C1C' }}>*</Text>
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
          <View className="mt-5 pb-40">
            <TouchableOpacity
              style={{ backgroundColor: colors.primaryOrange }}
              className="py-4 rounded-lg mb-3"
              onPress={handleSubmit}
            >
              <Text className="font-ifood-bold text-center text-white text-lg">
                + Criar conta
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text
                style={{ color: colors.primaryOrange }}
                className="font-ifood-medium text-center"
              >
                ✕ Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
