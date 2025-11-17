import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { useApiGet } from '@/src/hooks/useApi';
import type { AppointmentsResponse, Appointment } from '@/src/types/api';
import { AppointmentStatus, UserType } from '@/src/types/api';
import { useEffect, useMemo, useState } from 'react';

export function useCheckFeedback(user: any) {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [appointmentForFeedback, setAppointmentForFeedback] =
    useState<Appointment | null>(null);
  const [interpreterName, setInterpreterName] = useState<string | null>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  const completedRoute = useMemo(() => {
    if (!user?.id) return '';

    return ApiRoutes.appointments.filters(
      user.id,
      user.type || UserType.PERSON,
      AppointmentStatus.COMPLETED,
      false,
      5,
    );
  }, [user?.id, user?.type]);

  const {
    data: apptCompleted,
    loading: loading,
    error: error,
  } = useApiGet<AppointmentsResponse>(shouldFetch ? completedRoute : '');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetch(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user || loading || error) return;

    const list: Appointment[] = Array.isArray(apptCompleted?.data)
      ? apptCompleted.data
      : [];

    if (list.length > 0) {
      const firstAppointment = list[0];
      setAppointmentForFeedback(list[0]);
      const name = firstAppointment?.contact_data?.name || null;
      setInterpreterName(name);
      setShowFeedbackModal(true);
    }
  }, [user, apptCompleted, loading, error]);

  return {
    showFeedbackModal,
    setShowFeedbackModal,
    appointmentForFeedback,
    interpreterName,
  };
}
