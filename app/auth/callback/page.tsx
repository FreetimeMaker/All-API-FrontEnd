"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error parameters from URL
    const error = searchParams.get("error");
    const access_token = searchParams.get("access_token");
    const next = searchParams.get("next") || "/dashboard";
    
    if (error) {
      console.error("OAuth error:", error);
      router.push("/login?error=" + encodeURIComponent(error));
      return;
    }

    // Log callback parameters for debugging
    console.log("Auth callback received params:", Object.fromEntries(searchParams.entries()));

    // If we have an access_token, store it in localStorage
    if (access_token) {
      console.log("Storing access token");
      localStorage.setItem('access_token', access_token);
    }

    // Wait a moment for any cookies to be set, then redirect to the next page
    setTimeout(() => {
      router.push(next);
    }, 1000);
  }, [router, searchParams]);

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

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-slate-950"><p className="text-slate-300">Loading...</p></div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}