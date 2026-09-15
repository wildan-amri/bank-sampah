export function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export function getAppKey() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("appKey");
}

export function saveAuth(token: string, appKey: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("appKey", appKey);
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("appKey");
  localStorage.removeItem("role");
}