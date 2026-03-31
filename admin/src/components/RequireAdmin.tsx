import { Navigate, useLocation } from "react-router";
import { getAdminToken } from "@/lib/api";
import { getAdminUser } from "@/lib/auth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const token = getAdminToken();
  const user = getAdminUser();
  const ok = Boolean(token && user);

  if (!ok) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
