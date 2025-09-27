// app/index.tsx
import { useEffect } from "react";
import { View } from "react-native";
import { router } from "expo-router";

export default function Index() {
  useEffect(() => {
    router.replace("/detalhesagendamento");
  }, []);
  return <View />; // componente válido com default export
}
