import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { useColors } from '@/src/hooks/useColors';
import { BadgeQuestionMark, ChevronDown, ChevronRight, SquarePen } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const colors = useColors();

  const avatarImageUrl = require('@/src/assets/images/Avatar.png');


  return (
    <ScrollView className="flex-1 pt-[124px]" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 justify-center items-center p-6 ">
        <Image
          source={avatarImageUrl}
          className="w-128 h-128 rounded-full mb-6"
          resizeMode="cover"
        />
        <Text className="w-full text-xl font-ifood-regular text-center mb-4 text-primary-800">
          Nome e Sobrenome
        </Text>
        <View className="w-full h-px bg-gray-200 mb-4" />
        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
          CPF
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
          XXX.XXX.XXX-XX
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800">
          Data de Nascimento
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800">
          dd/mm/aaaa
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800" >
          Genero
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800 " >
          Masculino
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800 " >
          Telefone
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800" >
          (00) 00000-0000
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800" >
          Email
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-regular text-left mb-4 text-primary-800" >
          exemplo@.com
        </Text>
        <Text className="w-full pl-2 text-base font-ifood-medium text-left mb-1 text-primary-800" >
          Preferências
        </Text>

        <View className="flex-row justify-between space-x-2 mt-4 mb-4" style={{ gap: 8 }}>
          <TouchableOpacity
            className="flex-1 bg-sky-500 px-6 py-3 rounded-md"
            onPress={() => {
              console.log('botao a');
            }}
          >
            <Text className="text-center font-ifood-bold text-white">
              opção a
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-sky-500 px-6 py-3 rounded-md"
            onPress={() => {
              console.log('botao b');
            }}
          >
            <Text className="text-center font-ifood-bold text-white">
              opção b
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 bg-sky-500 px-6 py-3 rounded-md"
            onPress={() => {
              console.log('botao c');
            }}
          >
            <Text className="text-center font-ifood-bold text-white">
              opção c
            </Text>
          </TouchableOpacity>

        </View>
        <Text className="w-full pl-2 text-base font-ifood-regular text-center text-primary-50" >
          Mostrar mais
        </Text>
        <ChevronDown className="mb-2" width={20} height={20} stroke={colors.disabled} />
        <View className="w-full flex-row justify-left items-center mb-2" >
          <SquarePen width={20} height={20} stroke={colors.disabled} />
          <Text className="pl-2 text-base font-ifood-regular text-center mb-1 text-primary-50" >
            Editar perfil
          </Text>
          <ChevronRight width={16} height={16} stroke={colors.disabled}/>
        </View>
        <View className="w-full flex-row justify-left items-center" >
          <BadgeQuestionMark width={20} height={20} stroke={colors.disabled}/>
          <Text className="pl-2 text-base font-ifood-regular text-center mb-1 text-primary-50" >
            Ajuda 
          </Text>
          <ChevronRight width={16} height={16} stroke={colors.disabled}/>
        </View>
      </View>
    </ScrollView>
  );
}
