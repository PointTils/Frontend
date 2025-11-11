import type { ReactNode } from 'react';
import '@testing-library/jest-native/extend-expect';

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
