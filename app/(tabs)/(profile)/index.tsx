import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import ChipsSection from '@/src/components/ui/chipSection';
import { InfoRow } from '@/src/components/ui/infoRow';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { SCHEDULE_ENABLED } from '@/src/constants/Config';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type { UserResponse } from '@/src/types/api';
import { Modality, UserType } from '@/src/types/common';
import type { Day } from '@/src/types/common';
import {
  formatDate,
  formatDaySchedule,
  formatValueRange,
  handleCnpjChange,
  handlePhoneChange,
  mapGender,
  mapImageRights,
  mapModality,
} from '@/src/utils/masks';
import { router } from 'expo-router';
import {
  BriefcaseBusiness,
  Edit,
  HelpCircle,
  LogOut,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function ProfileScreen() {
  const colors = useColors();
  const { user, isAuthenticated, logout } = useAuth();

  // Determine API route based on user type
  let route = '';
  switch (user?.type) {
    case UserType.PERSON:
      route = ApiRoutes.person.profile(user?.id);
      break;
    case UserType.INTERPRETER:
      route = ApiRoutes.interpreters.profile(user?.id);
      break;
    case UserType.ENTERPRISE:
      route = ApiRoutes.enterprises.profile(user?.id);
      break;
  }

  // Integration with API to fetch profile data
  const { data, loading, error } = useApiGet<UserResponse>(route);

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

  // Redirect to home if no profile data or error occurs
  if (error || !data?.success || !data.data) {
    router.push('/(tabs)');
    Toast.show({
      type: 'error',
      text1: Strings.profile.toast.errorTitle,
      text2: Strings.profile.toast.errorDescription,
      position: 'top',
      visibilityTime: 2000,
      autoHide: true,
      closeIconSize: 1, // To "hide" the close icon
    });
    return null;
  }

  const profile = data.data;
  const chipsItems = profile.specialties?.map((item) => item.name) ?? [];

  const showLocation =
    profile.type === UserType.INTERPRETER
      ? profile.professional_data.modality === Modality.ALL ||
        profile.professional_data.modality === Modality.PERSONALLY
      : false;
  const firstLocation =
    profile.type === UserType.INTERPRETER ? profile.locations?.[0] : undefined;
  const neighborhoods =
    profile.type === UserType.INTERPRETER
      ? Array.from(
          new Set(
            (profile.locations || [])
              .map((l) => l.neighborhood)
              .filter((n): n is string => !!n && n.trim().length > 0),
          ),
        )
      : [];

  // Simple schedule mock - remove when API supports it
  const scheduleMock: Record<string, { from?: string; to?: string }> = {
    monday: { from: '08:00', to: '12:00' },
    tuesday: { from: '09:00', to: '17:00' },
    wednesday: { from: '09:00', to: '17:00' },
    thursday: { from: '09:00', to: '17:00' },
    friday: { from: '09:00', to: '16:00' },
    saturday: { from: '', to: '' },
    sunday: { from: '', to: '' },
  };

  return (
    <View className="flex-1 justify-center items-center mt-8 px-4">
      <ScrollView
        className="w-full"
        contentContainerClassName="items-center grow pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* For alignment purposes */}
        <View className="w-full mb-24" />

        {/* Avatar */}
        <Avatar size="lg" borderRadius="full" className="h-32 w-32">
          <AvatarImage
            source={{
              uri:
                profile.picture ||
                'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
            }}
          />
        </Avatar>
        <Text className="w-full text-xl font-ifood-regular text-center mb-4 mt-2 text-primary-800">
          {profile.type === UserType.ENTERPRISE
            ? profile.corporate_reason
            : profile.name}
        </Text>

        {/* Divider */}
        <View className="w-full h-px bg-gray-200 mb-4" />

        <View className="w-full mb-8">
          {profile.type === UserType.ENTERPRISE ? (
            <InfoRow
              label={Strings.common.fields.cnpj}
              value={profile.cnpj ? handleCnpjChange(profile.cnpj) : undefined}
            />
          ) : (
            <InfoRow
              label={Strings.common.fields.cpf}
              value={profile.cpf ?? undefined}
            />
          )}

          {profile.type !== UserType.ENTERPRISE && (
            <>
              <InfoRow
                label={Strings.common.fields.birthday}
                value={formatDate(profile.birthday)}
              />
              <InfoRow
                label={Strings.common.fields.gender}
                value={mapGender(profile.gender)}
              />
            </>
          )}

          <InfoRow
            label={Strings.common.fields.phone}
            value={profile.phone ? handlePhoneChange(profile.phone) : undefined}
          />

          <InfoRow label={Strings.common.fields.email} value={profile.email} />

          {/* Chips section */}
          {profile.type !== UserType.INTERPRETER && chipsItems.length > 0 && (
            <>
              <Text className="w-full pl-2 text-lg font-ifood-medium text-left mb-1 text-primary-800">
                {Strings.common.fields.preferences}
              </Text>
              <ChipsSection items={chipsItems} />
            </>
          )}

          {/* Interpreter area */}
          {profile.type === UserType.INTERPRETER && (
            <>
              <View className="w-full flex-row self-start items-center justify-center gap-2 mt-8 mb-6">
                <BriefcaseBusiness />
                <Text className="text-lg font-ifood-medium text-primary-800">
                  {Strings.common.fields.professionalArea}
                </Text>
              </View>

              {/* Show CNPJ if available */}
              <InfoRow
                label={Strings.common.fields.cnpj}
                value={
                  profile.professional_data?.cnpj
                    ? handleCnpjChange(profile.professional_data.cnpj)
                    : undefined
                }
              />

              {chipsItems.length > 0 && (
                <>
                  <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
                    {Strings.common.fields.specialties}
                  </Text>
                  <ChipsSection items={chipsItems} />
                </>
              )}

              <InfoRow
                label={Strings.common.fields.description}
                value={
                  profile.professional_data?.description
                    ? profile.professional_data.description
                    : undefined
                }
              />

              <InfoRow
                label={Strings.common.fields.modality}
                value={mapModality(profile.professional_data?.modality)}
              />

              {/* Locations (only if ALL or PERSONALLY) */}
              {showLocation &&
                (firstLocation?.city ||
                  firstLocation?.uf ||
                  neighborhoods.length > 0) && (
                  <>
                    <InfoRow
                      label={Strings.common.fields.location}
                      value={
                        firstLocation?.city && firstLocation?.uf
                          ? `${firstLocation.city} - ${firstLocation.uf}`
                          : undefined
                      }
                    />
                    {neighborhoods.length > 0 && (
                      <Text className="font-ifood-regular text-primary-800 px-2 mb-4 -mt-2">
                        - {`${neighborhoods.join(', ')}`}
                      </Text>
                    )}
                  </>
                )}

              <InfoRow
                label={Strings.common.fields.imageRights}
                value={mapImageRights(profile.professional_data?.image_rights)}
              />

              <InfoRow
                label={Strings.common.fields.valueRange}
                value={formatValueRange(
                  profile.professional_data?.min_value,
                  profile.professional_data?.max_value,
                )}
              />

              {/* Schedule */}
              {SCHEDULE_ENABLED && (
                <>
                  <Text className="w-full pl-2 mt-2 font-ifood-medium text-left mb-1 text-primary-800">
                    {Strings.hours.title}
                  </Text>

                  {Object.entries(Strings.days).map(([day, label]) => {
                    const value = formatDaySchedule(scheduleMock[day as Day]);
                    return (
                      <View
                        key={day}
                        className="w-full flex-row items-center justify-between px-2 py-1"
                      >
                        <Text className="font-ifood-regular text-primary-800">
                          {label}
                        </Text>
                        <Text className="font-ifood-regular text-primary-800">
                          {value}
                        </Text>
                      </View>
                    );
                  })}
                </>
              )}
            </>
          )}
        </View>

        {/* Buttons */}
        <View className="w-full mt-auto">
          <Button
            size="md"
            onPress={() =>
              router.push({
                pathname: '/(tabs)/(profile)/edit',
                params: {
                  data: JSON.stringify(profile),
                },
              })
            }
            variant={'linked'}
            className="w-[330px] bg-transparent data-[active=true]:bg-primary-gray-press-light items-center justify-start p-2"
          >
            <ButtonIcon as={Edit} className="text-primary-200" />
            <Text className="font-ifood-regular text-primary-100">
              {Strings.profile.editProfile}
            </Text>
          </Button>

          {/* Divider */}
          <View className="w-full h-px bg-gray-200 my-2" />

          <Button
            size="md"
            variant={'linked'}
            onPress={() =>
              router.replace({
                pathname: '/interpreters/[id]/to-schedule',
                params: { id: profile.id },
              })
            }
            className="w-[330px] bg-transparent data-[active=true]:bg-primary-gray-press-light items-center justify-start p-2"
          >
            <ButtonIcon as={HelpCircle} className="text-primary-200" />
            <Text className="font-ifood-regular text-primary-100">
              {Strings.profile.help}
            </Text>
          </Button>

          {/* Divider */}
          <View className="w-full h-px bg-gray-200 my-2" />

          <Button
            size="md"
            onPress={logout}
            variant={'linked'}
            className="w-[330px] bg-transparent data-[active=true]:bg-primary-gray-press-light items-center justify-start p-2"
          >
            <ButtonIcon as={LogOut} className="text-primary-200" />
            <Text className="font-ifood-regular text-primary-100">
              {Strings.profile.logout}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
