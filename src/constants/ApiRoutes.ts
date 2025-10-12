/**
 * Centralized API endpoints for Point Tils.
 * Update here if any route changes.
 */

import { UserType } from '../types/api';

export const ApiRoutes = {
  auth: {
    base: '/auth/',
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
  },
  person: {
    base: '/person',
    register: '/person/register',
    profile: (id: string) => `/person/${id}`,
  },
  enterprises: {
    base: '/enterprises',
    register: '/enterprises/register',
    profile: (id: string) => `/enterprises/${id}`,
  },
  interpreters: {
    base: (param: URLSearchParams) => `/interpreters?${param}`,
    register: '/interpreters/register',
    profile: (id: string) => `/interpreters/${id}`,
  },
  states: {
    base: '/states',
    cities: (stateId: string) => `/states/${stateId}/cities`,
  },
  userSpecialties: {
    userSpecialties: (userId: string) => `/users/${userId}/specialties`,
  },
  appointments: {
    base: '/appointments',
    create: '/appointments',
    list: '/appointments',
    detail: (id: string) => `/appointments/${id}`,
    update: (id: string) => `/appointments/${id}`,
    delete: (id: string) => `/appointments/${id}`,
    filter: '/appointments/filter',
  },
  // appointments: {
  //   base: '/appointments',
  //   byStatus: (id: string, type: UserType, status: string) =>
  //     `/appointments/filter?${type === UserType.INTERPRETER ? 'interpreterId' : 'userId'}=${id}&status=${status}`,
  //   filter: '/appointments/filter',
  // },
} as const;
