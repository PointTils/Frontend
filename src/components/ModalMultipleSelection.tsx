import { Text } from '@/src/components/ui/text';
import { View } from '@/src/components/ui/view';
import { Strings } from '@/src/constants/Strings';
import { useColors } from '@/src/hooks/useColors';
import type { OptionItem } from '@/src/types/ui';
import { CheckIcon, ChevronDownIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, TouchableOpacity } from 'react-native';

/**
 * A modal-based multiple selection dropdown component with custom styling and theming support.
 * Allows users to select multiple options from a list displayed in a modal overlay.
 *
 * @param items - Array of OptionItem objects with label and value
 * @param selectedValues - Array of currently selected values
 * @param onSelectionChange - Callback function called when selection changes
 * @param placeholderText - Text shown when no items are selected
 * @param hasError - Whether to show error styling (red border)
 * @param scrollableHeight - Maximum height of the scrollable modal content
 * @param maxSelections - Maximum number of items that can be selected
 * @returns A touchable trigger with modal for multiple selection
 *
 * @example
 * const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
 * const specialtyOptions = [
 *   { label: 'Medical', value: 'medical' },
 *   { label: 'Legal', value: 'legal' },
 *   { label: 'Education', value: 'education' },
 * ];
 *
 * <ModalMultipleSelection
 *   items={specialtyOptions}
 *   selectedValues={selectedSpecialties}
 *   onSelectionChange={setSelectedSpecialties}
 *   placeholderText="Select specialties"
 *   hasError={errors.specialties}
 *   maxSelections={3}
 * />
 */

interface ModalMultipleSelectionProps {
  items: OptionItem[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholderText?: string;
  hasError?: boolean;
  scrollableHeight?: number;
  maxSelections?: number;
}

export default function ModalMultipleSelection({
  items,
  selectedValues,
  onSelectionChange,
  placeholderText = Strings.common.select,
  hasError = false,
  scrollableHeight = 280,
  maxSelections,
}: ModalMultipleSelectionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const colors = useColors();

  const handleItemToggle = (itemValue: string) => {
    const isSelected = selectedValues.includes(itemValue);
    let newSelection: string[];

    if (isSelected) {
      newSelection = selectedValues.filter((value) => value !== itemValue);
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return;
      }
      newSelection = [...selectedValues, itemValue];
    }

    onSelectionChange(newSelection);
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const triggerStyle = {
    borderColor: hasError ? colors.mandatory : colors.fieldGray,
    backgroundColor: colors.background,
    borderWidth: 1,
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholderText;
    }

    if (selectedValues.length === 1) {
      const selectedItem = items.find(
        (item) => item.value === selectedValues[0],
      );
      return selectedItem?.label || '';
    }

    return `${selectedValues.length} selecionados`;
  };

  const getItemBackgroundColor = (itemValue: string) => {
    return selectedValues.includes(itemValue)
      ? `${colors.primaryBlue}15`
      : colors.background;
  };

  const getItemTextColor = (itemValue: string) => {
    return selectedValues.includes(itemValue)
      ? colors.primaryBlue
      : colors.text;
  };

  const getItemFontWeight = (itemValue: string) => {
    return selectedValues.includes(itemValue) ? '600' : '400';
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
          style={{
            color: selectedValues.length > 0 ? colors.text : colors.detailsGray,
          }}
        >
          {getDisplayText()}
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
              {items.map((item, idx) => {
                const isSelected = selectedValues.includes(item.value);

                return (
                  <TouchableOpacity
                    key={item.value}
                    onPress={() => handleItemToggle(item.value)}
                    className="p-4 flex-row items-center justify-between"
                    activeOpacity={1}
                    style={{
                      backgroundColor: getItemBackgroundColor(item.value),
                      ...getBorderBottomStyle(idx),
                    }}
                  >
                    <Text
                      className="text-base font-ifood-regular flex-1"
                      style={{
                        color: getItemTextColor(item.value),
                        fontWeight: getItemFontWeight(item.value),
                      }}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <CheckIcon size={20} color={colors.primaryBlue} />
                    )}
                  </TouchableOpacity>
                );
              })}
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
