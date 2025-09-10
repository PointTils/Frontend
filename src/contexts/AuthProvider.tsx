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
import { Storage } from '@/src/constants/Auth';
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
  useState,
} from 'react';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutAlertDialog, setShowLogoutAlertDialog] = useState(false);

  const isAuthenticated = !!user;

  const handleCloseLogoutAlertDialog = () => {
    setShowLogoutAlertDialog(false);
    router.replace('/(auth)');
  };

  async function loadStoredAuth() {
    try {
      const [storedUser, storedAccessToken] = await Promise.all([
        AsyncStorage.getItem(Storage.userData),
        AsyncStorage.getItem(Storage.accessToken),
      ]);

      if (storedUser && storedAccessToken) {
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common.Authorization = `Bearer ${storedAccessToken}`;
      }
    } catch (error) {
      console.error('Failed to load stored auth:', error);
      // Redirect to login if unable to load stored auth
      router.replace('/(auth)');
    } finally {
      setIsLoading(false);
    }
  }

  const setupApiInterceptors = useCallback(() => {
    // Request interceptor to add auth header
    api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem(Storage.accessToken);
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
          if (originalRequest.url?.includes('/auth/')) {
            return Promise.reject(error);
          }

          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            // Get the new token and retry the original request
            const newToken = await AsyncStorage.getItem(Storage.accessToken);
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
  }, []);

  // Configure API interceptors
  useEffect(() => {
    setupApiInterceptors();
  }, [setupApiInterceptors]);

  // API CALLS
  async function login(credentials: LoginCredentials): Promise<void> {
    try {
      setIsLoading(true);

      const response = await api.post<LoginResponse>(
        '/auth/login',
        credentials,
      );

      if (response.data.success) {
        const { user: userData, tokens } = response.data.data;

        // Store user data and tokens
        await Promise.all([
          AsyncStorage.setItem(Storage.userData, JSON.stringify(userData)),
          AsyncStorage.setItem(Storage.accessToken, tokens.accessToken),
          AsyncStorage.setItem(Storage.refreshToken, tokens.refreshToken),
        ]);

        // Update API default headers
        api.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;

        // Update state
        setUser(userData);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshToken(): Promise<boolean> {
    try {
      const storedRefreshToken = await AsyncStorage.getItem(
        Storage.refreshToken,
      );

      if (!storedRefreshToken) {
        return false;
      }

      const response = await api.post<RefreshResponse>('/auth/refresh', {
        refresh_token: storedRefreshToken,
      });

      if (response.data.success) {
        const { tokens } = response.data.data;

        // Store new tokens
        await Promise.all([
          AsyncStorage.setItem(Storage.accessToken, tokens.accessToken),
          AsyncStorage.setItem(Storage.refreshToken, tokens.refreshToken),
        ]);

        // Update API default headers
        api.defaults.headers.common.Authorization = `Bearer ${tokens.accessToken}`;

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
      setIsLoading(true);

      try {
        const storedRefreshToken = await AsyncStorage.getItem(
          Storage.refreshToken,
        );

        await api.post('/auth/logout', {
          refresh_token: storedRefreshToken,
        });
      } catch (error) {
        // Continue with local logout even if API call fails
        console.warn('Logout API call failed:', error);
      }

      // Clear stored data
      await Promise.all([
        AsyncStorage.removeItem(Storage.accessToken),
        AsyncStorage.removeItem(Storage.refreshToken),
        AsyncStorage.removeItem(Storage.userData),
      ]);

      // Clear API headers
      delete api.defaults.headers.common.Authorization;

      // Update state
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const value: AuthContextData = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshToken,
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
