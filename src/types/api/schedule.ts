export enum Days {
  MON = 'MON',
  TUE = 'TUE',
  WED = 'WED',
  THU = 'THU',
  FRI = 'FRI',
  SAT = 'SAT',
  SUN = 'SUN',
}

export type WeekSchedule = Record<
  Days,
  { id: string; from: string; to: string }
>;

export interface ScheduleRequest {
  day: Days;
  interpreter_id: string;
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
}

export interface Schedule {
  id: string;
  day: Days;
  interpreter_id: string;
  start_time: string; // HH:mm:ss
  end_time: string; // HH:mm:ss
}

export interface SchedulePerDate {
  date: string;
  interpreter_id: string;
  time_slots: TimeSlot[];
}

export interface SchedulePaginated {
  page: number;
  size: number;
  total: number;
  items: Schedule[];
}

export interface ScheduleResponse {
  success: boolean;
  message: string;
  data: Schedule | SchedulePaginated | SchedulePerDate | null;
}
