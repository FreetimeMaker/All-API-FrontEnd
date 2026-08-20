"use client";
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error parameters from URL
    const error = searchParams.get("error");
    
    if (error) {
      console.error("OAuth error:", error);
      router.push("/login?error=" + encodeURIComponent(error));
      return;
    }

    // Log callback parameters for debugging
    console.log("Auth callback received params:", Object.fromEntries(searchParams.entries()));

    // Since the API handles OAuth completely without returning tokens to us,
    // we'll set a mock session for development purposes
    // In production, this would need proper API integration
    localStorage.setItem('mock_session', 'true');
    localStorage.setItem('mock_user', JSON.stringify({
      name: "Test User",
      username: "testuser",
      email: "test@example.com"
    }));

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-300">Login erfolgreich...</p>
        <p className="text-slate-500 text-sm mt-2">Weiterleitung zum Dashboard...</p>
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