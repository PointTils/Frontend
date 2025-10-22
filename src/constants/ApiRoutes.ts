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
    byUser: (userId: string) => `/users/${userId}/specialties`,
  },
  appointments: {
    base: '/appointments',
    detail: (id: string) => `/appointments/${id}`,
    byStatus: (id: string, type: UserType, status: string) =>
      `/appointments/filter?${type === UserType.INTERPRETER ? 'interpreterId' : 'userId'}=${id}&status=${status}`,
    filter: '/appointments/filter',
    byId: (appointmentId: string) => `/appointments/${appointmentId}`,
  },
  userPicture: {
    upload: (userId: string) => `/users/${userId}/picture`,
  },
  schedules: {
    base: '/schedules',
    interpreterSchedule: (
      interpreterId: string,
      dateFrom: string,
      dateTo: string,
    ) =>
      `/schedules/available?interpreterId=${interpreterId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
  },
  ratings: {
    base: '/ratings',
    byInterpreter: (interpreterId: string) =>
      `/ratings?interpreterId=${interpreterId}`,
    create: (appointmentId: string) => `/ratings/${appointmentId}`,
  },
} as const;
