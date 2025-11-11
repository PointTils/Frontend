import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { notificationTemplates } from '@/src/utils/notificationTemplates';


messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const { type, ...data } = remoteMessage.data || {};
    console.log('Mensagem recebida em BACKGROUND:', remoteMessage);
    const typeStr = String(type);
    const template = notificationTemplates[typeStr];
    if (template) {
        const { title, body } = template(data);
        await Notifications.scheduleNotificationAsync({
            content: { title, body, priority: Notifications.AndroidNotificationPriority.MAX, data: data },
            trigger: null,
        });
    }
})