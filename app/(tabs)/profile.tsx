import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import { BadgeQuestionMark, ChevronDown, ChevronRight, SquarePen } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';

type Gender = 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar';

export type ProfileProps = {
  name?: string;
  cpf?: string;
  birthDate?: string | Date | null;
  gender?: Gender;
  phone?: string;
  email?: string;
  avatar?: number | { uri: string };
  onEditPress?: () => void;
  onHelpPress?: () => void;
};

function onlyDigits(s?: string) {
  return (s ?? '').replace(/\D/g, '');
}

function formatCPF(cpf?: string) {
  const d = onlyDigits(cpf).slice(0, 11);
  if (d.length !== 11) return 'XXX.XXX.XXX-XX';
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(phone?: string) {
  const d = onlyDigits(phone).slice(0, 11);
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return '(00) 00000-0000';
}

function formatDate(date?: string | Date | null) {
  if (!date) return 'dd/mm/aaaa';
  const dt = typeof date === 'string' ? new Date(date) : date;
  if (!(dt instanceof Date) || Number.isNaN(dt.getTime())) return 'dd/mm/aaaa';
  const day = String(dt.getDate()).padStart(2, '0');
  const mon = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  return `${day}/${mon}/${year}`;
}

export default function ProfileScreen({
  name = 'Nome e Sobrenome',
  cpf,
  birthDate,
  gender = 'Masculino',
  phone,
  email = 'exemplo@dominio.com',
  avatar,
  onEditPress,
  onHelpPress,
}: ProfileProps) {
  const colors = useColors();
  const avatarFallback = require('@/src/assets/images/Avatar.png');

  const [showMore, setShowMore] = useState(false);
  const handleToggleMore = () => setShowMore(v => !v);

  return (
    <ScrollView className="flex-1 pt-[124px]" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={avatar ?? avatarFallback}
          className="w-128 h-128 rounded-full mb-6"
          resizeMode="cover"
        />

        <Text className="w-full text-xl font-ifood-regular text-center mb-4 text-primary-800">
          {name}
        </Text>

        <View className="w-full h-px bg-gray-200 mb-4" />

        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">CPF</Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
          {formatCPF(cpf)}
        </Text>

        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">Data de Nascimento</Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
          {formatDate(birthDate)}
        </Text>

        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">Gênero</Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
          {gender}
        </Text>

        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">Telefone</Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
          {formatPhone(phone)}
        </Text>

        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">Email</Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
          {email}
        </Text>

        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
          Preferências
        </Text>

        {/* Botão "Mostrar mais" */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={showMore ? 'Ocultar opções' : 'Mostrar mais opções'}
          onPress={handleToggleMore}
          className="w-full flex-row items-center justify-center py-2 mt-2"
        >
          <Text className="text-base font-ifood-regular text-primary-50 mr-1">
            {showMore ? 'Mostrar menos' : 'Mostrar mais'}
          </Text>
          <ChevronDown
            width={20}
            height={20}
            stroke={colors.disabled}
            style={{ transform: [{ rotate: showMore ? '180deg' : '0deg' }] }}
          />
        </TouchableOpacity>

        {showMore && (
          <View className="w-full mt-2">
            <TouchableOpacity className="flex-1" onPress={onEditPress}>
              <View className="w-full flex-row items-center mb-3">
                <SquarePen width={20} height={20} stroke={colors.disabled} />
                <Text className="pl-2 text-base font-ifood-regular text-primary-50 flex-1">
                  Editar perfil
                </Text>
                <ChevronRight width={16} height={16} stroke={colors.disabled} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1" onPress={onHelpPress}>
              <View className="w-full flex-row items-center">
                <BadgeQuestionMark width={20} height={20} stroke={colors.disabled} />
                <Text className="pl-2 text-base font-ifood-regular text-primary-50 flex-1">
                  Ajuda
                </Text>
                <ChevronRight width={16} height={16} stroke={colors.disabled} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
