export interface ScheduleResponse {
  data: Schedule[]
}

export interface Schedule {
  date: string; 
  interpreter_id: string;
  time_slots: TimeSlot[];
}

export interface TimeSlot {
  start_time: string; 
  end_time: string;   
}