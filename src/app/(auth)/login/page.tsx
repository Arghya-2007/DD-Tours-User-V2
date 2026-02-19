"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Animation Refs
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  // GSAP Entrance Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Call your Backend API
      const { data } = await api.post("/auth/login", {
        userEmail: email,
        password: password,
      });

      // 2. Save User & Token to Store
      // (Your backend returns: { success: true, user: {...}, accessToken: "..." })
      setAuth(data.user, data.accessToken);

      // 3. Redirect to Home
      router.push("/");

    } catch (err: any) {
      // Handle Errors
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">

      {/* Background Glow (Optional Visual) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />

      {/* Login Card */}
      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-md bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Sign in to continue to DD Tours</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">

          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <Link href="/forgot-password" className="text-xs text-orange-500 hover:text-orange-400">
                    Forgot password?
                </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-zinc-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-orange-500 hover:text-orange-400 font-medium hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}