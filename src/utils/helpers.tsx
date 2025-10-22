import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import type { ImagePickerAsset } from 'expo-image-picker';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { View } from 'react-native';
import { Toast } from 'toastify-react-native';

import {
  formatAppointmentLocation,
  formatCpfOrCnpj,
  formatDate,
  formatDateToISO,
  formatTime,
} from './masks';
import { Card } from '../components/ui/card';
import { Strings } from '../constants/Strings';
import {
  type Appointment,
  type AppointmentRequest,
  type UserRequest,
  AppointmentStatus,
  Modality,
  UserType,
} from '../types/api';

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

export const toBoolean = (value?: string | null): boolean | undefined => {
  if (value == null) return undefined;
  const v = value.trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 'on', 'sim', 's'].includes(v)) return true;
  if (['false', '0', 'no', 'n', 'off', 'nao', 'não'].includes(v)) return false;
  return undefined;
};

export const toFloat = (
  value?: string | null,
  clamp?: { min?: number; max?: number },
): number | undefined => {
  if (value == null) return undefined;
  const n = Number.parseFloat(value.replace(',', '.').trim());
  if (!Number.isFinite(n)) return undefined;
  const min = clamp?.min ?? -Infinity;
  const max = clamp?.max ?? Infinity;
  return Math.max(min, Math.min(max, n));
};

// Payload builders
export const buildRegisterPayload = (
  type: string,
  fields: any,
): UserRequest => {
  switch (type) {
    case UserType.PERSON:
      return {
        name: fields.name.value,
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
      };
    case UserType.ENTERPRISE:
      return {
        corporate_reason: fields.reason.value,
        cnpj: fields.cnpj.value.replace(/\D/g, ''),
        email: fields.email.value,
        phone: fields.phone.value.replace(/\D/g, ''),
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
        ...(locations.length > 0 ? { locations } : {}),
        professional_data: {
          ...(fields.cnpj.value
            ? { cnpj: fields.cnpj.value.replace(/\D/g, '') }
            : { cnpj: null }),
          modality: modalityToSend(fields.modality.value),
          description: fields.description.value,
          image_rights:
            fields.imageRight.value === Strings.common.options.authorize,
        },
      };
    default:
      throw new Error('Invalid profile type');
  }
};

export const buildAppointmentPayload = (
  fields: any,
  interpreterId: string,
  userId: string,
): AppointmentRequest => {
  const isOnline = fields.modality.value.includes(Modality.ONLINE);

  // Calculate end time as one hour after start time
  const [hours, minutes] = fields.time.value.split(':');
  const startTime = `${fields.time.value}:00`;
  const endHour = parseInt(hours) + 1;
  const endTime = `${String(endHour).padStart(2, '0')}:${minutes}:00`;

  return {
    interpreter_id: interpreterId,
    user_id: userId,
    modality: modalityToSend(fields.modality.value),
    date: formatDateToISO(fields.date.value),
    description: fields.description.value,
    start_time: startTime,
    end_time: endTime,
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
  } as AppointmentRequest;
};

export const buildAvatarFormData = (image: ImagePickerAsset) => {
  const form = new FormData();
  const inferredExt = image.mimeType?.split('/')?.[1] || 'jpg';
  const name = image.fileName || `profile_${Date.now()}.${inferredExt}`;
  const type = `image/${inferredExt}`;

  form.append('file', {
    uri: image.uri,
    name,
    type,
  } as any);
  return form;
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

// Functions interacting with native APIs
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

// Rendering helpers
export const showGenericErrorToast = () => {
  return Toast.show({
    type: 'error',
    text1: Strings.common.toast.errorUnknownTitle,
    text2: Strings.common.toast.errorUnknownDescription,
    position: 'top',
    visibilityTime: 2000,
    autoHide: true,
    closeIconSize: 1,
  });
};

export const getSafeAvatarUri = ({
  selectedUri,
  remoteUrl,
  fallback = 'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
}: {
  selectedUri?: string | null;
  remoteUrl?: string | null;
  fallback?: string;
}): string => {
  if (selectedUri && selectedUri.trim()) return selectedUri;
  if (remoteUrl && remoteUrl.trim()) {
    try {
      return encodeURI(remoteUrl);
    } catch {
      return fallback;
    }
  }
  return fallback;
};

type RenderApptItemOptions = {
  userType?: UserType;
  returnTo?: string;
  onPress?: (appt: Appointment) => void;
  showRating?: boolean;
};

export const renderApptItem = (opts: RenderApptItemOptions = {}) => {
  function RenderApptItem({ item: appt }: { item: Appointment }) {
    const isInterpreter = opts.userType === UserType.INTERPRETER;

    const handlePress = () => {
      if (opts.onPress) {
        opts.onPress(appt);
        return;
      }

      const params: {
        id: string | number;
        userPhoto: string;
        userName: string;
        userDocument: string;
        rating?: string;
        isPending?: string;
        isActive?: string;
        returnTo?: string;
      } = {
        id: appt.id || '',
        userPhoto: appt.contact_data?.picture || '',
        userName: appt.contact_data?.name || '',
        userDocument: appt.contact_data
          ? formatCpfOrCnpj(appt.contact_data.document)
          : '',
        rating: appt.contact_data?.rating
          ? String(appt.contact_data.rating)
          : '',
        isPending: appt.status === AppointmentStatus.PENDING ? 'true' : 'false',
        isActive: appt.status === AppointmentStatus.ACCEPTED ? 'true' : 'false',
      };

      if (opts.returnTo) params.returnTo = opts.returnTo;

      router.push({ pathname: '/appointments/[id]', params });
    };

    return (
      <Fragment>
        <View className="w-full h-px bg-gray-200" />
        <Card
          photoUrl={appt.contact_data?.picture || ''}
          fullName={appt.contact_data?.name || ''}
          subtitle={
            !isInterpreter
              ? appt.contact_data?.specialties?.map((s) => s.name).join(', ')
              : formatCpfOrCnpj(appt.contact_data?.document)
          }
          showRating={opts.showRating ?? !isInterpreter}
          rating={!isInterpreter ? appt.contact_data?.rating || 0 : 0}
          date={`${formatDate(appt.date)}  ${formatTime(appt.start_time)} - ${formatTime(appt.end_time)}`}
          location={formatAppointmentLocation(appt)}
          pending={appt.status === AppointmentStatus.PENDING}
          onPress={handlePress}
        />
        <View className="w-full h-px bg-gray-200" />
      </Fragment>
    );
  }

  // For eslint react/display-name
  (RenderApptItem as unknown as { displayName?: string }).displayName =
    'RenderApptItem';
  return RenderApptItem;
};
