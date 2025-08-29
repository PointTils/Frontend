import { config as base } from '@gluestack-ui/config';
import { createConfig } from '@gluestack-ui/themed';

export const config = createConfig({
  ...base,
  tokens: {
    ...base.tokens,
    colors: {
      ...base.tokens.colors,
      primary0:   '#F7941D',
      primary50:  '#F7941D',
      primary100: '#F7941D',
      primary200: '#F7941D',
      primary300: '#F7941D',
      primary400: '#F7941D',
      primary500: '#F7941D',
      primary600: '#e58412',
      primary700: '#cc7510',
    },
  },
});

export type Config = typeof config;
