export type AdminUser = {
  _id: string;
  name?: string;
  email: string;
  role: string;
};

const USER_KEY = "admin_user";

export function getAdminUser(): AdminUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}

export function setAdminUser(user: AdminUser | null) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function clearAdminSession() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
}

export function isAdminUser(u: AdminUser | null): boolean {
  return u?.role === "admin";
}

export function isReadOnlyUser(u: AdminUser | null): boolean {
  return Boolean(u) && !isAdminUser(u);
}
