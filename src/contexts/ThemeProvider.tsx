import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { Colors } from '@/src/constants/Colors';
import { FORCE_LIGHT_MODE } from '@/src/constants/Theme';
import {
  DarkTheme as NavDark,
  DefaultTheme as NavLight,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance } from 'react-native';

type Mode = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

type Ctx = {
  mode: Mode;
  setMode: (m: Mode) => void;
  toggle: () => void;
  colorScheme: Resolved;
};

const ThemeCtx = createContext<Ctx | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(FORCE_LIGHT_MODE ? 'light' : 'system');
  const [system, setSystem] = useState<Resolved>(
    (Appearance.getColorScheme() ?? 'light') as Resolved,
  );

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystem((colorScheme ?? 'light') as Resolved);
    });
    return () => sub.remove();
  }, []);

  const colorScheme: Resolved = useMemo(
    () => (FORCE_LIGHT_MODE ? 'light' : mode === 'system' ? system : mode),
    [mode, system],
  );

  const value = useMemo<Ctx>(
    () => ({
      mode,
      setMode,
      toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
      colorScheme,
    }),
    [mode, colorScheme],
  );

  const navigationLight = React.useMemo(
    () => ({
      ...NavLight,
      colors: {
        ...NavLight.colors,
        primary: Colors.light.tint,
        background: Colors.light.background,
        card: Colors.light.background,
        text: Colors.light.text,
        border: Colors.light.icon,
        notification: Colors.light.tint,
      },
    }),
    [],
  );

  const navigationDark = React.useMemo(
    () => ({
      ...NavDark,
      colors: {
        ...NavDark.colors,
        primary: Colors.dark.tint,
        background: Colors.dark.background,
        card: Colors.dark.background,
        text: Colors.dark.text,
        border: Colors.dark.icon,
        notification: Colors.dark.tint,
      },
    }),
    [],
  );

  return (
    <ThemeCtx.Provider value={value}>
      <GluestackUIProvider mode={mode}>
        <NavigationThemeProvider
          value={colorScheme === 'dark' ? navigationDark : navigationLight}
        >
          {children}
        </NavigationThemeProvider>
      </GluestackUIProvider>
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
