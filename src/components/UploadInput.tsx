import { Paperclip, Upload, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { Toast } from 'toastify-react-native';

import { Text } from '../components/ui/text';
import { View } from '../components/ui/view';
import { Strings } from '../constants/Strings';
import { useColors } from '../hooks/useColors';
import type { ExistingDocument } from '../types/api';
import { pickFile } from '../utils/helpers';

type UploadInputProps = {
  multiple?: boolean;
  maxFiles?: number;
  existing?: ExistingDocument[];
  onChange: (files: any[]) => void;
  onExistingChange?: (files: ExistingDocument[]) => void;
};

/**
 * A file upload component that allows selecting one or multiple files
 * from the device. Displays a list of selected files with name and
 * removal option.
 *
 * @param multiple - Enables selection of multiple files (default: false)
 * @param maxFiles - Maximum number of files allowed when multiple is true (default: 3)
 * @param existing - List of existing files (get from backend)
 * @param onChange - Callback function called with the current list of selected files
 * @param onExistingChange - Callback function called with the current list of existing files
 *
 * @returns A file upload input with add and remove file controls.
 *
 * @example
 * <UploadInput
 *   multiple={true}
 *   onChange={(files) => console.log('Selected files:', files)}
 * />
 */

export default function UploadInput({
  multiple = false,
  maxFiles = 3,
  onChange,
  existing = [],
  onExistingChange,
}: UploadInputProps) {
  const [existingFiles, setExistingFiles] =
    useState<ExistingDocument[]>(existing);
  const [files, setFiles] = useState<any[]>([]);
  const colors = useColors();

  useEffect(() => {
    setExistingFiles(existing);
  }, [existing]);

  const handlePickFile = async () => {
    try {
      // Block when max reached (only relevant for multiple)
      if (multiple && existingFiles.length + files.length >= maxFiles) {
        Toast.show({
          type: 'info',
          text1: Strings.upload.toast.limitTitle,
          text2: Strings.upload.toast.limitDescription.replace(
            '{max}',
            String(maxFiles),
          ),
          position: 'top',
          visibilityTime: 2500,
          autoHide: true,
          closeIconSize: 1,
        });
        return;
      }

      const result = await pickFile();
      if (result) {
        const hasDuplicateInNew = files.some(
          (file) =>
            file.name.toLocaleLowerCase() === result.name.toLocaleLowerCase(),
        );
        const hasDuplicateInExisting = existingFiles.some(
          (file) =>
            file.name.toLocaleLowerCase() === result.name.toLocaleLowerCase(),
        );

        if (hasDuplicateInNew || hasDuplicateInExisting) {
          Toast.show({
            type: 'info',
            text1: Strings.upload.toast.duplicatedTitle,
            text2: Strings.upload.toast.duplicatedDescription,
            position: 'top',
            visibilityTime: 2000,
            autoHide: true,
            closeIconSize: 1,
          });
          return;
        }

        const newFiles = multiple ? [...files, result] : [result];
        setFiles(newFiles);
        onChange(newFiles);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: Strings.upload.toast.errorTitle,
        text2: Strings.upload.toast.errorDescription,
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        closeIconSize: 1,
      });
      console.error('Erro ao selecionar novo documento', error);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const removeExistingFile = (index: number) => {
    const updated = existingFiles.filter((_, i) => i !== index);
    setExistingFiles(updated);
    onExistingChange?.(updated);
  };

  return (
    <View className="p-3">
      <Pressable onPress={handlePickFile} className="items-center mt-2 mb-8">
        <Upload size={20} color={colors.primaryBlue} />
        <Text className="font-ifood-medium text-primary-blue-light">
          {Strings.common.fields.uploadFile}
        </Text>
      </Pressable>

      {existingFiles.map((file, index) => (
        <View
          key={`${file.id}-${index}`}
          className="flex-row items-center border border-gray-300 bg-white rounded px-2 py-4 mb-4"
        >
          <Paperclip size={16} color={colors.detailsGray} />
          <Text
            className="flex-1 ml-2 font-ifood-regular text-text-light dark:text-text-dark"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {file.name}
          </Text>
          <Pressable onPress={() => removeExistingFile(index)} className="pl-2">
            <X size={18} color={colors.text} />
          </Pressable>
        </View>
      ))}

      {files.map((file, index) => (
        <View
          key={index}
          className="flex-row items-center border border-gray-300 bg-white rounded px-2 py-4 mb-4"
        >
          <Paperclip size={16} color={colors.detailsGray} />
          <Text
            className="flex-1 ml-2 font-ifood-regular text-text-light dark:text-text-dark"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {file.name}
          </Text>
          <Pressable onPress={() => removeFile(index)} className="pl-2">
            <X size={18} color={colors.text} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}
