import { Colors } from '@/src/constants/Colors';
import { useTheme } from '@/src/contexts/ThemeProvider';

export function useColors() {
  const { colorScheme } = useTheme();
  return Colors[colorScheme ?? 'light'];
}
