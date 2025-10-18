export interface AppointmentResponseData {
  id: string | string;
  uf: string | null;
  city: string | null;
  neighborhood: string | null;
  street: string | null;
  streetNumber: number | null;
  addressDetails: string | null;
  modality: 'ONLINE' | 'PERSONALLY';
  date: string; // Formato: "YYYY-MM-DD"
  description: string;
  status: 'PENDING' | 'ACCEPTED' | 'CANCELED' | 'COMPLETED';
  interpreterId: string | string;
  userId: string | string;
  startTime: string; // Formato: "HH:mm:ss"
  endTime: string; // Formato: "HH:mm:ss"
}

export interface AppointmentResponse {
  success: boolean;
  data: AppointmentResponseData;
}
