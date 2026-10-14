import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, UserResponse } from '../services/authService';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginSession: (token: string, user: UserResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(() => authService.getUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const syncAuth = useCallback(() => {
    setUser(authService.getUser());
    setToken(authService.getToken());
  }, []);

  useEffect(() => {
    // Initial verification
    const tokenOnMount = authService.getToken();
    if (tokenOnMount) {
      authService
        .getMe()
        .then((fetchedUser) => {
          if (fetchedUser) {
            setUser(fetchedUser);
            localStorage.setItem('user', JSON.stringify(fetchedUser));
          }
        })
        .catch((err) => {
          console.warn('Silent session validation fallback:', err);
          // Don't forcefully wipe immediately if server is offline/mocking,
          // maintain existing cached user if valid
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    // Listen to custom auth events and storage changes
    const handleAuthChange = () => syncAuth();
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, [syncAuth]);

  const loginSession = useCallback((newToken: string, newUser: UserResponse) => {
    authService.saveSession(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const updatedUser = await authService.getMe();
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.warn('Failed to refresh user:', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        loginSession,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
