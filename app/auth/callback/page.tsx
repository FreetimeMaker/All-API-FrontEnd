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

    // After OAuth callback from API, redirect to dashboard
    // The cookies should already be set by the API
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Wird eingeloggt...</p>
      </div>
    </div>
  );
}