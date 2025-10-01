import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import { formatDateToISO } from './masks';
import { Strings } from '../constants/Strings';
import { type UserRequest, type UserResponseData, Modality, UserType, type Appointment } from '../types/api';

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

export const getUserDisplayName = (userData: UserResponseData): string => {
  switch (userData.type) {
    case UserType.PERSON:
    case UserType.INTERPRETER:
      return (userData as any).name || '';
    case UserType.ENTERPRISE:
      return (userData as any).corporate_reason || '';
    default:
      return '';
  }
};

export const transformAppointmentToCard = (appointment: Appointment) => {
  const formatDateTime = (date: string, startTime: string, endTime: string) => {
    try {
      const [year, month, day] = date.split('-');
      const formattedDate = `${day}/${month}/${year}`;
      
      const formatTime = (time: string) => time.substring(0, 5);
      
      return `${formattedDate} ${formatTime(startTime)} - ${formatTime(endTime)}`;
    } catch {
      return `${date} ${startTime} - ${endTime}`;
    }
  };

  const formatLocation = (appointment: Appointment) => {
    if (appointment.modality === 'ONLINE') {
      return 'Online';
    }
    
    const addressParts = [
      appointment.street,
      appointment.street_number,
      appointment.neighborhood,
      appointment.city,
      appointment.uf,
    ].filter(Boolean);
    
    const address = addressParts.join(', ');
    return appointment.address_details 
      ? `${address} - ${appointment.address_details}`
      : address;
  };

  return {
    fullName: 'Carregando...',
    specialty: 'Intérprete de Libras',
    rating: 0,
    pending: appointment.status === 'PENDING',
    date: formatDateTime(appointment.date, appointment.start_time, appointment.end_time),
    location: formatLocation(appointment),
    photoUrl: 'https://img.freepik.com/free-photo/front-view-smiley-woman-with-earbuds_23-2148613052.jpg',
    appointmentId: appointment.id,
    interpreterId: appointment.interpreter_id,
    userId: appointment.user_id,
  };
};
