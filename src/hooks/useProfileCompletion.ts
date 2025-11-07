import { StorageKeys } from '@/src/constants/StorageKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';

export function useProfileCompletion(userId: string | undefined) {
  const [showBanner, setShowBanner] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function checkProfileCompletion() {
        if (!userId) return;

        const hasCompletedProfile = await AsyncStorage.getItem(
          StorageKeys.hasCompletedProfile(userId),
        );
        setShowBanner(!hasCompletedProfile);
      }

      checkProfileCompletion();
    }, [userId]),
  );

  async function markProfileAsCompleted() {
    if (!userId) {
      return;
    }
    await AsyncStorage.setItem(StorageKeys.hasCompletedProfile(userId), 'true');
    setShowBanner(false);
  }

  return { showBanner, markProfileAsCompleted };
}
