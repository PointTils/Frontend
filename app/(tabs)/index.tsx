import DarkBlueLogo from '@/src/assets/svgs/DarkBlueLogo';
import FeedbackModal from '@/src/components/FeedbackModal';
import ModalBannerHome from '@/src/components/ModalBannerHome';
import ModalWarning from '@/src/components/ModalWarning';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useCheckFeedback } from '@/src/hooks/useCheckFeedback';
import { useColors } from '@/src/hooks/useColors';
import { useProfileCompletion } from '@/src/hooks/useProfileCompletion';
import {
  type AppointmentsResponse,
  type Appointment,
  UserType,
  AppointmentStatus,
} from '@/src/types/api';
import { renderApptItem, toBoolean } from '@/src/utils/helpers';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { CalendarDays, PackageSearchIcon } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const colors = useColors();
  const {
    showFeedbackModal,
    setShowFeedbackModal,
    appointmentForFeedback,
    interpreterName,
  } = useCheckFeedback(user);
  const { showBanner } = useProfileCompletion(user?.id);
  const { apptScheduled } = useLocalSearchParams<{
    apptScheduled?: string;
  }>();

  const [showApptScheduleModal, setShowApptScheduleModal] = useState(false);

  useEffect(() => {
    // Show modal if the user just scheduled an appointment
    if (toBoolean(apptScheduled)) {
      setShowApptScheduleModal(true);
    }
  }, [apptScheduled]);

  const renderItem = useMemo(
    () =>
      renderApptItem({
        userType: user?.type,
        returnTo: '/', // Home route
      }),
    [user?.type],
  );

  const [reloadKey, setReloadKey] = useState(0);

  const { data: appointmentsData, loading: appointmentsLoading } =
    useApiGet<AppointmentsResponse>(
      ApiRoutes.appointments.filters(
        user?.id || '',
        user?.type || UserType.PERSON,
        AppointmentStatus.ACCEPTED,
      ) + `&refresh=${reloadKey}`,
    );

  const appointments = useMemo<Appointment[]>(
    () => (Array.isArray(appointmentsData?.data) ? appointmentsData.data : []),
    [appointmentsData?.data],
  );

  // Refetch on tab focus
  useFocusEffect(
    useCallback(() => {
      setReloadKey((k) => k + 1);
    }, []),
  );

  if (appointmentsLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={colors.primaryBlue} size="small" />
        <Text className="mt-2 font-ifood-regular text-primary-blue-light">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  const welcomeMessage = user
    ? Strings.home.welcome.replace('{User}', user.name)
    : Strings.home.welcome;

  return (
    <View className="flex-1">
      <View className="pt-16">
        <View className="flex-row px-4 pb-6 items-center gap-2">
          <DarkBlueLogo width={85} height={50} />
          <Text className="text-left text-2xl font-ifood-medium text-text-light dark:text-text-dark max-w-[65%]">
            {welcomeMessage}
          </Text>
        </View>

        <SearchFilterBar onData={() => {}} navigateOnSearch />

        {/* Divider */}
        <View className="w-full h-px bg-gray-200 mb-4 mt-6" />

        {showBanner && (
          <>
            <ModalBannerHome
              title={
                user?.type === UserType.INTERPRETER
                  ? Strings.home.banner.interpreter
                  : Strings.home.banner.person
              }
              backgroundColor={colors.primaryBlue}
              onPress={() => router.push('/(tabs)/profile')}
            />

            {/* Divider */}
            <View className="w-full h-px bg-gray-200 mb-4 mt-4" />
          </>
        )}
        <View className="flex-row items-center gap-3 px-4">
          <CalendarDays color={colors.primaryBlue} />
          <Text className="text-text-light dark:text-text-dark font-ifood-medium">
            {Strings.home.nextAppointments}
          </Text>
        </View>
        {/* Divider */}
        <View className="w-full h-px bg-gray-200 mt-4" />
      </View>

      <View className="flex-1">
        {appointments.length > 0 ? (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id || Math.random().toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View className="h-3" />}
          />
        ) : (
          <View className="flex-1 justify-center gap-y-4 items-center">
            <PackageSearchIcon size={38} color={colors.detailsGray} />
            <Text className="font-ifood-regular text-typography-400 text-md">
              {Strings.common.noResults}
            </Text>
          </View>
        )}
      </View>

      <FeedbackModal
        visible={showFeedbackModal && !showApptScheduleModal}
        onClose={() => setShowFeedbackModal(false)}
        appointmentId={appointmentForFeedback?.id || ''}
        interpreterName={interpreterName ?? ''}
      />

      <ModalWarning
        visible={showApptScheduleModal}
        onClose={() => setShowApptScheduleModal(false)}
        title={Strings.toSchedule.toast.successTitle}
        text={Strings.toSchedule.toast.successDescription}
        buttonTitle={Strings.common.buttons.understood}
      />
    </View>
  );
}
