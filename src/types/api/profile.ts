import type { InterpreterProfessionalInfo, UserType, Gender } from '../common';

// Models
export type Profile = {
  id: string;
  name: string | null;
  corporate_reason: string | null;
  cpf: string | null;
  status: string;
  birthday: string | Date | null;
  type: UserType;
  picture: string | null;
  gender: Gender;
  cnpj: string | null;
  phone: string;
  email: string;
  specialties: string[] | null;
  locations: string[] | null;
  professional_info: InterpreterProfessionalInfo | null;
};

// API types
export interface ProfileResponse {
  success: boolean;
  message: string;
  data: Profile;
}
