/**
 * UI text constants for the Point Tils app
 * Organized by feature for easier maintenance
 */

export const Strings = {
  common: {
    buttons: {
      cancel: 'Cancelar',
      save: 'Salvar',
      delete: 'Excluir',
      back: 'Voltar',
      understood: 'Entendi',
      confirm: 'Confirmar',
      search: 'Buscar',
      clean: 'Limpar',
    },

    options: {
      authorize: 'Autoriza',
      deny: 'Não autoriza',

      person: 'Solicitante',
      enterprise: 'Empresa',
      interpreter: 'Intérprete',

      yes: 'Sim',
      no: 'Não',

      available: 'Atende',
      notAvailable: 'Não atende',

      online: 'Online',
      inPerson: 'Presencial',
    },

    values: {
      combined: 'A combinar',
      notInformed: 'Não informado',
    },

    fields: {
      select: 'Selecione',
      selected: '{count} selecionados',
      name: 'Nome',
      reason: 'Razão social',
      cpf: 'CPF',
      cnpj: 'CNPJ',
      birthday: 'Data de nascimento',
      gender: 'Gênero',
      phone: 'Telefone',
      email: 'Email',
      password: 'Senha',
      more: 'Mais informações',
      imageRights: 'Direito de uso de imagem',
      values: 'Valores',
      modality: 'Modalidade',
      location: 'Localização',
      state: 'UF',
      city: 'Cidade',
      neighborhoods: 'Bairros',
      neighborhood: 'Bairro',
      street: 'Logradouro',
      number: 'Número',
      floor: 'Complemento',
      specialties: 'Especialidades',
      preferences: 'Preferências',
      optional: 'Opcional',
      professionalArea: 'Área profissional',
      date: 'Data',
      time: 'Hora',
      uploadFile: 'Adicionar arquivo',

      errors: {
        minPassword: 'Senha deve ter no mínimo 8 caracteres',
        required: 'obrigatório',
        invalid: 'inválido',
        futureDate: 'Selecione uma data posterior a hoje',
      },
    },

    loading: 'Carregando',
    noData: 'Nenhum dado disponível',
    noResults: 'Nenhum resultado encontrado',

    toast: {
      errorUnknownTitle: 'Erro',
      errorUnknownDescription:
        'Aconteceu um erro inesperado. Tente novamente mais tarde.',
    },
  },

  // Screens
  register: {
    header: 'Cadastro',
    title: 'Boas-vindas!',
    subtitle: 'Precisamos de algumas informações básicas para criar sua conta.',
    typeSelect: 'Quem é você?',

    toast: {
      errorTitle: 'Falha no cadastro',
      errorDescription: 'Verifique os campos preenchidos. Tente novamente.',
      successTitle: 'Cadastro realizado com sucesso!',
      successDescription: 'Faça login para continuar.',
    },
  },

  auth: {
    login: 'Login',
    slogan: 'Interpretando o mundo, aproximando pessoas',
    signIn: 'Entrar',
    register: 'Cadastrar',
    forgotPassword: 'Esqueci a senha',
    signUpPrefix: 'Ainda não possui conta?',
    signUpAction: 'Criar conta',
    sessionExpired: 'Sessão Expirada',
    sessionExpiredMessage:
      'Sua sessão expirou. Você será redirecionado para o login.',

    toast: {
      errorTitle: 'Falha no login',
      errorDescription: 'Credenciais inválidas. Tente novamente.',
    },
  },

  home: {
    tabBar: 'Início',
    welcome: 'Olá, {User}!',
    nextAppointments: 'Próximos agendamentos',
  },

  profile: {
    tabBar: 'Perfil',
    editProfile: 'Editar Perfil',
    help: 'Ajuda',
    logout: 'Sair',

    toast: {
      errorTitle: 'Erro ao obter dados do perfil.',
      errorDescription: 'Verifique sua conexão e tente novamente.',
    },
  },

  onboarding: {
    INTERPRETER: {
      logoAlt: 'Logotipo do Point Tils',
      illoAlt: 'Ilustração da tela de boas-vindas',
      title: 'Mostre seu trabalho para quem precisa',
      subtitle:
        'No Point Tils, você cadastra suas áreas de atuação, horários disponíveis e recebe solicitações de empresas e pessoas surdas. Gerencie sua agenda e amplie seu alcance profissional.',
      cta: 'Começar agora',
    },
    ENTERPRISE: {
      logoAlt: 'Logotipo do Point Tils',
      illoAlt: 'Ilustração da tela de busca de intérpretes',
      title: 'Intérpretes certos para a sua necessidade',
      subtitle:
        'Pesquise e filtre intérpretes qualificados por especialidade, localização e disponibilidade, e garanta atendimento para reuniões, eventos e muito mais.',
      cta: 'Buscar intérprete',
    },
    PERSON: {
      logoAlt: 'Logotipo do Point Tils',
      illoAlt: 'Ilustração da tela de cadastro de intérprete',
      title: 'Conecte-se a intérpretes de forma rápida e simples',
      subtitle:
        'Encontre intérpretes próximos, verifique disponibilidade e agende atendimentos para situações urgentes ou momentos importantes',
      cta: 'Encontrar intérprete agora',
    },
  },

  toSchedule: {
    header: 'Agendar',
    title: 'Solicitação de agendamento',
    subtitle:
      'Informar uma descrição detalhada aumenta as chances do intérprete aceitar a sua solicitação.',

    calendarNoAvailable: 'Nenhum horário disponível.',

    toast: {
      errorTitle: 'Erro ao criar agendamento',
      errorDescription: 'Verifique os campos preenchidos. Tente novamente.',
      successTitle: 'Solicitação enviada!',
      successDescription:
        'O intérprete vai analisar sua solicitação e você receberá uma notificação assim que houver resposta.',
    },
  },

  edit: {
    header: 'Editar Perfil',
    basicData: 'Dados básicos',
    hoursDescription:
      'Defina os horários disponíveis para atendimento em cada dia da semana.',

    toast: {
      errorTitle: 'Falha ao atualizar perfil',
      errorDescription: 'Verifique os campos preenchidos. Tente novamente.',
      successTitle: 'Perfil atualizado com sucesso!',
      successDescription: 'As alterações foram salvas.',
    },
  },

  appointments: {
    tabBar: 'Agendamentos',
    details: 'Dados do agendamento',

    headers: {
      myAppointments: 'Meus Agendamentos',
      appointment: 'Agendamento',
      request: 'Solicitação',
    },

    states: {
      active: 'Ativos',
      completed: 'Encerrados',
      canceled: 'Cancelados',
      pending: 'Pendentes',
    },

    tabs: {
      appointment: 'Agendamento',
      professional: 'Profissional',
      requester: 'Solicitante',
    },

    accept: 'Aceitar',
    reject: 'Recusar',
    cancelAppointment: 'Cancelar Agendamento',

    toast: {
      acceptTitle: 'Solicitação Aprovada',
      acceptDescription: 'A solicitação foi aceita com sucesso!',
      rejectTitle: 'Solicitação Recusada',
      rejectDescription: 'A solicitação foi recusada com sucesso!',
      cancelTitle: 'Solicitação Cancelada',
      cancelDescription: 'A solicitação foi cancelada com sucesso!',
      errorTitle: 'Erro',
      errorDescription: 'Não foi possível processar a solicitação',
    },
  },

  search: {
    header: 'PESQUISA',

    tabs: {
      details: 'Dados',
      reviews: 'Avaliações',
    },

    createAppointment: 'Fazer solicitação',
    description: 'Serviços e experiência',
    calendar: 'Calendário',
    noSchedulesFound: 'Nenhum agendamento encontrado.',
    selectCity: 'Selecione um estado primeiro',
    filter: 'Filtro',
    datesAvailable: 'Datas disponíveis',
    noReviewsFound: 'Nenhuma avaliação encontrada.',

    toast: {
      errorGetTitle: 'Erro ao obter dados.',
      errorGetText: 'Verifique sua conexão e tente novamente.',
    },
  },

  // Components
  upload: {
    toast: {
      errorTitle: 'Falha no upload',
      errorDescription: 'Erro ao adicionar arquivo. Tente novamente',
      duplicatedTitle: 'Arquivo duplicado',
      duplicatedDescription: 'Este arquivo já foi adicionado.',
      limitTitle: 'Limite de arquivos atingido',
      limitDescription: 'Você pode adicionar até {max} arquivos.',
    },
  },

  feedbackModal: {
    title: 'Queremos saber sua opinião!',
    subtitle:
      'Avalie sua experiência no atendimento realizado pelo intérprete ',
    placeholder: 'Escreva mais detalhes',
    submitButton: 'Avaliar',

    toast: {
      noRatingTitle: 'Avaliação necessária',
      noRatingDescription: 'Por favor, selecione uma nota antes de enviar.',
      errorTitle: 'Erro ao enviar avaliação',
      errorDescription: 'Tente novamente mais tarde.',
      successTitle: 'Avaliação enviada',
      successDescription: 'Seu feedback foi enviado com sucesso!',
    },
  },

  // Enums and fixed options
  gender: {
    male: 'Masculino',
    female: 'Feminino',
    others: 'Outros',
  },

  days: {
    monday: 'Segunda-Feira',
    tuesday: 'Terça-Feira',
    wednesday: 'Quarta-Feira',
    thursday: 'Quinta-Feira',
    friday: 'Sexta-Feira',
    saturday: 'Sábado',
    sunday: 'Domingo',
  },

  hours: {
    title: 'Horários',
    from: 'De',
    to: 'Até',
  },

  specialties: {
    interpreterOfLibras: 'Intérprete de Libras',
    guideInterpreterOfLibras: 'Guia-intérprete de Libras',
    tactileInterpreter: 'Intérprete Tátil',
    internationalSignInterpreter: 'Intérprete de Sinais Internacionais',
  },

  detalhesAgendamento: {
    header: 'Detalhes do agendamento',
    tabs: {
      agendamento: 'Agendamento',
      solicitante: 'Solicitante',
    },
    sections: {
      description: 'Descrição',
      services: 'Serviços e experiência',
      date: 'Data',
      location: 'Localização',
      phone: 'Telefone',
      email: 'E-mail',
    },
    cta: {
      cancel: 'Cancelar agendamento',
      whatsapp: 'WhatsApp',
      // CHAVES ADICIONADAS
      accept: 'Aceitar',
      reject: 'Recusar',
    },
    toast: {
      errorNoIdTitle: 'Erro',
      errorNoIdDescription: 'ID do agendamento não fornecido',
      errorLoadTitle: 'Erro ao carregar',
      errorLoadDescription: 'Não foi possível carregar os detalhes',
      successCancelTitle: 'Cancelado',
      successCancelDescription: 'Agendamento cancelado com sucesso',
      errorCancelTitle: 'Erro ao cancelar',
      errorCancelDescription: 'Não foi possível cancelar o agendamento',
      noPhoneTitle: 'Erro',
      noPhoneDescription: 'Telefone não disponível para contato',
    },
  },

  detalhesAgendamentoUsuario: {
    header: 'Detalhes do agendamento',
    tabs: {
      agendamento: 'Agendamento',
      profissional: 'Profissional',
    },
    sections: {
      description: 'Descrição',
      services: 'Serviços e experiência',
      date: 'Data',
      location: 'Localização',
      phone: 'Telefone',
      email: 'E-mail',
    },
    cta: {
      cancel: 'Cancelar agendamento',
      whatsapp: 'WhatsApp',
    },
  },
} as const;
