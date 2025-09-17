import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useColors } from '../hooks/useColors';

/**
  Componente Header para telas com título e botão de voltar opcional.
  @param title Título da página onde se encontra o header
  @param showBackButton Booleano para mostrar ou esconder o botão de voltar
  @param handleBack Função a ser chamada ao pressionar o botão de voltar

  @example
  <Header 
    title="Página Inicial"
    showBackButton={true}
    handleBack={() => router.replace('(tabs)')}
 */

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  handleBack?: () => void;
}

export default function Header({
  title,
  showBackButton,
  handleBack,
}: HeaderProps) {
  const colorScheme = useColors();

  return (
    <View className="w-full flex-row justify-center items-denter px-4">
      <View className="w-8 items-start justify-center">
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <ChevronLeft size={24} color={colorScheme.primaryOrange} />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-md font-ifood-bold text-text-light dark:text-text-dark">
          {title.toUpperCase()}
        </Text>
      </View>

      {/** Spacing to alignment */}
      <View className="w-8" />
    </View>
  );
}
