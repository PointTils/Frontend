import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useColors } from '../hooks/useColors';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  handleBack?: () => void;
}

/**
 * Header component for screens with title and optional back button.
 *
 * @param title - Title of the page where the header is located
 * @param showBackButton - Boolean to show or hide the back button
 * @param handleBack - Function to be called when pressing the back button
 *
 * @example
 * <Header
 *   title="Home Page"
 *   showBackButton={true}
 *   handleBack={() => router.replace('(tabs)')}
 * />
 */
export default function Header({
  title,
  showBackButton,
  handleBack,
}: HeaderProps) {
  const colorScheme = useColors();

  return (
    <View className="w-full flex-row justify-center items-center px-4">
      <View className="w-8 items-start justify-center">
        {showBackButton && (
          <TouchableOpacity
            testID="back-button"
            onPress={handleBack}
            activeOpacity={0.7}
          >
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
