"use client";
import {useRef} from "react";
import Link from "next/link";
import {Bell, Search, User} from "lucide-react";
import {useAuthStore} from "@/store/authStore";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

export function TopBar() {
    const {isAuthenticated, user} = useAuthStore();
    const topbarRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            topbarRef.current,
            {y: -50, opacity: 0},
            {y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.1}
        );
    }, {scope: topbarRef});

    return (
        <header
            ref={topbarRef}
            className="sticky top-0 z-40 w-full border-b border-white/5 bg-surface/70 backdrop-blur-xl supports-backdrop-filter:bg-surface/40 shadow-sm shadow-black">
            <div className="flex h-20 items-center justify-between px-4 md:px-8">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-6">
                    {/* Mobile Logo */}
                    <Link href="/" className="md:hidden font-black text-2xl text-white tracking-tighter">
                        DD <span className="text-primary">Tours</span>
                    </Link>

                    {/* Desktop Search Bar - Expanding Effect */}
                    <div
                        className="hidden md:flex items-center gap-3 bg-surface-hover px-5 py-2.5 rounded-full border border-white/5 focus-within:border-primary/50 focus-within:bg-surface focus-within:shadow-[0_0_15px_var(--color-primary)] transition-all duration-300 w-80 focus-within:w-96 group">
                        <Search size={18} className="text-zinc-500 group-focus-within:text-primary transition-colors"/>
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            className="bg-transparent border-none outline-none text-sm font-medium text-white placeholder:text-zinc-600 w-full"
                        />
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-5">
                    {/* Notification Bell with pulse effect */}
                    <button
                        className="relative p-2.5 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10 group">
                        <Bell size={22} className="group-hover:rotate-12 transition-transform"/>
                        <span
                            className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface shadow-[0_0_8px_var(--color-primary)] animate-pulse"></span>
                    </button>

                    {/* DYNAMIC Mobile Profile Icon */}
                    {isAuthenticated ? (
                        <Link
                            href="/profile"
                            className="md:hidden w-10 h-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_var(--color-primary)] border-2 border-surface"
                        >
                            {user?.name?.charAt(0).toUpperCase() || <User size={18}/>}
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="md:hidden text-[11px] font-black uppercase tracking-widest text-primary border border-primary/30 bg-primary/10 px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all shadow-lg"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}