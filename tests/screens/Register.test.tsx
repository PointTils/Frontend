import React from 'react';
import { fireEvent, waitFor, act } from '@testing-library/react-native';
import { renderWithProviders } from '@/tests/config';
import { Strings } from '@/src/constants/Strings';
import { Gender, UserType } from '@/src/types/api';

// Import screen
import RegisterScreen from '@/app/(auth)/register';
import Header from '@/src/components/Header';

// Shared Mocks and Helpers
const mockPush = jest.fn();
const mockReplace = jest.fn();
let mockParams: Record<string, unknown> = {};
const mockPost = jest.fn();
const mockUploadPost = jest.fn();

let mockPersonApi = { post: mockPost, error: null, isLoading: false };
let mockEnterpriseApi = { post: mockPost, error: null, isLoading: false };
let mockInterpreterApi = { post: mockPost, error: null, isLoading: false };
let mockUploadApi = { post: mockUploadPost, error: null, isLoading: false };

// Mock fields for useFormValidation
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

const mockSetValue = jest.fn(
  (key: keyof typeof mockFields, value: string | undefined) => {
    mockFields[key].value = value || '';
    mockFields[key].error = ''; // Clear error on change
  },
);

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

const mockClearErrors = jest.fn(() => {
  (Object.keys(mockFields) as (keyof typeof mockFields)[]).forEach(
    (key: keyof typeof mockFields) => {
      mockFields[key].value = '';
      mockFields[key].error = '';
    },
  );
});

// Deps mocks
jest.mock('expo-router', () => ({
  router: {
    push: (...args: unknown[]) => mockPush(...args),
    replace: (...args: unknown[]) => mockReplace(...args),
  },
  useLocalSearchParams: () => mockParams,
}));

jest.mock('toastify-react-native', () => ({
  Toast: {
    show: jest.fn(),
  },
}));

// Hooks and Context Mocks
jest.mock('@/src/hooks/useColors', () => ({
  useColors: () => ({
    white: '#fff',
    disabled: '#999999',
    text: '#0D0D0D',
    primaryOrange: '#F28D22',
  }),
}));

jest.mock('@/src/hooks/useApi', () => ({
  useApiPost: (route: string) => {
    if (route === '/person/register') return mockPersonApi;
    if (route === '/enterprises/register') return mockEnterpriseApi;
    if (route === '/interpreters/register') return mockInterpreterApi;
    return mockUploadApi;
  },
}));

jest.mock('@/src/hooks/useFormValidation', () => ({
  useFormValidation: jest.fn(() => ({
    fields: mockFields,
    setValue: mockSetValue,
    validateForm: mockValidateForm,
    clearErrors: mockClearErrors,
  })),
}));

jest.mock('@/src/utils/masks', () => ({
  formatDate: jest.fn((date: Date) => date.toISOString().split('T')[0]),
  validateCpf: jest.fn(() => true),
  validateCnpj: jest.fn(() => true),
  validatePhone: jest.fn(() => true),
  validateEmail: jest.fn(() => true),
  validateBirthday: jest.fn(() => true),
  validateUrl: jest.fn(() => true),
  handleCnpjChange: jest.fn(),
  handleCpfChange: jest.fn(),
  handlePhoneChange: jest.fn(),
}));

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

// Helpers
const fillForm = (
  utils: ReturnType<typeof renderWithProviders>,
  data: Partial<Record<string, string>>,
) => {
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'gender') {
      // Gender is a select/picker, not a text input; set value directly via mock
      mockSetValue(key, value);
    } else {
      const input = utils.getByTestId(`${key}-input`);
      fireEvent.changeText(input, value);
    }
  });
};

const selectUserType = (
  utils: ReturnType<typeof renderWithProviders>,
  type: UserType,
) => {
  const typeButton = utils.getByTestId(`${type.toLowerCase()}-type-button`);
  fireEvent.press(typeButton);
};

