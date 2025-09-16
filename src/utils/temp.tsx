import AsyncStorage from '@react-native-async-storage/async-storage';

export async function clearAllStorage(logout: () => void): Promise<void> {
  try {
    const allKeys = await AsyncStorage.getAllKeys();

    // Filter out onboarding keys (they follow the pattern 'hasSeenOnboarding_*')
    const keysToDelete = allKeys.filter(
      (key) => !key.startsWith('hasSeenOnboarding_'),
    );

    if (keysToDelete.length > 0) {
      await AsyncStorage.multiRemove(keysToDelete);
      console.warn(
        `Cleared ${keysToDelete.length} storage keys, preserved onboarding data`,
      );
    } else {
      console.warn('No keys to clear, onboarding data preserved');
    }

    logout(); // Call logout to update auth state
  } catch (error) {
    console.error('Failed to clear storage:', error);
    throw error;
  }
}
