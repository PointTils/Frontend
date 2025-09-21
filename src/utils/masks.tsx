import { Strings } from '@/src/constants/Strings';
import { Gender } from '@/src/types/common';

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
  if (!date) return '';
  const dt = typeof date === 'string' ? new Date(date) : date;
  if (!(dt instanceof Date) || Number.isNaN(dt.getTime())) return '';
  const day = String(dt.getDate()).padStart(2, '0');
  const mon = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  return `${day}/${mon}/${year}`;
};

export const formatPhone = (phone?: string | null) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '').slice(0, 11);
  const formatted = cleaned
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  return formatted;
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
