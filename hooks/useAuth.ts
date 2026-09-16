"use client";

import { useEffect, useState } from "react";
import {
  getToken,
  getRole,
  getUser,
  getAppKey,
  logout as authLogout,
  isAuthenticated as checkAuth,
} from "@/lib/auth";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [appKey, setAppKey] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setToken(getToken());
    setRole(getRole());
    setUser(getUser());
    setAppKey(getAppKey());
    setIsAuthenticated(checkAuth());
    setLoading(false);
  }, []);

  const logout = () => {
    authLogout();
    setToken(null);
    setRole(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    token,
    role,
    user,
    appKey,
    isAuthenticated,
    loading,
    logout,
  };
}
