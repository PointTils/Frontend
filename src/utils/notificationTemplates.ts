import { Strings } from '../constants/Strings';
import { NotificationType } from '../types/api/notification';

export interface NotificationTemplateData {
  [key: string]: any;
}

export interface NotificationTemplate {
  title: string;
  body: string;
}

export const notificationTemplates: Record<
  NotificationType,
  (data: NotificationTemplateData) => NotificationTemplate
> = {
  APPOINTMENT_ACCEPTED: () => ({
    title: 'Sua solicitação foi aceita!',
    body: 'Boas notícias! O intérprete aceitou sua solicitação.',
  }),

  APPOINTMENT_REQUESTED: () => ({
    title: 'Você recebeu uma nova solicitação!',
    body: 'Alguém acabou de pedir sua ajuda como intérprete 😊',
  }),

  APPOINTMENT_CANCELED: () => ({
    title: 'Status da solicitação atualizado',
    body: 'Uma solicitação foi cancelada ou recusada.',
  }),

  APPOINTMENT_REMINDER: () => ({
    title: 'Lembrete para você!',
    body: 'Seu agendamento está chegando. Não esqueça! 😉',
  }),

  DEFAULT: () => ({
    title: 'Nova notificação',
    body: 'Você recebeu uma atualização importante. Clique para mais detalhes.',
  }),
};
