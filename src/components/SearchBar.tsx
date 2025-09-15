import React from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useColors } from "../hooks/useColors";

export default function SearchBar() {
      const colors = useColors();
    
  return (
    <View className="px-4 py-2">
      <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
        <Ionicons name="search" size={20} color={colors.primaryBlue} />
        <TextInput
          placeholder="Pesquisar"
          className="ml-2 flex-1 text-base"
          placeholderTextColor={colors.disabled}
        />
      </View>
    </View>
  );
}
