/**
 * Type definitions for UI component and asset props.
 * Centralizes UI-related prop types for maintainability and type safety.
 */

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
};
