import { Avatar, AvatarImage } from '@/src/components/ui/avatar';
import ChipsSection from '@/src/components/ui/chipSection';
import { InfoRow } from '@/src/components/ui/infoRow';
import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { formatDate, handleCnpjChange, handleCpfChange, handlePhoneChange } from '@/src/components/utils/mask';
import { useColors } from '@/src/hooks/useColors';
import type { ProfileModel } from '@/src/types/api';
import { BadgeHelp, ChevronRight, SquarePen } from 'lucide-react-native';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';



export default function ProfileScreen() {
  const colors = useColors();


  const demoData: ProfileModel = {
    // PF exemplo
    name: 'Nome Sobrenome',
    cpf: '12345678901',
    birthDate: '2000-03-14',
    gender: 'Masculino',
    phone: '51987654321',
    email: 'exemplo@dominio.com',
    preferences: ['Atendimento Online', 'Eventos', 'Emergência'],

    // Para PJ, comente acima e use:
    // corporateName: 'Razão Social Ltda',
    // cnpj: '11222333000181',
    // phone: '5133345566',
    // email: 'contato@empresa.com',
    // preferences: ['Treinamentos', 'Corporativo', 'Palestras'],

    // Para Intérprete, comente e use:
    // name: 'Ana Paula',
    // cpf: '98765432100',
    // birthDate: '1995-09-20',
    // gender: 'Feminino',
    // phone: '51999998888',
    // email: 'ana.paula@dominio.com',
    // specialties: ['Acadêmico', 'Saúde', 'Eventos'],
    // cnpj: '11222333000181',
  };

  const model: ProfileModel = demoData;
  const title = model.corporateName ?? model.name ?? 'Perfil';
  const hasSpecialties = Array.isArray(model.specialties) && model.specialties.length > 0;
  const hasPreferences = Array.isArray(model.preferences) && model.preferences.length > 0;
  const chipsLabel = hasSpecialties ? 'Especialidades' : hasPreferences ? 'Preferências' : undefined;
  const chipsItems = hasSpecialties ? model.specialties : hasPreferences ? model.preferences : undefined;

  return (
    <ScrollView className="flex-1 pt-[124px]" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 justify-center items-center p-6">
        <Avatar size="lg" borderRadius="full" className="h-32 w-32">
          <AvatarImage
            source={{
              uri: "https://gravatar.com/avatar/ff18d48bfe44336236f01212d96c67f0?s=400&d=mp&r=x",
            }}
          />
        </Avatar>
        {/* Título */}
        <Text className="w-full text-xl font-ifood-regular text-center mb-4 text-primary-800">
          {title}
        </Text>
        <View className="w-full h-px bg-gray-200 mb-4" />

        <InfoRow label="CPF" value={model.cpf ? handleCpfChange(model.cpf) : undefined} />
        <InfoRow label="Data de nascimento" value={formatDate(model.birthDate)} />
        <InfoRow label="Gênero" value={model.gender} />
        <InfoRow label="Telefone" value={model.phone ? handlePhoneChange(model.phone) : undefined} />
        <InfoRow label="E-mail" value={model.email} />
        <InfoRow label="CNPJ" value={model.cnpj ? handleCnpjChange(model.cnpj) : undefined} />
        {chipsLabel && (
          <>
            <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
              {chipsLabel}
            </Text>
            <ChipsSection items={chipsItems} />
          </>
        )}

        <View className="w-full mt-2">
          <TouchableOpacity className="flex-1" onPress={() => {}}>
            <View className="w-full flex-row items-center mb-3">
              <SquarePen width={20} height={20} stroke={colors.disabled} />
              <Text className="pl-2 text-base font-ifood-regular text-primary-50 flex-1">
                Editar perfil
              </Text>
              <ChevronRight width={16} height={16} stroke={colors.disabled} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1" onPress={() => {}}>
            <View className="w-full flex-row items-center">
              <BadgeHelp width={20} height={20} stroke={colors.disabled} />
              <Text className="pl-2 text-base font-ifood-regular text-primary-50 flex-1">
                Ajuda
              </Text>
              <ChevronRight width={16} height={16} stroke={colors.disabled} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
