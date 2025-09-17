/**
 * Type definitions for UI component and asset props.
 * Centralizes UI-related prop types for maintainability and type safety.
 */

export interface PointTilsLogoProps {
  width?: number;
  height?: number;
  primaryColor?: string;
  accentColor?: string;
}

export type BaseSvgProps = {
  width?: number;
  height?: number;
  accentColor?: string;
  accessibilityLabel?: string;
};
