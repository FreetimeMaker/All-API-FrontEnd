"use client";
import React, { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/session")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  const accountStats = [
    { title: "Konto-Status", value: "Aktiv", change: "Verifiziert", icon: "🛡️" },
    { title: "Letzter Login", value: "Heute", change: "Vor 2h", icon: "🕒" },
    { title: "Sicherheit", value: "Hoch", change: "90%", icon: "🔐" },
    { title: "Verknüpfte Dienste", value: "GitHub", change: "1 Aktiv", icon: "🔗" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Konto-Übersicht</h1>
        <p className="text-gray-500">Willkommen, {user?.name || user?.username || "Benutzer"}. Verwalte hier deine persönlichen Kontodetails und Einstellungen.</p>
      </header>

      {/* Account Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accountStats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-blue-50 text-blue-600 border border-blue-100">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Konto-Aktivität</h2>
            <button className="text-xs text-blue-600 hover:underline">Alle anzeigen</button>
          </div>
          <div className="p-4">
            <ul className="space-y-4">
              <li className="flex items-center gap-4 text-sm">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">
                  LG
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Erfolgreicher Login</p>
                  <p className="text-gray-500 text-xs">Chrome auf macOS • Berlin, DE</p>
                </div>
                <span className="text-xs text-gray-400">Vor 2 Stunden</span>
              </li>
              <li className="flex items-center gap-4 text-sm">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                  PR
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Profilbild aktualisiert</p>
                  <p className="text-gray-500 text-xs">Synchronisiert von GitHub</p>
                </div>
                <span className="text-xs text-gray-400">Gestern, 18:45</span>
              </li>
              <li className="flex items-center gap-4 text-sm">
                <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-xs font-bold">
                  SC
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">Sicherheits-Check durchgeführt</p>
                  <p className="text-gray-500 text-xs">Keine verdächtigen Aktivitäten gefunden</p>
                </div>
                <span className="text-xs text-gray-400">14. Aug 2026</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Account Shortcuts */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-900">Konto-Aktionen</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <a href="/dashboard/profile" className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-lg border flex items-center gap-2">
              👤 Profil bearbeiten
            </a>
            <button className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-lg border flex items-center gap-2">
              🔒 Passwort ändern
            </button>
            <button className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-gray-50 rounded-lg border flex items-center gap-2">
              📧 E-Mail Einstellungen
            </button>
            <div className="mt-2 pt-2 border-t">
              <button className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2 transition-colors">
                🚪 Abmelden
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
