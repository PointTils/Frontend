export interface Review {
  id: number;
  stars: number;
  description: string;
  date: string;
  user: {
    id: string;
    name: string;
    picture: string;
  };
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data: Review[];
}
