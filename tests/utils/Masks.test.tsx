import { Strings } from '@/src/constants/Strings';
import { Modality, Days, Gender } from '@/src/types/api';
import {
  formatAppointmentLocation,
  formatCpf,
  formatDate,
  formatDateToISO,
  formatTime,
  handlePhoneChange,
  handleCpfChange,
  validateEmail,
  validateTime,
  mapModality,
  emptyWeekSchedule,
  formatRangeDaySchedule,
  formatWeekSchedule,
  handleCnpjChange,
  handleTimeChange,
  formatDateTime,
  formatPhone,
  formatCnpj,
  formatCpfOrCnpj,
  validatePhone,
  validateUrl,
  validateCnpj,
  validateCpf,
  validateBirthday,
  mapGender,
  mapImageRights,
  mapWeekDay,
} from '@/src/utils/masks';

// Override global setups
jest.mock('@/src/utils/masks', () => jest.requireActual('@/src/utils/masks'));

describe('utils/masks', () => {
  it('formats phone and CPF inputs', () => {
    expect(handlePhoneChange('11988776655')).toBe('(11) 98877-6655');
    expect(handleCpfChange('12345678909')).toBe('123.456.789-09');
    expect(formatCpf('12345678909')).toBe('123.456.789-09');
  });

  it('formats dates without timezone shifts', () => {
    expect(formatDate('2024-03-10')).toBe('10/03/2024');
    expect(formatDate(new Date('2024-03-10T12:00:00Z'))).toBe('10/03/2024');
    expect(formatDateToISO('10/03/2024')).toBe('2024-03-10');
    const isoWithTime = formatDateToISO('10/03/2024 09:30');
    expect(isoWithTime?.startsWith('2024-03-10')).toBe(true);
  });

  it('formats times and validates inputs', () => {
    expect(formatTime('09:45:31')).toBe('09:45');
    expect(formatTime(new Date('2024-03-10T09:45:00'))).toBe('09:45');
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('invalid@')).toBe(false);
    expect(validateTime('23:59')).toBe(true);
    expect(validateTime('99:99')).toBe(false);
  });

  it('describes appointment location and modality', () => {
    expect(formatAppointmentLocation({ modality: Modality.ONLINE })).toBe(
      Strings.common.options.online,
    );

    expect(
      formatAppointmentLocation({
        modality: Modality.PERSONALLY,
        street: 'Rua A',
        street_number: 45,
        neighborhood: 'Centro',
        city: 'São Paulo',
        uf: 'SP',
      }),
    ).toBe('Rua A, 45, Centro, São Paulo - SP');

    expect(mapModality(Modality.ALL)).toContain(Strings.common.options.online);
  });

  it('handles schedule helpers and formatters', () => {
    const blank = emptyWeekSchedule();
    expect(blank[Days.MON]).toEqual({ id: '', from: '', to: '' });

    const formatted = formatWeekSchedule([
      { day: Days.MON, id: '1', start_time: '08:00:00', end_time: '10:00:00' },
    ]);
    expect(formatted[Days.MON]).toEqual({
      id: '1',
      from: '08:00',
      to: '10:00',
    });

    expect(formatRangeDaySchedule()).toBe(Strings.common.options.notAvailable);
    expect(formatRangeDaySchedule({ from: '09:00', to: '10:00' })).toBe(
      '09:00 - 10:00',
    );

    expect(handleCnpjChange('11222333000144')).toBe('11.222.333/0001-44');
    expect(handleTimeChange('0930')).toBe('09:30');
    expect(formatDateTime(new Date(2024, 2, 10, 9, 45, 31))).toBe(
      '10/03/2024 09:45:31',
    );
    expect(formatPhone('11988776655')).toBe('(11) 98877-6655');
    expect(formatCnpj('11222333000144')).toBe('11.222.333/0001-44');
    expect(formatCpfOrCnpj('12345678909')).toBe('123.456.789-09');
    expect(formatCpfOrCnpj('11222333000144')).toBe('11.222.333/0001-44');
  });

  it('validates inputs and maps descriptive labels', () => {
    expect(validatePhone('11988776655')).toBe(true);
    expect(validateUrl('https://example.com/path')).toBe(true);
    expect(validateUrl('ftp://example.com')).toBe(false);
    expect(validateCnpj('11.222.333/0001-44')).toBe(true);
    expect(validateCpf('123.456.789-09')).toBe(true);
    expect(validateBirthday('29022020')).toBe(true);
    expect(validateBirthday('31022020')).toBe(false);
    expect(validateTime('21:45')).toBe(true);
    expect(mapGender(Gender.FEMALE)).toBe(Strings.gender.female);
    expect(mapGender('unknown')).toBe('-');
    expect(mapImageRights(true)).toBe(Strings.common.options.authorize);
    expect(mapImageRights(undefined)).toBe('-');
    expect(mapModality(Modality.ALL)).toContain(Strings.common.options.online);
    expect(mapWeekDay(Days.SUN)).toBe(Strings.days.sunday);
  });

  describe('handlePhoneChange', () => {
    it('limits input to 11 digits', () => {
      expect(handlePhoneChange('1198877665512345')).toBe('(11) 98877-6655');
    });

    it.each([
      ['119', '(11) 9'],
      ['11988', '(11) 988'],
    ])('handles partial input: %s -> %s', (input, output) => {
      expect(handlePhoneChange(input)).toBe(output);
    });
  });

  describe('handleCpfChange', () => {
    it('limits input to 11 digits', () => {
      expect(handleCpfChange('1234567890912345')).toBe('123.456.789-09');
    });

    it.each([
      ['123', '123'],
      ['123456', '123.456'],
      ['123456789', '123.456.789'],
    ])('handles partial input: %s -> %s', (input, output) => {
      expect(handleCpfChange(input)).toBe(output);
    });
  });

  describe('handleCnpjChange', () => {
    it('limits input to 14 digits', () => {
      expect(handleCnpjChange('1122233300014412345')).toBe(
        '11.222.333/0001-44',
      );
    });

    it.each([
      ['112', '11.2'],
      ['11222333', '11.222.333'],
      ['1122233300014', '11.222.333/0001-4'],
    ])('handles partial input: %s -> %s', (input, output) => {
      expect(handleCnpjChange(input)).toBe(output);
    });
  });

  describe('handleTimeChange', () => {
    it('limits input to 4 digits', () => {
      expect(handleTimeChange('093012345')).toBe('09:30');
    });

    it.each([
      ['0', '0'],
      ['09', '09:'],
      ['093', '09:3'],
    ])('handles partial input: %s -> %s', (input, output) => {
      expect(handleTimeChange(input)).toBe(output);
    });
  });

  describe('formatDate', () => {
    it('handles ISO string with time', () => {
      expect(formatDate('2024-03-10T15:30:00.000Z')).toBe('10/03/2024');
    });

    it('handles already formatted date', () => {
      expect(formatDate('10/03/2024')).toBe('10/03/2024');
    });

    it('returns empty string for invalid date', () => {
      expect(formatDate('invalid-date')).toBe('');
    });

    it('returns empty string for null', () => {
      expect(formatDate(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(formatDate(undefined)).toBe('');
    });

    it('handles Date object (local timezone)', () => {
      const date = new Date(2024, 2, 10, 0, 0, 0);
      expect(formatDate(date)).toBe('10/03/2024');
    });
  });

  describe('formatDateToISO', () => {
    it('handles already ISO date-only format', () => {
      expect(formatDateToISO('2024-03-10')).toBe('2024-03-10');
    });

    it.each([
      ['2024-03-10T09:30:00'],
      ['2024-03-10 09:30'],
      ['10/03/2024 09:30:45'],
    ])('handles datetime input: %s', (input) => {
      const result = formatDateToISO(input);
      expect(result).toContain('2024-03-10');
    });

    it('returns empty string for invalid format', () => {
      expect(formatDateToISO('invalid')).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(formatDateToISO(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(formatDateToISO('')).toBe('');
    });
  });

  describe('formatTime', () => {
    it('handles time string with seconds', () => {
      expect(formatTime('09:45:31')).toBe('09:45');
    });

    it('handles already formatted time', () => {
      expect(formatTime('09:45')).toBe('09:45');
    });

    it('handles Date object', () => {
      const date = new Date(2024, 2, 10, 9, 45, 31);
      expect(formatTime(date)).toBe('09:45');
    });

    it('returns empty string for invalid format', () => {
      expect(formatTime('invalid')).toBe('');
    });
  });

  describe('formatPhone', () => {
    it.each([[''], [null], [undefined] as any])('handles empty input', (v) => {
      expect(formatPhone(v)).toBe('');
    });

    it('handles partial phone number', () => {
      expect(formatPhone('11988')).toBe('(11) 988');
    });
  });

  describe('formatCnpj', () => {
    it.each([[''], [null], [undefined] as any])('handles empty input', (v) => {
      expect(formatCnpj(v)).toBe('');
    });

    it('handles partial CNPJ', () => {
      expect(formatCnpj('112223')).toBe('11.222.3');
    });
  });

  describe('formatCpf', () => {
    it.each([[''], [null], [undefined] as any])('handles empty input', (v) => {
      expect(formatCpf(v)).toBe('');
    });

    it('handles partial CPF', () => {
      expect(formatCpf('12345')).toBe('123.45');
    });
  });

  describe('formatCpfOrCnpj', () => {
    it.each([[undefined], ['']])('handles empty input', (v) => {
      expect(formatCpfOrCnpj(v as any)).toBe('');
    });

    it('formats as CPF for 11 digits or less', () => {
      expect(formatCpfOrCnpj('12345678909')).toBe('123.456.789-09');
    });

    it('formats as CNPJ for more than 11 digits', () => {
      expect(formatCpfOrCnpj('11222333000144')).toBe('11.222.333/0001-44');
    });
  });

  describe('formatRangeDaySchedule', () => {
    it('returns N/A for undefined', () => {
      expect(formatRangeDaySchedule(undefined)).toBe(
        Strings.common.options.notAvailable,
      );
    });

    it.each([[{ from: '', to: '' }], [{ from: '   ', to: '   ' }]])(
      'returns N/A for empty-like inputs',
      (range) => {
        expect(formatRangeDaySchedule(range as any)).toBe(
          Strings.common.options.notAvailable,
        );
      },
    );
  });

  describe('formatDateTime', () => {
    it('pads single-digit values', () => {
      const date = new Date(2024, 0, 5, 8, 5, 3);
      expect(formatDateTime(date)).toBe('05/01/2024 08:05:03');
    });
  });

  describe('formatAppointmentLocation', () => {
    it('handles undefined modality as in-person', () => {
      const appt = {
        street: 'Rua X',
        street_number: 10,
        neighborhood: 'Bairro',
        city: 'Cidade',
        uf: 'UF',
      };

      expect(formatAppointmentLocation(appt)).toBe(
        'Rua X, 10, Bairro, Cidade - UF',
      );
    });

    it('handles partial address', () => {
      const appt = { modality: Modality.PERSONALLY, city: 'Cidade', uf: 'UF' };
      expect(formatAppointmentLocation(appt)).toBe('Cidade - UF');
    });

    it('handles no address data', () => {
      expect(formatAppointmentLocation({})).toBe(
        Strings.common.options.inPerson,
      );
    });
  });

  describe('formatWeekSchedule', () => {
    it('handles multiple days', () => {
      const items = [
        {
          day: Days.MON,
          id: '1',
          start_time: '08:00:00',
          end_time: '10:00:00',
        },
        {
          day: Days.WED,
          id: '2',
          start_time: '14:00:00',
          end_time: '16:00:00',
        },
      ];
      const result = formatWeekSchedule(items);

      expect(result[Days.MON]).toEqual({ id: '1', from: '08:00', to: '10:00' });
      expect(result[Days.WED]).toEqual({ id: '2', from: '14:00', to: '16:00' });
      expect(result[Days.TUE]).toEqual({ id: '', from: '', to: '' });
    });

    it('handles empty array', () => {
      const result = formatWeekSchedule([]);
      expect(result[Days.MON]).toEqual({ id: '', from: '', to: '' });
    });
  });

  describe('validatePhone', () => {
    it('validates mobile phone', () => {
      expect(validatePhone('(11) 98877-6655')).toBe(true);
    });

    it('accepts ramal phone', () => {
      expect(validatePhone('(11) 9887-6655')).toBe(true);
    });

    it('rejects incomplete phone', () => {
      expect(validatePhone('(11) 9887-665')).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it.each(['test@example.com', 'user.name@domain.co'])(
      'accepts valid email: %s',
      (email) => {
        expect(validateEmail(email)).toBe(true);
      },
    );

    it.each(['notanemail', '@example.com', 'test@'])(
      'rejects invalid email: %s',
      (email) => {
        expect(validateEmail(email)).toBe(false);
      },
    );
  });

  describe('validateUrl', () => {
    it('handles empty string', () => {
      expect(validateUrl('')).toBe(false);
    });

    it.each([
      'https://example.com',
      'https://sub.domain.com/path?query=value',
      'http://example.com',
    ])('validates URL: %s', (url) => {
      expect(validateUrl(url)).toBe(true);
    });

    it.each(['ftp://example.com', 'example.com'])('rejects URL: %s', (url) => {
      expect(validateUrl(url)).toBe(false);
    });
  });

  describe('validateCnpj', () => {
    it('validates correct CNPJ', () => {
      expect(validateCnpj('11.222.333/0001-44')).toBe(true);
    });

    it('rejects incomplete CNPJ', () => {
      expect(validateCnpj('11.222.333/0001-4')).toBe(false);
    });
  });

  describe('validateCpf', () => {
    it('validates correct CPF', () => {
      expect(validateCpf('123.456.789-09')).toBe(true);
    });

    it('rejects incomplete CPF', () => {
      expect(validateCpf('123.456.789-0')).toBe(false);
    });
  });

  describe('validateBirthday', () => {
    it('validates leap year date', () => {
      expect(validateBirthday('29022020')).toBe(true);
    });

    it('rejects invalid leap year date', () => {
      expect(validateBirthday('29022019')).toBe(false);
    });

    it('rejects invalid day', () => {
      expect(validateBirthday('32012020')).toBe(false);
    });

    it('rejects invalid month', () => {
      expect(validateBirthday('01132020')).toBe(false);
    });

    it('rejects incomplete date', () => {
      expect(validateBirthday('0101202')).toBe(false);
    });
  });

  describe('validateTime', () => {
    it('accepts empty string', () => {
      expect(validateTime('')).toBe(true);
    });

    it('validates valid times', () => {
      expect(validateTime('00:00')).toBe(true);
      expect(validateTime('23:59')).toBe(true);
      expect(validateTime('12:30')).toBe(true);
    });

    it('rejects invalid hours', () => {
      expect(validateTime('24:00')).toBe(false);
      expect(validateTime('25:30')).toBe(false);
    });

    it('rejects invalid minutes', () => {
      expect(validateTime('12:60')).toBe(false);
      expect(validateTime('12:99')).toBe(false);
    });
  });

  describe('mapGender', () => {
    it('handles undefined', () => {
      expect(mapGender(undefined)).toBe('-');
    });

    it('maps all gender types', () => {
      expect(mapGender(Gender.MALE)).toBe(Strings.gender.male);
      expect(mapGender(Gender.FEMALE)).toBe(Strings.gender.female);
      expect(mapGender(Gender.OTHERS)).toBe(Strings.gender.others);
    });
  });

  describe('mapImageRights', () => {
    it('maps true to authorize', () => {
      expect(mapImageRights(true)).toBe(Strings.common.options.authorize);
    });

    it('maps false to deny', () => {
      expect(mapImageRights(false)).toBe(Strings.common.options.deny);
    });
  });

  describe('mapModality', () => {
    it('handles undefined', () => {
      expect(mapModality(undefined)).toBe('-');
    });

    it('maps all modality types', () => {
      expect(mapModality(Modality.ONLINE)).toBe(Strings.common.options.online);
      expect(mapModality(Modality.PERSONALLY)).toBe(
        Strings.common.options.inPerson,
      );
      expect(mapModality(Modality.ALL)).toContain(
        Strings.common.options.online,
      );
      expect(mapModality(Modality.ALL)).toContain(
        Strings.common.options.inPerson,
      );
    });

    it('handles empty string', () => {
      expect(mapModality('')).toBe('-');
    });
  });

  describe('mapWeekDay', () => {
    it.each([
      [Days.MON, Strings.days.monday],
      [Days.TUE, Strings.days.tuesday],
      [Days.WED, Strings.days.wednesday],
      [Days.THU, Strings.days.thursday],
      [Days.FRI, Strings.days.friday],
      [Days.SAT, Strings.days.saturday],
      [Days.SUN, Strings.days.sunday],
    ])('maps %s to label', (day, label) => {
      expect(mapWeekDay(day)).toBe(label);
    });

    it('handles invalid day', () => {
      expect(mapWeekDay('INVALID' as Days)).toBe('');
    });
  });

  describe('emptyWeekSchedule', () => {
    it('creates empty schedule for all days', () => {
      const schedule = emptyWeekSchedule();
      Object.values(Days).forEach((day) => {
        expect(schedule[day]).toEqual({ id: '', from: '', to: '' });
      });
    });
  });
});
