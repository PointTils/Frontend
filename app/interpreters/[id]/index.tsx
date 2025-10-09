import Header from '@/src/components/Header';
import InterpreterCalendar from '@/src/components/InterpreterCalendar';
import InterpreterReviewCard from '@/src/components/InterpreterReviewCard';
import { StarRating } from '@/src/components/Rating';
import { Avatar } from '@/src/components/ui/avatar';
import { AvatarImage } from '@/src/components/ui/avatar/avatar-image';
import { Button, ButtonIcon } from '@/src/components/ui/button';
import { InfoRow } from '@/src/components/ui/infoRow';
import { SCHEDULE_ENABLED } from '@/src/constants/Config';
import { Strings } from '@/src/constants/Strings';
import { useApiGet } from '@/src/hooks/useApi';
import { useColors } from '@/src/hooks/useColors';
import { Modality } from '@/src/types/api';
import type {
  ScheduleResponse,
  ReviewResponse,
  InterpreterResponseData,
  UserResponse,
} from '@/src/types/api';
import {
  mapImageRights,
  mapModality,
  formatValueRange,
} from '@/src/utils/masks';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router/build/hooks';
import {
  BriefcaseBusinessIcon,
  StarIcon,
  PlusIcon,
  Clock,
  FileTextIcon,
  PenSquareIcon,
  InfoIcon,
  MapPinIcon,
  DollarSign,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

type TimeSelection = { date: string; time: string } | null;

export default function InterpreterDetails() {
  const params = useLocalSearchParams<{ id: string }>();
  const interpreterId = params.id;

  const [section, setSection] = useState<'Avaliações' | 'Dados'>(
    Strings.search.details,
  );
  const [selectTime, setSelectedTime] = useState<TimeSelection>(null);
  const colors = useColors();
  const router = useRouter();
  const now = new Date();
  const then = new Date(now);
  then.setDate(now.getDate() + 30);

  // Interpreter request
  const {
    data: data,
    loading: loadingInterpreter,
    error: errorInterpreter,
  } = useApiGet<UserResponse>(`/interpreters/${interpreterId}`);

  // Schedule request
  const {
    data: schedules,
    loading: loadingSchedule,
    error: errorSchedule,
  } = useApiGet<ScheduleResponse>('/schedules/available', {
    interpreterId: interpreterId,
    dateFrom: now.toISOString().split('T')[0],
    dateTo: then.toISOString().split('T')[0],
  });

  if (loadingInterpreter || loadingSchedule) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="small" color={colors.primaryBlue} />
        <Text className="mt-2 font-ifood-regular text-primary-blue-light">
          {Strings.common.loading}
        </Text>
      </View>
    );
  }

  if (errorInterpreter || errorSchedule || !data || !data.success) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">
          {errorInterpreter ?? 'Intérprete não encontrado'}
        </Text>
      </View>
    );
  }

  const interpreter = data.data as InterpreterResponseData;

  const mockReviewResponse: ReviewResponse = {
    success: true,
    message: 'Avaliações carregadas com sucesso.',
    data: [
      {
        id: 1,
        stars: 5,
        description:
          'Excelente produto! Superou todas as minhas expectativas. A qualidade do material é incrível.',
        date: '2025-10-04',
        user: {
          id: 'u1',
          name: 'João Silvaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 2,
        stars: 4.5,
        description:
          'Muito bom, cumpre o que promete. A entrega demorou um pouco mais que o esperado, mas o produto vale a pena.',
        date: '2025-10-02',
        user: {
          id: 'u2',
          name: 'Maria Oliveira',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 3,
        stars: 3,
        description:
          'É um produto razoável. Pelo preço, eu esperava um pouco mais de qualidade nos acabamentos.',
        date: '2025-09-30',
        user: {
          id: 'u3',
          name: 'Pedro Santos',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 4,
        stars: 5,
        description:
          'Atendimento impecável e o produto chegou antes do prazo. Recomendo fortemente a loja!',
        date: '2025-09-28',
        user: {
          id: 'u4',
          name: 'Carla Mendes',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 5,
        stars: 1,
        description:
          'Péssima experiência. O produto veio com defeito e o processo de devolução foi muito complicado.',
        date: '2025-09-25',
        user: {
          id: 'u5',
          name: 'Rafael Lima',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 6,
        stars: 4,
        description:
          'Gostei bastante, ótima relação custo-benefício. Ideal para o uso diário.',
        date: '2025-09-22',
        user: {
          id: 'u6',
          name: 'Ana Paula',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 7,
        stars: 2,
        description:
          'A descrição não condiz com a realidade. O produto é muito menor do que parece nas fotos.',
        date: '2025-09-20',
        user: {
          id: 'u7',
          name: 'Lucas Ferreira',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 8,
        stars: 5,
        description:
          'Simplesmente perfeito! Já é a minha segunda compra e a qualidade continua excelente. Virou minha marca favorita.',
        date: '2025-09-18',
        user: {
          id: 'u8',
          name: 'Fernanda Souza',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 9,
        stars: 4,
        description:
          'Ótimo, só achei a embalagem um pouco frágil para um produto tão delicado. Felizmente, não houve danos.',
        date: '2025-09-15',
        user: {
          id: 'u9',
          name: 'Ricardo Almeida',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
      {
        id: 10,
        stars: 3,
        description:
          'Funciona, mas o manual de instruções é muito confuso. Levei um tempo para conseguir montar.',
        date: '2025-09-11',
        user: {
          id: 'u10',
          name: 'Juliana Castro',
          picture:
            'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
        },
      },
    ],
  };

  return (
    <>
      {/* Header */}
      <View className="mt-12 pb-2">
        <Header
          title={Strings.search.header}
          showBackButton={true}
          handleBack={() => router.back()}
        />
      </View>

      {/* Name and photo section */}
      <ScrollView className="px-8">
        {/* For alignment purposes */}
        <View className="w-full h-6" />

        <View className="items-center flex-row w-full justify-center gap-4">
          {/* Avatar */}
          <Avatar size="lg" borderRadius="full" className="h-28 w-28">
            <AvatarImage
              source={{
                uri:
                  interpreter.picture ||
                  'https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x',
              }}
            />
          </Avatar>

          <View className="flex-col gap-1">
            <Text
              className="font-ifood-medium text-lg text-text-light dark:text-text-dark max-w-[180px]"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {interpreter.name}
            </Text>
            <Text
              className="font-ifood-regular text-md text-text-light dark:text-text-dark max-w-[180px]"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {interpreter.specialties.length > 0
                ? interpreter.specialties.map((s) => s.name).join(', ')
                : ''}
            </Text>
            <StarRating
              rating={interpreter.professional_data.rating}
              size={18}
            />
          </View>
        </View>

        {/* Section selector */}
        <View className="flex-row w-full mt-8 mb-4">
          <TouchableOpacity
            activeOpacity={1}
            className={`basis-1/2 pb-2 items-center ${section === Strings.search.details ? 'border-b-2 border-primary-blue-light' : ''}`}
            onPress={() => setSection(Strings.search.details)}
          >
            <View className="flex-row items-center gap-2">
              <BriefcaseBusinessIcon
                color={
                  section === Strings.search.details
                    ? colors.primaryBlue
                    : colors.disabled
                }
              />
              <Text
                className={`font-ifood-medium text-md ${section === Strings.search.details ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.search.details}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            className={`basis-1/2 pb-2 items-center ${section === Strings.search.reviews ? 'border-b-2 border-primary-blue-light' : ''}`}
            onPress={() => setSection(Strings.search.reviews)}
          >
            <View className="flex-row items-center gap-2">
              <StarIcon
                color={
                  section === Strings.search.reviews
                    ? colors.primaryBlue
                    : colors.disabled
                }
              />
              <Text
                className={`font-ifood-medium text-md ${section === Strings.search.reviews ? 'text-primary-blue-light' : 'text-typography-500 dark:text-typography-500'}`}
              >
                {Strings.search.reviews}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Information section */}
        {section === Strings.search.details && (
          <>
            <InfoRow
              icon={PenSquareIcon}
              label={Strings.search.description}
              value={interpreter.professional_data.description || undefined}
            />

            <InfoRow
              icon={InfoIcon}
              label={Strings.common.fields.modality}
              value={mapModality(interpreter.professional_data.modality)}
            />

            {interpreter.professional_data.modality !== Modality.ONLINE && (
              <InfoRow
                icon={MapPinIcon}
                label={Strings.common.fields.location}
                value={interpreter.locations
                  .map((loc) => loc.neighborhood)
                  .join(', ')}
              />
            )}

            <InfoRow
              icon={FileTextIcon}
              label={Strings.common.fields.imageRights}
              value={mapImageRights(interpreter.professional_data.image_rights)}
            />

            <InfoRow
              icon={DollarSign}
              label={Strings.common.fields.valueRange}
              value={formatValueRange(
                interpreter.professional_data.min_value,
                interpreter.professional_data.max_value,
              )}
            />

            {SCHEDULE_ENABLED && (
              <View className="mt-6">
                <InfoRow
                  icon={Clock}
                  label={Strings.hours.title}
                  value={undefined}
                />

                {loadingSchedule ? (
                  <View className="h-12 items-center justify-center">
                    <ActivityIndicator
                      size="small"
                      color={colors.primaryBlue}
                    />
                  </View>
                ) : (
                  <InterpreterCalendar
                    schedules={schedules?.data ?? []}
                    selectedTime={selectTime}
                    onTimeSelect={setSelectedTime}
                  />
                )}
              </View>
            )}
          </>
        )}

        {section === Strings.search.reviews && (
          <>
            {mockReviewResponse.data.map((review) => (
              <InterpreterReviewCard
                key={review.id}
                rating={review.stars}
                reviewDate={review.date}
                userName={review.user.name}
                reviewText={review.description}
                userPhoto={review.user.picture}
              />
            ))}
          </>
        )}
      </ScrollView>

      <View className="w-full mb-8 pt-6 px-8 border-t border-typography-200 dark:border-typography-700">
        <Button
          size="md"
          onPress={() => {
            router.push({
              pathname: '/interpreters/[id]/to-schedule',
              params: { id: interpreterId },
            });
          }}
          className="data-[active=true]:bg-primary-orange-press-light"
        >
          <ButtonIcon as={PlusIcon} className="text-white" />
          <Text className="font-ifood-regular text-text-dark">
            {Strings.search.createAppointment}
          </Text>
        </Button>
      </View>
    </>
  );
}
