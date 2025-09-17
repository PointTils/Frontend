export interface Location {
  id: string | null;
  uf: string;
  city: string;
}

export interface ClientRegisterData {
  id: string | null;
  type: string | null;
  status: string | null;
  name: string;
  email: string;
  password: string | null;
  phone: string;
  gender: string;
  birthday: string;
  cpf: string;
  picture: string | null;
  location: Location | null;
}

export interface ClientRegisterResponse {
  success: boolean;
  message: string;
  data: ClientRegisterData;
}

export interface EnterpriseRegisterData {
  id: string | null;
  type: string | null;
  status: string | null;
  cnpj: string;
  email: string;
  password: string | null;
  phone: string | null;
  picture: string;
  location: Location | null;
  corporate_reason: string;
}

export interface EnterpriseRegisterResponse {
  success: boolean;
  message: string;
  data: EnterpriseRegisterData;
}

export interface InterpreterSpecialty {
  id: string;
  name: string;
}

export interface InterpreterProfessionalInfo {
  cnpj: string;
  rating: number;
  modality: string;
  description: string;
  min_value: number;
  max_value: number;
  image_rights: boolean;
  specialties: InterpreterSpecialty[];
}

export interface InterpreterRegisterData {
  id: string;
  email: string;
  type: string | null;
  status: string | null;
  phone: string;
  picture: string | null;
  name: string;
  gender: string;
  password: string | null;
  birthday: string;
  cpf: string;
  location: Location | null;
  professional_info: InterpreterProfessionalInfo | null;
}

export interface InterpreterRegisterResponse {
  success: boolean;
  message: string;
  data: InterpreterRegisterData;
}
