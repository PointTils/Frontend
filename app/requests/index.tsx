import Header from '@/src/components/Header';
import { Card } from '@/src/components/ui/card';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type { Appointment, AppointmentsResponse } from '@/src/types/api';
import { AppointmentStatus, UserType } from '@/src/types/api';
import {
  formatAppointmentLocation,
  formatCpfOrCnpj,
  formatDate,
  formatTime,
} from '@/src/utils/masks';
import { router } from 'expo-router';
import { PackageSearchIcon } from 'lucide-react-native';
import React, { Fragment } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function PendingRequestsScreen() {
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();

  const { data, loading, error } = useApiGet<AppointmentsResponse>(
    ApiRoutes.appointments.byStatus(
      user?.id || '',
      user?.type || UserType.INTERPRETER,
      AppointmentStatus.PENDING,
    ),
  );

  // Early return if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={colors.primaryBlue} size="large" />
      </View>
    );
  }

  // Redirect to home if no appointments data or error occurs
  if (error || !data?.success || !data.data) {
    router.replace('/(tabs)');
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

  const requests = (Array.isArray(data.data) ? data.data : []) as Appointment[];
  console.log('Requests:', requests);

  return (
    <View className="flex-1 justify-center">
      <View className="mt-12 pb-2">
        <Header
          title={Strings.requests.requests}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      <View className="flex-1">
        {/* No data state */}
        {requests.length === 0 ? (
          <View className="flex-1 justify-center gap-y-4 items-center">
            <PackageSearchIcon size={38} color={colors.detailsGray} />
            <Text className="text-typography-600 text-md">
              {Strings.common.noData}
            </Text>
          </View>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerClassName="flex-1 mt-2"
          >
            <View className="pb-4">
              {requests.map((req) => (
                <Fragment key={req.id}>
                  <View className="w-full h-px bg-gray-200" />
                  <Card
                    photoUrl={req.contact_data?.picture || ''}
                    fullName={req.contact_data?.name}
                    subtitle={
                      user?.type !== UserType.INTERPRETER
                        ? req.contact_data?.specialties
                            ?.map((s) => s.name)
                            .join(', ')
                        : formatCpfOrCnpj(req.contact_data?.document)
                    }
                    showRating={false}
                    date={`${formatDate(req.date)}  ${formatTime(req.start_time)} - ${formatTime(req.end_time)}`}
                    location={formatAppointmentLocation(req)}
                    pending={true}
                    onPress={() =>
                      router.push({
                        pathname: '/requests/[id]',
                        params: { id: req.id },
                      })
                    }
                  />
                  <View className="w-full h-px bg-gray-200" />
                </Fragment>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}
