"use client";
import React, { useEffect, useState } from "react";

export default function HealthPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Health check failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-300 bg-slate-950 min-h-screen">Loading...</div>;
  }

  return (
    <main className="p-8 bg-slate-950 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-4">Health</h1>
      <pre className="mt-4 bg-slate-900 p-4 rounded-lg border border-slate-800 shadow-sm text-slate-100">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
