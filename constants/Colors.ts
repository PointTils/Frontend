/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 *
 * When adding new colors, make sure to define them in both light and dark mode.
 * Also, ensure that the colors are declared at components/ui/gluestack-ui-provider/config.ts
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
