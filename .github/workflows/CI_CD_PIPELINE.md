# CI/CD Pipeline Documentation

## Build and Checks Pipeline for PRs

This repository implements a robust CI/CD pipeline to ensure code quality in Pull Requests.

## 🔍 Checks Performed on PRs

### 1. **Lint and Type Check**

- ✅ ESLint to verify code standards
- ✅ TypeScript type checking
- ⏱️ ~2-3 minutes

### 2. **Code Formatting Check**

- ✅ Prettier to ensure consistent code formatting
- ✅ Standardized code style
- ⏱️ ~1-2 minutes

### 3. **Build Check**

- ✅ Prebuild for Android and iOS
- ✅ Verifies if the project compiles correctly
- ⏱️ ~5-8 minutes

### 4. **Dependency Analysis**

- ✅ Analysis of unused dependencies
- ✅ Bundle size verification
- ⏱️ ~2-3 minutes

### 5. **Security Audit**

- ✅ `npm audit` for known vulnerabilities
- ✅ Verification of insecure dependencies
- ⏱️ ~1-2 minutes

### 6. **Expo Doctor**

- ✅ Verifies Expo configuration
- ✅ Detects compatibility issues
- ⏱️ ~1-2 minutes

## 🌙 APK Build

### Automated Workflow:

- ⏰ Runs every day at 3 AM UTC
- 🔍 Checks for security vulnerabilities
- 🔄 Automatically updates patch/minor dependencies
- 📊 Monitors the overall health of the project

### Benefits:

- Early detection of security issues
- Automatic maintenance of dependencies
- Prevention of technical debt accumulation

## 🛡️ Branch Protection

### `main` Branch:

- ✅ Code owner approval required (@Bialves)
- ✅ All checks must pass
- ✅ Branch must be up-to-date before merging

## 🚨 Troubleshooting

### Lint Failure:

```bash
npm run lint --fix
```

### Formatting Failure:

```bash
npm run format:write
```

### Type Check Failure:

```bash
npm run type-check
```

### Build Failure:

```bash
npm run doctor
npm run prebuild:clean
```

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [ESLint Expo Config](https://docs.expo.dev/guides/using-eslint/)
- [GitHub Actions](https://docs.github.com/en/actions)
