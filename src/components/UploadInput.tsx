import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { Paperclip, Upload, X } from 'lucide-react-native';
import { pickFile } from '../utils/helpers';
import { useColors } from '../hooks/useColors';

type FileUploadBoxProps = {
  multiple?: boolean;
  onChange: (files: string[]) => void;
};

export default function FileUploadBox({
  multiple = false,
  onChange,
}: FileUploadBoxProps) {
  const [files, setFiles] = useState<any[]>([]);
  const colors = useColors();

  const handlePickFile = async () => {
    try {
      const result = await pickFile();
      if (result) {
        const newFiles = multiple ? [...files, result] : [result];
        setFiles(newFiles);
        onChange(newFiles);
      }
    } catch (error) {
      console.error('Erro ao selecionar arquivo', error);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange(newFiles);
  };

  return (
    <View className="border-2 border-dashed border-primary-orange-press-light rounded-lg p-3">
      <Pressable onPress={handlePickFile} className="items-center mt-2 mb-2">
        <Upload size={20} color={colors.primaryBlue} />
        <Text className="font-ifood-medium text-primary-blue-light">
          Adicionar arquivo
        </Text>
      </Pressable>

      {files.map((file, index) => (
        <View
          key={index}
          className="flex-row items-center border border-gray-300 bg-white rounded px-2 py-1 mt-6"
        >
          <Paperclip size={16} color={colors.detailsGray} />
          <TextInput
            value={file.name}
            editable={false}
            className="flex-1 ml-2 font-ifood-regular text-text-light dark:text-text-dark"
          />
          <Pressable onPress={() => removeFile(index)}>
            <X size={18} color={colors.text} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}
