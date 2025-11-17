import { act, renderHook } from '@testing-library/react-native';

import { Colors } from '@/src/constants/Colors';

jest.mock('@/src/contexts/ThemeProvider', () => ({
  useTheme: jest.fn(),
}));

const { useColors: useColorsActual } = jest.requireActual<
  typeof import('@/src/hooks/useColors')
>('@/src/hooks/useColors');

const renderUseColors = () =>
  renderHook(() => useColorsActual(), { initialProps: undefined });

describe('hooks/useColors', () => {
  const { useTheme } = jest.requireMock('@/src/contexts/ThemeProvider') as {
    useTheme: jest.Mock;
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns dark palette when color scheme is dark', () => {
    useTheme.mockReturnValue({ colorScheme: 'dark' });

    const { result } = renderUseColors();

    expect(result.current).toBe(Colors.dark);
  });

  it('returns light palette when color scheme is light', () => {
    useTheme.mockReturnValue({ colorScheme: 'light' });

    const { result } = renderUseColors();

    expect(result.current).toBe(Colors.light);
  });

  it('falls back to light palette when color scheme is undefined', () => {
    useTheme.mockReturnValue({ colorScheme: undefined });

    const { result } = renderUseColors();

    expect(result.current).toBe(Colors.light);
  });

  it('updates palette when theme changes', () => {
    useTheme.mockReturnValue({ colorScheme: 'light' });

    const { result, rerender } = renderUseColors();

    expect(result.current).toBe(Colors.light);

    useTheme.mockReturnValue({ colorScheme: 'dark' });

    act(() => {
      rerender(undefined);
    });

    expect(result.current).toBe(Colors.dark);
  });

  it('calls useTheme once per render', () => {
    useTheme.mockReturnValue({ colorScheme: 'light' });

    const { rerender } = renderUseColors();

    expect(useTheme).toHaveBeenCalledTimes(1);

    act(() => {
      rerender(undefined);
    });

    expect(useTheme).toHaveBeenCalledTimes(2);
  });
});
