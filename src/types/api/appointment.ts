import type { AppointmentStatus, Modality, Specialty } from './common';

export interface Appointment {
  id?: string;
  uf?: string;
  city?: string;
  neighborhood?: string;
  street?: string;
  street_number?: number | null;
  address_details?: string | null;
  modality: Modality;
  date: string;
  description: string | null;
  status: AppointmentStatus;
  interpreter_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  contact_data?: {
    id: string;
    name: string;
    picture: string | null;
    document?: string; // CPF or CNPJ
    rating?: number;
    specialties?: Specialty[];
  };
}

export type AppointmentRequest = Appointment;

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}

export interface AppointmentsResponse {
  success: boolean;
  message: string;
  data: Appointment[];
}
