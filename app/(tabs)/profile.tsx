import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import { BadgeQuestionMark, ChevronDown, ChevronRight, SquarePen } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';

/** Tipos de perfil (discriminated union) */
type Gender = 'Masculino' | 'Feminino' | 'Outro' | 'Prefiro não informar';

type UserCommon = {
  userType: 'comum';
  name: string;
  cpf?: string;
  birthDate?: string | Date | null;
  gender?: Gender;
  phone?: string;
  email?: string;
  preferences?: string[];
};

type UserCompany = {
  userType: 'empresa';
  corporateName: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  preferences?: string[];
};

type UserInterpreter = {
  userType: 'interprete';
  name: string;
  cpf?: string;
  birthDate?: string | Date | null;
  gender?: Gender;
  phone?: string;
  email?: string;
  professionalArea?: string;
  cnpj?: string;
  specialties?: string[];
  preferences?: string[];
};

export type ProfileData = UserCommon | UserCompany | UserInterpreter;

export type ProfileProps = {
  /** Em telas do Expo Router isso normalmente virá de store/params — aqui é opcional com fallback */
  data?: ProfileData;
  avatar?: number | { uri: string };
  onEditPress?: () => void;
  onHelpPress?: () => void;
};

/** Utils */
function onlyDigits(s?: string) {
  return (s ?? '').replace(/\D/g, '');
}
function formatCPF(cpf?: string) {
  const d = onlyDigits(cpf).slice(0, 11);
  if (d.length !== 11) return 'XXX.XXX.XXX-XX';
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
function formatCNPJ(cnpj?: string) {
  const d = onlyDigits(cnpj).slice(0, 14);
  if (d.length !== 14) return 'XX.XXX.XXX/0001-XX';
  return d.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
function formatPhone(phone?: string) {
  const d = onlyDigits(phone).slice(0, 11);
  if (d.length === 10) return d.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  if (d.length === 11) return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  return '(00) 00000-0000';
}
function formatDate(date?: string | Date | null) {
  if (!date) return 'dd/MM/yyyy';
  const dt = typeof date === 'string' ? new Date(date) : date;
  if (!(dt instanceof Date) || Number.isNaN(dt.getTime())) return 'dd/MM/yyyy';
  const day = String(dt.getDate()).padStart(2, '0');
  const mon = String(dt.getMonth() + 1).padStart(2, '0');
  const year = dt.getFullYear();
  return `${day}/${mon}/${year}`;
}

/** Linha "label → valor" */
function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <>
      <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
        {label}
      </Text>
      <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
        {value ?? '—'}
      </Text>
    </>
  );
}

/** Chip azul (retângulo, não clicável) */
function Chip({ text }: { text: string }) {
  return (
    <View className="px-4 py-2 rounded-md bg-sky-500 mr-2 mb-2">
      <Text className="text-white font-ifood-regular">{text}</Text>
    </View>
  );
}

function ChipsSection({ items }: { items?: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <View className="w-full pl-2 pr-2 mt-2 mb-4 flex-row flex-wrap">
      {items.map((text, idx) => (
        <Chip key={`${text}-${idx}`} text={text} />
      ))}
    </View>
  );
}


