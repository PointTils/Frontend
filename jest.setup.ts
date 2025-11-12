import type { ReactNode } from 'react';
import '@testing-library/jest-native/extend-expect';

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
