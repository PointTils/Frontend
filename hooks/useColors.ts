import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeProvider';

export function useColors() {
  const { colorScheme } = useTheme();
  return Colors[colorScheme ?? 'light'];
}
