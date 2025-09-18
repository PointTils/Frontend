import api from '@/src/api';
import type { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * Usage example:
 *
 *   const { data, loading, error } = useApiGet<User[]>('/users', { active: true });
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
 *   const { data, loading, error, post } = useApiPost<User, NewUser>('/users');
 *   await post({ name: 'John' });
 */
export const useApiPost = <T, U>(endpoint: string, body?: U) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  if (!endpoint) {
    setState({ data: null, loading: false, error: null });
    return;
  }

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
 *   const { data, loading, error, put } = useApiPut<User, UpdateUser>('/users/1');
 *   await put({ name: 'Jane' });
 */
export const useApiPut = <T, U>(endpoint: string, body?: U) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  if (!endpoint) {
    setState({ data: null, loading: false, error: null });
    return;
  }

  const put = async (payload?: U) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const res: AxiosResponse<T> = await api.put<T>(endpoint, payload ?? body);
      setState({ data: res.data, loading: false, error: null });
      return res.data;
    } catch (err: any) {
      setState({ data: null, loading: false, error: err.message });
      return null;
    }
  };

  return { ...state, put };
};
