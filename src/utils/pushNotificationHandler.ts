import { notificationTemplates } from '@/src/utils/notificationTemplates';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';

import type { NotificationType } from '../types/api/notification';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  const { type, ...data } = remoteMessage.data || {};
  const typeStr = String(type);
  if (typeStr in notificationTemplates) {
    const template = notificationTemplates[typeStr as NotificationType];
    const { title, body } = template(data);
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: data,
      },
      trigger: null,
    });
  }
});
