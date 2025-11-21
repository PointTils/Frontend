import { act, renderHook, waitFor } from '@testing-library/react-native';

import { useCheckFeedback } from '@/src/hooks/useCheckFeedback';
import { Appointment, UserType } from '@/src/types/api';

jest.mock('@/src/hooks/useApi', () => ({
  useApiGet: jest.fn(),
}));

describe('hooks/useCheckFeedback', () => {
  const { useApiGet } = jest.requireMock('@/src/hooks/useApi') as {
    useApiGet: jest.Mock;
  };

  const user = { id: 'user-1', type: UserType.PERSON };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens feedback modal when completed appointment without rating exists', async () => {
    const appointment = {
      id: 'appt-1',
      contact_data: { name: 'Interpreter Doe' },
    } as unknown as Appointment;

    useApiGet.mockImplementation((route: string) =>
      route
        ? {
            data: { data: [appointment] } as unknown,
            loading: false,
            error: null,
          }
        : { data: undefined, loading: false, error: null },
    );

    const { result } = renderHook(() => useCheckFeedback(user));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.showFeedbackModal).toBe(true);
    });

    expect(result.current.appointmentForFeedback).toBe(appointment);
    expect(result.current.interpreterName).toBe('Interpreter Doe');
  });

  it('keeps feedback modal closed when API returns error', async () => {
    useApiGet.mockImplementation((route: string) =>
      route
        ? {
            data: undefined,
            loading: false,
            error: new Error('Request failed'),
          }
        : { data: undefined, loading: false, error: null },
    );

    const { result } = renderHook(() => useCheckFeedback(user));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.showFeedbackModal).toBe(false);
      expect(result.current.appointmentForFeedback).toBeNull();
    });
  });

  it('keeps feedback modal closed when appointments list is empty', async () => {
    useApiGet.mockImplementation((route: string) =>
      route
        ? {
            data: { data: [] },
            loading: false,
            error: null,
          }
        : { data: undefined, loading: false, error: null },
    );

    const { result } = renderHook(() => useCheckFeedback(user));

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(result.current.showFeedbackModal).toBe(false);
    });

    expect(result.current.appointmentForFeedback).toBeNull();
    expect(result.current.interpreterName).toBeNull();
  });

  it('does not request appointments when user id is missing', () => {
    renderHook(() =>
      useCheckFeedback({
        type: UserType.PERSON,
      }),
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(useApiGet).toHaveBeenCalled();
    expect(
      useApiGet.mock.calls.every(([route]: [string]) => route === ''),
    ).toBe(true);
  });
});
