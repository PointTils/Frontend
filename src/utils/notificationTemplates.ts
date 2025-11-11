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

  // Preciso ver o que fazer nesse cenário
  REQUEST_DECLINED: () => ({
    title: 'Solicitação recusada!',
    body: 'Uma solicitação foi recusada.',
  }),

  APPOINTMENT_REQUESTED: () => ({
    title: 'Solicitação recebida!',
    body: 'Você recebeu uma nova solicitação.',
  }),

  APPOINTMENT_CANCELED: () => ({
    title: 'Solicitação cancelada!',
    body: 'Uma solicitação foi cancelada.',
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
