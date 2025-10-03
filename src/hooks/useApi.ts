import api from '@/src/api';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Usage example:
 *
 *   const { data, loading, error } = useApiGet<UserResponse[]>('/users', { active: true });
 */
export const useApiGet = <T>(endpoint: string, params?: object) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const serializedParams = JSON.stringify(params ?? {});

  useEffect(() => {
    if (!endpoint) {
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
        if (isMounted)
          setState({ data: null, loading: false, error: err.message });
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, serializedParams]);

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
      const res: AxiosResponse<T> = await api.post<T>(
        endpoint,
        payload ?? body,
      );
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: any) {
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

  const patch = async (payload?: U, config?: AxiosRequestConfig) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const dataToSend = (payload ?? body) as unknown as U;
      const isFormData =
        typeof FormData !== 'undefined' && dataToSend instanceof FormData;

      // RN/Axios requires headers to be set this way for FormData
      const axiosConfig: AxiosRequestConfig | undefined = isFormData
        ? { ...(config ?? {}), headers: { ...(config?.headers ?? {}) } }
        : config;

      const res: AxiosResponse<T> = await api.patch<T>(
        endpoint,
        dataToSend,
        axiosConfig,
      );
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: any) {
      setState({ data: null, loading: false, error: err.message });
      return null;
    }
  };

  return { ...state, patch };
};
