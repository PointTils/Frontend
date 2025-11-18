import Header from '@/src/components/Header';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type { Appointment, AppointmentsResponse } from '@/src/types/api';
import { AppointmentStatus, UserType } from '@/src/types/api';
import { renderApptItem } from '@/src/utils/helpers';
import { router } from 'expo-router';
import { PackageSearchIcon } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import { Toast } from 'toastify-react-native';

type TabKey = keyof typeof Strings.appointments.states;

export default function AppointmentsScreen() {
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();

  const [tab, setTab] = React.useState<TabKey>('active');

  const renderItem = useMemo(
    () =>
      renderApptItem({
        userType: user?.type,
        returnTo: '/(tabs)/appointments',
      }),
    [user?.type],
  );

  const {
    data: apptActive,
    loading: loadActive,
    error: errorActive,
  } = useApiGet<AppointmentsResponse>(
    ApiRoutes.appointments.filters(
      user?.id || '',
      user?.type || UserType.PERSON,
      AppointmentStatus.ACCEPTED,
    ),
  );

  const {
    data: apptCompleted,
    loading: loadCompleted,
    error: errorCompleted,
  } = useApiGet<AppointmentsResponse>(
    ApiRoutes.appointments.filters(
      user?.id || '',
      user?.type || UserType.PERSON,
      AppointmentStatus.COMPLETED,
    ),
  );

  const {
    data: apptCanceled,
    loading: loadCanceled,
    error: errorCanceled,
  } = useApiGet<AppointmentsResponse>(
    ApiRoutes.appointments.filters(
      user?.id || '',
      user?.type || UserType.PERSON,
      AppointmentStatus.CANCELED,
    ),
  );

  const {
    data: apptPending,
    loading: loadPending,
    error: errorPending,
  } = useApiGet<AppointmentsResponse>(
    ApiRoutes.appointments.filters(
      user?.id || '',
      user?.type || UserType.PERSON,
      AppointmentStatus.PENDING,
    ),
  );

  // Ensure stable refs for dependencies
  const empty = useMemo<Appointment[]>(() => [], []);

  const active = useMemo<Appointment[]>(() => {
    return Array.isArray(apptActive?.data) ? apptActive.data : empty;
  }, [apptActive?.data, empty]);

  const completed = useMemo<Appointment[]>(() => {
    return Array.isArray(apptCompleted?.data) ? apptCompleted.data : empty;
  }, [apptCompleted?.data, empty]);

  const canceled = useMemo<Appointment[]>(() => {
    return Array.isArray(apptCanceled?.data) ? apptCanceled.data : empty;
  }, [apptCanceled?.data, empty]);

  const pending = useMemo<Appointment[]>(() => {
    return Array.isArray(apptPending?.data) ? apptPending.data : empty;
  }, [apptPending?.data, empty]);

  // Combine and sort appointments based on selected tab
  // Sorted by date descending, then by start_time descending
  const current = useMemo(() => {
    const source =
      tab === 'active'
        ? active
        : tab === 'completed'
          ? completed
          : tab === 'canceled'
            ? canceled
            : pending;
    return [...source].sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) return dateCmp;
      return (b.start_time || '').localeCompare(a.start_time || '');
    });
  }, [tab, active, completed, canceled, pending]);

  function TabButton({ k, label }: { k: TabKey; label: string }) {
    const selected = tab === k;
    return (
      <Pressable
        onPress={() => setTab(k)}
        className={`px-4 py-2 rounded-full border ${selected ? 'bg-primary-blue-light/10 border-primary-blue-light' : 'bg-transparent border-gray-200'}`}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text
          className={`text-sm font-ifood-regular ${selected ? 'text-primary-blue-light' : 'text-typography-600'}`}
        >
          {label}
        </Text>
      </Pressable>
    );
  }

  // Early return if not authenticated or user not loaded
  if (!isAuthenticated || !user) return null;

  if (loadCompleted || loadCanceled || loadActive || loadPending) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={colors.primaryBlue} size="small" />
        <Text className="mt-2 font-ifood-regular text-primary-blue-light">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  // Handle errors
  if (
    errorCompleted ||
    errorCanceled ||
    errorActive ||
    errorPending ||
    !apptCompleted?.success ||
    !apptCompleted.data ||
    !apptCanceled?.success ||
    !apptCanceled.data ||
    !apptActive?.success ||
    !apptActive.data ||
    !apptPending?.success ||
    !apptPending.data
  ) {
    router.replace('/');
    Toast.show({
      type: 'error',
      text1: Strings.profile.toast.errorTitle,
      text2: Strings.profile.toast.errorDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1,
    });
    return null;
  }

  return (
    <View className="flex-1">
      <View className="mt-12 pb-4">
        <Header
          title={Strings.appointments.headers.myAppointments}
          showBackButton={false}
        />
      </View>

      {/* Segmented tabs */}
      <View className="pt-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4"
        >
          <View className="flex-row gap-x-2">
            <TabButton k="active" label={Strings.appointments.states.active} />
            <TabButton
              k="pending"
              label={Strings.appointments.states.pending}
            />
            <TabButton
              k="completed"
              label={Strings.appointments.states.completed}
            />
            <TabButton
              k="canceled"
              label={Strings.appointments.states.canceled}
            />
          </View>
        </ScrollView>
      </View>

      <View className="flex-1 mt-2">
        {/* No data state */}
        {current.length === 0 ? (
          <View className="flex-1 justify-center gap-y-4 items-center">
            <PackageSearchIcon size={38} color={colors.detailsGray} />
            <Text className="font-ifood-regular text-typography-400 text-md">
              {Strings.common.noResults}
            </Text>
          </View>
        ) : (
          <FlatList
            data={current}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="mt-2"
            ItemSeparatorComponent={() => <View className="h-3" />}
          />
        )}
      </View>
    </View>
  );
}
