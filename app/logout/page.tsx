"use client";
import React, { useState } from "react";

export default function LogoutPage() {
  const [result, setResult] = useState<any>(null);

  async function handleLogout() {
    const res = await fetch(`/api/proxy/api/v1/auth/logout`, { method: "POST" });
    const data = await res.json().catch(() => ({ message: "No JSON" }));
    setResult({ status: res.status, body: data });
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Logout</h1>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Call Logout</button>
      {result && <pre className="mt-4 bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
