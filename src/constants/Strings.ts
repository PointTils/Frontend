/**
 * UI text constants for the Point Tils app
 * Organized by feature for easier maintenance
 */

export const Strings = {
  common: {
    cancel: 'Cancelar',
    save: 'Salvar',
    delete: 'Excluir',
    back: 'Voltar',
    error: 'Ocorreu um erro. Tente novamente.',
    understood: 'Entendi',
    slogan: 'Interpretando o mundo, aproximando pessoas',
  },

  auth: {
    login: 'Login',
    signIn: 'Entrar',
    password: 'Senha',
    register: 'Cadastrar',
    forgotPassword: 'Esqueci a senha',
    email: 'Email',
    signUp: 'Ainda não possui conta? Criar conta',
    signUpPrefix: 'Ainda não possui conta?',
    signUpAction: 'Criar conta',
    sessionExpired: 'Sessão Expirada',
    sessionExpiredMessage:
      'Sua sessão expirou. Você será redirecionado para o login.',
  },

  home: {
    title: 'Início',
  },

  history: {
    title: 'Histórico',
  },

  profile: {
    title: 'Perfil',
  },

  onboarding: {
    til: {
      logoAlt: 'Logotipo do Point Tils',
      illoAlt: 'Ilustração da tela de boas-vindas',
      title: 'Mostre seu trabalho para quem precisa',
      subtitle:
        'No Point Tils, você cadastra suas áreas de atuação, horários disponíveis e recebe solicitações de empresas e pessoas surdas. Gerencie sua agenda e amplie seu alcance profissional.',
      cta: 'Começar agora',
    },
    company: {
      logoAlt: 'Logotipo do Point Tils',
      illoAlt: 'Ilustração da tela de busca de intérpretes',
      title: 'Intérpretes certos para a sua necessidade',
      subtitle:
        'Pesquise e filtre intérpretes qualificados por especialidade, localização e disponibilidade, e garanta atendimento para reuniões, eventos e muito mais.',
      cta: 'Buscar intérprete',
    },
    user: {
      logoAlt: 'Logotipo do Point Tils',
      illoAlt: 'Ilustração da tela de cadastro de intérprete',
      title: 'Conecte-se a intérpretes de forma rápida e simples',
      subtitle:
        'Encontre intérpretes próximos, verifique disponibilidade e agende atendimentos para situações urgentes ou momentos importantes',
      cta: 'Encontrar intérprete agora',
    },
  },
} as const;
