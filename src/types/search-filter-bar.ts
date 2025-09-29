import { Gender, Modality } from "./common";

export type AppliedFilters = {
  modality?: Modality | null;
  availableDates?: string;
  online?: boolean;
  personally?: boolean;
  specialty?: string[];
  gender?: Gender | null;
  city?: string;
  state?: string;
};
