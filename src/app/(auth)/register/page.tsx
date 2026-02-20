"use client";

import {useState, useRef} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {Loader2, Mail, Lock, User, Phone, AlertTriangle, CheckCircle, Compass, MapPin} from "lucide-react";
import {api} from "@/lib/axios";

const BG_IMAGES = [
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop", // Mountains
    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2068&auto=format&fit=crop", // Beach
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop", // Forest Road
];

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        userName: "",
        userEmail: "",
        phoneNumber: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // 🎬 CINEMATIC BACKGROUND & ENTRANCE
    useGSAP(() => {
        if (!containerRef.current) return;

        // 1. Card Entrance Animation
        gsap.fromTo(cardRef.current,
            {y: 50, opacity: 0, rotationX: -10, scale: 0.95},
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                scale: 1,
                duration: 1.2,
                ease: "power3.out",
                transformPerspective: 1000,
                delay: 0.2
            }
        );

        // 2. Auto-Fading Travel Background (Ken Burns Effect)
        const images = gsap.utils.toArray(".bg-slide") as HTMLElement[];
        if (images.length > 1) {
            gsap.set(images, {opacity: 0, scale: 1});
            gsap.set(images[0], {opacity: 1, scale: 1.05});

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

                gsap.set(nextImg, {zIndex: 1, scale: 1});
                gsap.set(currentImg, {zIndex: 2});

                tl.to(nextImg, {opacity: 1, duration: transitionDuration, ease: "power2.inOut"}, 0)
                    .to(currentImg, {opacity: 0, duration: transitionDuration, ease: "power2.inOut"}, 0)
                    .to(nextImg, {scale: 1.05, duration: displayDuration + transitionDuration, ease: "none"}, 0);
            };

            const slideTimer = setTimeout(playNextImage, displayDuration * 1000);
            return () => clearTimeout(slideTimer);
        }
    }, {scope: containerRef});

    // 🖱️ 3D HOVER PHYSICS (Premium Glass Feel)
    const handle3DHover = (e: React.MouseEvent<HTMLElement>) => {
        if (loading || success) return;
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Dialed down strength slightly for a heavier, more elegant glass feel
        gsap.to(el, {
            rotationY: (x / rect.width) * 8,
            rotationX: -(y / rect.height) * 8,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000,
        });
    };

    const handle3DLeave = (e: React.MouseEvent<HTMLElement>) => {
        gsap.to(e.currentTarget, {rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)"});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match. Please try again.");
            setLoading(false);
            return;
        }

        try {
            await api.post("/auth/register", {
                userName: formData.userName,
                userEmail: formData.userEmail,
                phoneNumber: formData.phoneNumber,
                password: formData.password,
            });

            // Beautiful Success Sequence
            setSuccess(true);
            if (cardRef.current) {
                gsap.to(cardRef.current, {
                    rotationY: 0,
                    rotationX: 0,
                    scale: 1.02,
                    duration: 0.5,
                    ease: "back.out(1.5)"
                });
            }

            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err: any) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef}
             className="min-h-[100svh] flex items-center justify-center relative overflow-hidden bg-black py-20 perspective-[1000px] selection:bg-orange-600 selection:text-white">

            {/* 🌍 AUTO-CHANGING TRAVEL BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {BG_IMAGES.map((src, index) => (
                    <div key={index} className="bg-slide absolute inset-0 w-full h-full opacity-0">
                        <Image src={src} alt="Travel Destination" fill className="object-cover" priority={index === 0}/>
                    </div>
                ))}
                {/* Elegant Dark Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90 z-10"></div>
            </div>

            <div
                ref={cardRef}
                onMouseMove={handle3DHover}
                onMouseLeave={handle3DLeave}
                className="relative z-20 w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/20 p-8 md:p-12 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-shadow hover:shadow-[0_30px_80px_rgba(234,88,12,0.15)]"
            >
                <div className="text-center mb-10 relative z-10">
                    <div
                        className="mx-auto w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-full flex items-center justify-center text-orange-500 mb-6 shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                        <Compass size={32}/>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Start Your
                        Journey</h1>
                    <p className="text-zinc-300 font-medium">Join DD Tours to explore the world's beauty.</p>
                </div>

                {/* 🎬 Success Sequence */}
                {success ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center relative z-10">
                        <div
                            className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500">
                            <CheckCircle size={40}/>
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-wide mb-2">Account Created!</h3>
                        <p className="text-zinc-300 font-medium animate-pulse">Packing your bags... routing to
                            login.</p>
                    </div>
                ) : (
                    /* Registration Form */
                    <form onSubmit={handleRegister} className="space-y-5 relative z-10">

                        {error && (
                            <div
                                className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-medium shadow-inner animate-in fade-in">
                                <AlertTriangle size={18} className="shrink-0 mt-0.5"/>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1.5 group">
                            <label
                                className="text-xs font-bold text-zinc-300 group-focus-within:text-orange-500 transition-colors uppercase tracking-wider ml-1">Full
                                Name</label>
                            <div className="relative">
                                <User
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"
                                    size={18}/>
                                <input
                                    name="userName" type="text" required placeholder="John Doe" onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-base focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <label
                                className="text-xs font-bold text-zinc-300 group-focus-within:text-orange-500 transition-colors uppercase tracking-wider ml-1">Email
                                Address</label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"
                                    size={18}/>
                                <input
                                    name="userEmail" type="email" required placeholder="hello@example.com"
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-base focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 group">
                            <label
                                className="text-xs font-bold text-zinc-300 group-focus-within:text-orange-500 transition-colors uppercase tracking-wider ml-1">Phone
                                Number</label>
                            <div className="relative">
                                <Phone
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"
                                    size={18}/>
                                <input
                                    name="phoneNumber" type="tel" required placeholder="+91 00000 00000"
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-base focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5 group">
                                <label
                                    className="text-xs font-bold text-zinc-300 group-focus-within:text-orange-500 transition-colors uppercase tracking-wider ml-1">Password</label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"
                                        size={18}/>
                                    <input
                                        name="password" type="password" required placeholder="••••••••"
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-base focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 group">
                                <label
                                    className="text-xs font-bold text-zinc-300 group-focus-within:text-orange-500 transition-colors uppercase tracking-wider ml-1">Confirm
                                    Password</label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors"
                                        size={18}/>
                                    <input
                                        name="confirmPassword" type="password" required placeholder="••••••••"
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-base focus:outline-none focus:border-orange-500 focus:bg-white/10 transition-all placeholder:text-zinc-600 shadow-inner"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-white/10 disabled:text-zinc-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(234,88,12,0.4)] disabled:shadow-none"
                        >
                            {loading ? <><Loader2 className="animate-spin" size={20}/> Creating
                                Account...</> : "Sign Up"}
                        </button>
                    </form>
                )}

                <div className="mt-8 text-center relative z-10 border-t border-white/10 pt-6">
                    <p className="text-zinc-300 font-medium">
                        Already have an account?{" "}
                        <Link href="/login"
                              className="text-orange-500 hover:text-orange-400 font-bold hover:underline ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}