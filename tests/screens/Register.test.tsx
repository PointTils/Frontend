import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import {
  createClearFieldErrors,
  createSetFieldValue,
  fillForm,
  getRouterMock,
  renderWithProviders,
} from '@/tests/utils';
import { Strings } from '@/src/constants/Strings';
import { Gender, UserType } from '@/src/types/api';

// Import screen
import RegisterScreen from '@/app/(auth)/register';
import Header from '@/src/components/Header';

// Shared Mocks and Helpers
const routerMock = getRouterMock();
const { replace: mockReplace } = routerMock;

const mockPost = jest.fn();
const mockUploadPost = jest.fn();

let mockPersonApi = { post: mockPost, error: null, isLoading: false };
let mockEnterpriseApi = { post: mockPost, error: null, isLoading: false };
let mockInterpreterApi = { post: mockPost, error: null, isLoading: false };
let mockUploadApi = {
  post: mockUploadPost,
  postAt: mockUploadPost,
  error: null,
  isLoading: false,
};

jest.mock('@/src/hooks/useApi', () => ({
  useApiPost: (route: string) => {
    if (route === '/person/register') return mockPersonApi;
    if (route === '/enterprises/register') return mockEnterpriseApi;
    if (route === '/interpreters/register') return mockInterpreterApi;
    return mockUploadApi;
  },
}));

const mockFields = {
  name: { value: '', error: '' },
  reason: { value: '', error: '' },
  cpf: { value: '', error: '' },
  cnpj: { value: '', error: '' },
  birthday: { value: '', error: '' },
  gender: { value: '', error: '' },
  phone: { value: '', error: '' },
  email: { value: '', error: '' },
  password: { value: '', error: '' },
  videoUrl: { value: '', error: '' },
};

const mockValidateForm = jest.fn((context?: { type: string }) => {
  let isValid = true;
  // Simulate validation based on type
  const type = context?.type;

  if (
    type !== UserType.ENTERPRISE &&
    (mockFields.name.value || '').trim().length < 5
  ) {
    mockFields.name.error = 'name is required';
    isValid = false;
  }
  if (type === UserType.ENTERPRISE && !(mockFields.reason.value || '').trim()) {
    mockFields.reason.error = 'reason is required';
    isValid = false;
  }
  if (
    (type === UserType.PERSON || type === UserType.INTERPRETER) &&
    !(mockFields.cpf.value || '').trim()
  ) {
    mockFields.cpf.error = 'cpf is required';
    isValid = false;
  }
  if (
    (type === UserType.PERSON || type === UserType.INTERPRETER) &&
    !(mockFields.birthday.value || '').trim()
  ) {
    mockFields.birthday.error = 'birthday is required';
    isValid = false;
  }
  if (
    (type === UserType.PERSON || type === UserType.INTERPRETER) &&
    !(mockFields.gender.value || '').trim()
  ) {
    mockFields.gender.error = 'gender is required';
    isValid = false;
  }
  if (!(mockFields.phone.value || '').trim()) {
    mockFields.phone.error = 'phone is required';
    isValid = false;
  }
  if (!(mockFields.email.value || '').trim()) {
    mockFields.email.error = 'email is required';
    isValid = false;
  }
  if (!(mockFields.password.value || '').trim()) {
    mockFields.password.error = 'password is required';
    isValid = false;
  }
  if (type === UserType.ENTERPRISE && !(mockFields.cnpj.value || '').trim()) {
    mockFields.cnpj.error = 'cnpj is required';
    isValid = false;
  }
  return isValid;
});

let mockUseActualValidation = false;
const mockSetValue = createSetFieldValue(mockFields);
const mockClearErrors = createClearFieldErrors(mockFields);

jest.mock('@/src/hooks/useFormValidation', () => {
  const actualModule = jest.requireActual('@/src/hooks/useFormValidation');
  return {
    useFormValidation: (...args: any[]) =>
      mockUseActualValidation
        ? actualModule.useFormValidation(...args)
        : {
            fields: mockFields,
            setValue: mockSetValue,
            validateForm: mockValidateForm,
            clearErrors: mockClearErrors,
          },
  };
});

