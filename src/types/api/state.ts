
// Models
export type State = {
  name: string;
};

// API types
export interface StateResponse {
  success: boolean;
  message: string;
  data: State[];
}

export type City = {
  name: string;
};

// API types
export interface CityResponse {
  success: boolean;
  message: string;
  data: City[];
}
