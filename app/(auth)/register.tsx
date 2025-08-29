import { useColors } from "@/src/hooks/useColors";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { RadioButton } from "react-native-paper";

export default function RegisterScreen() {
    const [type, setType] = useState("enterprise");
    const [reason, setReason] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const colors = useColors();

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handlePhoneChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 11);

        const formatted = cleaned
            .replace(/^(\d{2})(\d)/, '($1) $2')      
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');  
        setPhone(formatted);
    };

    const handleCnpjChange = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 14);

        const formatted = cleaned
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2');

        setCnpj(formatted);
    };


    return (
        <ScrollView className="flex-1 bg-white p-10 mt-10">
            <Text className="font-ifood-medium text-lg mb-3 text-[18px]">Boas-vindas!</Text>
            <Text className="font-ifood-regular mb-6">
                Precisamos de algumas informações básicas para criar sua conta.
            </Text>

            <Text className="font-ifood-medium mb-2">Quem é você?</Text>
            <View className="flex-row mb-2">
                <View className="flex-row items-center">
                    <RadioButton
                        value="client"
                        status={type === "client" ? "checked" : "unchecked"}
                        onPress={() => setType("client")}
                        color={colors.primaryBlue}
                        uncheckedColor={colors.disabled}
                    />
                    <Text style={{color: type === "client" ? colors.primaryBlue : colors.disabled}} className="font-ifood-regular"> Solicitante</Text>
                </View>
                <View className="flex-row items-center">
                    <RadioButton
                        value="enterprise"
                        status={type === "enterprise" ? "checked" : "unchecked"}
                        onPress={() => setType("enterprise")}
                        color={colors.primaryBlue}
                        uncheckedColor={colors.disabled}
                    />
                    <Text style={{color: type === "enterprise" ? colors.primaryBlue : colors.disabled}} className="font-ifood-regular">Empresa</Text>
                </View>
                <View className="flex-row items-center">
                    <RadioButton
                        value="interpreter"
                        status={type === "interpreter" ? "checked" : "unchecked"}
                        onPress={() => setType("interpreter")}
                        color={colors.primaryBlue}
                        uncheckedColor={colors.disabled}
                    />
                    <Text style={{color: type === "interpreter" ? colors.primaryBlue : colors.disabled}} className="font-ifood-regular">Intérprete</Text>
                </View>
            </View>
            <View className="flex-1 px-4 pt-2 justify-between">
                <View>
                    <Text className="font-ifood-medium mb-2">
                        Razão Social
                        <Text style={{color:"#B91C1C"}}>*</Text>
                    </Text>
                    <TextInput
                        placeholder="Empresa X"
                        value={reason}
                        onChangeText={setReason}
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                    />
                    
                    <Text className="font-ifood-medium mb-2">
                        CNPJ
                        <Text style={{color:"#B91C1C"}}>*</Text>
                    </Text>
                    <TextInput
                        placeholder="00.000.000/0001-00"
                        value={cnpj}
                        onChangeText={handleCnpjChange}
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                        maxLength={18}
                    />
                    
                    <Text className="font-ifood-medium mb-2">
                        Telefone
                        <Text style={{color:"#B91C1C"}}>*</Text>
                    </Text>
                    <TextInput
                        placeholder="(00) 00000-0000"
                        value={phone}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                        maxLength={15}
                    />
                    
                    <Text className="font-ifood-medium mb-2">
                        Email
                        <Text style={{color:"#B91C1C"}}>*</Text>
                    </Text>
                    <TextInput
                        placeholder="example@gmail.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
                    />
                    
                    <Text className="font-ifood-medium mb-2">
                        Senha
                        <Text style={{color:"#B91C1C"}}>*</Text>
                    </Text>
                    <TextInput
                        placeholder="*******"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        className="border border-gray-300 rounded-lg px-4 py-3 mb-6"
                    />
                </View>
                <View className="mt-5 pb-40">
                    <TouchableOpacity style={{ backgroundColor: colors.primaryOrange }} className="py-4 rounded-lg mb-3">
                        <Text className="text-center text-white font-semibold text-lg">+ Criar conta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={{ color: colors.primaryOrange }} className="text-center font-semibold">✕ Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
);
}
