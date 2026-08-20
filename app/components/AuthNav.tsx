"use client";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"ok" | "error" | "loading">("loading");

  async function checkHealth() {
    try {
      const res = await fetch("/api/health");
      setHealthStatus(res.ok ? "ok" : "error");
    } catch {
      setHealthStatus("error");
    }
  }

  async function fetchSession() {
    setLoading(true);
    setError(null);
    try {
      // Check for mock session first (for development)
      const mockSession = localStorage.getItem('mock_session');
      if (mockSession === 'true') {
        const mockUser = JSON.parse(localStorage.getItem('mock_user') || '{}');
        setLoggedIn(true);
        setUser(mockUser);
        setLoading(false);
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      const authCode = localStorage.getItem('auth_code');
      const headers: HeadersInit = {};
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      } else if (authCode) {
        headers['Authorization'] = `Bearer ${authCode}`;
      }
      
      const res = await fetch("/api/session", {
        headers
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const j = await res.json();
      setLoggedIn(Boolean(j?.loggedIn));
      setUser(j?.user ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
      setLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    checkHealth();
    fetchSession();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      const res = await fetch("/api/proxy/api/v1/auth/logout", { method: "POST" });
      // best-effort: ignore failures but refresh session
      await fetchSession();
    } catch (_) {
      await fetchSession();
    }
  }

  return (
    <nav className="max-w-4xl mx-auto flex items-center justify-between py-2">
      <div className="flex items-center gap-4">
        <a href="/" className="font-semibold text-lg text-slate-800">All API Frontend</a>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-medium uppercase tracking-wider text-slate-600">
          <div className={`h-2 w-2 rounded-full ${healthStatus === 'ok' ? 'bg-emerald-500' : healthStatus === 'error' ? 'bg-red-500' : 'bg-amber-400 animate-pulse'}`} />
          API {healthStatus === 'ok' ? 'Online' : healthStatus === 'error' ? 'Offline' : 'Checking'}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-slate-600">Checking login…</span>
          </div>
        ) : error ? (
          <span className="text-sm text-red-600">Error checking session</span>
        ) : loggedIn ? (
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</a>
            <div className="flex items-center gap-3">
              {(() => {
                const avatarUrl =
                  user?.avatar ||
                  user?.avatar_url ||
                  user?.picture ||
                  user?.image ||
                  user?.avatarUrl ||
                  user?.profile_image_url ||
                  null;

                const name = user?.name || user?.username || "User";

                if (avatarUrl) {
                  // eslint-disable-next-line @next/next/no-img-element
                  return <img src={avatarUrl} alt={`${name} profile`} className="h-8 w-8 rounded-full object-cover" onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />;
                }

                const initials = name
                  .split(" ")
                  .map((s: string) => s[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <div aria-hidden className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-700">
                    {initials}
                  </div>
                );
              })()}

              <span className="text-sm text-slate-800">{user?.name ?? user?.username ?? "User"}</span>
              <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors">Logout</button>
            </div>
          </div>
        ) : (
          <a href="/login" className="px-3 py-1 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-colors">Login</a>
        )}
      </div>
    </nav>
  );
}
