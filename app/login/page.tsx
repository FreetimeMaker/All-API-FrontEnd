"use client";
import React from "react";

export default function LoginPage() {
  function redirectTo(provider: "github" | "gitlab") {
    // Use browser navigation so redirects from upstream are followed normally
    window.location.href = `/api/proxy/api/v1/auth/${provider}`;
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="mt-2 text-sm text-gray-600">Bitte mit GitHub oder GitLab anmelden.</p>

      <div className="mt-6 flex flex-col gap-3 max-w-xs">
        <button onClick={() => redirectTo("github")} className="px-4 py-2 bg-black text-white rounded">Login with GitHub</button>
        <button onClick={() => redirectTo("gitlab")} className="px-4 py-2 bg-[#fc6d26] text-white rounded">Login with GitLab</button>
      </div>

      <p className="mt-4 text-sm text-gray-500">Hinweis: Vor jedem API-Aufruf prüft der Server die Health-API; wenn die API nicht verfügbar ist, wird die Anfrage abgelehnt.</p>
    </main>
  );
}
