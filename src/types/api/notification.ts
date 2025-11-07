export interface RegisterTokenPayload {
  token: string;
  platform: string;
  userId: string;
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

export enum NotificationStatus {
  GRANTED,
  DENIED,
  UNDETERMINED
}