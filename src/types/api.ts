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
export type Gender =
  | 'Masculino'
  | 'Feminino'
  | 'Outro'
  | 'Prefiro não informar';

export enum UserType {
  PERSON = 'person',
  COMPANY = 'company',
  TIL = 'til',
}
