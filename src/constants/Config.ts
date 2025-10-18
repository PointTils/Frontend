/**
 * App configuration constants for the Point Tils app.
 * Centralizes global settings such astheme mode and navigation behaviors.
 *
 * - FORCE_LIGHT_MODE: Forces the app to use light mode regardless of system preference.
 * - HIDE_TABBAR_SEGMENTS: List of route segments where the tab bar should be hidden.
 * - SCHEDULE_ENABLED: Toggles the availability of scheduling features in the app.
 * - MAX_NEIGHBORHOODS: Maximum number of neighborhoods a user can select in forms.
 * - IMAGE_UPLOAD_ENABLED: Enables or disables image upload functionality.
 */

export const FORCE_LIGHT_MODE = true;

export const HIDE_TABBAR_SEGMENTS = ['edit', '[id]'];

export const SCHEDULE_ENABLED = true;

export const MAX_NEIGHBORHOODS = 5;

export const IMAGE_UPLOAD_ENABLED = true;
