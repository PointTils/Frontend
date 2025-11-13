import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '@/tests/config';
import { Strings } from '@/src/constants/Strings';

// Import screen
import LoginScreen from '@/app/(auth)';

// Shared Mocks and Helpers
const mockPush = jest.fn();
let mockParams: Record<string, unknown> = {};
const mockLogin = jest.fn();
const mockSetLoginError = jest.fn();

let mockAuthState = {
  login: mockLogin,
  isLoggingIn: false,
  loginError: null as string | null,
  setLoginError: mockSetLoginError,
};

// Deps mocks
jest.mock('expo-router', () => ({
  router: { push: (...args: unknown[]) => mockPush(...args) },
  useLocalSearchParams: () => mockParams,
}));

jest.mock('toastify-react-native', () => ({
  Toast: {
    show: jest.fn(),
  },
}));

// Hooks and Context Mocks
jest.mock('@/src/contexts/AuthProvider', () => ({
  useAuth: () => mockAuthState,
}));

jest.mock('@/src/hooks/useColors', () => ({
  useColors: () => ({
    white: '#fff',
    disabled: '#999',
  }),
}));

jest.mock('@/src/assets/svgs/DarkBlueLogo', () => () => null);

// Helpers
const typeAndLogin = (
  utils: ReturnType<typeof renderWithProviders>,
  email: string,
  password: string,
) => {
  const emailInput = utils.getByTestId('email-input');
  const passwordInput = utils.getByTestId('password-input');
  const signInButton = utils.getByTestId('sign-in-button');

  fireEvent.changeText(emailInput, email);
  fireEvent.changeText(passwordInput, password);
  fireEvent.press(signInButton);
};

describe('app/(auth)/index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    mockAuthState = {
      login: mockLogin,
      isLoggingIn: false,
      loginError: null,
      setLoginError: mockSetLoginError,
    };
  });

  it('renders basic elements', () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <LoginScreen />,
    );

    expect(getByText(Strings.auth.slogan)).toBeTruthy();
    expect(getByPlaceholderText('email@example.com')).toBeTruthy();
    expect(getByPlaceholderText('********')).toBeTruthy();
    expect(getByText(Strings.auth.signIn)).toBeTruthy();
    expect(getByText(Strings.auth.signUpAction)).toBeTruthy();
    expect(getByText(Strings.auth.forgotPassword)).toBeTruthy();
  });

  it('does not call login with invalid data', () => {
    const { getByTestId } = renderWithProviders(<LoginScreen />);
    fireEvent.press(getByTestId('sign-in-button'));
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('calls login with valid credentials', () => {
    const { getByTestId } = renderWithProviders(<LoginScreen />);

    typeAndLogin(
      { getByTestId } as unknown as ReturnType<typeof renderWithProviders>,
      'user@example.com',
      '12345678',
    );

    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: '12345678',
    });
  });

  it('toggles password visibility', () => {
    const { getByTestId } = renderWithProviders(<LoginScreen />);

    const passwordInput = getByTestId('password-input');
    const toggle = getByTestId('toggle-password-visibility');

    expect(passwordInput.props.secureTextEntry).toBe(true);

    fireEvent.press(toggle);
    expect(passwordInput.props.secureTextEntry).toBe(false);

    fireEvent.press(toggle);
    expect(passwordInput.props.secureTextEntry).toBe(true);
  });

  it('shows modal when registeredAsInterpreter=true', () => {
    mockParams = { registeredAsInterpreter: 'true' };
    const { getByText } = renderWithProviders(<LoginScreen />);

    expect(getByText(Strings.auth.toast.interpreterRegisterTitle)).toBeTruthy();
    expect(
      getByText(Strings.auth.toast.interpreterRegisterDescription),
    ).toBeTruthy();
  });

  it('navigate to /register on sign-up link press', () => {
    const { getByTestId } = renderWithProviders(<LoginScreen />);
    fireEvent.press(getByTestId('sign-up-link'));
    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  it('shows error toast when loginError is set', async () => {
    const { Toast } = require('toastify-react-native');
    mockAuthState.loginError = 'any-error';

    renderWithProviders(<LoginScreen />);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledTimes(1);
    });

    const toastArgs = (Toast.show as jest.Mock).mock.calls[0][0];

    expect(toastArgs).toEqual(
      expect.objectContaining({
        type: 'error',
        text1: Strings.auth.toast.errorTitle,
        text2: Strings.auth.toast.errorDescription,
      }),
    );

    // Simulate auto hide to trigger setLoginError(null)
    toastArgs.onHide?.();

    expect(mockSetLoginError).toHaveBeenCalledWith(null);
  });
});
