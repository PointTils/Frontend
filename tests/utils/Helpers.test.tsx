import { Strings } from '@/src/constants/Strings';
import type { InterpreterResponseData, Appointment } from '@/src/types/api';
import { Modality, UserType, AppointmentStatus } from '@/src/types/api';
import {
  buildAppointmentPayload,
  buildRegisterPayload,
  buildRequiredFieldError,
  buildInvalidFieldError,
  getModality,
  getSafeAvatarUri,
  toBoolean,
  toFloat,
  buildEditPayload,
  buildAvatarFormData,
  buildDocumentFormData,
  getYouTubeId,
  clearAsyncStorage,
  pickImage,
  pickFile,
  showGenericErrorToast,
  renderApptItem,
} from '@/src/utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Toast } from 'toastify-react-native';

const originalFormData = (global as any).FormData;

class TestFormData {
  fields: [string, any][];
  constructor() {
    this.fields = [];
  }
  append(name: string, value: any) {
    this.fields.push([name, value]);
  }
}

beforeAll(() => {
  (global as any).FormData = TestFormData;
});

afterAll(() => {
  (global as any).FormData = originalFormData;
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('utils/helpers', () => {
  describe('error builders', () => {
    it('builds required and invalid field errors', () => {
      expect(buildRequiredFieldError('name')).toBe(
        `${Strings.common.fields.name} ${Strings.common.fields.errors.required}`,
      );
      expect(buildInvalidFieldError('email')).toBe(
        `${Strings.common.fields.email} ${Strings.common.fields.errors.invalid}`,
      );
    });
  });

  describe('getModality', () => {
    it.each([
      [undefined, []],
      [Modality.ONLINE, [Modality.ONLINE]],
      [Modality.ALL, [Modality.PERSONALLY, Modality.ONLINE]],
    ])('normalizes %s -> %j', (input, output) => {
      expect(getModality(input as any)).toEqual(output);
    });
  });

  describe('toBoolean', () => {
    it.each(['TRUE', ' true ', ' yes ', '1', 'ON', 'Y', 'Sim', 's'])(
      'returns true for %s',
      (v) => {
        expect(toBoolean(v)).toBe(true);
      },
    );

    it.each(['FALSE', ' false ', 'no', '0', 'OFF', 'N', 'nao', 'não'])(
      'returns false for %s',
      (v) => {
        expect(toBoolean(v)).toBe(false);
      },
    );

    it('returns undefined for null', () => {
      expect(toBoolean(null)).toBeUndefined();
    });

    it('returns undefined for unknown strings', () => {
      expect(toBoolean('maybe')).toBeUndefined();
    });
  });

  describe('toFloat', () => {
    it('handles comma decimal separator', () => {
      expect(toFloat('10,5')).toBe(10.5);
    });

    it('clamps to maximum', () => {
      expect(toFloat('999', { max: 50 })).toBe(50);
    });

    it('clamps to minimum', () => {
      expect(toFloat('5', { min: 10 })).toBe(10);
    });

    it('no clamping when not set', () => {
      expect(toFloat('100')).toBe(100);
    });

    it('returns undefined for invalid or empty values', () => {
      expect(toFloat('abc')).toBeUndefined();
      expect(toFloat(null)).toBeUndefined();
      expect(toFloat('')).toBeUndefined();
    });
  });

  describe('buildRegisterPayload', () => {
    it('builds register payloads per user type', () => {
      const baseFields = {
        name: { value: 'Maria' },
        reason: { value: 'Maria LTDA' },
        email: { value: 'maria@example.com' },
        password: { value: 'Secr3t12' },
        phone: { value: '(11) 98877-6655' },
        gender: { value: 'FEMALE' },
        birthday: { value: '10/03/1990' },
        cpf: { value: '123.456.789-09' },
        cnpj: { value: '11.222.333/0001-44' },
        videoUrl: { value: 'https://youtu.be/abc123XYZ89' },
      };

      const person = buildRegisterPayload(UserType.PERSON, baseFields);
      expect(person).toMatchObject({
        name: 'Maria',
        email: 'maria@example.com',
        cpf: '12345678909',
        birthday: '1990-03-10',
      });

      const interpreter = buildRegisterPayload(
        UserType.INTERPRETER,
        baseFields,
      );
      expect(
        (interpreter as InterpreterResponseData).professional_data,
      ).toMatchObject({
        cnpj: '11222333000144',
        video_url: 'https://youtu.be/abc123XYZ89',
      });

      const enterprise = buildRegisterPayload(UserType.ENTERPRISE, baseFields);
      expect(enterprise).toMatchObject({
        corporate_reason: 'Maria LTDA',
        cnpj: '11222333000144',
      });
    });

    it('throws error for invalid profile type', () => {
      expect(() => {
        buildRegisterPayload('INVALID_TYPE' as any, {});
      }).toThrow('Invalid profile type');
    });

    it('handles empty CNPJ and videoUrl for interpreter', () => {
      const fields = {
        name: { value: 'Maria' },
        email: { value: 'maria@example.com' },
        password: { value: 'Secr3t12' },
        phone: { value: '(11) 98877-6655' },
        gender: { value: 'FEMALE' },
        birthday: { value: '10/03/1990' },
        cpf: { value: '123.456.789-09' },
        cnpj: { value: '' },
        videoUrl: { value: '' },
      };

      const interpreter = buildRegisterPayload(
        UserType.INTERPRETER,
        fields,
      ) as InterpreterResponseData;

      expect(interpreter.professional_data?.cnpj).toBeNull();
      expect(interpreter.professional_data?.video_url).toBeNull();
    });
  });

  describe('buildEditPayload', () => {
    it('builds edit payloads per user type', () => {
      const person = buildEditPayload(UserType.PERSON, {
        name: { value: 'Maria' },
        email: { value: 'maria@example.com' },
        gender: { value: 'FEMALE' },
        birthday: { value: '10/03/1990' },
        phone: { value: '(11) 98877-6655' },
      });
      expect(person).toMatchObject({
        phone: '11988776655',
        birthday: '1990-03-10',
      });

      const enterprise = buildEditPayload(UserType.ENTERPRISE, {
        reason: { value: 'Maria LTDA' },
        cnpj: { value: '11.222.333/0001-44' },
        email: { value: 'contato@maria.com' },
        phone: { value: '(11) 95555-4444' },
      });
      expect(enterprise).toMatchObject({
        corporate_reason: 'Maria LTDA',
        cnpj: '11222333000144',
        phone: '11955554444',
      });

      const interpreter = buildEditPayload(UserType.INTERPRETER, {
        name: { value: 'Ana' },
        email: { value: 'ana@example.com' },
        phone: { value: '(21) 98888-1111' },
        gender: { value: 'FEMALE' },
        birthday: { value: '01/07/1991' },
        neighborhoods: { value: ['Centro'] },
        state: { value: 'RJ' },
        city: { value: 'Rio de Janeiro' },
        modality: { value: [Modality.PERSONALLY, Modality.ONLINE] },
        description: { value: 'Experienced interpreter' },
        imageRight: { value: Strings.common.options.authorize },
        videoUrl: { value: ' https://youtu.be/abc123XYZ89 ' },
        cnpj: { value: '' },
      });
      expect(interpreter).toMatchObject({
        locations: [
          { uf: 'RJ', city: 'Rio de Janeiro', neighborhood: 'Centro' },
        ],
        professional_data: {
          cnpj: null,
          modality: Modality.ALL,
          description: 'Experienced interpreter',
          image_rights: true,
          video_url: 'https://youtu.be/abc123XYZ89',
        },
      });
    });

    it('throws error for invalid profile type', () => {
      expect(() => {
        buildEditPayload('INVALID_TYPE' as any, {});
      }).toThrow('Invalid profile type');
    });

    it('handles interpreter with no locations', () => {
      const interpreter = buildEditPayload(UserType.INTERPRETER, {
        name: { value: 'Ana' },
        email: { value: 'ana@example.com' },
        phone: { value: '(21) 98888-1111' },
        gender: { value: 'FEMALE' },
        birthday: { value: '01/07/1991' },
        neighborhoods: { value: [] },
        state: { value: 'RJ' },
        city: { value: 'Rio de Janeiro' },
        modality: { value: [Modality.ONLINE] },
        description: { value: 'Online only' },
        imageRight: { value: Strings.common.options.deny },
        videoUrl: { value: '' },
        cnpj: { value: '11.222.333/0001-44' },
      }) as InterpreterResponseData;

      expect(interpreter.locations).toBeUndefined();
      expect(interpreter.professional_data?.cnpj).toBe('11222333000144');
    });
  });

  describe('buildAppointmentPayload', () => {
    it('handles mixed modalities as ALL', () => {
      const fields = {
        modality: { value: [Modality.PERSONALLY, Modality.ONLINE] },
        date: { value: '05/09/2025' },
        description: { value: 'Meeting' },
        startTime: { value: '09:00' },
        endTime: { value: '10:30' },
        state: { value: 'RS' },
        city: { value: 'Porto Alegre' },
        neighborhood: { value: 'Centro' },
        street: { value: 'Rua Principal' },
        number: { value: '123' },
        floor: { value: 'Sala 5' },
      };

      const payload = buildAppointmentPayload(fields, 'int-1', 'user-2');
      expect(payload).toMatchObject({
        interpreter_id: 'int-1',
        modality: Modality.ALL,
        date: '2025-09-05',
        start_time: '09:00:00',
        end_time: '10:30:00',
        uf: null,
        city: null,
        street_number: null,
      });
    });

    it('handles online-only appointment', () => {
      const fields = {
        modality: { value: [Modality.ONLINE] },
        date: { value: '05/09/2025' },
        description: { value: 'Online meeting' },
        startTime: { value: '09:00' },
        endTime: { value: '10:30' },
        state: { value: 'RS' },
        city: { value: 'Porto Alegre' },
        neighborhood: { value: 'Centro' },
        street: { value: 'Rua Principal' },
        number: { value: '123' },
        floor: { value: 'Sala 5' },
      };

      const payload = buildAppointmentPayload(
        fields,
        'int-1',
        'user-2',
      ) as Appointment;

      expect(payload.modality).toBe(Modality.ONLINE);
      expect(payload.uf).toBeNull();
      expect(payload.city).toBeNull();
      expect(payload.neighborhood).toBeNull();
      expect(payload.street).toBeNull();
      expect(payload.street_number).toBeNull();
      expect(payload.address_details).toBeNull();
    });

    it('handles in-person appointment with all fields', () => {
      const fields = {
        modality: { value: [Modality.PERSONALLY] },
        date: { value: '05/09/2025' },
        description: { value: 'In-person meeting' },
        startTime: { value: '14:00' },
        endTime: { value: '15:30' },
        state: { value: 'SP' },
        city: { value: 'São Paulo' },
        neighborhood: { value: 'Centro' },
        street: { value: 'Av. Paulista' },
        number: { value: '1000' },
        floor: { value: '10º andar' },
      };

      const payload = buildAppointmentPayload(
        fields,
        'int-1',
        'user-2',
      ) as Appointment;

      expect(payload.modality).toBe(Modality.PERSONALLY);
      expect(payload.uf).toBe('SP');
      expect(payload.city).toBe('São Paulo');
      expect(payload.neighborhood).toBe('Centro');
      expect(payload.street).toBe('Av. Paulista');
      expect(payload.street_number).toBe(1000);
      expect(payload.address_details).toBe('10º andar');
    });
  });

  describe('getSafeAvatarUri', () => {
    it('returns safe avatar URIs', () => {
      expect(
        getSafeAvatarUri({ selectedUri: 'file:///local.png', remoteUrl: '' }),
      ).toBe('file:///local.png');

      expect(
        getSafeAvatarUri({
          selectedUri: '',
          remoteUrl: 'https://example.com/avatar.png',
        }),
      ).toBe('https://example.com/avatar.png');

      expect(getSafeAvatarUri({ selectedUri: '', remoteUrl: '' })).toBeTruthy();
    });

    it('handles invalid remote URL gracefully', () => {
      const result = getSafeAvatarUri({
        selectedUri: '',
        remoteUrl: 'not-a-valid-url-at-all',
      });
      expect(result).toBeTruthy();
    });

    it('uses custom fallback when provided', () => {
      const customFallback = 'https://custom.com/avatar.png';
      const result = getSafeAvatarUri({
        selectedUri: null,
        remoteUrl: null,
        fallback: customFallback,
      });
      expect(result).toBe(customFallback);
    });
  });

  describe('FormData builders', () => {
    it('creates FormData payloads for avatar and documents', () => {
      jest.spyOn(Date, 'now').mockReturnValue(123456);

      const avatarForm = buildAvatarFormData({
        uri: 'file:///avatar.png',
        mimeType: 'image/png',
      } as any);

      expect((avatarForm as any).fields[0][0]).toBe('file');
      expect((avatarForm as any).fields[0][1]).toMatchObject({
        uri: 'file:///avatar.png',
        name: 'profile_123456.png',
        type: 'image/png',
      });

      const documentsForm = buildDocumentFormData([
        { uri: 'file:///contract.pdf', fileName: 'contract.pdf' },
        { uri: 'file:///certificate.pdf' },
      ]);

      const formEntries = (documentsForm as any).fields;
      expect(formEntries).toHaveLength(2);
      expect(formEntries[0][1]).toMatchObject({
        name: 'contract.pdf',
        type: 'application/pdf',
      });
      expect(formEntries[1][1].name).toBe('document_1_123456.pdf');
    });

    describe('buildAvatarFormData variations', () => {
      it('handles image without fileName', () => {
        jest.spyOn(Date, 'now').mockReturnValue(999999);

        const avatarForm = buildAvatarFormData({
          uri: 'file:///avatar.jpg',
          mimeType: 'image/jpeg',
        } as any);

        expect((avatarForm as any).fields[0][1]).toMatchObject({
          uri: 'file:///avatar.jpg',
          name: 'profile_999999.jpeg',
          type: 'image/jpeg',
        });
      });

      it('handles image without mimeType', () => {
        const avatarForm = buildAvatarFormData({
          uri: 'file:///avatar.png',
          fileName: 'custom-name.png',
        } as any);

        expect((avatarForm as any).fields[0][1]).toMatchObject({
          uri: 'file:///avatar.png',
          name: 'custom-name.png',
          type: 'image/jpg',
        });
      });
    });
  });

  describe('clearAsyncStorage', () => {
    it('clears AsyncStorage successfully', async () => {
      const clearSpy = jest
        .spyOn(AsyncStorage, 'clear')
        .mockResolvedValue(undefined);
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      await clearAsyncStorage();

      expect(clearSpy).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalledWith('AsyncStorage cleared');

      clearSpy.mockRestore();
      warnSpy.mockRestore();
    });

    it('handles AsyncStorage clear errors', async () => {
      const error = new Error('Clear failed');
      const clearSpy = jest
        .spyOn(AsyncStorage, 'clear')
        .mockRejectedValue(error);
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      await clearAsyncStorage();

      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to clear AsyncStorage',
        error,
      );

      clearSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe('pickImage', () => {
    it('returns selected image when user picks one', async () => {
      const mockAsset = {
        uri: 'file:///image.jpg',
        width: 100,
        height: 100,
      };

      jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValue({
        canceled: false,
        assets: [mockAsset],
      } as any);

      const result = await pickImage();

      expect(result).toEqual(mockAsset);
    });

    it('returns null when user cancels', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      jest.spyOn(ImagePicker, 'launchImageLibraryAsync').mockResolvedValue({
        canceled: true,
        assets: [],
      } as any);

      const result = await pickImage();

      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith('User canceled image picker');

      warnSpy.mockRestore();
    });
  });

  describe('pickFile', () => {
    it('returns selected file when user picks one', async () => {
      const mockFile = {
        uri: 'file:///document.pdf',
        name: 'document.pdf',
      };

      jest.spyOn(DocumentPicker, 'getDocumentAsync').mockResolvedValue({
        canceled: false,
        assets: [mockFile],
      } as any);

      const result = await pickFile();

      expect(result).toEqual(mockFile);
    });

    it('returns null when user cancels', async () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      jest.spyOn(DocumentPicker, 'getDocumentAsync').mockResolvedValue({
        canceled: true,
        assets: [],
      } as any);

      const result = await pickFile();

      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalledWith('User canceled document picker');

      warnSpy.mockRestore();
    });

    it('handles errors when picking file', async () => {
      const error = new Error('Picker error');
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      jest.spyOn(DocumentPicker, 'getDocumentAsync').mockRejectedValue(error);

      const result = await pickFile();

      expect(result).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith(error);

      errorSpy.mockRestore();
    });
  });

  describe('showGenericErrorToast', () => {
    it('displays generic error toast', () => {
      const showSpy = jest.spyOn(Toast, 'show').mockReturnValue(undefined);

      showGenericErrorToast();

      expect(showSpy).toHaveBeenCalledWith({
        type: 'error',
        text1: Strings.common.toast.errorUnknownTitle,
        text2: Strings.common.toast.errorUnknownDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });

      showSpy.mockRestore();
    });
  });

  describe('renderApptItem', () => {
    const mockAppointment = {
      id: '1',
      date: '2025-09-05',
      start_time: '09:00:00',
      end_time: '10:30:00',
      status: AppointmentStatus.ACCEPTED,
      modality: Modality.ONLINE,
      description: 'Test appointment description',
      interpreter_id: 'int-1',
      user_id: 'user-1',
      contact_data: {
        name: 'João Silva',
        document: '12345678909',
        picture: 'https://example.com/photo.jpg',
        rating: 4.5,
        specialties: [{ id: '1', name: 'Libras' }],
      },
    } as Appointment;

    it('renders appointment for non-interpreter user', () => {
      const RenderComponent = renderApptItem({
        userType: UserType.PERSON,
        showRating: true,
      });

      const component = RenderComponent({ item: mockAppointment });

      expect(component).toBeTruthy();
    });

    it('renders appointment for interpreter user', () => {
      const RenderComponent = renderApptItem({
        userType: UserType.INTERPRETER,
      });

      const component = RenderComponent({ item: mockAppointment });

      expect(component).toBeTruthy();
    });

    it('handles custom onPress callback', () => {
      const mockOnPress = jest.fn();

      const RenderComponent = renderApptItem({
        onPress: mockOnPress,
      });

      const component = RenderComponent({ item: mockAppointment });

      expect(component).toBeTruthy();
    });

    it('navigates with returnTo parameter', () => {
      const pushSpy = jest.spyOn(router, 'push');

      const RenderComponent = renderApptItem({
        returnTo: '/home',
        userType: UserType.PERSON,
      });

      RenderComponent({ item: mockAppointment });

      pushSpy.mockRestore();
    });

    it('handles pending appointment', () => {
      const pendingAppt = {
        ...mockAppointment,
        status: AppointmentStatus.PENDING,
      };

      const RenderComponent = renderApptItem({
        userType: UserType.PERSON,
      });

      const component = RenderComponent({ item: pendingAppt });

      expect(component).toBeTruthy();
    });
  });

  describe('getYouTubeId', () => {
    it.each([
      ['abc123XYZ89', 'abc123XYZ89'],
      ['https://youtu.be/abc123XYZ89', 'abc123XYZ89'],
      ['https://www.youtube.com/watch?v=abc123XYZ89&t=42', 'abc123XYZ89'],
      ['https://youtube.com/embed/abc123XYZ89', 'abc123XYZ89'],
      ['https://youtube.com/shorts/abc123XYZ89', 'abc123XYZ89'],
      ['https://m.youtube.com/watch?v=abc123XYZ89', 'abc123XYZ89'],
      ['https://notyoutube.com/video', ''],
      ['notaurl', ''],
    ])('extracts ID from %s', (input, expected) => {
      expect(getYouTubeId(input)).toBe(expected);
    });

    it('returns null for empty input', () => {
      expect(getYouTubeId('')).toBeNull();
      expect(getYouTubeId(null)).toBeNull();
      expect(getYouTubeId(undefined)).toBeNull();
    });
  });
});
