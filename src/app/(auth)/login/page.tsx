"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Loader2, Mail, Lock, AlertTriangle, Compass, ArrowRight } from "lucide-react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

const BG_IMAGES = [
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop", // Tropical Bay
    "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop", // Mountain Peaks
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop", // Serene Lake
];

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 🎬 CINEMATIC BACKGROUND & ENTRANCE
    useGSAP(() => {
        if (!containerRef.current) return;

        // 1. Card Entrance Animation
        gsap.fromTo(cardRef.current,
            { y: 50, opacity: 0, rotationX: -10, scale: 0.95 },
            { y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 1.2, ease: "power3.out", transformPerspective: 1000, delay: 0.2 }
        );

        // 2. Auto-Fading Travel Background (Ken Burns Effect)
        const images = gsap.utils.toArray(".bg-slide") as HTMLElement[];
        if (images.length > 1) {
            gsap.set(images, { opacity: 0, scale: 1 });
            gsap.set(images[0], { opacity: 1, scale: 1.05 });

            let currentIndex = 0;
            const displayDuration = 4;
            const transitionDuration = 2;

            const playNextImage = () => {
                const nextIndex = (currentIndex + 1) % images.length;
                const currentImg = images[currentIndex];
                const nextImg = images[nextIndex];

                const tl = gsap.timeline({
                    onComplete: () => {
                        currentIndex = nextIndex;
                        setTimeout(playNextImage, displayDuration * 1000);
                    }
                });

                gsap.set(nextImg, { zIndex: 1, scale: 1 });
                gsap.set(currentImg, { zIndex: 2 });

                tl.to(nextImg, { opacity: 1, duration: transitionDuration, ease: "power2.inOut" }, 0)
                    .to(currentImg, { opacity: 0, duration: transitionDuration, ease: "power2.inOut" }, 0)
                    .to(nextImg, { scale: 1.05, duration: displayDuration + transitionDuration, ease: "none" }, 0);
            };

            const slideTimer = setTimeout(playNextImage, displayDuration * 1000);
            return () => clearTimeout(slideTimer);
        }
    }, { scope: containerRef });

    // 🖱️ 3D HOVER PHYSICS (Premium Glass Feel)
    const handle3DHover = (e: React.MouseEvent<HTMLElement>) => {
        if (loading) return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            rotationY: (x / rect.width) * 8,
            rotationX: -(y / rect.height) * 8,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000,
        });
    };

    const handle3DLeave = (e: React.MouseEvent<HTMLElement>) => {
        gsap.to(e.currentTarget, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)" });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/auth/login", {
                userEmail: email,
                password: password,
            });

            setAuth(data.user, data.accessToken);

            // Smart Redirect or Home
            const redirectUrl = searchParams.get("redirect") || "/";

            // Mini success animation before redirect
            if (cardRef.current) {
                gsap.to(cardRef.current, { scale: 1.02, duration: 0.3, ease: "back.out(1.5)" });
            }

            router.push(redirectUrl);

        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
            setLoading(false);

            // Error shake animation
            if (cardRef.current) {
                gsap.fromTo(cardRef.current, { x: -10 }, { x: 0, duration: 0.4, ease: "elastic.out(2, 0.2)" });
            }
        }
    };

    return (
        <div ref={containerRef} className="min-h-[100svh] flex items-center justify-center relative overflow-hidden bg-black py-20 perspective-[1000px] selection:bg-orange-600 selection:text-white">

            {/* 🌍 AUTO-CHANGING TRAVEL BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {BG_IMAGES.map((src, index) => (
                    <div key={index} className="bg-slide absolute inset-0 w-full h-full opacity-0">
                        <Image src={src} alt="Travel Destination" fill className="object-cover" priority={index === 0} />
                    </div>
                ))}
                {/* Elegant Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 z-10"></div>
            </div>

            {/* 🪟 LOGIN CARD */}
            <div
                ref={cardRef}
                onMouseMove={handle3DHover}
                onMouseLeave={handle3DLeave}
                className="relative z-20 w-full max-w-[28rem] bg-black/40 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_30px_80px_rgba(234,88,12,0.15)] mx-4"
            >
                <div className="text-center mb-10 relative z-10">
                    <div className="mx-auto w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-500 mb-6 shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                        <Compass size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-zinc-300 font-medium">Sign in to access your itineraries.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6 relative z-10">

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-medium shadow-inner animate-in fade-in">
                            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-1.5 group">
                        <label className="text-xs font-bold text-zinc-300 group-focus-within:text-orange-500 transition-colors uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-base focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                                placeholder="hello@example.com"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5 group">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-bold text-zinc-300 group-focus-within:text-orange-500 transition-colors uppercase tracking-wider">Password</label>
                            <Link href="/forgot-password" className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors">
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white text-base focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-white/10 disabled:text-zinc-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,88,12,0.4)] disabled:shadow-none group"
                    >
                        {loading ? (
                            <><Loader2 className="animate-spin" size={20} /> Authenticating...</>
                        ) : (
                            <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center relative z-10 border-t border-white/10 pt-6">
                    <p className="text-zinc-300 font-medium">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-orange-500 hover:text-orange-400 font-bold hover:underline ml-1">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

// Wrap in Suspense because of useSearchParams (Next.js 13+ requirement for static generation)
export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-orange-600 w-10 h-10" /></div>}>
            <LoginContent />
        </Suspense>
    );
}