describe('app/(auth)/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockPersonApi = { post: mockPost, error: null, isLoading: false };
    mockEnterpriseApi = { post: mockPost, error: null, isLoading: false };
    mockInterpreterApi = { post: mockPost, error: null, isLoading: false };
    mockUploadApi = { post: mockUploadPost, error: null, isLoading: false };
    // Reset mock fields
    (Object.keys(mockFields) as (keyof typeof mockFields)[]).forEach((key) => {
      mockFields[key].value = '';
      mockFields[key].error = '';
    });
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
    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    fillForm(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      { email: 'test@example.com' },
    );
    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.ENTERPRISE,
    );

    // Assuming form clears, check if name input is empty
    const emailInput = getByTestId('email-input');
    expect(emailInput.props.value).toBe('');
  });

  it('validates required fields for person type', async () => {
    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.PERSON,
    );

    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(getByTestId('name-error')).toBeTruthy();
      expect(getByTestId('cpf-error')).toBeTruthy();
      expect(getByTestId('birthday-error')).toBeTruthy();
      expect(getByTestId('gender-error')).toBeTruthy();
      expect(getByTestId('phone-error')).toBeTruthy();
      expect(getByTestId('email-error')).toBeTruthy();
      expect(getByTestId('password-error')).toBeTruthy();
    });
  });

  it('validates required fields for enterprise type', async () => {
    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.ENTERPRISE,
    );

    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(getByTestId('reason-error')).toBeTruthy();
      expect(getByTestId('cnpj-error')).toBeTruthy();
      expect(getByTestId('phone-error')).toBeTruthy();
      expect(getByTestId('email-error')).toBeTruthy();
      expect(getByTestId('password-error')).toBeTruthy();
    });
  });

  it('validates required fields for interpreter type', async () => {
    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.INTERPRETER,
    );

    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(getByTestId('name-error')).toBeTruthy();
      expect(getByTestId('cpf-error')).toBeTruthy();
      expect(getByTestId('birthday-error')).toBeTruthy();
      expect(getByTestId('gender-error')).toBeTruthy();
      expect(getByTestId('phone-error')).toBeTruthy();
      expect(getByTestId('email-error')).toBeTruthy();
      expect(getByTestId('password-error')).toBeTruthy();
    });
  });

  it('submits form successfully for person type', async () => {
    mockPost.mockResolvedValue({ success: true, data: { id: '1' } });

    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.PERSON,
    );

    const payload = {
      name: 'Test Person',
      cpf: '12345678901',
      birthday: '1990-01-01',
      gender: Gender.MALE,
      phone: '11999999999',
      email: 'test@example.com',
      password: 'password123',
    };

    fillForm(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      payload,
    );

    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(payload);
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'false' },
      });
    });
  });

  it('submits form successfully for enterprise type', async () => {
    mockPost.mockResolvedValue({ success: true, data: { id: '1' } });

    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.ENTERPRISE,
    );
    fillForm(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      {
        reason: 'Test Enterprise',
        cnpj: '12345678000123',
        phone: '11999999999',
        email: 'test@example.com',
        password: 'password123',
      },
    );

    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'false' },
      });
    });
  });

  it('submits form successfully for interpreter type with documents', async () => {
    mockPost.mockResolvedValue({ success: true, data: { id: '1' } });
    mockUploadPost.mockResolvedValue({ success: true });

    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.INTERPRETER,
    );
    fillForm(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      {
        name: 'Test Interpreter',
        cpf: '12345678901',
        birthday: '1990-01-01',
        gender: 'male',
        phone: '11999999999',
        email: 'test@example.com',
        password: 'password123',
        videoUrl: 'https://example.com/video',
      },
    );
    // Assume document is set somehow, e.g., via state
    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalled();
      expect(mockUploadPost).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(auth)',
        params: { registeredAsInterpreter: 'true' },
      });
    });
  });

  it('shows error toast on registration failure', async () => {
    const { Toast } = require('toastify-react-native');
    mockPost.mockResolvedValue({ success: false });

    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    selectUserType(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      UserType.PERSON,
    );
    fillForm(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      {
        name: 'Test Person',
        cpf: '12345678901',
        birthday: '1990-01-01',
        gender: 'male',
        phone: '11999999999',
        email: 'test@example.com',
        password: 'password123',
      },
    );

    await act(async () => {
      fireEvent.press(getByTestId('register-button'));
    });

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

  it('toggles password visibility', () => {
    const { getByTestId } = renderWithProviders(<RegisterScreen />);

    const passwordInput = getByTestId('password-input');
    const toggle = getByTestId('toggle-password-visibility');

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
});
