"use client";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/session")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Benutzerprofil</h1>
        <p className="text-gray-500">Verwalte deine Kontoeinstellungen und persönlichen Informationen.</p>
      </header>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600" />
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
              {user.avatar || user.avatar_url || user.picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatar || user.avatar_url || user.picture}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-3xl text-gray-400">
                  {user.name?.[0] || user.username?.[0] || "?"}
                </div>
              )}
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Profil bearbeiten
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name || "Kein Name angegeben"}</h2>
              <p className="text-gray-500 text-sm">@{user.username || "username"}</p>
            </div>

            <hr />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase">E-Mail Adresse</p>
                <p className="text-sm font-medium text-gray-900">{user.email || "Nicht hinterlegt"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase">Rolle</p>
                <p className="text-sm font-medium text-gray-900">Administrator</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase">Provider</p>
                <p className="text-sm font-medium text-gray-900">GitHub</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase">Mitglied seit</p>
                <p className="text-sm font-medium text-gray-900">August 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Sicherheit</h3>
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Zwei-Faktor-Authentisierung</p>
            <p className="text-xs text-gray-500">Zusätzlicher Schutz für dein Konto.</p>
          </div>
          <button className="text-sm text-blue-600 font-medium">Aktivieren</button>
        </div>
      </div>
    </div>
  );
}
