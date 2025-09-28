// Models
export type Specialties = {
  id: string;
  name: string;
};

// API types
export interface SpecialtiesResponse {
  success: boolean;
  message: string;
  data: Specialties[];
}
