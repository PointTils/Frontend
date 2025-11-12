import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import {
  getAuthStateMock,
  getRouterMock,
  getUseLocalSearchParamsMock,
  renderWithProviders,
  setLocalSearchParams,
} from '@/tests/utils';
import { Strings } from '@/src/constants/Strings';

// Import screen
import LoginScreen from '@/app/(auth)';

// Deps mocks
const routerMock = getRouterMock();
const { push: mockPush } = routerMock;
const authMock = getAuthStateMock();
const useLocalSearchParamsMock = getUseLocalSearchParamsMock();

// Shared Mocks and Helpers
const mockLogin = jest.fn();

jest.mock('@/src/assets/svgs/DarkBlueLogo', () => () => null);

jest.mock('@/src/hooks/useFormValidation', () => {
  return jest.requireActual('@/src/hooks/useFormValidation');
});

jest.mock('@/src/utils/helpers', () => {
  const actual = jest.requireActual('@/src/utils/helpers');
  return {
    ...actual,
    buildRequiredFieldError: jest.fn((field: string) => `${field} is required`),
    buildInvalidFieldError: jest.fn((field: string) => `${field} is invalid`),
  };
});

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
    authMock.login = mockLogin;
    authMock.loginError = null;
    authMock.isLoggingIn = false;
    authMock.setLoginError = jest.fn();
    authMock.user = null;
    authMock.isAuthenticated = false;
    setLocalSearchParams({});
    useLocalSearchParamsMock.mockClear();
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

  it('shows validation errors for invalid fields', async () => {
    const masks = require('@/src/utils/masks');
    const emailSpy = jest.spyOn(masks, 'validateEmail').mockReturnValue(false);

    const { getByTestId, getByText } = renderWithProviders(<LoginScreen />);

    fireEvent.changeText(getByTestId('email-input'), 'invalid-email');
    fireEvent.changeText(getByTestId('password-input'), ' ');

    act(() => {
      fireEvent.press(getByTestId('sign-in-button'));
    });

    await waitFor(() => {
      expect(getByText('email is invalid')).toBeTruthy();
      // expect(getByText('password is required')).toBeTruthy();
    });
    expect(mockLogin).not.toHaveBeenCalled();

    emailSpy.mockRestore();
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
    setLocalSearchParams({ registeredAsInterpreter: 'true' });

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
    authMock.loginError = 'Invalid credentials';

    renderWithProviders(<LoginScreen />);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          text1: Strings.auth.toast.errorTitle,
          text2: Strings.auth.toast.errorDescription,
        }),
      );
    });
  });

  it('clears login error when toast hides', async () => {
    const { Toast } = require('toastify-react-native');
    const setLoginErrorSpy = jest.fn();

    authMock.loginError = 'Invalid credentials';
    authMock.setLoginError = setLoginErrorSpy;

    renderWithProviders(<LoginScreen />);

    await waitFor(() => {
      expect(Toast.show).toHaveBeenCalled();
    });

    const toastArgs = (Toast.show as jest.Mock).mock.calls[0][0];
    toastArgs.onHide?.();

    expect(setLoginErrorSpy).toHaveBeenCalledWith(null);
  });
});
