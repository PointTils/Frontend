import type {
  Location,
  Specialty,
  InterpreterProfessionalInfo,
  UserType,
  Gender,
} from '../common';

// Models
export interface PersonRegisterData {
  id: string | null;
  type: UserType | null;
  status: string | null;
  name: string;
  email: string;
  password: string | null;
  phone: string;
  gender: Gender;
  birthday: string;
  cpf: string;
  picture: string | null;
}

export interface EnterpriseRegisterData {
  id: string | null;
  corporate_reason: string;
  type: UserType | null;
  status: string | null;
  cnpj: string;
  email: string;
  password: string | null;
  phone: string;
  picture: string | null;
}

export interface InterpreterRegisterData {
  id: string | null;
  name: string;
  email: string;
  type: UserType | null;
  status: string | null;
  phone: string;
  picture: string | null;
  gender: Gender;
  password: string | null;
  birthday: string;
  cpf: string;
  locations: Location[] | null;
  specialties: Specialty[] | null;
  professional_info: InterpreterProfessionalInfo | null;
}

// API types
export interface PersonRegisterResponse {
  success: boolean;
  message: string;
  data: PersonRegisterData;
}

export interface EnterpriseRegisterResponse {
  success: boolean;
  message: string;
  data: EnterpriseRegisterData;
}

export interface InterpreterRegisterResponse {
  success: boolean;
  message: string;
  data: InterpreterRegisterData;
}
