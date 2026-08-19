import React from "react";

export default async function HealthPage() {
  const res = await fetch(`/api/proxy/api/v1/health`, { cache: "no-store" });
  const data = await res.json().catch(() => ({}));

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Health</h1>
      <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
