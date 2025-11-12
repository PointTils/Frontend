import type { ReactNode } from 'react';
import '@testing-library/jest-native/extend-expect';

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };
const localSearchParamsStore = { params: {} as Record<string, unknown> };
const mockUseLocalSearchParams = jest.fn(() => localSearchParamsStore.params);

const mockToast = { show: jest.fn() };

const mockAuthState = {
  login: jest.fn(),
  isLoggingIn: false,
  loginError: null as string | null,
  setLoginError: jest.fn(),
  user: null,
  isAuthenticated: false,
};

// Global assignments
Object.assign(globalThis, {
  mockRouter,
  mockUseLocalSearchParams,
  setLocalSearchParams: (params: Record<string, unknown>) => {
    localSearchParamsStore.params = params;
  },
  mockToast,
  mockAuthState,
});

// Suppress console.error during tests
let consoleErrorSpy: jest.SpyInstance;
beforeAll(() => {
  consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
});

// Deps mocks
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);

jest.mock('nativewind', () => {
  const actual = jest.requireActual('nativewind');
  return { ...actual, setColorScheme: () => {} };
});

jest.mock('@/src/components/ui/gluestack-ui-provider', () => ({
  GluestackUIProvider: ({ children }: { children: ReactNode }) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-router', () => ({
  router: mockRouter,
  useLocalSearchParams: mockUseLocalSearchParams,
}));

jest.mock('toastify-react-native', () => ({
  Toast: mockToast,
}));

jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
  PermissionStatus: { GRANTED: 'granted' },
}));

jest.mock('toastify-react-native', () => ({
  Toast: { show: jest.fn() },
}));

// Global mocks
jest.mock('@/src/contexts/AuthProvider', () => ({
  useAuth: () => mockAuthState,
}));

jest.mock('@/src/hooks/useColors', () => ({
  useColors: () => ({
    white: '#fff',
    disabled: '#999999',
    text: '#0d0d0d',
    primaryOrange: '#f28d22',
    primaryBlue: '#007bff',
    detailsGray: '#6c757d',
    fieldGray: '#e9ecef',
    onPressBlue: '#5CB3E8',
    onPressOrange: '#FF9F3A',
  }),
}));

jest.mock('@/src/utils/masks', () => ({
  formatDate: jest.fn((date: Date) => date.toISOString().split('T')[0]),
  validateCpf: jest.fn(() => true),
  validateCnpj: jest.fn(() => true),
  validatePhone: jest.fn(() => true),
  validateEmail: jest.fn(() => true),
  validateBirthday: jest.fn(() => true),
  validateUrl: jest.fn(() => true),
  handleCnpjChange: jest.fn((value: string) => value),
  handleCpfChange: jest.fn((value: string) => value),
  handlePhoneChange: jest.fn((value: string) => value),
}));

jest.mock('@/src/components/UploadInput', () => {
  const React = require('react');
  const { useEffect } = React;
  const mockDocuments = [
    {
      uri: 'file:///mock-document.pdf',
      name: 'mock-document.pdf',
      type: 'application/pdf',
    },
  ];
  const UploadInputMock = ({
    onChange,
  }: {
    onChange?: (files: any[]) => void;
  }) => {
    useEffect(() => {
      if (onChange) {
        onChange(mockDocuments);
      }
    }, [onChange]);
    return null;
  };
  return UploadInputMock;
});
