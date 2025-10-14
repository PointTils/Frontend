import { Text } from '@/src/components/ui/text/index';
import { View } from '@/src/components/ui/view/index';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { StarIcon, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, TouchableOpacity, TextInput } from 'react-native';

import { Button } from './ui/button';

export default function FeedbackModal({
  visible,
  onClose,
  onSubmit,
  interpreterName,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (details: string) => void;
  interpreterName?: string;
}) {
  const colors = useColors();
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState(0);
  const modalContainerStyle = {
    backgroundColor: colors.background,
    borderColor: colors.fieldGray,
    borderWidth: 1,
    borderRadius: 6,
  };
  const textInputStyle = {
    borderColor: colors.fieldGray,
    backgroundColor: colors.background,
    color: colors.text,
    height: 96,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay externo responsivo */}
      <View className="flex-1 bg-black/50 items-center justify-center p-7">
        {/* Container interno do modal */}
        <View
          className="bg-white p-6 w-[324px] max-w-[90%]"
          style={modalContainerStyle}
        >
          {/* Botão de fechar */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={22} color={colors.detailsGray} />
          </TouchableOpacity>

          {/* Título */}
          <Text
            className="font-ifood-medium text-lg mb-4 text-left"
            style={{ color: colors.text }}
          >
            Queremos saber sua opinião!
          </Text>

          {/* Estrelas clicáveis */}
          <View className="mb-4 flex-row items-center justify-center">
            {Array.from({ length: 5 }).map((_, i) => {
              const isFilled = i < rating;

              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setRating(i + 1)}
                  activeOpacity={0.7}
                  className="mx-1"
                >
                  <StarIcon
                    width={28}
                    height={28}
                    stroke={colors.primaryBlue}
                    fill={isFilled ? colors.primaryBlue : 'white'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Texto com nome do intérprete */}
          <View className="mb-4 px-[2px]">
            <Text className="font-ifood-light text-base text-left text-black leading-5">
              Avalie sua experiência no atendimento realizado pelo intérprete{' '}
              <Text className="font-ifood-medium text-black">
                {interpreterName || Strings.common.fields.name || 'Fulano'}
              </Text>
            </Text>
          </View>

          {/* Campo de texto */}
          <TextInput
            className="mb-6 px-4 py-3 rounded border font-ifood-regular w-full"
            style={textInputStyle}
            placeholder="Escreva mais detalhes"
            placeholderTextColor={colors.detailsGray}
            multiline
            scrollEnabled
            textAlignVertical="top"
            value={details}
            onChangeText={setDetails}
          />

          {/* Botão */}
          <View className="items-end">
            <Button
              size="md"
              className="bg-primary-blue-light dark:bg-primary-blue-dark data-[active=true]:bg-primary-blue-press-light"
              onPress={() => onSubmit(details)}
            >
              <Text className="text-white font-ifood-medium">Avaliar</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
