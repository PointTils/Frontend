import DarkBlueLogo from '@/src/assets/svgs/DarkBlueLogo';
import SearchFilterBar from '@/src/components/SearchFilterBar';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import {
  type AppointmentsResponse,
  type Appointment,
  UserType,
  AppointmentStatus,
} from '@/src/types/api';
import { renderApptItem } from '@/src/utils/helpers';
import { router } from 'expo-router';
import { BellIcon, CalendarDays } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const colors = useColors();

  const renderItem = useMemo(
    () =>
      renderApptItem({
        userType: user?.type,
        returnTo: '/', // Home route
      }),
    [user?.type],
  );

  const appointmentsRoute = useMemo(() => {
    if (!user?.id) return '';

    const baseUrl = ApiRoutes.appointments.filter;
    const params = new URLSearchParams();

    if (user.type === UserType.INTERPRETER) {
      params.append('interpreterId', user.id);
    } else {
      params.append('userId', user.id);
    }

    params.append('status', AppointmentStatus.ACCEPTED);

    return `${baseUrl}?${params.toString()}`;
  }, [user?.id, user?.type]);

  const { data: appointmentsData, loading: appointmentsLoading } =
    useApiGet<AppointmentsResponse>(appointmentsRoute);

  const appointments = useMemo<Appointment[]>(
    () => (Array.isArray(appointmentsData?.data) ? appointmentsData.data : []),
    [appointmentsData?.data],
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
        <View className="flex-row pl-4 pr-6 justify-between items-center">
          <View className="flex-row items-center gap-2">
            <DarkBlueLogo width={85} height={50} />
            <Text className="text-left text-2xl font-ifood-medium text-text max-w-[65%]">
              {welcomeMessage}
            </Text>
          </View>

          {user?.type === UserType.INTERPRETER && (
            <BellIcon
              size={24}
              className="pr-4 text-right"
              onPress={() => router.push('/requests')}
            />
          )}
        </View>

        <TouchableOpacity
          className="mt-6"
          accessibilityRole="button"
          accessibilityLabel={Strings.common.buttons.search}
          onPress={() => router.push('/interpreters/search')}
        >
          <SearchFilterBar onData={() => {}} interactive={false} />
        </TouchableOpacity>

        <View
          className="h-px w-full mt-4"
          style={{ backgroundColor: colors.fieldGray }}
        />
        <View className="flex-row items-center gap-3 pl-6 pt-4">
          <CalendarDays color={colors.primaryBlue} />
          <Text
            className="text-center font-ifood-medium"
            style={{ color: colors.text }}
          >
            {Strings.home.nextAppointments}
          </Text>
        </View>
        <View
          className="h-px w-full mt-4"
          style={{ backgroundColor: colors.fieldGray }}
        />
      </View>

      <View className="flex-1 pb-4">
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
          <View className="flex-1 justify-center items-center py-8">
            <Text
              className="text-center font-ifood-regular"
              style={{ color: colors.detailsGray }}
            >
              {Strings.common.noData}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
