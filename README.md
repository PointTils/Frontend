# Frontend

Repositório de Frontend do projeto Point Tils desenvolvido no semestre 2025/2 na Agência Experimental de Engenharia de Software da PUCRS

## Point Tils

Aplicativo móvel em React Native + Expo com theming (light/dark), roteamento por arquivos (expo-router) e estilização com NativeWind/Tailwind.

- Plataforma: Android
- Linguagem: TypeScript
- Navegação: React Navigation + Expo Router
- UI: NativeWind + Gluestack UI overlay/toast + Lucid icons

> [!NOTE]
> Mais informações a respeito de UI, Theming e padrões de código... podem ser encontradas em nossa Wiki:
> [Wiki](https://github.com/PointTils/Frontend/wiki)

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

> [!NOTE]
> Use as mesmas credenciais da conta criada no site do Expo Go

4. Iniciar o app (modo desenvolvimento)

```bash
npm run start
```

> [!IMPORTANT]
> Pressione “s” para Expo Go emulador e escanei o QR Code.
>
> - Android: escanei usando o app do Expo Go
> - iPhone: escanei usando a câmera do celular

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
- **tests/**: Testes unitários dos utilitários e componentes visuais.
- **+**: Arquivos de configuração do projeto, como `tailwind.config.js`, `eslint.config.js`, e `tsconfig.json`.

## CI/CD

- PR Notifications: Dispara notificação a cada abertura de PR para dev, envia para um channel no Discord
  - Workflow: [.github/workflows/pr_notification.yml](.github/workflows/pr_notification.yml)
- PR Checks: lint, type-check, prebuild Android/iOS, depcheck, audit, expo-doctor
  - Workflow: [.github/workflows/pr_checks.yml](.github/workflows/pr_checks.yml)
- APK Build Android com EAS: Publica release no GitHub e anexa APK quando disponível
  - Workflow: [.github/workflows/apk_build.yml](.github/workflows/apk_build.yml)
- Mirror GitLab: Sincroniza repos do GitLab e GitHub
  - Workflow: [.github/workflows/mirror_gitlab_front.yml](.github/workflows/mirror_gitlab_front.yml)
