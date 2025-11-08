import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { useApiGet } from '@/src/hooks/useApi';
import type { AppointmentsResponse, Appointment } from '@/src/types/api';
import { AppointmentStatus } from '@/src/types/api';
import { useEffect, useMemo, useState } from 'react';

export function useAppointmentNotification(user: any) {
  const [showAppointmentNotification, setShowAppointmentNotification] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);

  const pendingRoute = useMemo(() => {
    if (!user?.id) return '';

    return ApiRoutes.appointments.filters(
      user.id,
      user.type,
      AppointmentStatus.PENDING,
    );
  }, [user?.id, user?.type]);

  const {
    data: apptCompleted,
    loading: loading,
    error: error,
  } = useApiGet<AppointmentsResponse>(shouldFetch ? pendingRoute : '');

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
      setShowAppointmentNotification(true);
    }
  }, [user, apptCompleted, loading, error]);

  return {
    showAppointmentNotification,
    setShowAppointmentNotification,
  };
}