jest.mock('@/src/utils/helpers', () => ({
  buildRegisterPayload: jest.fn((type: UserType, fields: any) => {
    const { UserType } = require('@/src/types/api');

    // Dynamically build payload based on type and fields for testing
    const payload: any = {};
    if (type === UserType.PERSON || type === UserType.INTERPRETER) {
      payload.name = fields.name?.value || '';
      payload.cpf = fields.cpf?.value || '';
      payload.birthday = fields.birthday?.value || '';
      payload.gender = fields.gender?.value || '';
    }
    if (type === UserType.ENTERPRISE) {
      payload.reason = fields.reason?.value || '';
      payload.cnpj = fields.cnpj?.value || '';
    }
    if (type === UserType.INTERPRETER) {
      payload.videoUrl = fields.videoUrl?.value || '';
    }
    payload.phone = fields.phone?.value || '';
    payload.email = fields.email?.value || '';
    payload.password = fields.password?.value || '';
    return payload;
  }),
  buildDocumentFormData: jest.fn(() => new FormData()),
  buildRequiredFieldError: jest.fn((field: string) => `${field} is required`),
  buildInvalidFieldError: jest.fn((field: string) => `${field} is invalid`),
}));

jest.mock('@/src/components/ModalSingleSelection', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');
  return ({ selectedValue, onSelectionChange }: any) => (
    <Pressable
      testID="gender-selector"
      onPress={() => onSelectionChange('MALE')}
      accessibilityRole="button"
    >
      <Text>{selectedValue || 'Select gender'}</Text>
    </Pressable>
  );
});

const mockDateChangeHandler: {
  current?: (event: unknown, date?: Date) => void;
} = {};

jest.mock('@react-native-community/datetimepicker', () => {
  return ({
    onChange,
  }: {
    onChange: (event: unknown, date?: Date) => void;
  }) => {
    mockDateChangeHandler.current = onChange;
    return null;
  };
});

// Helper functions
const selectUserType = (
  utils: ReturnType<typeof renderWithProviders>,
  type: UserType,
) => {
  const typeButton = utils.getByTestId(`${type.toLowerCase()}-type-button`);
  fireEvent.press(typeButton);
};

