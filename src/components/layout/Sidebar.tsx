"use client";
import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, BookOpen, Info, User, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Tours", href: "/tours", icon: Map },
    { name: "Reviews", href: "/reviews", icon: MessageSquare },
    { name: "Blogs", href: "/blogs", icon: BookOpen },
    { name: "About Us", href: "/about", icon: Info },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();
    const sidebarRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        gsap.fromTo(".nav-item", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.2 });
        gsap.fromTo(".brand-logo", { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
    }, { scope: sidebarRef });

    return (
        <aside
            ref={sidebarRef}
            // CRITICAL CLASSES: fixed, top-0, left-0, h-[100dvh], z-[100]
            className="hidden md:flex flex-col w-64 h-[100dvh] bg-[#050505] border-r border-white/5 fixed left-0 top-0 z-[100] shadow-2xl shadow-black overflow-y-auto"
        >
            <div className="p-6 border-b border-white/5 brand-logo shrink-0">
                <h1 className="text-3xl font-black text-white tracking-tighter">
                    DD <span className="text-[#FF4500] drop-shadow-[0_0_10px_rgba(255,69,0,0.5)]">Tours</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "nav-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                                isActive ? "bg-gradient-to-r from-[#FF4500] to-[#E63946] text-white shadow-[0_4px_20px_rgba(255,69,0,0.3)]" : "text-zinc-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon size={22} className={cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110 group-hover:text-[#FF4500]")} />
                            <span className="font-semibold tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 nav-item shrink-0">
                {isAuthenticated ? (
                    <Link href="/profile" className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all duration-300 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF4500] to-[#E63946] flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(255,69,0,0.4)] transition-transform duration-300 group-hover:scale-110">
                            {user?.name?.charAt(0).toUpperCase() || <User size={18}/>}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate w-32">{user?.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">Explorer</p>
                        </div>
                    </Link>
                ) : (
                    <Link href="/login" className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#FF4500]/10 text-[#FF4500] hover:bg-[#FF4500] hover:text-white border border-[#FF4500]/20 transition-all duration-300 group font-bold">
                        <LogIn size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sign In</span>
                    </Link>
                )}
            </div>
        </aside>
    );
}