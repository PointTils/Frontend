export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// User types
export enum UserType {
  PERSON = 'person',
  COMPANY = 'company',
  TIL = 'til',
}

export interface User {
  id: number;
  email: string;
  name: string;
  type: UserType;
  status: string;
}

// Auth types
export interface Tokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
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
