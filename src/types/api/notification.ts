export interface RegisterTokenPayload {
  token: string;
  platform: string;
  user_id: string;
  device_id: string;
}

export interface RegisterTokenResponse {
  id: string;
  token: string;
  platform: string;
  created_at: string;
  modified_at: string;
  device_id: string;
  user_id: string;
}
