import { ThemeProvider } from '@/src/contexts/ThemeProvider';
import type { RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import React from 'react';

type UI = Parameters<typeof render>[0];

// Custom render function for testing with ThemeProvider
export function renderWithProviders(ui: UI, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
    ...options,
  });
}
