/**
 * Common types used across the application.
 * Includes user roles and shared models.
 */

// Models
export interface Location {
  id: string | null;
  uf: string;
  city: string;
  neighborhood: string;
}

export interface Specialty {
  id: string | null;
  name: string;
}

export interface InterpreterProfessionalInfo {
  cnpj: string | null;
  rating: number;
  modality: Modalities;
  description: string;
  min_value: number;
  max_value: number;
  image_rights: boolean;
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

export enum Modalities {
  PRESENTIAL = 'PRESENTIAL',
  ONLINE = 'ONLINE',
}
