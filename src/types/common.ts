/**
 * Common types used across the application.
 * Includes user roles and shared models.
 */

import type { Strings } from '../constants/Strings';

// Models
export interface Location {
  id?: string | null;
  city: string;
  neighborhood: string;
  uf: string;
}

export interface Specialty {
  id?: string | null;
  name: string;
}

// API types
export interface StateAndCityResponse {
  success: boolean;
  message: string;
  data: [
    {
      name: string;
    },
  ];
}

// Enums
export enum UserType {
  PERSON = 'PERSON',
  ENTERPRISE = 'ENTERPRISE',
  INTERPRETER = 'INTERPRETER',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export enum Modality {
  PERSONALLY = 'PERSONALLY',
  ONLINE = 'ONLINE',
  ALL = 'ALL',
}

// Types
export type Day = keyof typeof Strings.days;

export type TimeRange = { from?: string | null; to?: string | null };
