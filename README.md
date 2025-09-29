# Frontend

Repositório de Frontend do projeto Point Tils desenvolvido no semestre 2025/2 na Agência Experimental de Engenharia de Software da PUCRS

## Point Tils

Aplicativo móvel em React Native + Expo com theming (light/dark), roteamento por arquivos (expo-router) e estilização com NativeWind/Tailwind.

- Plataforma: Android
- Linguagem: TypeScript
- Navegação: React Navigation + Expo Router
- UI: NativeWind + Gluestack UI overlay/toast + Lucid icons

### Requisitos

- Node.js LTS ≥ 22.17.0
- npm ≥ 10
- dispositivo Android/iOS
- Conta no Expo: https://expo.dev

> Observação: A CI usa Node 20, mas o desenvolvimento local recomenda Node 22 LTS.

## Primeiros passos

1. Instalar dependencias

```bash
npm install
```

2. Instalar EAS CLI

```bash
npm install --global eas-cli
```

3. Autenticar no Expo/EAS

```bash
npx expo login
```

> Usar mesmas credenciais da conta criada no site do Expo Go

4. Iniciar o app (modo desenvolvimento)

```bash
npm run start
```

> Pressione “s” para Expo Go emulador e escanei o QR Code (Android: escanei usando o app do Expo Go, iPhone: escanei usando a câmera do celular).

## Scripts úteis

- Lint (checar): `npm run lint`
- Lint (corrigir): `npx eslint --fix .`
- Formatação (checar): `npm run format:check`
- Formatação (corrigir): `npm run format:write`
- Verificação de dependencias: `depcheck`
- Diagnóstico: `npx expo-doctor`
- Type-check: `npx tsc --noEmit`

## Estrutura de Pastas

- **app/**: Telas e layouts principais.
- **src/assets**: Recursos estáticos como imagens e fontes.
- **src/components**: Componentes reutilizáveis, incluindo:
  - **ui**: Componentes específicos do GlueStack.
- **src/constants**: Constantes globais, como cores e strings.
- **src/contexts**: Providers e contextos globais.
- **src/hooks**: Hooks compartilhados para lógica reutilizável.
- **src/types**: Definições de tipos TypeScript.
- **+**: Arquivos de configuração do projeto, como `tailwind.config.js`, `eslint.config.js`, e `tsconfig.json`.

## UI e Theming

- Tema global via [contexts/ThemeProvider.tsx](src/contexts/ThemeProvider.tsx) que integra:
  - React Navigation ThemeProvider
  - GluestackUIProvider (NativeWind vars)
- Cores centralizadas em [constants/Colors.ts](src/constants/Colors.ts)
- Tailwind estendido com variáveis (CSS vars) em
  - [components/ui/gluestack-ui-provider/config.ts](src/components/ui/gluestack-ui-provider/config.ts)
  - [tailwind.config.js](tailwind.config.js)

## Navegação

O roteamento é baseado em arquivos (expo-router), mais informações sobre o funcionamento em https://docs.expo.dev/router/basics/core-concepts/#4-root-_layouttsx-replaces-appjsxtsx

## Padrões de código

- TypeScript strict ([tsconfig.json](tsconfig.json))
- ESLint + Prettier ([eslint.config.js](eslint.config.js), [.prettierrc](.prettierrc))
- Strings com aspas simples
- Componentes funcionais e hooks idiomáticos
- Evitar estilos inline (usar Tailwind/NativeWind)

## CI/CD

- PR Checks: lint, type-check, prebuild Android/iOS, depcheck, audit, expo-doctor
  - Workflow: [.github/workflows/pr_checks.yml](.github/workflows/pr_checks.yml)
- Nightly Build Android com EAS:
  - Workflow: [.github/workflows/nightly_build.yml](.github/workflows/nightly_build.yml)
  - Publica release no GitHub e anexa APK quando disponível
