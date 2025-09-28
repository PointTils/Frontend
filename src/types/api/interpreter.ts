export interface InterpreterLocation {
  id: string;
  uf: string;
  city: string;
  neighborhood: string;
}

export interface InterpreterSpecialty {
  id: string;
  name: string;
}

export interface InterpreterProfessionalData {
  cnpj: string | null;
  rating: number;
  modality: 'ONLINE' | 'PERSONALLY' | 'ALL';
  description: string;
  min_value: number;
  max_value: number;
  image_rights: boolean;
}

export interface Interpreter {
  id: string;
  email: string;
  type: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  phone: string;
  picture: string | null;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | string;
  birthday: string;
  cpf: string;
  locations: InterpreterLocation[];
  specialties: InterpreterSpecialty[];
  professional_data: InterpreterProfessionalData;
}

export interface InterpreterResponse {
  success: boolean;
  message: string;
  data: Interpreter[];
}
