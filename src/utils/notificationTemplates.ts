export interface NotificationTemplateData {
  [key: string]: any;
}

export interface NotificationTemplate {
  title: string;
  body: string;
}

export const notificationTemplates: Record<
  string,
  (data: NotificationTemplateData) => NotificationTemplate
> = {
  APPOINTMENT_ACCEPTED: () => ({
    title: 'Solicitação aceita!',
    body: 'Uma solicitação foi aceita.',
  }),

  APPOINTMENT_REQUESTED: () => ({
    title: 'Solicitação recebida!',
    body: 'Você recebeu uma nova solicitação.',
  }),

  APPOINTMENT_CANCELED: () => ({
    title: 'Solicitação encerrada!',
    body: 'Uma solicitação foi cancelada ou recusada.',
  }),

  APPOINTMENT_REMINDER: () => ({
    title: 'Lembrete de solicitação!',
    body: 'Você tem uma solicitação agendada em breve.',
  }),

  DEFAULT: () => ({
    title: 'Notificação',
    body: 'Você recebeu uma nova atualização.',
  }),
};
