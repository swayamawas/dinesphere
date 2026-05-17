'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  // Auth state — sourced from NextAuth session
  isAuthenticated: boolean;
  user: { id?: string; name?: string | null; email?: string | null } | null;
  isLoading: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;

  // Modal state
  isAuthModalOpen: boolean;
  authMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  // Modal UI state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Derive auth state from NextAuth session
  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';
  const user = session?.user
    ? {
        id: (session.user as any).id,
        name: session.user.name,
        email: session.user.email,
      }
    : null;

  /**
   * Login using NextAuth's Credentials provider.
   * `redirect: false` prevents the full-page redirect so we can
   * handle errors inside the modal.
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        return { ok: false, error: 'Login failed. Please try again.' };
      }

      if (result.error) {
        // NextAuth returns generic "CredentialsSignin" when authorize() returns null
        // We map this to a user-friendly message
        return { ok: false, error: 'Invalid email or password. Please try again.' };
      }

      if (result.ok) {
        setIsAuthModalOpen(false);
        return { ok: true };
      }

      return { ok: false, error: 'Login failed. Please try again.' };
    } catch (_error) {
      console.error('[LOGIN_ERROR]', _error);
      return { ok: false, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  /**
   * Signup: POST to our custom endpoint, then auto-login on success.
   */
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, error: data.error || 'Signup failed' };
      }

      // Auto-login after successful signup
      const loginResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!loginResult || loginResult.error) {
        return { ok: false, error: 'Account created! Please log in with your credentials.' };
      }

      setIsAuthModalOpen(false);
      return { ok: true };
    } catch (_error) {
      console.error('[SIGNUP_ERROR]', _error);
      return { ok: false, error: 'Something went wrong. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    signOut({ redirect: false });
  }, []);

  const openAuthModal = useCallback((mode: 'login' | 'signup' | 'forgot') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthModalOpen,
        authMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
