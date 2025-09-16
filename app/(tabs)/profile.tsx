import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import ChipsSection from '@/src/components/ui/chipSection';
import { InfoRow } from '@/src/components/ui/infoRow';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import {
  formatDate,
  handleCnpjChange,
  handlePhoneChange,
} from '@/src/components/utils/mask';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { UserType, type ProfileResponse } from '@/src/types/api';
import { mapGender } from '@/src/utils/mask';
import { clearAllStorage } from '@/src/utils/temp';
import { router } from 'expo-router';
import { Edit, HelpCircle, LogOut } from 'lucide-react-native';
import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function ProfileScreen() {
  const colors = useColors();
  const { user, logout } = useAuth();

  // Determine API route based on user type
  let route = '';
  switch (user?.type) {
    case UserType.CLIENT:
      route = '/deaf-users';
      break;
    case UserType.INTERPRETER:
      route = '/interpreters';
      break;
    case UserType.ENTERPRISE:
      route = '/enterprise-users';
      break;
  }

  // Integration with API to fetch profile data
  const { data, loading, error } = useApiGet<ProfileResponse>(
    user?.id ? `${route}/${user.id}` : '',
  );

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
      text1: Strings.profile.toast.errorGetProfileTitle,
      text2: Strings.profile.toast.errorGetProfileText,
      position: 'top',
      visibilityTime: 2500,
      autoHide: true,
      closeIconSize: 1, // To "hide" the close icon
    });
    return null;
  }

  const profile = data.data;
  console.log('Profile data:', profile);

  let chipsItems: string[] | undefined = undefined;
  if (profile.type === UserType.INTERPRETER) {
    chipsItems = profile.specialties ?? undefined;
  } else {
    chipsItems = profile.preferences ?? undefined;
  }

  async function handleLogout() {
    await clearAllStorage(logout); // Temporarily clear all storage on logout
    router.replace('/(auth)');
  }

  return (
    <View className="flex-1 justify-center items-center pt-32 px-4">
      <ScrollView
        className="w-full"
        contentContainerClassName="items-center pb-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <Avatar size="lg" borderRadius="full" className="h-32 w-32">
          <AvatarImage
            source={{
              uri: 'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
            }}
          />
        </Avatar>
        <Text className="w-full text-xl font-ifood-regular text-center mb-4 mt-2 text-primary-800">
          {profile.corporate_reason || profile.name}
        </Text>

        {/* Divider */}
        <View className="w-full h-px bg-gray-200 mb-4" />

        <View className="w-full mb-8">
          {profile.type === UserType.ENTERPRISE ? (
            <InfoRow
              label={Strings.profile.cnpj}
              value={profile.cnpj ? handleCnpjChange(profile.cnpj) : undefined}
            />
          ) : (
            <InfoRow
              label={Strings.profile.cpf}
              value={profile.cpf ?? undefined}
            />
          )}

          {profile.type !== UserType.ENTERPRISE && (
            <>
              <InfoRow
                label={Strings.profile.birthday}
                value={formatDate(profile.birthday)}
              />
              <InfoRow
                label={Strings.profile.gender}
                value={mapGender(profile.gender)}
              />
            </>
          )}

          <InfoRow
            label={Strings.profile.phone}
            value={profile.phone ? handlePhoneChange(profile.phone) : undefined}
          />

          <InfoRow label={Strings.profile.email} value={profile.email} />

          {/* Chips section */}
          {profile.type !== UserType.INTERPRETER && chipsItems && (
            <>
              <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
                {Strings.profile.preferences}
              </Text>
              <ChipsSection items={chipsItems} />
            </>
          )}

          {/* Interpreter area */}
          {profile.type === UserType.INTERPRETER && (
            <>
              <Text className="w-full text-xl font-ifood-regular text-center mb-4 text-primary-800">
                {Strings.profile.tilArea}
              </Text>

              {/* Show CNPJ if available */}
              <InfoRow
                label={Strings.profile.cnpj}
                value={
                  profile.cnpj ? handleCnpjChange(profile.cnpj) : undefined
                }
              />

              {/* Show specialties chips if available */}
              {chipsItems && (
                <>
                  <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
                    {Strings.profile.specialties}
                  </Text>
                  <ChipsSection items={chipsItems} />
                </>
              )}
            </>
          )}
        </View>

        {/* Buttons */}
        <View className="w-full">
          <Button
            size="md"
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
            onPress={handleLogout}
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
