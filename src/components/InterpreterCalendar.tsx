import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/Colors";


// TODO: Pegar dados da schedule do backend e popular o calendário
function generateDays() {
    const today = new Date();
    const days = [];

    for (let i = 0; i <= 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);

        const dayName = date
            .toLocaleDateString("pt-BR", { weekday: "short" })
            .replace(".", "");
        const day = dayName.charAt(0).toUpperCase() + dayName.slice(1);

        const dateStr = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
        });

        days.push({
            day,
            date: dateStr,
            times: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"],
        });
    }

    return days;
}

type SelectedTime = {
    date: string;
    time: string;
} | null;

export default function InterpreterCalendar() {
    const days = generateDays();
    const [startIndex, setStartIndex] = useState(0);
    const [selectedTime, setSelectedTime] = useState<SelectedTime>(null);

    const currentDays = days.slice(startIndex, startIndex + 3);

    return (
        <View>
            <View className="flex-row justify-around">
                <TouchableOpacity
                    disabled={startIndex === 0}
                    onPress={() => setStartIndex((prev) => Math.max(prev - 3, 0))}
                >
                    <Text className='mt-6'>
                        <ChevronLeftIcon color={Colors.light.primaryBlue} />
                    </Text>
                </TouchableOpacity>

                <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
                    {currentDays.map((day) => (
                        <View key={day.date} className="items-center">

                            {/* Dia */}
                            <Text className='font-ifood-medium mb-2'>{day.day}</Text>
                            <Text className='font-ifood-light mb-6'>{day.date}</Text>

                            {/* Horários */}
                            {day.times.map((time) => {
                                const isSelected =
                                    selectedTime?.date === day.date && selectedTime?.time === time;

                                return (
                                    <TouchableOpacity
                                        key={time}
                                        className='px-4 py-3 items-center mb-2 mx-3 rounded'                                        
                                        style={{
                                            backgroundColor: isSelected ? `${Colors.light.primaryBlue}` : `${Colors.light.primaryBlue}30`,
                                        }}
                                        onPress={() => setSelectedTime({ date: day.date, time })}
                                    >
                                        <Text className='font-ifood-medium' style={{ color: isSelected ? `${Colors.light.white}` : `${Colors.light.primaryBlue}` }}>{time}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    disabled={startIndex + 3 >= days.length}
                    onPress={() =>
                        setStartIndex((prev) =>
                            Math.min(prev + 3, days.length - (days.length % 3 || 3))
                        )
                    }
                >
                    <Text className='mt-6'>
                        <ChevronRightIcon color={Colors.light.primaryBlue} />
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Dia selecionado (debugging) */}
            <Text style={{ marginTop: 20, textAlign: "center" }}>
                Selecionado:{" "}
                {selectedTime
                    ? `${selectedTime.date} - ${selectedTime.time}`
                    : "nenhum horário"}
            </Text>
        </View>
    );
}
