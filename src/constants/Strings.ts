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
      description: 'Descrição',
      imageRights: 'Direito de uso de imagem',
      valueRange: 'Faixa de valores',
      min: 'Mínimo',
      max: 'Máximo',
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

      errors: {
        minPassword: 'Senha deve ter no mínimo 8 caracteres',
        required: 'obrigatório',
        invalid: 'inválido',
        futureDate: 'Selecione uma data posterior a hoje',
      },
    },

    errorTitle: 'Ocorreu um erro',
    errorDescription: 'Ocorreu um erro. Tente novamente.',
    Loading: 'Carregando...',
    noData: 'Nenhum dado disponível',
    noResults: 'Nenhum resultado encontrado',
  },

  // Screens
  register: {
    header: 'Cadastro',
    title: 'Boas-vindas!',
    subtitle: 'Precisamos de algumas informações básicas para criar sua conta.',
    typeSelect: 'Quem é você?',
    create: 'Criar conta',

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
  },

  history: {
    tabBar: 'Histórico',
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
  },

  edit: {
    header: 'Editar Perfil',
    basicData: 'Dados básicos',
    hoursDescription:
      'Defina os horários disponíveis para atendimento em cada dia da semana.',

    toast: {
      errorApiTitle: 'Falha ao atualizar perfil',
      errorApiDescription: 'Verifique os campos preenchidos. Tente novamente.',
      successTitle: 'Perfil atualizado com sucesso!',
      successDescription: 'As alterações foram salvas.',
      errorTitle: 'Erro',
      errorDescription:
        'Aconteceu um erro inesperado. Tente novamente mais tarde.',
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

  edit: {
    header: 'Editar Perfil',
    basicData: 'Dados básicos',
    hoursDescription:
      'Defina os horários disponíveis para atendimento em cada dia da semana.',

    toast: {
      errorApiTitle: 'Falha ao atualizar perfil',
      errorApiDescription: 'Verifique os campos preenchidos. Tente novamente.',
      successTitle: 'Perfil atualizado com sucesso!',
      successDescription: 'As alterações foram salvas.',
      errorTitle: 'Erro',
      errorDescription:
        'Aconteceu um erro inesperado. Tente novamente mais tarde.',
    },
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
