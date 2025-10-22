// src/hooks/useCheckFeedback.ts
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { useApiGet } from '@/src/hooks/useApi';
import type { AppointmentsResponse, Appointment } from '@/src/types/api';
import { AppointmentStatus, UserType } from '@/src/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useMemo, useState } from 'react';

export function useCheckFeedback(user: any) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [appointmentForFeedback, setAppointmentForFeedback] = useState<Appointment | null>(null);

  const completedRoute = useMemo(() => {
    if (!user?.id) return '';
    return ApiRoutes.appointments.byStatus(
      user.id,
      user.type || UserType.PERSON,
      AppointmentStatus.COMPLETED,
      false,
      5
    );
  }, [user?.id, user?.type]);

  const { data: apptCompleted, loading: loadCompleted, error: errorCompleted } =
    useApiGet<AppointmentsResponse>(completedRoute);

  useEffect(() => {
    if (!user || loadCompleted || errorCompleted) return;

    const list: Appointment[] = Array.isArray(apptCompleted?.data) ? apptCompleted.data : [];

    if (list.length > 0) {
      setAppointmentForFeedback(list[0]);
      setShowFeedbackModal(true);
    }
  }, [user, apptCompleted, loadCompleted, errorCompleted]);

  return { showFeedbackModal, setShowFeedbackModal, appointmentForFeedback };
}
