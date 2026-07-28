import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { setAccessToken, onSessionExpired } from "../lib/api/tokenStore";
import * as authApi from "../lib/api/endpoints/auth";
import { api } from "../lib/api/client";
import type { AuthUser } from "../types/user";
import { isStaffRole } from "../types/user";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isStaff: boolean;
  loginCustomer: (accessToken: string, user: AuthUser) => void;
  loginStaff: (accessToken: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const applySession = useCallback((accessToken: string, authedUser: AuthUser) => {
    setAccessToken(accessToken, isStaffRole(authedUser.role) ? "staff" : "customer");
    setUser(authedUser);
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  useEffect(() => {
    onSessionExpired(clearSession);
  }, [clearSession]);

  // Silent boot: try to reacquire an access token from the httpOnly refresh
  // cookie, then hydrate the profile. A 401 here just means "not logged in".
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { accessToken } = await authApi.refreshSession();
        if (cancelled) return;
        setAccessToken(accessToken);
        const me = await api.get<AuthUser>("/users/me");
        if (cancelled) return;
        applySession(accessToken, me);
      } catch {
        if (!cancelled) clearSession();
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refreshProfile = useCallback(async () => {
    const me = await api.get<AuthUser>("/users/me");
    setUser(me);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isStaff: user ? isStaffRole(user.role) : false,
      loginCustomer: applySession,
      loginStaff: applySession,
      logout,
      refreshProfile,
    }),
    [status, user, applySession, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
