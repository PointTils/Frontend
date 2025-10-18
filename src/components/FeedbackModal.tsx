import { Text } from '@/src/components/ui/text/index';
import { View } from '@/src/components/ui/view/index';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import { StarIcon, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, TouchableOpacity, TextInput } from 'react-native';

import { Button } from './ui/button';
import { ApiRoutes } from '../constants/ApiRoutes';
import { useApiPost } from '../hooks/useApi';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  appointmentId: string;
  interpreterName?: string;
}

/**
 *  A modal component for collecting user feedback with a star rating and text input.
 *
 * @param visible - Controls the visibility of the modal.
 * @param onClose - Function to call when the modal is closed.
 * @param onSubmit - Function to call with the feedback details when submitted.
 * @param interpreterName - Name of the interpreter to personalize the feedback request.
 * @param interpreterId - ID of the interpreter to associate the feedback with.
 *
 * @returns The rendered FeedbackModal component.
 *
 *  @example
 * <FeedbackModal
 *   visible={isModalVisible}
 *   onClose={handleClose}
 *   onSubmit={handleSubmit}
 *   interpreterName="John Doe"
 * />
 */
export default function FeedbackModal({
  visible = false,
  onClose,
  appointmentId,

  interpreterName,
}: FeedbackModalProps) {
  const colors = useColors();
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState(0);

  //hook para enviar a avaliação
  const { post, loading } = useApiPost<
    {
      success: boolean;
      message: string;
      data: {
        id: number;
        stars: number;
        description: string;
        appointmentId: string | number;
      };
    },
    { stars: number; description?: string }
  >(ApiRoutes.ratings.create(appointmentId));

  // Reset state when modal is opened
  useEffect(() => {
    if (visible) {
      setRating(0);
      setDetails('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('Por favor, selecione uma nota antes de enviar.');
      return;
    }

    const body = {
      stars: rating,
      description: details.trim() || undefined,
    };

    const response = await post(body);

    if (response?.success) {
      alert('Avaliação enviada com sucesso!');
      onClose();
    } else {
      alert(response?.message || 'Não foi possível enviar a avaliação.');
    }
  };

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
      {/* Overlay */}
      <View className="flex-1 bg-black/50 items-center justify-center p-6">
        {/* Content */}
        <View
          className="bg-white p-6 w-[324px] max-w-[90%]"
          style={modalContainerStyle}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 z-10"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={22} color={colors.detailsGray} />
          </TouchableOpacity>

          {/* Title */}
          <Text
            className="font-ifood-medium text-lg mb-4 text-left"
            style={{ color: colors.text }}
          >
            {Strings.feedbackModal.title}
          </Text>

          {/* Stars */}
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

          {/* Text with interpreter's name */}
          <View className="mb-4">
            <Text className="font-ifood-light text-base text-left text-black leading-5">
              {Strings.feedbackModal.subtitle}
              <Text className="font-ifood-medium text-black">
                {interpreterName || 'Fulano'}
              </Text>
            </Text>
          </View>

          {/* Text input */}
          <TextInput
            className="mb-6 px-4 py-3 rounded border font-ifood-regular w-full"
            style={textInputStyle}
            placeholder={Strings.feedbackModal.placeholder}
            placeholderTextColor={colors.detailsGray}
            multiline
            scrollEnabled
            maxLength={400}
            textAlignVertical="top"
            value={details}
            onChangeText={setDetails}
          />

          {/* Submit button */}
          <View className="items-end">
            <Button
              size="md"
              onPress={handleSubmit}
              disabled={loading}
              className={`
                ${
                  loading
                    ? 'bg-disabled'
                    : 'active:bg-onPressBlue bg-primary-blue-light dark:bg-primary-blue-dark'
                }
                 rounded-md px-6 py-3
            `}
            >
              <Text className="text-white font-ifood-regular text-base">
                {Strings.feedbackModal.submitButton}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
