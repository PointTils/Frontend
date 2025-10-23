export interface Rating {
  id: string;
  stars: number;
  description: string;
  date: string;
  user: {
    id: string;
    name: string;
    picture: string;
  };
}

export interface RatingRequest {
  stars: number;
  description?: string | null;
  user_id: string;
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
