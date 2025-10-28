import api from '@/src/api';
import { isAxiosError, type AxiosError, type AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type GetOptions = {
  enabled?: boolean;
};

// Helper to detect FormData
const isFormData = (v: unknown): v is FormData =>
  typeof FormData !== 'undefined' && v instanceof FormData;

// Compact stringify to avoid huge logs/stack traces
const compact = (obj: unknown, max = 300) => {
  try {
    const s = typeof obj === 'string' ? obj : JSON.stringify(obj);
    return s.length > max ? `${s.slice(0, max)}…` : s;
  } catch {
    return '[unserializable]';
  }
};

// Centralized error logging
const logAxiosError = (
  verb: 'GET' | 'POST' | 'PATCH',
  endpoint: string,
  err: unknown,
) => {
  if (isAxiosError(err)) {
    const { response, code, message, config } = err;
    const url = config?.url || endpoint;
    console.warn(
      `[API] ${verb} ${url} failed: status=${response?.status ?? 'n/a'} code=${code ?? 'n/a'} msg=${message}`,
    );
  } else {
    console.warn(`[API] ${verb} ${endpoint} failed:`, compact(err));
  }
};

/**
 * Usage example:
 *
 *   const { data, loading, error } = useApiGet<UserResponse[]>('/users', { active: true });
 */
export const useApiGet = <T>(
  endpoint: string,
  params?: object,
  options?: GetOptions,
) => {
  const enabled = options?.enabled ?? true;

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: !!(enabled && endpoint),
    error: null,
  });

  const serializedParams = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!endpoint || !enabled) {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let isMounted = true;
    setState((prev) => ({ ...prev, loading: true }));

    api
      .get<T>(endpoint, { params })
      .then((res: AxiosResponse<T>) => {
        if (isMounted)
          setState({ data: res.data, loading: false, error: null });
      })
      .catch((err: AxiosError) => {
        logAxiosError('GET', endpoint, err);
        if (isMounted)
          setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, serializedParams, enabled]);

  return state;
};

/**
 * Usage example:
 *
 *   const { data, loading, error, post } = useApiPost<UserResponse, UserRequest>('/users');
 *   const result =await post({ name: 'John' });
 */
export const useApiPost = <T, U>(endpoint: string, body?: U) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const post = async (payload?: U) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const effectivePayload = (payload ?? body) as unknown;
      const config = isFormData(effectivePayload)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

      const res: AxiosResponse<T> = await api.post<T>(
        endpoint,
        effectivePayload as U,
        config,
      );
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: any) {
      logAxiosError('POST', endpoint, err);
      setState({ data: null, loading: false, error: err.message });
      return null;
    }
  };

  return { ...state, post };
};

/**
 * Usage example:
 *
 *   const { data, loading, error, patch } = useApiPatch<UserResponse, UserRequest>('/users/1');
 *   const result = await patch({ name: 'Jane' });
 */
export const useApiPatch = <T, U>(endpoint: string, body?: U) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const patch = async (payload?: U) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const effectivePayload = (payload ?? body) as unknown;
      const config = isFormData(effectivePayload)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

      const res: AxiosResponse<T> = await api.patch<T>(
        endpoint,
        effectivePayload as U,
        config,
      );
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: any) {
      logAxiosError('PATCH', endpoint, err);
      setState({ data: null, loading: false, error: err.message });
      return null;
    }
  };

  const patchAt = async (targetEndpoint: string, payload?: U) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const effectivePayload = (payload ?? body) as unknown;
      const config = isFormData(effectivePayload)
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

      const res: AxiosResponse<T> = await api.patch<T>(
        targetEndpoint,
        effectivePayload as U,
        config,
      );
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: any) {
      logAxiosError('PATCH', targetEndpoint, err);
      setState({ data: null, loading: false, error: err.message });
      return null;
    }
  };

  return { ...state, patch, patchAt };
};
