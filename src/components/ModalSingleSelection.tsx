import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import type { OptionItem } from '@/src/types/ui';
import { ChevronDownIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';

interface ModalSingleSelectionProps {
  items: OptionItem[];
  selectedValue: string;
  onSelectionChange: (value: string) => void;
  placeholderText?: string;
  hasError?: boolean;
  scrollableHeight?: number;
}

export default function ModalSingleSelection({
  items,
  selectedValue,
  onSelectionChange,
  placeholderText = Strings.register.select,
  hasError = false,
  scrollableHeight = 280,
}: ModalSingleSelectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useColors();
  const currentSelection = items.find((item) => item.value === selectedValue);

  const handleItemSelection = (itemValue: string) => {
    onSelectionChange(itemValue);
    setModalVisible(false);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const triggerStyle = {
    borderColor: hasError ? colors.mandatory : colors.fieldGray,
    backgroundColor: colors.background,
    borderWidth: 1,
  };

  const getItemBackgroundColor = (itemValue: string) => {
    return selectedValue === itemValue
      ? `${colors.primaryBlue}10`
      : colors.background;
  };

  const getItemTextColor = (itemValue: string) => {
    return selectedValue === itemValue ? colors.primaryBlue : colors.text;
  };

  const getItemFontWeight = (itemValue: string) => {
    return selectedValue === itemValue ? '600' : '400';
  };

  const getBorderBottomStyle = (idx: number) => ({
    borderBottomWidth: idx < items.length - 1 ? 1 : 0,
    borderBottomColor: `${colors.disabled}20`,
  });

  const cancelButtonStyle = {
    borderTopColor: `${colors.disabled}20`,
    backgroundColor: colors.background,
  };

  return (
    <>
      <TouchableOpacity
        onPress={openModal}
        className="flex-row items-center justify-between p-2 rounded border"
        style={triggerStyle}
      >
        <Text
          className="font-ifood-regular"
          style={{ color: currentSelection ? colors.text : colors.detailsGray }}
        >
          {currentSelection ? currentSelection.label : placeholderText}
        </Text>
        <ChevronDownIcon size={20} color={colors.detailsGray} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: colors.modalOverlay }}
          onPress={closeModal}
        >
          <View
            className="mx-4 mb-8 rounded-xl overflow-hidden"
            style={{ backgroundColor: colors.background }}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              bounces={false}
              style={{ maxHeight: scrollableHeight }}
            >
              {items.map((item, idx) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleItemSelection(item.value)}
                  className="p-4"
                  activeOpacity={1}
                  style={{
                    backgroundColor: getItemBackgroundColor(item.value),
                    ...getBorderBottomStyle(idx),
                  }}
                >
                  <Text
                    className="text-center font-ifood-regular"
                    style={{
                      color: getItemTextColor(item.value),
                      fontWeight: getItemFontWeight(item.value),
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={closeModal}
              className="p-4 border-t"
              style={cancelButtonStyle}
            >
              <Text
                className="text-center font-ifood-medium"
                style={{ color: colors.disabled }}
              >
                {Strings.common.cancel}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
