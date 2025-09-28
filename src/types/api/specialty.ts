export interface UserSpecialty {
  id: string;
  userId: string;
  specialtyId: string;
  specialtyName: string;
}

export interface UserSpecialtyResponse {
  success: boolean;
  message: string;
  data: {
    userSpecialties: UserSpecialty[];
  };
}

export interface UserSpecialtyRequest {
  specialtyIds: string[];
  replaceExisting: boolean;
}
