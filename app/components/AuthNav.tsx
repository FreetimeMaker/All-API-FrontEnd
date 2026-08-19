"use client";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

export default function AuthNav() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchSession() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/session");
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
      <a href="/" className="font-semibold text-lg">All API Frontend</a>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-gray-500">Checking login…</span>
          </div>
        ) : error ? (
          <span className="text-sm text-red-600">Error checking session</span>
        ) : loggedIn ? (
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
                <div aria-hidden className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
                  {initials}
                </div>
              );
            })()}

            <span className="text-sm">{user?.name ?? user?.username ?? "User"}</span>
            <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600 text-white text-sm">Logout</button>
          </div>
        ) : (
          <a href="/login" className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Login</a>
        )}
      </div>
    </nav>
  );
}
