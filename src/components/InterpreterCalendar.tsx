import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Colors } from "../constants/Colors";

type Schedule = {
  id: number;
  interpreterId: number;
  day: string;
  startTime: string;
  endTime: string;
};

type InterpreterCalendarProps = {
  schedules: Schedule[];
};

export default function InterpreterCalendar({ schedules }: InterpreterCalendarProps) {

  // Organiza os schedules em dias com intervalos de 30min
  const daysArray = schedules.reduce((acc, schedule) => {
    const dateStr = schedule.day; // se vier date no backend, usar schedule.date
    if (!acc[dateStr]) {
      acc[dateStr] = { day: schedule.day, date: dateStr, times: [] as string[] };
    }

    let start = new Date(`2025-01-01T${schedule.startTime}:00`);
    const end = new Date(`2025-01-01T${schedule.endTime}:00`);

    while (start < end) {
      const timeStr = start.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

      if (!acc[dateStr].times.includes(timeStr)) {
        acc[dateStr].times.push(timeStr);
      }

      start.setMinutes(start.getMinutes() + 30);
    }

    return acc;
  }, {} as Record<string, { day: string; date: string; times: string[] }>);

  const days = Object.values(daysArray);

  // Estados de navegação e seleção
  const [startIndex, setStartIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState<{ date: string; time: string } | null>(null);

  const currentDays = days.slice(startIndex, startIndex + 3);

  return (
    <View>
      <View className="flex-row justify-around">
        {/* Navegação esquerda */}
        <TouchableOpacity
          disabled={startIndex === 0}
          onPress={() => setStartIndex((prev) => Math.max(prev - 3, 0))}
        >
          <Text className="mt-6">
            <ChevronLeftIcon color={Colors.light.primaryBlue} />
          </Text>
        </TouchableOpacity>

        {/* Dias */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 20 }}>
          {currentDays.map((day) => {
            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString("pt-BR", { weekday: "short" });
            const formattedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
            const formattedDate = dateObj.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

            return (
              <View key={day.date} className="items-center">
                <Text className="font-ifood-medium mb-2">{formattedDayName}</Text>
                <Text className="font-ifood-light mb-6">{formattedDate}</Text>

                {day.times.map((time) => {
                  const isSelected = selectedTime?.date === day.date && selectedTime?.time === time;

                  return (
                    <TouchableOpacity
                      key={time}
                      className="px-4 py-3 items-center mb-2 mx-3 rounded"
                      style={{
                        backgroundColor: isSelected
                          ? Colors.light.primaryBlue
                          : `${Colors.light.primaryBlue}30`,
                      }}
                      onPress={() => setSelectedTime({ date: day.date, time })}
                    >
                      <Text
                        className="font-ifood-medium"
                        style={{ color: isSelected ? Colors.light.white : Colors.light.primaryBlue }}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Navegação direita */}
        <TouchableOpacity
          disabled={startIndex + 3 >= days.length && startIndex + 1 >= days.length}
          onPress={() =>
            setStartIndex((prev) => Math.min(prev + 3, days.length - 1))
          }

        >
          <Text className="mt-6">
            <ChevronRightIcon color={Colors.light.primaryBlue} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
