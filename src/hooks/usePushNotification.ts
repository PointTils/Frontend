import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { useApiPost, useApiPatch } from '@/src/hooks/useApi';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import type { RegisterTokenPayload } from '@/src/types/api/notification';
import { useAuth } from '../contexts/AuthProvider';
import api from '@/src/api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [fcmPushToken, setFcmPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);

  const { user } = useAuth();
  const { post, postAt } = useApiPost(ApiRoutes.userApps.base);
  const { patch, patchAt } = useApiPatch(ApiRoutes.userApps.base);

  useEffect(() => {
    if (!user) return;

    async function setup() {
      const token = await registerForPushNotificationsAsync();
      if (!token) return;

      setFcmPushToken(token);

      const deviceId = await DeviceInfo.getUniqueId();
      const userId = user!.id;

      try {
        const url = ApiRoutes.userApps.getByUserAndDevice(userId, deviceId);
        const response = await api.get(url);

        const existing = response.data;
        if (existing.data.length > 0) {
          await patchAt(ApiRoutes.userApps.update(existing.data[0].id), {
            token: token,
            platform: Platform.OS,
            device_id: deviceId,
          });
          console.log('Token atualizado com sucesso:', token);
        } else if (existing.data.length === 0) {
          const payload: RegisterTokenPayload = {
            userId,
            device_id: deviceId,
            token,
            platform: Platform.OS,
          };
          await postAt(ApiRoutes.userApps.base, payload);
          console.log('Token cadastrado com sucesso:', token);
        }
      } catch (error) {
        console.error('Erro ao registrar token do dispositivo:', error);
      }
    }

    setup();

    const subscription =
      Notifications.addNotificationReceivedListener(setNotification);
    return () => subscription.remove();
  }, [user]);

  return { fcmPushToken, notification };
}

/**
 * Asks for permission and returns device FCM token
 */
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== Notifications.PermissionStatus.GRANTED) {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== Notifications.PermissionStatus.GRANTED) {
    console.warn('Permissão de notificação negada');
    return null;
  }

  const token = (await Notifications.getDevicePushTokenAsync()).data;
  return token;
}
