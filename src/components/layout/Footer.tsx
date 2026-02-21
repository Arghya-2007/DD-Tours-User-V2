"use client";

import {useEffect, useState, useRef} from "react";
import Link from "next/link";
import {
    Facebook, Twitter, Instagram, Linkedin, Youtube,
    MapPin, Phone, Mail, ArrowRight
} from "lucide-react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {api} from "@/lib/axios";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export const Footer = () => {
    const footerRef = useRef<HTMLElement>(null);

    // 📡 Live System Settings State
    const [sysSettings, setSysSettings] = useState({
        siteName: "DD Tours & Travels",
        supportPhone: "+91 98765 43210",
        supportEmail: "support@ddtours.in",
    });

    // Fetch Global Settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Using the public endpoint so unauthenticated users can still see the footer data
                const {data} = await api.get("/settings/public");
                if (data?.success && data?.data) {
                    setSysSettings({
                        siteName: data.data.siteName || "DD Tours & Travels",
                        supportPhone: data.data.supportPhone || "+91 98765 43210",
                        supportEmail: data.data.supportEmail || "support@ddtours.in",
                    });
                }
            } catch (error) {
                console.warn("Using default footer settings (Backend fetch failed or unauthorized).");
            }
        };
        fetchSettings();
    }, []);

    useGSAP(() => {
        // 1. Check if the component itself is ready
        if (!footerRef.current) return;

        // 2. Wait 100ms for Next.js to finish building the DOM
        const timer = setTimeout(() => {

            // 3. Safely look for our custom scroll container
            const customScroller = document.querySelector("#main-scroll-container");

            gsap.fromTo(
                ".footer-col",
                {y: 50, opacity: 0},
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        // THE MAGIC: Only apply the scroller if it successfully found it
                        ...(customScroller ? {scroller: customScroller} : {}),
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        }, 100);

        // 4. Cleanup function to prevent memory leaks
        return () => clearTimeout(timer);

    }, {scope: footerRef});

    return (
        <footer ref={footerRef} className="bg-background border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
            {/* Subtle ambient glow in the background */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary opacity-[0.03] blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* 1. Brand Section */}
                    <div className="space-y-6 footer-col">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div
                                className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center font-black text-white text-xl shadow-[0_0_20px_var(--color-primary)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                                DD
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter truncate max-w-50"
                                  title={sysSettings.siteName}>
                                {sysSettings.siteName.split(' ')[0]} <span
                                className="text-primary">{sysSettings.siteName.split(' ').slice(1).join(' ')}</span>
                            </span>
                        </Link>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                            Crafting unforgettable journeys since 2020. We believe in sustainable, immersive, and
                            hassle-free travel experiences for the modern explorer.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:-translate-y-1 hover:shadow-[0_5px_15px_var(--color-primary)] transition-all duration-300"
                                >
                                    <Icon size={18}/>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div className="footer-col">
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Explore</h3>
                        <ul className="space-y-4">
                            {[
                                {label: "All Tours", href: "/tours"},
                                {label: "Travel Blogs", href: "/blogs"},
                                {label: "Wall of Love", href: "/reviews"},
                                {label: "About Us", href: "/about"},
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href}
                                          className="text-zinc-400 hover:text-white text-sm font-medium transition-all duration-300 flex items-center gap-3 group">
                                        <span
                                            className="w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-primary group-hover:scale-125 group-hover:shadow-[0_0_8px_var(--color-primary)] transition-all duration-300"/>
                                        <span
                                            className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Contact Info (CONNECTED TO DB) */}
                    <div className="footer-col">
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Contact</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4 text-zinc-400 text-sm group cursor-default">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                                    <MapPin size={18} className="text-primary"/>
                                </div>
                                <span className="mt-1 font-medium group-hover:text-zinc-200 transition-colors">DD Tours Headquarters,<br/>Ranaghat, West Bengal</span>
                            </li>
                            <li className="flex items-center gap-4 text-zinc-400 text-sm group cursor-pointer">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                                    <Phone size={18} className="text-primary"/>
                                </div>
                                <span
                                    className="font-medium group-hover:text-zinc-200 transition-colors">{sysSettings.supportPhone}</span>
                            </li>
                            <li className="flex items-center gap-4 text-zinc-400 text-sm group cursor-pointer">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 transition-colors">
                                    <Mail size={18} className="text-primary"/>
                                </div>
                                <span
                                    className="font-medium group-hover:text-zinc-200 transition-colors">{sysSettings.supportEmail}</span>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Newsletter */}
                    <div className="footer-col">
                        <h3 className="text-white font-bold text-lg mb-6 tracking-wide">Newsletter</h3>
                        <p className="text-zinc-400 text-sm font-medium mb-5">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-surface border border-white/10 rounded-xl py-3.5 pl-4 pr-14 text-white text-sm font-medium focus:border-primary focus:bg-surface-hover focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_var(--color-primary)] focus:outline-none transition-all duration-300"
                            />
                            <button
                                type="button"
                                className="absolute right-1.5 top-1.5 p-2 bg-linear-to-r from-primary to-accent rounded-lg text-white hover:scale-105 hover:shadow-[0_0_15px_var(--color-primary)] transition-all duration-300"
                            >
                                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform"/>
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar (CONNECTED TO DB) */}
                <div
                    className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 footer-col">
                    <p className="text-zinc-500 text-xs font-semibold tracking-wide">
                        © {new Date().getFullYear()} {sysSettings.siteName}. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link href="./privacy"
                              className="text-zinc-500 hover:text-primary font-medium text-xs transition-colors">Privacy
                            Policy</Link>
                        <Link href="./terms"
                              className="text-zinc-500 hover:text-primary font-medium text-xs transition-colors">Terms
                            of Service</Link>
                        <Link href="./cookies"
                              className="text-zinc-500 hover:text-primary font-medium text-xs transition-colors">Cookies</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};