"use client";
import {useRef} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Home, Map, MessageSquare, BookOpen, Info} from "lucide-react";
import {cn} from "@/lib/utils";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

const navItems = [
    {name: "Home", href: "/", icon: Home},
    {name: "Tours", href: "/tours", icon: Map},
    {name: "Reviews", href: "/reviews", icon: MessageSquare},
    {name: "Blogs", href: "/blogs", icon: BookOpen},
    {name: "About Us", href: "/about", icon: Info},
];

export function BottomNav() {
    const pathname = usePathname();
    const navRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(navRef.current, {y: 100, opacity: 0}, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.3
        });
    }, {scope: navRef});

    return (
        <div
            ref={navRef}
            className="md:hidden w-full bg-surface/90 backdrop-blur-xl border-t border-white/10 z-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
            <div className="flex justify-around items-center h-20 px-2 pb-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                                isActive ? "text-primary -translate-y-1" : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2}
                                       className="transition-all duration-300"/>
                            <span className="text-[10px] font-bold tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}