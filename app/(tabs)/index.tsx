import api from '@/src/api';
import DarkBlueLogo from '@/src/assets/svgs/DarkBlueLogo';
import { Card } from '@/src/components/ui/card';
import type { CardProps } from '@/src/components/ui/card';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import type { UserResponse, AppointmentFilterResponse } from '@/src/types/api';
import { UserType } from '@/src/types/common';
import { getUserDisplayName, transformAppointmentToCard } from '@/src/utils/helpers';
import { CalendarDays } from 'lucide-react-native';
import { useMemo, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';

export default function HomeScreen() {
  const colors = useColors();
  const { user } = useAuth();
  const [appointmentCards, setAppointmentCards] = useState<CardProps[]>([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  let route = '';
  if (user?.type) {
    switch (user.type) {
      case UserType.PERSON:
        route = ApiRoutes.person.profile(user.id);
        break;
      case UserType.INTERPRETER:
        route = ApiRoutes.interpreters.profile(user.id);
        break;
      case UserType.ENTERPRISE:
        route = ApiRoutes.enterprises.profile(user.id);
        break;
    }
  }

  const { data, loading } = useApiGet<UserResponse>(route);

  const appointmentsRoute = useMemo(() => {
    if (!user?.id) return '';
    
    const baseUrl = ApiRoutes.appointments.filter;
    const params = new URLSearchParams();
    
    if (user.type === UserType.INTERPRETER) {
      params.append('interpreterId', user.id);
    } else {
      params.append('userId', user.id);
    }
    
    const currentDateTime = new Date().toISOString().slice(0, 19);
    params.append('fromDateTime', currentDateTime);

    return `${baseUrl}?${params.toString()}`;
  }, [user?.id, user?.type]);

  const { data: appointmentsData, loading: appointmentsLoading } = useApiGet<AppointmentFilterResponse>(appointmentsRoute);

  useEffect(() => {
    if (!appointmentsData?.data?.length || !user?.type) {
      setAppointmentCards([]);
      return;
    }

    const fetchAppointmentDetails = async () => {
      setFetchingDetails(true);
      
      try {
        const detailedCardsWithNulls = await Promise.all(
          appointmentsData.data.map(async (appointment): Promise<CardProps | null> => {
            const baseCard = transformAppointmentToCard(appointment);
            
            try {
              if (user.type === UserType.INTERPRETER) {
                let clientData: UserResponse['data'] | null = null;
                
                try {
                  const personResponse = await api.get<UserResponse>(
                    ApiRoutes.person.profile(appointment.user_id)
                  );
                  clientData = personResponse.data.data;
                } catch {
                  try {
                    const enterpriseResponse = await api.get<UserResponse>(
                      ApiRoutes.enterprises.profile(appointment.user_id)
                    );
                    clientData = enterpriseResponse.data.data;
                  } catch {}
                }

                if (clientData) {
                  let identificationDisplay = '';
                  if ((clientData as any).type === UserType.ENTERPRISE) {
                    const cnpj = (clientData as any).cnpj;
                    identificationDisplay = cnpj || 'CNPJ não disponível';
                  } else {
                    const cpf = (clientData as any).cpf;
                    identificationDisplay = cpf || 'CPF não disponível';
                  }

                  const clientPicture = (clientData as any).picture;

                  return {
                    ...baseCard,
                    fullName: getUserDisplayName(clientData),
                    specialty: identificationDisplay,
                    rating: 0,
                    photoUrl: clientPicture && clientPicture.trim() !== '' ? clientPicture : baseCard.photoUrl,
                    showRating: false,
                  };
                } else {
                  return null;
                }
              } else {
                const interpreterResponse = await api.get<UserResponse>(
                  ApiRoutes.interpreters.profile(appointment.interpreter_id)
                );
                
                const interpreterData = interpreterResponse.data.data as any;
                const interpreterPicture = interpreterData.picture;

                const specialty = interpreterData.specialties?.[0];
                let specialtyDisplay = 'Intérprete de Libras';
                if (specialty) {
                  if (typeof specialty === 'string') {
                    specialtyDisplay = specialty;
                  } else if (specialty && typeof specialty === 'object' && specialty.name) {
                    specialtyDisplay = specialty.name;
                  }
                }

                return {
                  ...baseCard,
                  fullName: interpreterData.name || 'Intérprete',
                  specialty: specialtyDisplay,
                  rating: interpreterData.professional_data?.rating || 0,
                  photoUrl: interpreterPicture && interpreterPicture.trim() !== '' ? interpreterPicture : null,
                  showRating: true,
                };
              }
            } catch (error) {
              console.warn('Failed to fetch user/interpreter details:', error);
              return null;
            }
          })
        );

        const validCards = detailedCardsWithNulls.filter((card): card is CardProps => card !== null);
        setAppointmentCards(validCards);
      } catch (error) {
        console.error('Error fetching appointment details:', error);
        setAppointmentCards([]);
      } finally {
        setFetchingDetails(false);
      }
    };

    fetchAppointmentDetails();
  }, [appointmentsData?.data, user?.type]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color={colors.primaryBlue} size="large" />
      </View>
    );
  }

  const displayName = data?.data ? getUserDisplayName(data.data) : '';
  
  const welcomeMessage = displayName 
    ? Strings.home.welcome.replace('{User}', displayName)
    : Strings.home.welcome;

  return (
    <ScrollView 
      className="flex-1"
      accessibilityLabel={Strings.home.tabBar}
      showsVerticalScrollIndicator={false}
    >
      <View className="pt-16">
        <View className='flex-row items-center gap-5 pl-6'>
          <DarkBlueLogo width={85} height={50}/>
          <Text 
            className="text-center text-3xl font-ifood-medium"
            style={{ color: colors.text }}
          >
            {welcomeMessage}
          </Text>
        </View>
        {/* Search Bar component */}
        <View 
          className="h-px w-full mt-4"
          style={{ backgroundColor: colors.fieldGray }}
        />
        <View className="flex-row items-center gap-3 pl-6 pt-4">
          <CalendarDays 
            color={colors.primaryBlue}
          />
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
        
        {appointmentsLoading || fetchingDetails ? (
          <View className="flex-1 justify-center items-center py-8">
            <ActivityIndicator color={colors.primaryBlue} size="large" />
            <Text 
              className="mt-2 text-center font-ifood-regular"
              style={{ color: colors.detailsGray }}
            >
              {Strings.common.Loading}
            </Text>
          </View>
        ) : appointmentCards.length > 0 ? (
          appointmentCards.map((appointment, index) => (
            <View key={index}>
              <Card
                photoUrl={appointment.photoUrl}
                fullName={appointment.fullName}
                specialty={appointment.specialty}
                rating={appointment.rating}
                showRating={appointment.showRating}
                pending={appointment.pending}
                pendingLabel="Pendente"
                date={appointment.date}
                location={appointment.location}
              />
              <View 
                className="h-2 w-full mt-4"
                style={{ backgroundColor: colors.fieldGray }}
              />
            </View>
          ))
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
    </ScrollView>
  );
}
