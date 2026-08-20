"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "./components/Spinner";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/session")
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          setLoggedIn(true);
          router.push("/dashboard");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-20 px-6 sm:items-start">
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-4">
          v1.0.0
        </div>
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-gray-900 dark:text-white">
          All API <span className="text-blue-600">Frontend</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
          Verwalte dein Benutzerkonto, überprüfe deine Sicherheitsstatistiken und behalte den Überblick über deine Profilaktivitäten – alles an einem zentralen Ort.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all text-center"
          >
            Jetzt loslegen
          </Link>
          <Link
            href="/health"
            className="px-8 py-3 bg-white text-gray-700 border rounded-xl font-bold hover:bg-gray-50 transition-all text-center"
          >
            System Status
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full border-t pt-10">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">OAuth Login</h3>
            <p className="text-sm text-gray-500">Sichere Anmeldung über GitHub oder GitLab.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Proxy API</h3>
            <p className="text-sm text-gray-500">Nahtlose Integration deiner Backend-Dienste.</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Live Monitor</h3>
            <p className="text-sm text-gray-500">Echtzeit-Health-Checks für alle Endpunkte.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
