export type InterpreterResponseDTO = {
  id: string;
  email: string;
  type: string;
  status: string;
  phone: string;
  picture: string;
  name: string;
  gender: "MALE" | "FEMALE" | "OTHERS";
  birthday: string;
  cpf: string;
  locations: LocationDTO[];
  specialties: SpecialtyResponseDTO[];
  professional_data: ProfessionalDataResponseDTO;
};

export type LocationDTO = {
  id: string;
  uf: string;
  city: string;
  neighborhood: string;
};

export type SpecialtyResponseDTO = {
  id: string;
  name: string;
};

export type ProfessionalDataResponseDTO = {
  cnpj: string | null;
  rating: number;
  modality: string;
  description: string;
  min_value: number;
  max_value: number;
  image_rights: boolean;
};
