import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Development-only request/response logging to help validate API calls
const redactSensitive = (value: any): any => {
  const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'Authorization'];
  if (Array.isArray(value)) {
    return value.map((v) => redactSensitive(v));
  }
  if (value && typeof value === 'object') {
    const clone: Record<string, any> = {};
    Object.keys(value).forEach((k) => {
      if (SENSITIVE_KEYS.includes(k)) {
        clone[k] = '***';
      } else {
        clone[k] = redactSensitive((value as any)[k]);
      }
    });
    return clone;
  }
  return value;
};

api.interceptors.request.use((config) => {
  if (__DEV__) {
    try {
      // Avoid logging large binary payloads; sanitize common sensitive fields
      const safeData = redactSensitive(config.data);
      console.warn('[API Request]', {
        method: config.method,
        baseURL: config.baseURL,
        url: config.url,
        params: config.params,
        data: safeData,
      });
    } catch {
      // noop
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      try {
        console.warn('[API Response]', {
          status: response.status,
          method: response.config?.method,
          url: response.config?.url,
        });
      } catch {
        // noop
      }
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      try {
        console.error('[API Error]', {
          status: error?.response?.status,
          method: error?.config?.method,
          url: error?.config?.url,
          data: redactSensitive(error?.response?.data),
        });
      } catch {
        // noop
      }
    }
    return Promise.reject(error);
  },
);

export default api;
