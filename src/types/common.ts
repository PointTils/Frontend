export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type TimeRange = [string, string];

interface Response {
  specialties: Specialty[];
  locations: Location[];
}

interface Specialty {
  id: string;
  name: string;
}

interface Location {
  id: string;
  city: string;
  state: string;
  neighborhood: string;
}
