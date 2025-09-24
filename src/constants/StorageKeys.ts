/**
 * Centralized keys for AsyncStorage usage across the app.
 * Use these constants to avoid typos and ensure consistency.
 */

export const StorageKeys = {
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  user_data: 'user_data',
  hasSeenOnboarding: (id: string) => `hasSeenOnboarding_${id}`,
} as const;
