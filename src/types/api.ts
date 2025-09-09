export type ApiState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export type Gender = 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar';

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
