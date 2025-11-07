/**
 * Centralized API endpoints for Point Tils.
 * Update here if any route changes.
 */

import type { AppointmentStatus } from '../types/api';
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
    byId: (appointmentId: string) => `/appointments/${appointmentId}`,
    filters: (
      userId: string,
      type: UserType,
      status: AppointmentStatus,
      hasRating?: boolean,
      dayLimit?: number,
    ) => {
      const params = new URLSearchParams();

      params.set(
        type === UserType.INTERPRETER
          ? hasRating !== undefined && !hasRating
            ? 'userId'
            : 'interpreterId'
          : 'userId',
        userId,
      );
      params.set('status', String(status));

      if (hasRating !== undefined) params.set('hasRating', String(hasRating));
      if (dayLimit !== undefined) params.set('dayLimit', String(dayLimit));

      return `/appointments/filter?${params.toString()}`;
    },
  },
  userPicture: {
    upload: (userId: string) => `/users/${userId}/picture`,
  },
  schedules: {
    base: '/schedules',
    register: '/schedules/register',
    availabilityPerDay: (
      interpreterId: string,
      dateFrom: string,
      dateTo: string,
    ) =>
      `/schedules/available?interpreterId=${interpreterId}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
    byInterpreterPaginated: (
      page: number = 0,
      size: number = 10,
      interpreterId: string,
      day?: string,
      dateFrom?: string,
      dateTo?: string,
    ) => {
      const params = new URLSearchParams();

      if (page !== undefined) params.set('page', String(page));
      if (size !== undefined) params.set('size', String(size));
      if (interpreterId) params.set('interpreterId', String(interpreterId));
      if (day) params.set('day', String(day));
      if (dateFrom) params.set('dateFrom', String(dateFrom));
      if (dateTo) params.set('dateTo', String(dateTo));

      const qs = params.toString();
      return `/schedules${qs ? `?${qs}` : ''}`;
    },
    updatePerDay: (scheduleId: string) => `/schedules/${scheduleId}`,
  },
  ratings: {
    base: '/ratings',
    byInterpreter: (interpreterId: string) =>
      `/ratings?interpreterId=${interpreterId}`,
    create: (appointmentId: string) => `/ratings/${appointmentId}`,
  },
  interpreterDocument: {
    base: `/interpreter-documents`,
    upload: (interpreterId: string) => `/interpreter-documents/${interpreterId}`,
  },
} as const;
