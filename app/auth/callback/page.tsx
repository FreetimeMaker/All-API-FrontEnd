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

    // Check for access_token in the callback parameters
    const accessToken = searchParams.get("access_token");
    const tokenType = searchParams.get("token_type") || "Bearer";
    const expiresIn = searchParams.get("expires_in");
    
    if (accessToken) {
      console.log("Access token received, storing in localStorage");
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('token_type', tokenType);
      
      if (expiresIn) {
        const expiresAt = Date.now() + (parseInt(expiresIn) * 1000);
        localStorage.setItem('token_expires_at', expiresAt.toString());
      }
      
      // Fetch user info using the access token
      fetchUserInfo(accessToken, router);
    } else {
      // Fallback to mock session if no token is provided
      console.log("No access token received, using mock session");
      localStorage.setItem('mock_session', 'true');
      localStorage.setItem('mock_user', JSON.stringify({
        name: "Test User",
        username: "testuser",
        email: "test@example.com"
      }));

      // Verify the values were set
      console.log("Mock session set:", localStorage.getItem('mock_session'));
      console.log("Mock user set:", localStorage.getItem('mock_user'));

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        console.log("Redirecting to dashboard");
        router.push("/dashboard");
      }, 1000);
    }
  }, [router, searchParams]);

  async function fetchUserInfo(accessToken: string, router: any) {
    try {
      const API_BASE = process.env.API_BASE || "https://all-api-node.vercel.app";
      const response = await fetch(`${API_BASE}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("User data fetched:", userData);
        
        // Store user info in localStorage
        localStorage.setItem('user_info', JSON.stringify(userData));
        localStorage.setItem('auth_token', accessToken); // Alternative key for consistency
        
        // Redirect to dashboard
        setTimeout(() => {
          console.log("Redirecting to dashboard with token");
          router.push("/dashboard");
        }, 500);
      } else {
        console.error("Failed to fetch user info:", response.status);
        // Still redirect to dashboard, the session check will handle auth failure
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Still redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-300">Authentifizierung wird verarbeitet...</p>
        <p className="text-slate-500 text-sm mt-2">Token werden abgerufen und gespeichert...</p>
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