import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { setAdminToken } from "@/lib/api";
import { setAdminUser, type AdminUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "https://intelligent-upliftment-production.up.railway.app";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post<{
        success?: boolean;
        token?: string;
        user?: AdminUser;
        message?: string;
      }>(`${baseURL}/api/auth/login`, { email: email.trim(), password });

      if (!data.token || !data.user) {
        toast.error(data.message || "Login failed.");
        return;
      }
      if (data.user.role !== "admin") {
        toast.error("Access denied. Admin role required.");
        return;
      }
      setAdminToken(data.token);
      setAdminUser(data.user);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object" && "message" in err.response.data
          ? String((err.response.data as { message: string }).message)
          : "Login failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <h1 className="text-2xl font-bold text-white">
          NavzaBD <span className="text-indigo-400">Admin</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">Sign in to manage the store</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-white outline-none ring-indigo-500/30 focus:ring-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 text-sm text-white outline-none ring-indigo-500/30 focus:ring-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-500"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          <Link to="/register" className="text-indigo-400 hover:underline">
            Create account
          </Link>{" "}
          · Storefront is separate
        </p>
      </div>
    </div>
  );
};

export default Login;
