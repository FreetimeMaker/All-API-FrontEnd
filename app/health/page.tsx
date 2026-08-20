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
    return <div className="p-8 text-slate-700">Loading...</div>;
  }

  return (
    <main className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900">Health</h1>
      <pre className="mt-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
