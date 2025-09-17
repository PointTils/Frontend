import type { Strings } from '@/src/constants/Strings';

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

export type Gender =
  | typeof Strings.gender.male
  | typeof Strings.gender.female
  | typeof Strings.gender.others;

// API types
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}

// Enums
export enum GenderType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}
