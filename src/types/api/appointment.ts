export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED', 
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export enum AppointmentModality {
  ONLINE = 'ONLINE',
  PERSONALLY = 'PERSONALLY',
}

export interface AppointmentResponseDTO {
  id: string;
  uf: string;
  city: string;
  neighborhood: string;
  street: string;
  modality: AppointmentModality;
  date: string;
  description?: string;
  status: AppointmentStatus;
  street_number: number;
  address_details?: string;
  interpreter_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
}

export interface AppointmentFilterResponse {
  success: boolean;
  message: string;
  data: AppointmentResponseDTO[];
}

export interface AppointmentFilterParams {
  interpreterId?: string;
  userId?: string;
  status?: AppointmentStatus;
  modality?: AppointmentModality;
  fromDateTime?: string;
}