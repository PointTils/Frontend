// src/hooks/useCheckFeedback.ts
import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { AppointmentStatus, AppointmentsResponse, Appointment, UserType } from '@/src/types/api';
import { useApiGet } from '@/src/hooks/useApi';

export function useCheckFeedback(user: any) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const completedRoute = useMemo(() => {
    if (!user?.id) return null; 
    return ApiRoutes.appointments.byStatus(
      user.id,
      user.type || UserType.PERSON,
      AppointmentStatus.COMPLETED,
    );
  }, [user?.id, user?.type]);

  
  const {
    data: apptCompleted,
    loading: loadCompleted,
    error: errorCompleted,
  } = useApiGet<AppointmentsResponse>(completedRoute || '');
  
  useEffect(() => {
    if (!user || loadCompleted || errorCompleted) return;
    (async () => {
      const alreadyChecked = await AsyncStorage.getItem('@reviewCheckDone');
      
      if (alreadyChecked) return;
      const list: Appointment[] = Array.isArray(apptCompleted?.data)
        ? apptCompleted!.data
        : [];
      const hasPending = list.some(
        a =>
          a.contact_data &&
          typeof a.contact_data.rating === 'number' &&
          (a.contact_data.rating === 0),
      );
      console.log(hasPending)
      if (hasPending) setShowFeedbackModal(true);
      await AsyncStorage.setItem('@reviewCheckDone', 'true');
    })();
  }, [user, apptCompleted, loadCompleted, errorCompleted]);

  return { showFeedbackModal, setShowFeedbackModal };
}
