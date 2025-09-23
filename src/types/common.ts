/**
 * Common types used across the application.
 * Includes user roles and shared models.
 */

// Models
export interface Location {
  id: string | null;
  city: string;
  neighborhood: string;
  state: string;
}

export interface Specialty {
  id: string | null;
  name: string;
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
export type ImageRightsOptions = 'AUTHORIZE' | 'DENY';

export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type TimeRange = [string, string];
