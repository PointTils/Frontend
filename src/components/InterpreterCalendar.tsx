import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import React, { useState, useMemo, useCallback } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { Text } from '../components/ui/text';
import { Strings } from '../constants/Strings';
import { useColors } from '../hooks/useColors';
import type { Schedule } from '../types/api/schedule';
import type { DateTimeSelection } from '../types/ui';

type InterpreterCalendarProps = {
  schedules?: Schedule[];
  onTimeSelect: (selection: DateTimeSelection) => void;
};

/**
 * Component to display a calendar with available time slots for interpreters.
 *
 * @param schedules Array of schedules containing available time slots
 * @param onTimeSelect Function to inform the parent component of the selected time slot
 *
 * @returns A calendar with the availability schedule rendered
 */
export default function InterpreterCalendar({
  schedules,
  onTimeSelect,
}: InterpreterCalendarProps) {
  const colors = useColors();
  const [startIndex, setStartIndex] = useState(0);

  const days = useMemo(() => {
    if (!schedules) return [];
    const daysMap = schedules.reduce(
      (acc, currentSchedule) => {
        const dateStr = currentSchedule.date;
        if (!acc[dateStr]) {
          acc[dateStr] = { date: dateStr, times: new Set<string>() };
        }
        currentSchedule.time_slots.forEach((slot) => {
          let start = new Date(`1970-01-01T${slot.start_time}Z`);
          const end = new Date(`1970-01-01T${slot.end_time}Z`);
          while (start < end) {
            const hours = start.getUTCHours().toString().padStart(2, '0');
            const minutes = start.getUTCMinutes().toString().padStart(2, '0');
            acc[dateStr].times.add(`${hours}:${minutes}`);
            start.setUTCMinutes(start.getUTCMinutes() + 30);
          }
        });
        return acc;
      },
      {} as Record<string, { date: string; times: Set<string> }>,
    );
    return Object.values(daysMap)
      .map((day) => ({ ...day, times: Array.from(day.times).sort() }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [schedules]);

  const currentDays = useMemo(
    () => days.slice(startIndex, startIndex + 3),
    [days, startIndex],
  );

  // Creates an array of exactly 3 elements, filling with null if there are less than 3 days available
  // This ensures the calendar always has 3 columns
  const displayDays = useMemo(() => {
    const daysToDisplay: ((typeof days)[0] | null)[] = Array(3).fill(null);
    currentDays.forEach((day, index) => {
      daysToDisplay[index] = day;
    });
    return daysToDisplay;
  }, [currentDays]);

  const allPossibleTimes = useMemo(
    () => Array.from(new Set(currentDays.flatMap((day) => day.times))).sort(),
    [currentDays],
  );

  // Handlers for navigation buttons
  const handlePrev = useCallback(
    () => setStartIndex((prev) => Math.max(prev - 3, 0)),
    [],
  );
  const handleNext = useCallback(
    () => setStartIndex((prev) => (prev + 3 >= days.length ? prev : prev + 3)),
    [days.length],
  );

  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex + 3 >= days.length;

  if (!days || days.length === 0) {
    return (
      <View className="h-22 justify-center items-center">
        <Text className="text-gray-500 font-ifood-regular">
          {Strings.toSchedule.noCalendarAvailable}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-start justify-center -mt-6">
      <TouchableOpacity
        disabled={isPrevDisabled}
        onPress={handlePrev}
        className="p-2 mt-8"
      >
        <ChevronLeftIcon
          color={isPrevDisabled ? colors.disabled : colors.text}
        />
      </TouchableOpacity>

      <View className="flex-1">
        <View className="flex-row justify-around">
          {/* Map the 3 columns of the calendar */}
          {displayDays.map((day, index) =>
            day ? (
              <View key={day.date} className="items-center flex-1 px-1">
                <Text className="font-ifood-medium text-center mb-2">
                  {new Date(`${day.date}T00:00:00Z`)
                    .toLocaleDateString('pt-BR', {
                      weekday: 'short',
                      timeZone: 'UTC',
                    })
                    .replace(/^\w/, (c) => c.toUpperCase())}
                </Text>
                <Text className="text-center mb-4">
                  {new Date(`${day.date}T00:00:00Z`).toLocaleDateString(
                    'pt-BR',
                    { day: '2-digit', month: '2-digit', timeZone: 'UTC' },
                  )}
                </Text>
              </View>
            ) : (
              <View key={`header-empty-${index}`} className="flex-1 px-1" />
            ),
          )}
        </View>

        <View>
          {allPossibleTimes.map((time) => (
            <View key={time} className="flex-row justify-around items-center">
              {displayDays.map((day, index) => {
                if (!day) {
                  return (
                    <View key={`slot-empty-${index}`} className="flex-1" />
                  );
                }

                const isAvailable = day.times.includes(time);

                return isAvailable ? (
                  <TouchableOpacity
                    key={`${day.date}-${time}`}
                    className="flex-1 items-center p-3 mb-2 mx-1 rounded-md bg-primary-success-light/20"
                    onPress={() => onTimeSelect({ date: day.date, time })}
                  >
                    <Text className="font-ifood-medium text-primary-success-light">
                      {time}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View
                    key={`${day.date}-${time}`}
                    className="flex-1 items-center p-3 mb-2 mx-1 rounded-md bg-primary-error-light/20"
                  >
                    <Text className="text-primary-error-light">-</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        disabled={isNextDisabled}
        onPress={handleNext}
        className="p-2 mt-8"
      >
        <ChevronRightIcon
          color={isNextDisabled ? colors.disabled : colors.text}
        />
      </TouchableOpacity>
    </View>
  );
}
