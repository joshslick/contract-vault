import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import authService from '../services/authService';

/**
 * Auth Context
 * Provides authentication state across the app
 */
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [hasPassword, setHasPassword] = useState(() => authService.hasPasswordSet());
  const [isLocked, setIsLocked] = useState(() => !authService.hasPasswordSet());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionPassword, setSessionPassword] = useState(null);

  const setPassword = useCallback(async (password) => {
    try {
      setIsLoading(true);
      setError(null);

      await authService.setPassword(password);

      setHasPassword(true);
      setSessionPassword(password);
      setIsLocked(false);
      return true;
    } catch (err) {
      setError(err?.message || 'Failed to set password');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unlock = useCallback(async (password) => {
    try {
      setIsLoading(true);
      setError(null);

      const isValid = await authService.validatePassword(password);
      if (isValid) {
        setSessionPassword(password);
        setIsLocked(false);
        return true;
      }

      setError('Invalid password');
      return false;
    } catch (err) {
      console.error(err);
      setError('Error validating password');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const lock = useCallback(() => {
    setIsLocked(true);
    setSessionPassword(null);
    setError(null);
  }, []);

  const value = useMemo(() => {
    return {
      isLocked,
      isLoading,
      error,
      sessionPassword,
      setPassword,
      unlock,
      lock,
      hasPassword,
    };
  }, [isLocked, isLoading, error, sessionPassword, setPassword, unlock, lock, hasPassword]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within AuthProvider');
  return context;
}
