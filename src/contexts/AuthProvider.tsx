import api from '@/src/api';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/src/components/ui/alert-dialog';
import { Button, ButtonText } from '@/src/components/ui/button';
import { Text } from '@/src/components/ui/text';
import { ApiRoutes } from '@/src/constants/ApiRoutes';
import { StorageKeys } from '@/src/constants/StorageKeys';
import { Strings } from '@/src/constants/Strings';
import type {
  LoginCredentials,
  LoginResponse,
  RefreshResponse,
  User,
} from '@/src/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
  loginError: string | null;
  isAuthenticated: boolean;
  isFirstTime: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  setLoginError: (error: string | null) => void;
  setIsFirstTime: (value: boolean) => void;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLogoutAlertDialog, setShowLogoutAlertDialog] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false);

  const isAuthenticated = !!user;

  const initialLoadRef = useRef(false);

  const handleCloseLogoutAlertDialog = () => {
    setShowLogoutAlertDialog(false);
    router.replace('/(auth)');
  };

  async function loadStoredAuth() {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    try {
      const [storedUser, storedAccessToken, storedRefreshToken] =
        await Promise.all([
          AsyncStorage.getItem(StorageKeys.user_data),
          AsyncStorage.getItem(StorageKeys.access_token),
          AsyncStorage.getItem(StorageKeys.refresh_token),
        ]);

      if (storedUser && storedAccessToken && storedRefreshToken) {
        try {
          // TODO: Validate token (e.g., decode and check expiry)

          setUser(JSON.parse(storedUser));
          api.defaults.headers.common.Authorization = `Bearer ${storedAccessToken}`;
        } catch (error) {
          // Invalid token or user data, clear storage
          console.error('Invalid stored auth data, logging out:', error);
          await logout();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  const setupApiInterceptors = useCallback(() => {
    // Request interceptor to add auth header
    api.interceptors.request.use(
      async (config) => {
        // Do not set Authorization header for refresh endpoint
        if (config.url?.includes(ApiRoutes.auth.refreshToken)) {
          // Remove Authorization header if present
          if (config.headers && 'Authorization' in config.headers) {
            delete config.headers.Authorization;
          }
          return config;
        }

        const token = await AsyncStorage.getItem(StorageKeys.access_token);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor to handle token refresh
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Check if it's a 401 error and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Skip refresh for auth endpoints to avoid infinite loops
          if (originalRequest.url?.includes(ApiRoutes.auth.base)) {
            return Promise.reject(error);
          }

          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Get the new token and retry the original request
            const newToken = await AsyncStorage.getItem(
              StorageKeys.access_token,
            );
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            return api(originalRequest);
          } else {
            // Refresh failed, logout user and redirect to login
            await logout();
            setShowLogoutAlertDialog(true);
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      },
    );
  }, []);

  // Load stored user data and tokens on app start
  useEffect(() => {
    loadStoredAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Configure API interceptors
  useEffect(() => {
    setupApiInterceptors();
  }, [setupApiInterceptors]);

  // API CALLS
  async function login(credentials: LoginCredentials): Promise<void> {
    try {
      setIsLoggingIn(true);
      setLoginError(null);

      const response = await api.post<LoginResponse>(
        ApiRoutes.auth.login,
        credentials,
      );

      if (response.data.success) {
        console.log('Login response:', response.data);
        const { user: userData, tokens } = response.data.data;

        // Store user data and tokens
        await Promise.all([
          AsyncStorage.setItem(StorageKeys.user_data, JSON.stringify(userData)),
          AsyncStorage.setItem(StorageKeys.access_token, tokens.access_token),
          AsyncStorage.setItem(StorageKeys.refresh_token, tokens.refresh_token),
        ]);

        // Update API default headers
        api.defaults.headers.common.Authorization = `Bearer ${tokens.access_token}`;

        // Check if this specific user has seen onboarding
        const hasSeenOnboarding = await AsyncStorage.getItem(
          StorageKeys.hasSeenOnboarding(userData.id),
        );
        setIsFirstTime(!hasSeenOnboarding);

        // Update state
        setUser(userData);
      } else {
        setLoginError(response.data.message);
      }
    } catch (error: any) {
      setLoginError(error?.message || Strings.auth.sessionExpiredMessage);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function refreshToken(): Promise<boolean> {
    try {
      const storedRefreshToken = await AsyncStorage.getItem(
        StorageKeys.refresh_token,
      );

      if (!storedRefreshToken) {
        return false;
      }

      const response = await api.post<RefreshResponse>(
        ApiRoutes.auth.refreshToken,
        {
          refresh_token: storedRefreshToken,
        },
      );

      if (response.data.success) {
        const { tokens } = response.data.data;

        // Store new tokens
        await Promise.all([
          AsyncStorage.setItem(StorageKeys.access_token, tokens.access_token),
          AsyncStorage.setItem(StorageKeys.refresh_token, tokens.refresh_token),
        ]);

        // Update API default headers
        api.defaults.headers.common.Authorization = `Bearer ${tokens.access_token}`;

        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  async function logout(): Promise<void> {
    try {
      setIsLoggingOut(true);

      try {
        const storedRefreshToken = await AsyncStorage.getItem(
          StorageKeys.refresh_token,
        );

        await api.post(ApiRoutes.auth.logout, {
          refresh_token: storedRefreshToken,
        });
      } catch (error) {
        // Continue with local logout even if API call fails
        console.warn('Logout API call failed:', error);
      }

      // Clear stored data
      await Promise.all([
        AsyncStorage.removeItem(StorageKeys.access_token),
        AsyncStorage.removeItem(StorageKeys.refresh_token),
        AsyncStorage.removeItem(StorageKeys.user_data),
      ]);

      // Clear API headers
      delete api.defaults.headers.common.Authorization;

      // Update state
      setUser(null);
      setIsFirstTime(false);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }

  async function completeOnboarding(): Promise<void> {
    if (!user?.id) return;
    await AsyncStorage.setItem(StorageKeys.hasSeenOnboarding(user.id), 'true');
    setIsFirstTime(false);
  }

  const value: AuthContextData = {
    user,
    isLoading,
    isLoggingIn,
    isLoggingOut,
    isAuthenticated,
    loginError,
    isFirstTime,
    login,
    logout,
    refreshToken,
    setLoginError,
    setIsFirstTime,
    completeOnboarding,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      <AlertDialog
        isOpen={showLogoutAlertDialog}
        onClose={handleCloseLogoutAlertDialog}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text
              className="font-ifood-medium text-text-light dark:text-text-dark"
              size="md"
            >
              {Strings.auth.sessionExpired}
            </Text>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text
              size="sm"
              className="font-ifood-regular text-text-light dark:text-text-dark"
            >
              {Strings.auth.sessionExpiredMessage}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="solid"
              action="primary"
              onPress={handleCloseLogoutAlertDialog}
              size="sm"
            >
              <ButtonText>{Strings.common.understood}</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
