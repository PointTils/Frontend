import type { UserType } from './common';

// Models
export interface User {
  id: string;
  email: string;
  type: UserType;
  status: string;
  name: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

// API types
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

export interface PasswordResetEmailResponse {
  success: boolean;
  message: string;
  data: {
    to: string;
    userName: string;
  };
}

export interface ValidateMailTokenResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface RecoverPasswordResponse {
  success: boolean;
  message: string;
  data: {
    resetToken: string;
  };
}

export interface RecoverPasswordRequest {
  reset_token: string;
  new_password: string;
}
