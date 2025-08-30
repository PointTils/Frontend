export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Auth types
export interface User {
  id: number;
  email: string;
  name: string;
  type: string;
  status: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: Tokens;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    tokens: Tokens;
  };
}
