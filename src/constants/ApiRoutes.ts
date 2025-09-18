/**
 * Centralized API endpoints for Point Tils.
 * Update here if any route changes.
 */

export const ApiRoutes = {
  auth: {
    base: '/auth/',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
  },
  clients: {
    base: '/deaf-users',
    register: '/deaf-users/register',
    profile: (id: string) => `/deaf-users/${id}`,
  },
  enterprises: {
    base: '/enterprise-users',
    register: '/enterprise-users/register',
    profile: (id: string) => `/enterprise-users/${id}`,
  },
  interpreters: {
    base: '/interpreters',
    register: '/interpreters/register',
    profile: (id: string) => `/interpreters/${id}`,
  },
  states: {
    base: '/states',
    cities: (uf: string) => `/states/${uf}/cities`,
  },
} as const;
