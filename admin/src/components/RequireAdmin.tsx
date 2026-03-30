import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import { getAdminToken } from "@/lib/api";
import { getAdminUser, isAdminUser } from "@/lib/auth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    const user = getAdminUser();
    setOk(Boolean(token && isAdminUser(user)));
  }, [location.pathname]);

  if (ok === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    );
  }

  if (!ok) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
