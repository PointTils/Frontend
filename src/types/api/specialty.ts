export interface UserSpecialty {
  id: string;
  userId: string;
  specialtyId: string;
  specialtyName: string;
}

export interface SpecialtyResponse {
  success: boolean;
  message: string;
  data: {
    userSpecialties: UserSpecialty[];
  };
}
