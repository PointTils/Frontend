import React from 'react';
import type { RenderOptions } from '@testing-library/react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { ThemeProvider } from '@/src/contexts/ThemeProvider';

type UI = Parameters<typeof render>[0];

// Custom render function for testing with ThemeProvider
export function renderWithProviders(ui: UI, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  });
}

// Helpers to access global mocks
export const getRouterMock = () => (globalThis as any).mockRouter;
export const getUseLocalSearchParamsMock = () =>
  (globalThis as any).mockUseLocalSearchParams as jest.Mock;

export const setLocalSearchParams = (params: Record<string, unknown>): void => {
  (globalThis as any).setLocalSearchParams(params);
};
export const getAuthStateMock = () => (globalThis as any).mockAuthState;

export const getHapticTab = () => (globalThis as any).mockImpactAsync;

// Mock form fields
export const fillForm = (
  utils: ReturnType<typeof import('@/tests/utils').renderWithProviders>,
  setValue: (field: string, value: string | undefined) => void,
  data: Record<string, string>,
) => {
  Object.entries(data).forEach(([field, value]) => {
    const input = utils.queryByTestId(`${field}-input`);
    if (input) {
      fireEvent.changeText(input, value);
    }
    setValue(field as any, value);
  });
};
export const createSetFieldValue = (
  formFields: Record<string, { value: string; error: string }>,
) =>
  jest.fn((key: keyof typeof formFields, value: string | undefined) => {
    formFields[key].value = value ?? '';
    formFields[key].error = '';
  });

export const createClearFieldErrors = (
  formFields: Record<string, { value: string; error: string }>,
) =>
  jest.fn(() => {
    (Object.keys(formFields) as (keyof typeof formFields)[]).forEach((key) => {
      formFields[key].value = '';
      formFields[key].error = '';
    });
  });
