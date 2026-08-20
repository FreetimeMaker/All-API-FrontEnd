"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for error parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    
    if (error) {
      console.error("OAuth error:", error);
      router.push("/login?error=" + encodeURIComponent(error));
      return;
    }

    // Log callback parameters for debugging
    console.log("Auth callback received params:", Object.fromEntries(urlParams.entries()));

    // Wait a moment for cookies to be set, then redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-300">Wird eingeloggt...</p>
        <p className="text-slate-500 text-sm mt-2">Session wird überprüft...</p>
      </div>
    </div>
  );
}