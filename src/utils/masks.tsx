import { Strings } from '@/src/constants/Strings';
import { type TimeRange, Gender, Modality } from '@/src/types/api';

/**
 * Collection of utility functions for formatting, validating, and mapping data.
 * Includes input masks for Brazilian documents (CPF/CNPJ), phone numbers,
 * date formatting, validation functions, and gender mapping.
 *
 * @example
 * // Phone formatting
 * const formattedPhone = handlePhoneChange('11999887766');
 * // Result: '(11) 99988-7766'
 *
 * // Validation
 * const isValidEmail = validateEmail('user@example.com');
 * // Result: true
 *
 * // Gender mapping
 * const genderText = mapGender(GenderType.MALE);
 * // Result: 'Masculino'
 */

// Formatting
export const handlePhoneChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 11);

  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  return formatted;
};

export const handleCnpjChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 14);

  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  return formatted;
};

export const handleCpfChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 11);

  const formatted = cleaned
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');

  return formatted;
};

export const handleTimeChange = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 4);
  const formatted = cleaned.replace(/^(\d{2})(\d{0,2})$/, '$1:$2');
  return formatted;
};

export const formatDate = (date?: string | Date | null) => {
  // Returns "DD/MM/AAAA"
  if (!date) return '';
  if (typeof date === 'string') {
    // Handle "YYYY-MM-DD" or ISO "YYYY-MM-DDTHH:mm:ss..." without timezone shift
    const isoLike = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoLike) {
      const [, year, month, day] = isoLike;
      return `${day}/${month}/${year}`;
    }
    // Already "DD/MM/AAAA"
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;

    // Fallback: parse and use UTC getters to avoid off-by-one
    const dt = new Date(date);
    if (Number.isNaN(dt.getTime())) return '';
    const day = String(dt.getUTCDate()).padStart(2, '0');
    const mon = String(dt.getUTCMonth() + 1).padStart(2, '0');
    const year = dt.getUTCFullYear();
    return `${day}/${mon}/${year}`;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const mon = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${mon}/${year}`;
};

export const formatDateToISO = (dateString: string): string => {
  // Expects "DD/MM/AAAA" and returns "AAAA-MM-DD"
  const [day, month, year] = dateString.split('/');
  if (!day || !month || !year) return '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const formatPhone = (phone?: string | null) => {
  // Returns "(XX) XXXXX-XXXX"
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '').slice(0, 11);
  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  return formatted;
};

export const formatValueRange = (min?: number, max?: number) => {
  // Returns "R$ X - R$ Y"
  if (min === undefined && max === undefined) return '-';
  return `R$ ${min ?? 0} - R$ ${max ?? 0}`;
};

export const formatCnpj = (cnpj?: string | null) => {
  // Returns "XX.XXX.XXX/XXXX-XX"
  if (!cnpj) return '';
  const cleaned = cnpj.replace(/\D/g, '').slice(0, 14);

  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  return formatted;
};

export const formatCpf = (cpf?: string | null): string => {
  // Returns "XXX.XXX.XXX-XX"
  if (!cpf) return '';
  const cleaned = cpf.replace(/\D/g, '').slice(0, 11);

  const formatted = cleaned
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');

  return formatted;
};

export const formatDaySchedule = (range?: TimeRange): string => {
  // Returns "HH:MM - HH:MM" or "N/A"
  const from = range?.from?.trim();
  const to = range?.to?.trim();
  return from && to ? `${from} - ${to}` : Strings.common.options.notAvailable;
};

export const formatTime = (input: string | Date): string => {
  // Returns "HH:MM"
  if (input instanceof Date) {
    const hours = String(input.getHours()).padStart(2, '0');
    const minutes = String(input.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  const s = String(input).trim();
  if (/^\d{2}:\d{2}$/.test(s)) return s;
  if (/^\d{2}:\d{2}:\d{2}$/.test(s)) return s.slice(0, 5);
  return '';
};

export const formatDateTime = (date: Date) => {
  // Returns "DD/MM/AAAA HH:MM:SS"
  return `${String(date.getDate()).padStart(2, '0')}/${String(
    date.getMonth() + 1,
  ).padStart(
    2,
    '0',
  )}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

export const formatAppointmentLocation = (appt: any): string => {
  // Returns formatted location string, like "Street, 123, Neighborhood, City - State"
  if ((appt?.modality || '').toUpperCase() === Modality.ONLINE) {
    return Strings.common.options.online;
  }

  const cityUf = [appt?.city, appt?.uf].filter(Boolean).join(' - ');
  const streetNum = [appt?.street, appt?.street_number]
    .filter(Boolean)
    .join(', ');
  const parts = [streetNum, appt?.neighborhood, cityUf].filter(Boolean);
  return parts.length ? parts.join(', ') : Strings.common.options.inPerson;
};

export const formatCpfOrCnpj = (value: string | undefined): string => {
  // Returns formatted CPF or CNPJ based on length
  if (!value) return '';
  const digits = (value ?? '').replace(/\D/g, '');
  if (!digits) return '';
  return digits.length <= 11 ? formatCpf(digits) : formatCnpj(digits);
};

// Validation
export const validatePhone = (phone: string) => {
  return phone.replace(/\D/g, '').length === 11;
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateCnpj = (cnpj: string) => {
  return cnpj.replace(/\D/g, '').length === 14;
};

export const validateCpf = (cpf: string) => {
  return cpf.replace(/\D/g, '').length === 11;
};

export const validateBirthday = (birthday: string) => {
  const cleaned = birthday.replace(/\D/g, '');
  if (cleaned.length !== 8) return false;

  const day = parseInt(cleaned.substring(0, 2), 10);
  const month = parseInt(cleaned.substring(2, 4), 10);
  const year = parseInt(cleaned.substring(4, 8), 10);

  const dateObj = new Date(year, month - 1, day);

  return (
    dateObj.getFullYear() === year &&
    dateObj.getMonth() === month - 1 &&
    dateObj.getDate() === day
  );
};

export const validateTime = (time: string) => {
  const regex = /^$|^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(time);
};

// Mapping
export const mapGender = (gender: Gender | string | undefined): string => {
  if (!gender) return '-';
  switch (gender) {
    case Gender.MALE:
      return Strings.gender.male;
    case Gender.FEMALE:
      return Strings.gender.female;
    case Gender.OTHERS:
      return Strings.gender.others;
    default:
      return '-';
  }
};

export const mapImageRights = (value: boolean | undefined): string => {
  if (value === undefined) return '-';
  return value ? Strings.common.options.authorize : Strings.common.options.deny;
};

export const mapModality = (
  modality: Modality | string | undefined,
): string => {
  if (!modality) return '-';
  switch (modality) {
    case Modality.ONLINE:
      return Strings.common.options.online;
    case Modality.PERSONALLY:
      return Strings.common.options.inPerson;
    case Modality.ALL:
      return `${Strings.common.options.online} e ${Strings.common.options.inPerson}`;
    default:
      return '-';
  }
};
