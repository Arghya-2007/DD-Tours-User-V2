// src/components/providers/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 🚨 Extract both setAuth AND logout from the store
  const { setAuth, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Attempt to validate the 7-day cookie
        const { data } = await api.post("/auth/refresh-token");

        if (data.accessToken && data.user) {
             // Cookie is valid! Log them in silently.
             setAuth(data.user, data.accessToken);
        }
      } catch (error) {
        // 🚨 THE FIX: Cookie is expired, invalid, or missing.
        logout();
      } finally {
        // Always drop the loading screen so they can see the website
        setLoading(false);
      }
    };

    initAuth();
  }, [setAuth, logout]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="animate-spin text-orange-600 w-10 h-10" />
      </div>
    );
  }

  return <>{children}</>;
}