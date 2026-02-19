"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to refresh token immediately on mount
        // You need to update your auth.controller.ts to return 'user' data in refreshTokenHandler too
        // OR fetch /api/auth/me right after refreshing.

        // For now, assuming refresh-token returns { accessToken }
        const { data } = await api.post("/auth/refresh-token");

        if (data.accessToken) {
             // Ideally, decode the token or call /me to get user details
             // For now, let's just set the token so the app is "authenticated"
             // You really should add a /me endpoint to get the user name/role back

             // Temporary fix: set dummy user until you make a /me endpoint
             setAuth({ id: "init", name: "User", role: "USER" }, data.accessToken);
        }
      } catch (error) {
        // Use is not logged in, that's fine.
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setAuth]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0a0a0a] text-orange-500">
        <Loader2 className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return <>{children}</>;
}