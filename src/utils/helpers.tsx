import AsyncStorage from '@react-native-async-storage/async-storage';

import { formatDateToISO } from './masks';
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
        gender: fields.gender.value,
        birthday: formatDateToISO(fields.birthday.value),
        email: fields.email.value,
        phone: fields.phone.value.replace(/\D/g, ''),
        picture: '',
      };
    case UserType.ENTERPRISE:
      return {
        cnpj: fields.cnpj.value,
        email: fields.email.value,
        phone: fields.phone.value.replace(/\D/g, ''),
        corporate_reason: fields.reason.value,
        picture: '',
      };
    case UserType.INTERPRETER:
      return {
        name: fields.name.value,
        email: fields.email.value,
        phone: fields.phone.value.replace(/\D/g, ''),
        gender: fields.gender.value,
        birthday: formatDateToISO(fields.birthday.value),
        picture: '',
        // locations: /* your logic */,
        // specialties: /* your logic */,
        professional_data: {
          cnpj: fields.cnpj.value.replace(/\D/g, ''),
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

export async function clearAsyncStorage() {
  try {
    await AsyncStorage.clear();
    console.warn('AsyncStorage cleared');
  } catch (e) {
    console.error('Failed to clear AsyncStorage', e);
  }
}
