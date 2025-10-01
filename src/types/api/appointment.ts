export interface AppointmentBody {
  modality: string;
  UF: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  streetNumber: number | null;
  addressDetails: string | null;
  date: string;
  description: string;
  interpreterId: string;
  userId: string;
  startTime: string;
  endTime: string;
}

export interface AppointmentResponseBody {
  id: string;
  UF: string;
  city: string;
  neighborhood: string;
  street: string;
  streetNumber: number;
  addressDetails: string | null;
  modality: string;
  date: string;
  description: string;
  status: string;
  interpreterId: string;
  userId: string;
  startTime: string;
  endTime: string;
}

export type AppointmentResponseData = AppointmentResponseBody;

export type AppointmentRequest = AppointmentBody;

export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: AppointmentResponseData;
}