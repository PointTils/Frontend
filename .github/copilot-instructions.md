# Project Overview

This project, **Point Tils**, is a mobile application built with React Native and Expo. It supports Android and iOS, and includes features such as theming, animations, and file-based routing.

## Folder Structure

- `/app`: Contains the main application code, including screens and layouts.
- `/src/api`: API client.
- `/src/assets`: Static assets like images and fonts.
- `/src/components`: Reusable UI components, including:
  - `/ui`: Components specific to GlueStack.
- `/src/constants`: Shared constants such as colors and strings.
- `/src/contexts`: Providers and global contexts.
- `/src/hooks`: Custom React hooks for shared logic, including utilities for theming, color schemes and API calls.
- `/src/types`: TypeScript type definitions.
  - `/api`: Type definitions for API responses and requests.
- `/src/utils`: Utility functions and helpers.
- `app.json`: Expo configuration file.
- `eas.json`: Configuration for Expo Application Services (EAS).

## Libraries and Frameworks

- **React Native**: Core framework for mobile development.
- **Expo**: Platform for universal app development.
- **TypeScript**: For type safety and better developer experience.
- **React Navigation**: For navigation and routing.
- **React Native Reanimated**: For animations.
- **Expo Router**: For file-based routing.
- **NativeWind**: Tailwind CSS for React Native.
- **Gluestack UI**: For UI components and theming.
- **ESLint**: For linting and code quality.
- **Prettier**: For consistent code formatting.
- **Lucid icons**: For a set of high-quality icons.

## Coding Standards

- Use **English** for all code, comments, and documentation.
- Avoid verbose comments; only include comments when necessary to clarify complex logic.
- Follow TypeScript strict mode for type safety ([tsconfig.json](../tsconfig.json)).
- Use single quotes for strings.
- Use arrow functions for callbacks and functional components.
- Maintain consistent formatting with Prettier and ESLint ([eslint.config.js](../eslint.config.js), [.prettierrc](../.prettierrc)).
- Avoid unused imports and dependencies.
- Avoid inline styles; use Tailwind/NativeWind or shared constants.

## UI Guidelines

- Follow light and dark mode theming using the `useColors` hook.
- Ensure components are reusable and follow a modular design.
- Use animations sparingly and only when they enhance the user experience.
- Centralize colors in [constants/Colors.ts](../src/constants/Colors.ts).
- Centralize texts/copies in [constants/Strings.ts](../src/constants/Strings.ts).
- Centralize API routes in [constants/ApiRoutes.ts](../src/constants/ApiRoutes.ts).
- Extend Tailwind with CSS variables in [tailwind.config.js](../tailwind.config.js).

## CI/CD

- **PR Checks**: Includes linting, type-checking, prebuild for Android/iOS, dependency checks, security audits, and `expo-doctor`.
  - Workflow: [.github/workflows/pr_checks.yml](../.github/workflows/pr_checks.yml)
- **Nightly Build**: Runs daily at 3 AM UTC to check for vulnerabilities, update dependencies, and monitor project health.
  - Workflow: [.github/workflows/nightly_build.yml](../.github/workflows/nightly_build.yml)

## Additional Notes

- Follow the folder structure and naming conventions for new files and components.
- Use the `Colors` constant for consistent theming.
- Use the `Strings` constant for consistent texts/copies.
- Use Expo's `expo-router` for navigation and routing.
- For troubleshooting, refer to the [CI/CD Pipeline Documentation](../.github/workflows/CI_CD_PIPELINE.md).
