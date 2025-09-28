export interface UserSpecialty {
  id: string;
  user_id: string;
  specialty_id: string;
  specialty_name: string;
}

export interface UserSpecialtyResponse {
  success: boolean;
  message: string;
  data: UserSpecialty[];
}

export interface UserSpecialtyRequest {
  specialty_ids: string[];
  replace_existing: boolean;
}
