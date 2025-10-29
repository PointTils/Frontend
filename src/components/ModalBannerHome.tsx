import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import BannerHome from '../assets/svgs/BannerHome';
import { useTheme } from '../contexts/ThemeProvider';
import { Colors } from '../constants/Colors';

interface ModalBannerHome {
  title: string;
  backgroundColor: string;
  onPress?: () => void;
}

export default function ModalBannerHome({
  backgroundColor,
  title,
  onPress,
}: ModalBannerHome) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between h-[100px] rounded-sm p-4 mx-4 my-2"
      style={{ backgroundColor }}
      activeOpacity={0.8}
    >
      <View className="flex-row items-center flex-1">
        <BannerHome />

        <View className="ml-4 flex-1">
          <Text className="font-ifood-medium" style={{ color: colors.white }}>
            {title}
          </Text>
        </View>
      </View>

      <ArrowRight size={20} color={colors.white} />
    </TouchableOpacity>
  );
}