export default function ProfileScreen({
  data,
  avatar,
  onEditPress,
  onHelpPress,
}: ProfileProps) {
  const colors = useColors();
  const avatarFallback = require('@/src/assets/images/Avatar.png');

  // --- Fallback para desenvolvimento (evita crash quando não houver props/params)

  // CASO SEJA UM USUÁRIO SURDO

  const demoData: ProfileData = {
    userType: 'comum',
    name: 'Nome Sobrenome',
    cpf: '12345678901',
    birthDate: '2000-03-14',
    gender: 'Masculino',
    phone: '51987654321',
    email: 'exemplo@dominio.com',
    preferences: ['Atendimento Online', 'Eventos', 'Emergência'],
  };


  // CASO SEJA UM USUÁRIO EMPRESA 

  // const demoData: ProfileData = {
  //   userType: 'empresa',
  //   corporateName: 'Razão Social Ltda',
  //   cnpj: '11222333000181',
  //   phone: '5133345566',
  //   email: 'contato@empresa.com',
  //   preferences: ['Treinamentos', 'Corporativo', 'Palestras'],
  // };


  // CASO SEJA UM USUÁRIO INTERPRETE

  // const demoData: ProfileData = {
  //   userType: 'interprete',
  //   name: 'Ana Paula',
  //   cpf: '98765432100',
  //   birthDate: '1995-09-20',
  //   gender: 'Feminino',
  //   phone: '51999998888',
  //   email: 'ana.paula@dominio.com',
  //   professionalArea: 'Intérprete de Libras',
  //   cnpj: '77889966000110',
  //   specialties: ['Acadêmico', 'Saúde', 'Eventos'],
  // };





  const model: ProfileData = data ?? demoData;

  const [showMore, setShowMore] = useState(false);
  const handleToggleMore = () => setShowMore(v => !v);

  const title =
    model.userType === 'empresa'
      ? (model as UserCompany).corporateName || 'Razão Social'
      : (model as UserCommon | UserInterpreter).name || 'Nome e Sobrenome';

  return (
    <ScrollView className="flex-1 pt-[124px]" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 justify-center items-center p-6">
        {/* Avatar */}
        <Image
          source={avatar ?? avatarFallback}
          className="w-128 h-128 rounded-full mb-6"
          resizeMode="cover"
        />

        {/* Título */}
        <Text className="w-full text-xl font-ifood-regular text-center mb-4 text-primary-800">
          {title}
        </Text>
        <View className="w-full h-px bg-gray-200 mb-4" />

        {/* Seções por tipo */}
        {model.userType === 'comum' && (
          <>
            <InfoRow label="CPF" value={formatCPF((model as UserCommon).cpf)} />
            <InfoRow label="Data de nascimento" value={formatDate((model as UserCommon).birthDate)} />
            <InfoRow label="Gênero" value={(model as UserCommon).gender} />
            <InfoRow label="Telefone" value={formatPhone((model as UserCommon).phone)} />
            <InfoRow label="E-mail" value={(model as UserCommon).email} />
          </>
        )}

        {model.userType === 'empresa' && (
          <>
            <InfoRow label="CNPJ" value={formatCNPJ((model as UserCompany).cnpj)} />
            <InfoRow label="Telefone" value={formatPhone((model as UserCompany).phone)} />
            <InfoRow label="E-mail" value={(model as UserCompany).email} />
          </>
        )}

        {model.userType === 'interprete' && (
          <>
            <InfoRow label="CPF" value={formatCPF((model as UserInterpreter).cpf)} />
            <InfoRow label="Data de nascimento" value={formatDate((model as UserInterpreter).birthDate)} />
            <InfoRow label="Gênero" value={(model as UserInterpreter).gender} />
            <InfoRow label="Telefone" value={formatPhone((model as UserInterpreter).phone)} />
            <InfoRow label="E-mail" value={(model as UserInterpreter).email} />

            {/* Área do profissional */}
            <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
              Área do profissional
            </Text>
            <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
              {(model as UserInterpreter).professionalArea ?? '—'}
            </Text>

            {/* CNPJ (se houver) */}
            <InfoRow label="CNPJ" value={formatCNPJ((model as UserInterpreter).cnpj)} />

          </>
        )}

        {/* Label dinâmico (Preferências | Especialidades) + Chips */}
        {(() => {
          const isInterpreter = model.userType === 'interprete';
          const label = isInterpreter ? 'Especialidades' : 'Preferências';
          const items =
            isInterpreter
              ? (model as UserInterpreter).specialties
              : (model as UserCommon | UserCompany).preferences;

          return (
            <>
              <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
                {label}
              </Text>
              <ChipsSection items={items} />
            </>
          );
        })()}


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

        {/* Área colapsável */}
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
