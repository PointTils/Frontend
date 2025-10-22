import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

import { StorageKeys } from '@/src/constants/StorageKeys';

interface AppointmentBadgeContextData {
  hasPendingBadge: boolean;
  markPendingAsSeen: () => Promise<void>;
  checkForNewPending: (currentPendingIds: string[]) => Promise<void>;
}

const AppointmentBadgeContext = createContext<
  AppointmentBadgeContextData | undefined
>(undefined);

export function AppointmentBadgeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasPendingBadge, setHasPendingBadge] = useState(false);

  useEffect(() => {
    loadBadgeState();
  }, []);

  const loadBadgeState = async () => {
    try {
      const hasUnseen = await AsyncStorage.getItem(
        StorageKeys.hasPendingAppointments,
      );
      setHasPendingBadge(hasUnseen === 'true');
    } catch (error) {
      console.error('Error loading badge state:', error);
    }
  };

  const markPendingAsSeen = useCallback(async () => {
    try {
      await AsyncStorage.setItem(StorageKeys.hasPendingAppointments, 'false');
      setHasPendingBadge(false);
    } catch (error) {
      console.error('Error marking pending as seen:', error);
    }
  }, []);

  const checkForNewPending = useCallback(
    async (currentPendingIds: string[]) => {
      try {
        const lastSeenIds = await AsyncStorage.getItem(
          StorageKeys.lastSeenPendingIds,
        );
        console.log('Last seen pending IDs:', lastSeenIds);
        const previousIds = lastSeenIds ? JSON.parse(lastSeenIds) : [];

        const hasNewPending = currentPendingIds.some(
          (id) => !previousIds.includes(id),
        );

        if (hasNewPending && currentPendingIds.length > 0) {
          await AsyncStorage.setItem(
            StorageKeys.hasPendingAppointments,
            'true',
          );
          console.log('New pending appointments found.', currentPendingIds);
          setHasPendingBadge(true);
        } else if (currentPendingIds.length === 0) {
          await AsyncStorage.setItem(
            StorageKeys.hasPendingAppointments,
            'false',
          );
          setHasPendingBadge(false);
        }

        await AsyncStorage.setItem(
          StorageKeys.lastSeenPendingIds,
          JSON.stringify(currentPendingIds),
        );
      } catch (error) {
        console.error('Error checking for new pending:', error);
      }
    },
    [],
  );

  return (
    <AppointmentBadgeContext.Provider
      value={{ hasPendingBadge, markPendingAsSeen, checkForNewPending }}
    >
      {children}
    </AppointmentBadgeContext.Provider>
  );
}

export function useAppointmentBadge() {
  const context = useContext(AppointmentBadgeContext);
  if (!context) {
    throw new Error(
      'useAppointmentBadge must be used within AppointmentBadgeProvider',
    );
  }
  return context;
}