// Tests
describe('app/(auth)/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseActualValidation = false;
    mockPersonApi = { post: mockPost, error: null, isLoading: false };
    mockEnterpriseApi = { post: mockPost, error: null, isLoading: false };
    mockInterpreterApi = { post: mockPost, error: null, isLoading: false };
    mockUploadApi = {
      post: mockUploadPost,
      postAt: mockUploadPost,
      error: null,
      isLoading: false,
    };
    mockSetValue.mockClear();
    mockClearErrors.mockClear();
    mockValidateForm.mockClear();
    // Reset mock fields
    (Object.keys(mockFields) as (keyof typeof mockFields)[]).forEach((key) => {
      mockFields[key].value = '';
      mockFields[key].error = '';
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    mockUseActualValidation = false;
  });

  it('renders basic elements', () => {
    const { getByText } = renderWithProviders(<RegisterScreen />);

    expect(getByText(Strings.register.title)).toBeTruthy();
    expect(getByText(Strings.register.subtitle)).toBeTruthy();
    expect(getByText(Strings.register.typeSelect)).toBeTruthy();
  });

  it('renders user type selection buttons', () => {
    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    expect(getByTestId('person-type-button')).toBeTruthy();
    expect(getByTestId('enterprise-type-button')).toBeTruthy();
    expect(getByTestId('interpreter-type-button')).toBeTruthy();
  });

  it('changes user type and clears form', () => {
    const screen = renderWithProviders(<RegisterScreen />);

    fillForm(screen, mockSetValue, { email: 'test@example.com' });
    selectUserType(screen, UserType.ENTERPRISE);

    const emailInput = screen.getByTestId('email-input');
    expect(emailInput.props.value).toBe('');
    expect(mockClearErrors).toHaveBeenCalledTimes(1);
  });

  it('toggles password visibility', () => {
    const screen = renderWithProviders(<RegisterScreen />);

    const passwordInput = screen.getByTestId('password-input');
    const toggle = screen.getByTestId('toggle-password-visibility');
    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggle);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggle);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('opens date picker', () => {
    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    const dateInput = getByTestId('birthday-input');
    fireEvent.press(dateInput);

    // Assuming date picker is shown, but since it's mocked, just check if pressed
    expect(dateInput).toBeTruthy();
  });

  it('updates birthday field when a date is selected', () => {
    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.PERSON);
    fireEvent.press(screen.getByTestId('birthday-input'));

    act(() => {
      mockDateChangeHandler.current?.({}, new Date('1995-05-20T00:00:00.000Z'));
    });

    expect(mockFields.birthday.value).toBe('1995-05-20');
  });

  it('navigates back on header back button', () => {
    const { getByTestId } = renderWithProviders(
      <Header
        title="Test"
        showBackButton={true}
        handleBack={() => mockReplace('/(tabs)')}
      />,
    );

    fireEvent.press(getByTestId('back-button'));

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });

  it('does not submit when payload builder returns null', async () => {
    const { Toast } = require('toastify-react-native');
    const helpers = require('@/src/utils/helpers');

    Toast.show.mockClear();
    helpers.buildRegisterPayload.mockReturnValueOnce(null);

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.PERSON);
    fillForm(screen, mockSetValue, {
      name: 'Test Person',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    expect(mockPost).not.toHaveBeenCalled();
    expect(Toast.show).not.toHaveBeenCalled();
  });

  it('prevents duplicate submissions while request is pending', async () => {
    const { Toast } = require('toastify-react-native');
    jest.useFakeTimers();

    mockPost.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, data: { id: '1' } }), 500),
        ),
    );

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.PERSON);
    fillForm(screen, mockSetValue, {
      name: 'Test Person',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    });

    act(() => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    fireEvent.press(screen.getByTestId('register-button'));

    expect(mockPost).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'false' },
      }),
    );

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: Strings.register.toast.successTitle,
          text2: Strings.register.toast.successDescription,
        }),
      ),
    );
  });

  it('runs real validation on empty person form', async () => {
    mockUseActualValidation = true;

    const screen = renderWithProviders(<RegisterScreen />);

    act(() => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('name is required')).toBeTruthy();
      expect(screen.getByText('cpf is required')).toBeTruthy();
      expect(screen.getByText('birthday is required')).toBeTruthy();
      expect(screen.getByText('gender is required')).toBeTruthy();
      expect(screen.getByText('phone is required')).toBeTruthy();
      expect(screen.getByText('email is required')).toBeTruthy();
      expect(screen.getByText('password is required')).toBeTruthy();
    });

    expect(mockPost).not.toHaveBeenCalled();
  });

  it('shows invalid format errors when validators fail', async () => {
    mockUseActualValidation = true;

    const masks = require('@/src/utils/masks');
    const cpfSpy = jest.spyOn(masks, 'validateCpf').mockReturnValue(false);
    const birthdaySpy = jest
      .spyOn(masks, 'validateBirthday')
      .mockReturnValue(false);
    const phoneSpy = jest.spyOn(masks, 'validatePhone').mockReturnValue(false);
    const emailSpy = jest.spyOn(masks, 'validateEmail').mockReturnValue(false);

    const screen = renderWithProviders(<RegisterScreen />);

    fireEvent.changeText(screen.getByTestId('name-input'), 'Valid Person');
    fireEvent.changeText(screen.getByTestId('cpf-input'), '12345678901');
    fireEvent.press(screen.getByTestId('birthday-input'));

    act(() => {
      mockDateChangeHandler.current?.({}, new Date('1990-01-01T00:00:00.000Z'));
    });

    fireEvent.press(screen.getByTestId('gender-selector'));
    fireEvent.changeText(screen.getByTestId('phone-input'), '11999999999');
    fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'short');

    act(() => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('cpf is invalid')).toBeTruthy();
      expect(screen.getByText('birthday is invalid')).toBeTruthy();
      expect(screen.getByText('phone is invalid')).toBeTruthy();
      expect(screen.getByText('email is invalid')).toBeTruthy();
      expect(
        screen.getByText(Strings.common.fields.errors.minPassword),
      ).toBeTruthy();
    });

    expect(mockPost).not.toHaveBeenCalled();

    cpfSpy.mockRestore();
    birthdaySpy.mockRestore();
    phoneSpy.mockRestore();
    emailSpy.mockRestore();
  });

  it('validates required fields for person type', async () => {
    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.PERSON);

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockFields.name.error).toBe('name is required');
      expect(mockFields.cpf.error).toBe('cpf is required');
      expect(mockFields.birthday.error).toBe('birthday is required');
      expect(mockFields.gender.error).toBe('gender is required');
      expect(mockFields.phone.error).toBe('phone is required');
      expect(mockFields.email.error).toBe('email is required');
      expect(mockFields.password.error).toBe('password is required');
    });
  });

  it('validates required fields for enterprise type', async () => {
    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.ENTERPRISE);

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockFields.reason.error).toBe('reason is required');
      expect(mockFields.cnpj.error).toBe('cnpj is required');
      expect(mockFields.phone.error).toBe('phone is required');
      expect(mockFields.email.error).toBe('email is required');
      expect(mockFields.password.error).toBe('password is required');
    });
  });

  it('validates required fields for interpreter type', async () => {
    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.INTERPRETER);

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockFields.name.error).toBe('name is required');
      expect(mockFields.cpf.error).toBe('cpf is required');
      expect(mockFields.birthday.error).toBe('birthday is required');
      expect(mockFields.gender.error).toBe('gender is required');
      expect(mockFields.phone.error).toBe('phone is required');
      expect(mockFields.email.error).toBe('email is required');
      expect(mockFields.password.error).toBe('password is required');
    });
  });

  it('validates interpreter optional fields with real validators', async () => {
    mockUseActualValidation = true;

    const masks = require('@/src/utils/masks');
    const cnpjSpy = jest.spyOn(masks, 'validateCnpj').mockReturnValue(false);
    const urlSpy = jest.spyOn(masks, 'validateUrl').mockReturnValue(false);

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.INTERPRETER);

    fireEvent.changeText(screen.getByTestId('name-input'), 'Valid Interpreter');
    fireEvent.changeText(screen.getByTestId('cpf-input'), '12345678901');
    fireEvent.press(screen.getByTestId('birthday-input'));

    act(() => {
      mockDateChangeHandler.current?.({}, new Date('1990-01-01T00:00:00.000Z'));
    });

    fireEvent.press(screen.getByTestId('gender-selector'));
    fireEvent.changeText(screen.getByTestId('phone-input'), '11999999999');
    fireEvent.changeText(screen.getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(screen.getByTestId('password-input'), 'password123');
    fireEvent.changeText(screen.getByTestId('cnpj-input'), '12345678000123');
    fireEvent.changeText(screen.getByTestId('videoUrl-input'), 'https://video');

    act(() => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('cnpj is invalid')).toBeTruthy();
      expect(screen.getByText('videoUrl is invalid')).toBeTruthy();
    });

    expect(mockPost).not.toHaveBeenCalled();

    cnpjSpy.mockRestore();
    urlSpy.mockRestore();
  });

  it('submits form successfully for person type', async () => {
    const { Toast } = require('toastify-react-native');
    mockPost.mockResolvedValue({ success: true, data: { id: '1' } });

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.PERSON);

    fillForm(screen, mockSetValue, {
      name: 'Test Person',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'false' },
      });
    });

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: Strings.register.toast.successTitle,
          text2: Strings.register.toast.successDescription,
        }),
      ),
    );
  });

  it('submits form successfully for enterprise type', async () => {
    const { Toast } = require('toastify-react-native');
    mockPost.mockResolvedValue({ success: true, data: { id: '1' } });

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.ENTERPRISE);
    fillForm(screen, mockSetValue, {
      reason: 'Test Enterprise',
      cnpj: '12345678000123',
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'false' },
      });
    });

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: Strings.register.toast.successTitle,
          text2: Strings.register.toast.successDescription,
        }),
      ),
    );
  });

  it('submits form successfully for interpreter type with documents', async () => {
    const { Toast } = require('toastify-react-native');
    mockPost.mockResolvedValue({ success: true, data: { id: '1' } });
    mockUploadPost.mockResolvedValue({ success: true });

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.INTERPRETER);
    fillForm(screen, mockSetValue, {
      name: 'Test Interpreter',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
      videoUrl: 'https://example.com/video',
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
      expect(mockUploadPost).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'true' },
      });
    });

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: Strings.register.toast.successTitle,
          text2: Strings.register.toast.successDescription,
        }),
      ),
    );
  });

  it('shows error toast on registration failure', async () => {
    const { Toast } = require('toastify-react-native');
    mockPost.mockResolvedValueOnce({ success: false });

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.PERSON);
    fillForm(screen, mockSetValue, {
      name: 'Test Person',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));
    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          text1: Strings.register.toast.errorTitle,
          text2: Strings.register.toast.errorDescription,
        }),
      );
    });
  });

  it('shows error toast when API call throws', async () => {
    const { Toast } = require('toastify-react-native');
    Toast.show.mockClear();

    mockPost.mockRejectedValueOnce(new Error('network'));

    const screen = renderWithProviders(<RegisterScreen />);

    fillForm(screen, mockSetValue, {
      name: 'Test Person',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          text1: Strings.register.toast.errorTitle,
          text2: Strings.register.toast.errorDescription,
        }),
      ),
    );
  });

  it('shows success toast even when document upload fails', async () => {
    const { Toast } = require('toastify-react-native');
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    mockPost.mockResolvedValue({ success: true, data: { id: '1' } });
    mockUploadPost.mockRejectedValueOnce(new Error('upload failed'));

    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.INTERPRETER);
    fillForm(screen, mockSetValue, {
      name: 'Test Interpreter',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
      videoUrl: 'https://example.com/video',
    });

    await act(async () => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'true' },
      });
    });

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: Strings.register.toast.successTitle,
          text2: Strings.register.toast.successDescription,
        }),
      ),
    );

    expect(mockUploadPost).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('does not submit when validation fails', () => {
    mockValidateForm.mockReturnValueOnce(false);
    const screen = renderWithProviders(<RegisterScreen />);

    fireEvent.press(screen.getByTestId('register-button'));

    expect(mockPost).not.toHaveBeenCalled();
  });

  it('passes the selected user type to validation', () => {
    const screen = renderWithProviders(<RegisterScreen />);

    selectUserType(screen, UserType.INTERPRETER);
    fireEvent.press(screen.getByTestId('register-button'));

    expect(mockValidateForm).toHaveBeenCalledWith({
      type: UserType.INTERPRETER,
    });
  });

  it('clears errors when cancel button is pressed', () => {
    const screen = renderWithProviders(<RegisterScreen />);

    fireEvent.press(screen.getByTestId('cancel-button'));

    expect(mockClearErrors).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator while submitting', async () => {
    const { Toast } = require('toastify-react-native');
    jest.useFakeTimers();
    mockPost.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true, data: { id: '1' } }), 100),
        ),
    );

    const screen = renderWithProviders(<RegisterScreen />);

    fillForm(screen, mockSetValue, {
      name: 'Test Person',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    });

    act(() => {
      fireEvent.press(screen.getByTestId('register-button'));
    });

    await waitFor(() =>
      expect(screen.getByTestId('register-loading-indicator')).toBeTruthy(),
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() =>
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'false' },
      }),
    );

    await waitFor(() =>
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
          text1: Strings.register.toast.successTitle,
          text2: Strings.register.toast.successDescription,
        }),
      ),
    );
  });
});
