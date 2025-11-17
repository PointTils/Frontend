import { act, renderHook, waitFor } from '@testing-library/react-native';

import api from '@/src/api';
import {
  useApiDelete,
  useApiGet,
  useApiPatch,
  useApiPost,
} from '@/src/hooks/useApi';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';

jest.mock('@/src/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
}));

type MockResponse = { value: string };
type MockPayload = { input: string };

const mockedApi = api as jest.Mocked<typeof api>;

describe('hooks/useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resolves data for useApiGet', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { value: 'ok' } });

    const { result } = renderHook(() => useApiGet<MockResponse>('/endpoint'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedApi.get).toHaveBeenCalledWith('/endpoint', {
      params: undefined,
    });
    expect(result.current.data).toEqual({ value: 'ok' });
    expect(result.current.error).toBeNull();
  });

  it('propagates error for useApiGet', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('boom'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useApiGet<MockResponse>('/endpoint'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('boom');

    warnSpy.mockRestore();
  });

  it('posts data with useApiPost', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { value: 'saved' } });

    const { result } = renderHook(() =>
      useApiPost<MockResponse, MockPayload>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.post({ input: 'payload' });
      expect(res).toEqual({ value: 'saved' });
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/endpoint',
      { input: 'payload' },
      undefined,
    );
    expect(result.current.data).toEqual({ value: 'saved' });
    expect(result.current.error).toBeNull();
  });

  it('calls postAt with alternate endpoint', async () => {
    mockedApi.post.mockResolvedValueOnce({ data: { value: 'forwarded' } });

    const { result } = renderHook(() =>
      useApiPost<MockResponse, MockPayload>('/default'),
    );

    await act(async () => {
      const res = await result.current.postAt('/other', { input: 'payload' });
      expect(res).toEqual({ value: 'forwarded' });
    });

    expect(mockedApi.post).toHaveBeenCalledWith(
      '/other',
      { input: 'payload' },
      undefined,
    );
  });

  it('handles errors on useApiPost', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('fail'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useApiPost<MockResponse, MockPayload>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.post({ input: 'payload' });
      expect(res).toBeNull();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('fail');

    warnSpy.mockRestore();
  });

  it('patches data with useApiPatch', async () => {
    mockedApi.patch.mockResolvedValueOnce({ data: { value: 'updated' } });

    const { result } = renderHook(() =>
      useApiPatch<MockResponse, MockPayload>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.patch({ input: 'payload' });
      expect(res).toEqual({ value: 'updated' });
    });

    expect(mockedApi.patch).toHaveBeenCalledWith(
      '/endpoint',
      { input: 'payload' },
      undefined,
    );
    expect(result.current.data).toEqual({ value: 'updated' });
    expect(result.current.error).toBeNull();
  });

  it('patchAt sends request to custom endpoint', async () => {
    mockedApi.patch.mockResolvedValueOnce({ data: { value: 'patched' } });

    const { result } = renderHook(() =>
      useApiPatch<MockResponse, MockPayload>('/default'),
    );

    await act(async () => {
      const res = await result.current.patchAt('/other', { input: 'payload' });
      expect(res).toEqual({ value: 'patched' });
    });

    expect(mockedApi.patch).toHaveBeenCalledWith(
      '/other',
      { input: 'payload' },
      undefined,
    );
  });

  it('handles errors on useApiPatch', async () => {
    mockedApi.patch.mockRejectedValueOnce(new Error('patch-fail'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useApiPatch<MockResponse, MockPayload>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.patch({ input: 'payload' });
      expect(res).toBeNull();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('patch-fail');

    warnSpy.mockRestore();
  });

  it('deletes data with useApiDelete', async () => {
    mockedApi.delete.mockResolvedValueOnce({ data: undefined });

    const { result } = renderHook(() =>
      useApiDelete<void, MockPayload>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.del({ input: 'payload' });
      expect(res).toBeUndefined();
    });

    expect(mockedApi.delete).toHaveBeenCalledWith('/endpoint', {
      data: { input: 'payload' },
    });
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  it('deleteAt handles FormData payload', async () => {
    const formData = new FormData();
    formData.append('file', 'content');
    mockedApi.delete.mockResolvedValueOnce({ data: undefined });

    const { result } = renderHook(() =>
      useApiDelete<void, FormData>('/endpoint'),
    );

    await act(async () => {
      await result.current.deleteAt('/other', formData);
    });

    expect(mockedApi.delete).toHaveBeenCalledWith('/other', {
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });

  it('handles errors on useApiDelete', async () => {
    mockedApi.delete.mockRejectedValueOnce(new Error('delete-fail'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useApiDelete<void, MockPayload>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.del({ input: 'payload' });
      expect(res).toBeNull();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('delete-fail');

    warnSpy.mockRestore();
  });

  it('honors disabled option on useApiGet', async () => {
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useApiGet<MockResponse>('/endpoint', undefined, { enabled }),
      { initialProps: { enabled: false } },
    );

    expect(result.current.loading).toBe(false);
    expect(mockedApi.get).not.toHaveBeenCalled();

    mockedApi.get.mockResolvedValueOnce({ data: { value: 'late' } });
    rerender({ enabled: true });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedApi.get).toHaveBeenCalledWith('/endpoint', {
      params: undefined,
    });
    expect(result.current.data).toEqual({ value: 'late' });
  });

  it('posts FormData with multipart headers', async () => {
    const formData = new FormData();
    formData.append('file', 'content');

    mockedApi.post.mockResolvedValueOnce({ data: { value: 'uploaded' } });

    const { result } = renderHook(() =>
      useApiPost<MockResponse, FormData>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.post(formData);
      expect(res).toEqual({ value: 'uploaded' });
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/endpoint', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  });

  it('logs axios-shaped errors on deleteAt', async () => {
    const axiosErr = new AxiosError('delete-axios');
    axiosErr.config = {
      url: '/other',
      headers: {},
    } as InternalAxiosRequestConfig;
    axiosErr.isAxiosError = true;

    mockedApi.delete.mockRejectedValueOnce(axiosErr);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useApiDelete<void, MockPayload>('/endpoint'),
    );

    await act(async () => {
      const res = await result.current.deleteAt('/other', { input: 'payload' });
      expect(res).toBeNull();
    });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
