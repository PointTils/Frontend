import type { OptionItem } from '@/src/types/ui';

import { Strings } from './Strings';
import { Gender } from '../types/common';

/**
 * Centralized option lists for select/dropdown components.
 * Add new option arrays here to keep select data consistent across the app.
 */

export const specialties: OptionItem[] = [
  {
    value: 'f960f5b0-be40-4bff-8625-84fbe6e86588',
    label: Strings.specialties.interpreterOfLibras,
  },
  {
    value: '9e9a0cc0-f968-4852-9683-7fa5c138a5da',
    label: Strings.specialties.guideInterpreterOfLibras,
  },
  {
    value: '6539e352-1742-4f70-a484-c256fc36177a',
    label: Strings.specialties.tactileInterpreter,
  },
  {
    value: 'f7462efe-b4fe-4098-86ae-d1b0290a32f6',
    label: Strings.specialties.internationalSignInterpreter,
  },
] as const;

export const genders: OptionItem[] = [
  { label: Strings.gender.male, value: Gender.MALE },
  { label: Strings.gender.female, value: Gender.FEMALE },
  { label: Strings.gender.others, value: Gender.OTHERS },
] as const;

export const hourOptions: OptionItem[] = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return { label: `${hour}:00`, value: `${hour}:00` };
});
