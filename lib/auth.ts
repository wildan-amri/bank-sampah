export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function getAppKey(): string | null {
  const defaultKey = process.env.NEXT_PUBLIC_DEFAULT_APP_KEY?.trim() || null;
  if (typeof window === "undefined") return defaultKey;

  const stored = localStorage.getItem("appKey");
  if (stored && stored.trim() !== "") {
    return stored.trim();
  }

  // Auto-initialize with default pre-configured key so manual registration is NEVER required
  if (defaultKey) {
    localStorage.setItem("appKey", defaultKey);
    return defaultKey;
  }

  return null;
}

export function setAppKey(appKey: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("appKey", appKey.trim());
}

export function getRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role");
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export function saveAuth(token: string, role: string, user?: any): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.username) {
      localStorage.setItem("username", user.username);
    }
  }
}

/**
 * Logout clears session token and user data, but preserves appKey (multi-tenant)
 */
export function logout(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("username");
}

/**
 * Reset tenant restores the default app key
 */
export function resetTenant(): void {
  if (typeof window === "undefined") return;
  const defaultKey = process.env.NEXT_PUBLIC_DEFAULT_APP_KEY?.trim();
  if (defaultKey) {
    localStorage.setItem("appKey", defaultKey);
  } else {
    localStorage.removeItem("appKey");
  }
  logout();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}