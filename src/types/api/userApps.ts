export interface UserAppResponse {
  success: boolean;
  message: string;
  data: userAppsData[];
}

export interface UserAppPostRequest {
  token: string;
  platform: string;
  userId: string;
  device_id: string;
}

export interface UserAppsPatchRequest {
  token?: string;
  platform?: string;
  device_id?: string;
}

type userAppsData = {
  id: string;
  token: string;
  platform: 'android';
  device_id: string;
  user_id: string;
  created_at: string;
  modified_at: string;
};
