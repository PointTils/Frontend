import type { Strings } from '@/src/constants/Strings';

export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// User types
export interface User {
  id: number;
  email: string;
  name: string;
  type: UserType;
  status: string;
}

export type ProfileModel = {
  name?: string;
  corporateName?: string;
  cpf?: string;
  birthDate?: string | Date | null;
  gender?: Gender;
  cnpj?: string;
  phone?: string;
  email?: string;
  specialties?: string[];
  preferences?: string[];
};

export type Gender =
  | typeof Strings.gender.male
  | typeof Strings.gender.female
  | typeof Strings.gender.others;

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

// Enums
export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export enum UserType {
  CLIENT = 'CLIENT',
  ENTERPRISE = 'ENTERPRISE',
  INTERPRETER = 'INTERPRETER',
}

// ===== Enterprise Registration =====
export interface EnterpriseRegisterPayload {
  corporate_reason: string; // Razão Social
  cnpj: string; // only numbers, backend will validate mask
  email: string;
  password: string;
  phone: string; // only numbers
  picture?: string | null; // base64 image (optional)
  status?: 'pending_verification' | 'active' | 'inactive';
  type: 'enterprise';
  location: {
    uf: string; // e.g., 'SP'
    city: string; // e.g., 'São Paulo'
  };
}

export interface ApiBaseResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export type EnterpriseRegisterResponse = ApiBaseResponse<
  { id: string | number } | undefined
>;
