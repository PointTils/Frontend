import Header from '@/src/components/Header';
import { Card } from '@/src/components/ui/card';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useAuth } from '@/src/contexts/AuthProvider';
import type { Appointment } from '@/src/types/api';
import { UserType, AppointmentStatus, Modality } from '@/src/types/api';
import {
  formatAppointmentLocation,
  formatCpfOrCnpj,
  formatDate,
  formatTime,
} from '@/src/utils/masks';
import { router } from 'expo-router';
import React, { Fragment } from 'react';
import { ScrollView } from 'react-native';

export default function PendingRequestsScreen() {
  const { user } = useAuth();

  // Dados mockados para demonstração
  const mockRequests: Appointment[] = [
    {
      id: '1',
      date: '2024-01-15',
      start_time: '14:00',
      end_time: '15:00',
      status: AppointmentStatus.PENDING,
      modality: Modality.PERSONALLY,
      description: 'Consulta médica com necessidade de intérprete de Libras',
      interpreter_id: 'interpreter-1',
      user_id: 'user-1',
      uf: 'RS',
      city: 'Porto Alegre',
      neighborhood: 'Partenon',
      street: 'Av. Ipiranga',
      street_number: 6681,
      address_details: 'Prédio A, Sala 101',
      contact_data: {
        id: '1',
        name: 'Maria Silva Santos',
        document: '123.456.789-00',
        picture:
          'https://img.freepik.com/fotos-premium/beleza-e-feminilidade-linda-mulher-loira-com-longos-cabelos-loiros-sorrindo-retrato-natural_360074-56804.jpg',
        specialties: [
          { id: '1', name: 'Libras' },
          { id: '2', name: 'Audiodescrição' },
        ],
      },
    },
    {
      id: '2',
      date: '2024-01-16',
      start_time: '10:30',
      end_time: '11:30',
      status: AppointmentStatus.PENDING,
      modality: Modality.PERSONALLY,
      description: 'Reunião de trabalho com participante surdo',
      interpreter_id: 'interpreter-2',
      user_id: 'user-2',
      uf: 'RS',
      city: 'Porto Alegre',
      neighborhood: 'Centro',
      street: 'Rua da República',
      street_number: 123,
      address_details: 'Sala de reuniões',
      contact_data: {
        id: '2',
        name: 'João Pedro Oliveira',
        document: '987.654.321-00',
        picture:
          'https://img.freepik.com/fotos-premium/homem-jovem-sorrindo-retrato-natural_360074-56805.jpg',
        specialties: [{ id: '3', name: 'Libras' }],
      },
    },
  ];

  const requests = mockRequests;

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
                  fullName={req.contact_data?.name || ''}
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
                      params: { id: req.id || '' },
                    })
                  }
                />
                <View className="w-full h-px bg-gray-200" />
              </Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
