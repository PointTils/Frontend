export interface ScheduleResponseDTO {
  id: number;
  interpreterId: number;
  day: string;
  startTime: string;
  endTime: string;
}

export interface PaginatedScheduleResponseDTO {
  page: number;
  size: number;
  total: number;
  items: ScheduleResponseDTO[];
}
