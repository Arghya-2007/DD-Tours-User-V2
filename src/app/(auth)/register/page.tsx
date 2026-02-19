"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Loader2, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "" // Frontend only validation
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Animation Refs
  const cardRef = useRef(null);
  const containerRef = useRef(null);

  // GSAP Entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 30, opacity: 0, duration: 1, ease: "power3.out",
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // 1. Basic Client Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // 2. Call Backend API
      await api.post("/auth/register", {
        userName: formData.userName,
        userEmail: formData.userEmail,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      // 3. Success Feedback
      setSuccess(true);

      // 4. Redirect after a brief pause
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a] py-10">

      {/* Background Visuals */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />

      <div
        ref={cardRef}
        className="relative z-10 w-full max-w-lg bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-zinc-400">Join DD Tours and start exploring</p>
        </div>

        {/* Success Message */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white">Account Created!</h3>
            <p className="text-zinc-400 mt-2">Redirecting you to login...</p>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-zinc-500" size={18} />
              <input
                name="userName"
                type="text"
                required
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-zinc-500" size={18} />
              <input
                name="userEmail"
                type="email"
                required
                placeholder="Email Address"
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 text-zinc-500" size={18} />
              <input
                name="phoneNumber"
                type="tel"
                required
                placeholder="Phone Number"
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-zinc-500" size={18} />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-zinc-500" size={18} />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium hover:underline">
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}