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
} as const;
