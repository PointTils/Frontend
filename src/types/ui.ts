/**
 * Type definitions for UI component and asset props.
 * Centralizes UI-related prop types for maintainability and type safety.
 */

import type { Gender, Modality } from './api/common';

export type PointTilsLogoProps = {
  width?: number;
  height?: number;
  primaryColor?: string;
  accentColor?: string;
};

export type AvatarProps = {
  width?: number;
  height?: number;
  skinColor?: string;
  shirtColor?: string;
};

export type BaseSvgProps = {
  width?: number;
  height?: number;
  accentColor?: string;
  accessibilityLabel?: string;
};

export type OptionItem = {
  label: string;
  value: string;
}

export type AppliedFilters = {
  modality?: Modality | null;
  availableDates?: string;
  online?: boolean;
  personally?: boolean;
  specialty?: string[];
  gender?: Gender | null;
  city?: string;
  state?: string;
};
