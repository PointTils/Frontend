import type { Gender, Location, Modality, Specialty, UserType } from './common';

// Models
export interface PersonBody {
  name: string;
  cpf?: string;
  gender: Gender;
  birthday: string;
  email: string;
  phone: string;
  picture?: string;
  password?: string;
}

export interface EnterpriseBody {
  corporate_reason: string;
  cnpj?: string;
  email: string;
  phone: string;
  picture?: string;
  password?: string;
}

export interface InterpreterBody {
  name: string;
  cpf?: string;
  email: string;
  phone: string;
  gender: Gender;
  birthday: string;
  picture?: string;
  password?: string;
  locations?: Location[];
  specialties?: Specialty[];
  professional_data?: {
    cnpj?: string | null;
    modality?: Modality;
    description?: string;
    min_value?: number;
    max_value?: number;
    image_rights?: boolean;
  };
}

export interface PersonResponseData {
  id: string;
  name?: string;
  cpf?: string;
  email: string;
  phone: string;
  picture: string;
  type: UserType.PERSON;
  status: string;
  gender?: Gender;
  birthday?: string;
  specialties?: Specialty[];
}

export interface EnterpriseResponseData {
  id: string;
  corporate_reason?: string;
  cnpj?: string;
  email: string;
  type: UserType.ENTERPRISE;
  status: string;
  phone: string;
  picture: string;
  specialties?: Specialty[];
}

export interface InterpreterResponseData {
  id: string;
  name?: string;
  cpf?: string;
  email: string;
  type?: UserType.INTERPRETER;
  status: string;
  phone: string;
  picture: string;
  gender?: Gender;
  birthday?: string;
  locations?: Location[];
  specialties: Specialty[];
  professional_data?: {
    cnpj: string | null;
    rating: number;
    modality: Modality;
    description: string;
    min_value: number;
    max_value: number;
    image_rights: boolean;
  };
}

// API types
export type UserRequest = PersonBody | EnterpriseBody | InterpreterBody;

export type UserResponseData =
  | PersonResponseData
  | EnterpriseResponseData
  | InterpreterResponseData;

export interface UserResponse {
  success: boolean;
  message: string;
  data: UserResponseData;
}

export interface InterpreterListResponse {
  success: boolean;
  message: string;
  data: InterpreterResponseData[];
}
