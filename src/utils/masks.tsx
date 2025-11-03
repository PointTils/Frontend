import { Strings } from '@/src/constants/Strings';
import {
  type WeekSchedule,
  type TimeRange,
  Days,
  Gender,
  Modality,
} from '@/src/types/api';

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

export const emptyWeekSchedule = (): WeekSchedule => ({
  [Days.MON]: { id: '', from: '', to: '' },
  [Days.TUE]: { id: '', from: '', to: '' },
  [Days.WED]: { id: '', from: '', to: '' },
  [Days.THU]: { id: '', from: '', to: '' },
  [Days.FRI]: { id: '', from: '', to: '' },
  [Days.SAT]: { id: '', from: '', to: '' },
  [Days.SUN]: { id: '', from: '', to: '' },
});

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

export const formatDateToISO = (dateString: string | undefined): string => {
  // - "DD/MM/YYYY" -> returns "YYYY-MM-DD"
  // - "DD/MM/YYYY HH:mm[:ss]" -> returns full ISO datetime
  // - "YYYY-MM-DD" -> returns same
  // - "YYYY-MM-DD HH:mm[:ss]" or ISO -> returns full ISO datetime
  if (!dateString) return '';
  const s = dateString.trim();

  // Already ISO date-only
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // ISO-like with time or "YYYY-MM-DD HH:mm"
  if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?$/.test(s)) {
    const d = new Date(s.replace(' ', 'T'));
    return Number.isNaN(d.getTime()) ? '' : d.toISOString();
  }

  // "DD/MM/YYYY" with optional time
  const m = s.match(
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/,
  );
  if (!m) return '';
  const [, dd, mm, yyyy, hh, min, ss] = m;

  // With time -> full ISO
  if (hh && min) {
    const d = new Date(
      Number(yyyy),
      Number(mm) - 1,
      Number(dd),
      Number(hh),
      Number(min),
      ss ? Number(ss) : 0,
    );
    return Number.isNaN(d.getTime()) ? '' : d.toISOString();
  }

  // Date only -> YYYY-MM-DD
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
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

export const formatRangeDaySchedule = (range?: TimeRange): string => {
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

export const formatWeekSchedule = (
  items: {
    day: Days;
    id: string;
    start_time: string;
    end_time: string;
  }[],
): WeekSchedule => {
  // Converts array of schedule items to WeekSchedule object
  const base = emptyWeekSchedule();

  items.forEach(({ day, id, start_time, end_time }) => {
    if (day) {
      base[day] = {
        id: id,
        from: start_time.slice(0, 5),
        to: end_time.slice(0, 5),
      };
    }
  });

  return base;
};

// Validation
export const validatePhone = (phone: string) => {
  return phone.replace(/\D/g, '').length === 11;
};

export const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateUrl = (url: string) => {
  if (!url) return false;
  const value = url.trim();
  const regex = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
  return regex.test(value);
}

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

export const mapWeekDay = (day: Days): string => {
  switch (day) {
    case Days.MON:
      return Strings.days.monday;
    case Days.TUE:
      return Strings.days.tuesday;
    case Days.WED:
      return Strings.days.wednesday;
    case Days.THU:
      return Strings.days.thursday;
    case Days.FRI:
      return Strings.days.friday;
    case Days.SAT:
      return Strings.days.saturday;
    case Days.SUN:
      return Strings.days.sunday;
    default:
      return '';
  }
};
