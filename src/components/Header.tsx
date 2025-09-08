import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  handleBack?: () => void;
}

export default function Header({ title, showBackButton, handleBack }: HeaderProps) {
  const colorScheme = useColorScheme();

  const arrowColor = colorScheme === "dark" ? "#FF9F3A" : "#F28D22";

  return (
    <SafeAreaView edges={["top"]} className="bg-background-0">
      <View className="w-full flex-row items-center justify-between px-4 py-3 shadow-sm">
        <View className="w-1/4">
          {showBackButton && (
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
              <ChevronLeft size={24} color={arrowColor} />
            </TouchableOpacity>
          )}
        </View>

        <View className="w-2/4 items-center">
          <Text className="text-xl font-ifood-bold text-typography-900 dark:text-typography-white">
            {title}
          </Text>
        </View>

        <View className="w-1/4" />
      </View>
    </SafeAreaView>
  );
}
