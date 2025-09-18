// Types
export type Profile = {
  name: string;
  corporate_reason: string;
  cpf: string | null;
  status: string;
  birthday: string | Date | null;
  type: string;
  picture: string | null;
  gender: Gender;
  cnpj: string | null;
  phone: string;
  email: string;
  specialties: string[] | null;
  preferences: string[] | null;
};

// API types
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

// Enums
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}
