export interface Rating {
  id: string;
  stars: number;
  description: string;
  date: string;
  appointment: {
    id: string;
    modality: string;
    status: string;
    interpreter_id: string;
    user_id: string;
  };
}

export interface RatingRequest {
  stars: number;
  description?: string | null;
  appointmentId: string;
}

export interface RatingsResponse {
  success: boolean;
  message: string;
  data: Rating[];
}

export interface RatingResponse {
  success: boolean;
  message: string;
  data: Rating;
}
