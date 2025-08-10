import api from '@/api';
import { ApiState } from '@/types/api';
import type { AxiosError, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

export const useApiGet = <T>(endpoint: string, params?: object) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
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
  }, [endpoint, JSON.stringify(params)]);

  return state;
};

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

export const useApiPut = <T, U>(endpoint: string, body?: U) => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

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
