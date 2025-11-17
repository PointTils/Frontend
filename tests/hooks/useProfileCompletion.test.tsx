import { act, renderHook, waitFor } from '@testing-library/react-native';

import { StorageKeys } from '@/src/constants/StorageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProfileCompletion } from '@/src/hooks/useProfileCompletion';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const mockUseFocusEffect = jest.fn();
let mockFocusEffectCallback: (() => void) | undefined;

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (...args: unknown[]) => mockUseFocusEffect(...args),
}));

const mockedGetItem = AsyncStorage.getItem as jest.MockedFunction<
  typeof AsyncStorage.getItem
>;
const mockedSetItem = AsyncStorage.setItem as jest.MockedFunction<
  typeof AsyncStorage.setItem
>;

describe('hooks/useProfileCompletion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetItem.mockReset();
    mockedSetItem.mockReset();
    mockFocusEffectCallback = undefined;
    mockUseFocusEffect.mockImplementation((callback: () => void) => {
      mockFocusEffectCallback = callback;
      callback();
    });
  });

  it('keeps banner hidden when userId is missing', () => {
    const { result } = renderHook(() => useProfileCompletion(undefined));

    expect(result.current.showBanner).toBe(false);
    expect(mockedGetItem).not.toHaveBeenCalled();
  });

  it('shows banner when profile is incomplete', async () => {
    mockedGetItem.mockResolvedValueOnce(null);

    const userId = '123';
    const { result } = renderHook(() => useProfileCompletion(userId));

    await waitFor(() =>
      expect(mockedGetItem).toHaveBeenCalledWith(
        StorageKeys.hasCompletedProfile(userId),
      ),
    );
    await waitFor(() => expect(result.current.showBanner).toBe(true));
  });

  it('hides banner when profile is already completed', async () => {
    mockedGetItem.mockResolvedValueOnce('true');

    const { result } = renderHook(() => useProfileCompletion('123'));

    await waitFor(() => expect(result.current.showBanner).toBe(false));
  });

  it('does not mark profile as completed without userId', async () => {
    const { result } = renderHook(() => useProfileCompletion(undefined));

    await act(async () => {
      await result.current.markProfileAsCompleted();
    });

    expect(mockedSetItem).not.toHaveBeenCalled();
    expect(result.current.showBanner).toBe(false);
  });

  it('re-evaluates banner visibility when screen refocuses', async () => {
    const userId = '123';
    mockedGetItem.mockResolvedValueOnce('true');

    const { result } = renderHook(() => useProfileCompletion(userId));

    await waitFor(() => expect(result.current.showBanner).toBe(false));

    mockedGetItem.mockResolvedValueOnce(null);

    await act(async () => {
      mockFocusEffectCallback?.();
    });

    await waitFor(() => expect(result.current.showBanner).toBe(true));
  });
});
