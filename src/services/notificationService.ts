import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Strings } from '@/src/constants/Strings';

export async function registerForPushNotificationsAsync(): Promise<
  string | null
> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== Strings.system.permission.granted) {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== Strings.system.permission.granted) {
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  console.log('Project ID:', projectId);

  const token = (await Notifications.getDevicePushTokenAsync());
  const tokenData = token.data
  console.log('Token Expo Push:', tokenData);


  return tokenData;
}
