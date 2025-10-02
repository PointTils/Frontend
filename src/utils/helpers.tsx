import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { formatDateToISO, formatTime } from './masks';
import { Strings } from '../constants/Strings';
import type { UserRequest } from '../types/api';
import { Modality, UserType } from '../types/common';

/**
 * Contains utility functions used across the application.
 * These functions are designed to be reusable and help maintain clean and efficient code.
 */

type FieldKey = Exclude<keyof typeof Strings.common.fields, 'errors'>;

export const buildRequiredFieldError = (field: FieldKey) => {
  return (
    Strings.common.fields[field] + ' ' + Strings.common.fields.errors.required
  );
};

export const buildInvalidFieldError = (field: FieldKey) => {
  return (
    Strings.common.fields[field] + ' ' + Strings.common.fields.errors.invalid
  );
};

export const getModality = (modality: Modality | undefined): Modality[] => {
  if (!modality) return [];
  if (modality === Modality.ALL) {
    return [Modality.PERSONALLY, Modality.ONLINE];
  }
  return [modality];
};

export const buildRegisterPayload = (
  type: string,
  fields: any,
): UserRequest => {
  switch (type) {
    case UserType.PERSON:
      return {
        name: fields.name.value,
        picture: '',
        email: fields.email.value,
        password: fields.password.value,
        phone: fields.phone.value.replace(/\D/g, ''),
        gender: fields.gender.value,
        birthday: formatDateToISO(fields.birthday.value),
        cpf: fields.cpf.value.replace(/\D/g, ''),
      };
    case UserType.ENTERPRISE:
      return {
        corporate_reason: fields.reason.value,
        picture: '',
        cnpj: fields.cnpj.value.replace(/\D/g, ''),
        email: fields.email.value,
        password: fields.password.value,
        phone: fields.phone.value.replace(/\D/g, ''),
      };
    case UserType.INTERPRETER:
      return {
        name: fields.name.value,
        email: fields.email.value,
        password: fields.password.value,
        picture: '',
        phone: fields.phone.value.replace(/\D/g, ''),
        gender: fields.gender.value,
        birthday: formatDateToISO(fields.birthday.value),
        cpf: fields.cpf.value.replace(/\D/g, ''),
        professional_data: {
          cnpj: fields.cnpj.value ? fields.cnpj.value.replace(/\D/g, '') : null,
        },
      };
    default:
      throw new Error('Invalid profile type');
  }
};

export const buildEditPayload = (type: string, fields: any): UserRequest => {
  switch (type) {
    case UserType.PERSON:
      return {
        name: fields.name.value,
        email: fields.email.value,
        gender: fields.gender.value,
        birthday: formatDateToISO(fields.birthday.value),
        phone: fields.phone.value.replace(/\D/g, ''),
        picture: '',
      };
    case UserType.ENTERPRISE:
      return {
        corporate_reason: fields.reason.value,
        cnpj: fields.cnpj.value.replace(/\D/g, ''),
        email: fields.email.value,
        phone: fields.phone.value.replace(/\D/g, ''),
        picture: '',
      };
    case UserType.INTERPRETER:
      const neighborhoods = (fields.neighborhoods.value ?? []) as string[];
      const locations = neighborhoods.map((n) => ({
        uf: fields.state.value,
        city: fields.city.value,
        neighborhood: n,
      }));

      return {
        name: fields.name.value,
        email: fields.email.value,
        phone: fields.phone.value.replace(/\D/g, ''),
        gender: fields.gender.value,
        birthday: formatDateToISO(fields.birthday.value),
        picture: '',
        ...(locations.length > 0 ? { locations } : {}),
        professional_data: {
          ...(fields.cnpj.value
            ? { cnpj: fields.cnpj.value.replace(/\D/g, '') }
            : { cnpj: null }),
          modality: modalityToSend(fields.modality.value),
          description: fields.description.value,
          image_rights:
            fields.imageRight.value === Strings.common.options.authorize,
          max_value: Number(fields.maxPrice.value),
        },
      };
    default:
      throw new Error('Invalid profile type');
  }
};

const modalityToSend = (modality: Modality[]) => {
  // If both are checked, send 'ALL', else send the single value
  let modalityToSend: Modality;
  if (
    modality.includes(Modality.PERSONALLY) &&
    modality.includes(Modality.ONLINE)
  ) {
    modalityToSend = Modality.ALL;
  } else {
    modalityToSend = modality[0];
  }

  return modalityToSend;
};

export const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.warn('AsyncStorage cleared');
  } catch (e) {
    console.error('Failed to clear AsyncStorage', e);
  }
};

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0];
  }

  console.warn('User canceled image picker');
  return null;
};

export const pickFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ],
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (result.canceled) {
      console.warn('User canceled document picker');
      return null;
    }

    return result.assets[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const buildAppointmentPayload = (
  fields: any,
  interpreterId: string,
  userId: string,
) => {
  const isOnline = fields.modality.value.includes(Modality.ONLINE);

  // Calcular end_time (assumindo 1 hora de duração)
  const [hours, minutes] = fields.time.value.split(':');
  const startTime = `${fields.time.value}:00`; // Adicionar segundos
  const endHour = parseInt(hours) + 1;
  const endTime = `${String(endHour).padStart(2, '0')}:${minutes}:00`;

  return {
    modality: fields.modality.value[0], // Pegar a primeira modalidade selecionada
    UF: isOnline ? null : fields.state.value || null,
    city: isOnline ? null : fields.city.value || null,
    neighborhood: isOnline ? null : fields.neighborhood.value || null,
    street: isOnline ? null : fields.street.value || null,
    streetNumber: isOnline
      ? null
      : fields.number.value
      ? Number(fields.number.value)
      : null,
    addressDetails: isOnline ? null : fields.floor.value || null,
    date: formatDateToISO(fields.date.value),
    description: fields.description.value,
    interpreterId: interpreterId,
    userId: userId,
    startTime: startTime,
    endTime: endTime,
  };
};

// Função específica para o backend
export const buildBackendAppointmentPayload = (
  fields: any,
  interpreterId: string,
  userId: string,
) => {
  const isOnline = fields.modality.value.includes(Modality.ONLINE);

  // Calcular end_time (assumindo 1 hora de duração)
  const [hours, minutes] = fields.time.value.split(':');
  const startTime = `${fields.time.value}:00`; // Adicionar segundos
  const endHour = parseInt(hours) + 1;
  const endTime = `${String(endHour).padStart(2, '0')}:${minutes}:00`;

  return {
    uf: isOnline ? null : fields.state.value || null,
    city: isOnline ? null : fields.city.value || null,
    neighborhood: isOnline ? null : fields.neighborhood.value || null,
    street: isOnline ? null : fields.street.value || null,
    street_number: isOnline
      ? null
      : fields.number.value
      ? Number(fields.number.value)
      : null,
    address_details: isOnline ? null : fields.floor.value || null,
    modality: fields.modality.value[0], // Pegar a primeira modalidade selecionada
    date: formatDateToISO(fields.date.value),
    description: fields.description.value,
    interpreter_id: interpreterId,
    user_id: userId,
    start_time: startTime,
    end_time: endTime,
  };
};
