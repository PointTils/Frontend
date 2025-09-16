/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 *
 * When adding new colors, make sure to define them in both light and dark mode.
 * Also, ensure that the colors are declared at components/ui/gluestack-ui-provider/config.ts
 */
export const Colors = {
  light: {
    text: '#0D0D0D', // primary800 - Gluestack
    background: '#fff',
    white: '#fff',
    primaryOrange: '#F28D22',
    primaryBlue: '#43A2DB',
    disabled: '#999999', // primary50 - Gluestack
    onPressBlue: '#5CB3E8',
    onPressOrange: '#FF9F3A',
    mandatory: '#B91C1C',
    onPressGray: '#e4e4e4ff',
  },
  dark: {
    text: '#fff',
    white: '#fff',
    background: '#151718',
    primaryOrange: '#FF9F3A',
    primaryBlue: '#5CB3E8',
    disabled: '#9BA1A6',
    mandatory: '#EF4444',
    onPressBlue: '#43A2DB',
    onPressOrange: '#F28D22',
    onPressGray: '#374151',
  },
} as const;
