import React from 'react';
import { Modal, View, Text } from 'react-native';

import { Button } from './ui/button';

/**
 * A confirmation modal displayed after interpreter registration.
 * Informs the user that the account is under review and will be
 * available after approval.
 *
 * @param visible - Controls modal visibility
 * @param onClose - Callback triggered when the user presses "Entendi"
 * @param title   - Text title displayed at the top of the modal
 * @param text    - Informative text displayed below the title
 * @param buttonTitle - Text displayed on the confirmation button
 * @param onClose - Callback triggered when the user presses "Entendi"
 *
 * @example
 * <ModalWarning
 *   visible={true}
 *   onClose={() => setVisible(false)}
 *   title={'Quase lá!'}
 *   text={
 *     'Recebemos seu cadastro como intérprete. Nossa equipe fará a validação dos dados e, após aprovação, você poderá acessar sua conta. \n\n Avisaremos por e-mail quando estiver tudo pronto.'
 *   }
 *   buttonTitle={'Entendi!'}
 * />
 */
export default function ModalWarning({
  visible,
  onClose,
  title,
  text,
  buttonTitle,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  text: string;
  buttonTitle: string;
}) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-7">
        <View className="bg-white rounded-2xl p-7 w-full w-full ">
          <Text className="font-ifood-medium mb-3 text-[18px] text-left text-primary-800">
            {title}
          </Text>

          <Text className="font-ifood-regular mb-6 text-left text-primary-300">
            {text}
          </Text>
          <View className="items-end">
            <Button
              size="md"
              className="bg-primary-blue-light dark:bg-primary-blue-dark data-[active=true]:bg-primary-blue-press-light"
            >
              <Text className="text-white" onPress={onClose}>
                {buttonTitle}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
