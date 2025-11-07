import * as Notifications from 'expo-notifications';
import { NotificationStatus } from '@/src/types/api/notification'
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setFcmPushToken(token),
    );

    const subscription =
      Notifications.addNotificationReceivedListener(setNotification);

    return () => {
      subscription.remove();
    };
  }, []);

  return { fcmPushToken: fcmPushToken, notification };
}

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== NotificationStatus.GRANTED) {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== NotificationStatus.GRANTED) {
    return null;
  }

  const token = (await Notifications.getDevicePushTokenAsync()).data;

  return token;
}
