"use client";

import {useLayoutEffect, useEffect, useState, useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {
    Globe, ShieldCheck, Heart, Users, Map, Smartphone,
    ArrowRight, Award, Star, Crosshair, Radar, Fingerprint,
    Phone, Mail, MapPin, Crown, Zap, Briefcase,
    Target
} from "lucide-react";
import {api} from "@/lib/axios";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
    const mainRef = useRef<HTMLDivElement>(null);

    // 📡 Live System Settings State
    const [sysSettings, setSysSettings] = useState({
        siteName: "DD Tours & Travels",
        supportPhone: "+91 98765 43210",
        supportEmail: "intel@ddtours.com",
    });

    // Fetch Global Settings on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Adjust this endpoint if you create a specific public route like '/settings/public'
                const {data} = await api.get("/settings/public");
                if (data?.success && data?.data) {
                    setSysSettings({
                        siteName: data.data.siteName || "DD Tours & Travels",
                        supportPhone: data.data.supportPhone || "+91 98765 43210",
                        supportEmail: data.data.supportEmail || "intel@ddtours.com",
                    });
                }
            } catch (error) {
                console.warn("Using encrypted offline comms data (Backend fetch failed or unauthorized).");
            }
        };
        fetchSettings();
    }, []);

    useLayoutEffect(() => {
        const customScroller = document.querySelector("#main-scroll-container");
        const scrollerTarget = customScroller || window;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // 1. Cinematic Background & Hero Animation
            tl.fromTo(".bg-grid-overlay", {opacity: 0}, {opacity: 0.4, duration: 2, ease: "power2.inOut"}, 0)
                .fromTo(".bg-glow", {scale: 0.8, opacity: 0}, {
                    scale: 1,
                    opacity: 1,
                    duration: 2.5,
                    ease: "power3.out"
                }, 0)
                .fromTo(".hero-text",
                    {y: 60, opacity: 0, rotationX: -30},
                    {
                        y: 0,
                        opacity: 1,
                        rotationX: 0,
                        duration: 1.5,
                        ease: "expo.out",
                        stagger: 0.15,
                        transformPerspective: 1000
                    },
                    0.3
                );

            // 2. Stats Counter
            gsap.fromTo(".stat-item",
                {y: 60, opacity: 0, rotationX: 45, scale: 0.9},
                {
                    y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 1, stagger: 0.1, ease: "back.out(1.5)",
                    scrollTrigger: {trigger: ".stats-section", scroller: scrollerTarget, start: "top 85%"}
                }
            );

            // 3. Sections Reveal
            gsap.utils.toArray(".reveal-section").forEach((section: any) => {
                gsap.fromTo(section,
                    {y: 60, opacity: 0, filter: "blur(15px)"},
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {trigger: section, scroller: scrollerTarget, start: "top 85%"}
                    }
                );
            });

            // 4. Team Stagger
            gsap.fromTo(".team-card",
                {y: 80, opacity: 0, rotationY: 20, scale: 0.95},
                {
                    y: 0, opacity: 1, rotationY: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "expo.out",
                    scrollTrigger: {trigger: ".team-section", scroller: scrollerTarget, start: "top 85%"}
                }
            );

            // 5. Contact Node Reveal
            gsap.fromTo(".contact-node",
                {scale: 0.8, opacity: 0, rotationZ: -5},
                {
                    scale: 1, opacity: 1, rotationZ: 0, duration: 1, stagger: 0.2, ease: "back.out(1.5)",
                    scrollTrigger: {trigger: ".contact-section", scroller: scrollerTarget, start: "top 85%"}
                }
            );

        }, mainRef);

        return () => ctx.revert();
    }, [sysSettings]); // Added sysSettings as dependency so GSAP plays nice with fetched data

    // 🖱️ UNIVERSAL 3D HOVER PHYSICS
    const handle3DHover = (e: React.MouseEvent<HTMLElement>, strength: number = 8) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            rotationY: (x / rect.width) * strength,
            rotationX: -(y / rect.height) * strength,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 1000,
        });
    };

    const handle3DLeave = (e: React.MouseEvent<HTMLElement>) => {
        gsap.to(e.currentTarget, {rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)"});
    };

    return (
        <div ref={mainRef}
             className="pb-20 md:pb-32 overflow-hidden bg-[#020202] text-white selection:bg-orange-600 relative perspective-[1000px]">

            {/* 🌐 ULTRA-REALISTIC TACTICAL GRID & AMBIENT GLOWS */}
            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
            <div
                className="bg-glow absolute top-[10%] left-[-10%] w-[60vw] h-[60vw] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse"></div>
            <div
                className="bg-glow absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            {/* 🌍 HERO */}
            <div
                className="relative w-full h-[70vh] md:h-[85vh] flex items-center justify-center overflow-hidden mb-20 md:mb-32 rounded-b-[2rem] md:rounded-b-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.9)] border-b border-white/10 z-10">
                <div className="absolute inset-0 z-0 bg-[#050505]">
                    <Image
                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                        alt="Travel Adventure" fill className="object-cover opacity-40" priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent"/>
                </div>
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
                    <div
                        className="hero-text inline-flex items-center gap-2 px-5 py-2 rounded-md bg-white/5 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-6 shadow-2xl">
                        <Globe size={14} className="text-orange-500"/> Operational Since 2020
                    </div>
                    <h1 className="hero-text text-6xl md:text-8xl lg:text-[8rem] font-black text-white tracking-tighter mb-6 leading-[0.85] drop-shadow-[0_0_40px_rgba(0,0,0,1)] uppercase">
                        WE CRAFT <br/> <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">MEMORIES</span>
                    </h1>
                    <p className="hero-text text-base md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-medium">
                        Your global access point to the world's most breathtaking, secure, and unforgettable expedition
                        experiences.
                    </p>
                </div>
            </div>

            {/* 📊 TACTICAL STATS */}
            <div className="stats-section max-w-7xl mx-auto px-4 md:px-8 mb-24 md:mb-32 relative z-10">
                <div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-6 md:p-12 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">

                    <div
                        className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[80px] rounded-full pointer-events-none"></div>

                    {[
                        {label: "Active Operatives", value: "2,000+", icon: Users, color: "text-blue-500"},
                        {label: "Targets Cleared", value: "15+", icon: Target, color: "text-emerald-500"},
                        {label: "Years in Field", value: "5+", icon: Award, color: "text-purple-500"},
                        {label: "Global Rating", value: "4.9/5", icon: Star, color: "text-orange-500"},
                    ].map((stat, i) => (
                        <div
                            key={i}
                            onMouseMove={(e) => handle3DHover(e, 15)}
                            onMouseLeave={handle3DLeave}
                            className="stat-item text-center p-6 rounded-2xl border border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all cursor-default relative z-10 shadow-lg"
                        >
                            <div className={`flex justify-center mb-4 ${stat.color}`}>
                                <stat.icon size={32}/>
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">{stat.value}</h3>
                            <p className="text-zinc-400 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🚀 THE DIRECTIVE */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24 md:mb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <div className="reveal-section space-y-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-4">
                                <span className="w-1.5 h-10 bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.8)]"/>
                                Core Directive
                            </h2>
                            <p className="text-zinc-300 leading-relaxed text-base md:text-lg font-medium">
                                We believe travel should be seamless, secure, and soul-stirring. Our directive is to
                                eliminate logistical friction, allowing operatives to focus entirely on the experience
                                of the environment.
                            </p>
                        </div>

                        <div
                            className="bg-[#111]/80 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl">
                            <h2 className="text-xl md:text-2xl font-black text-white mb-8 uppercase tracking-widest flex items-center gap-3">
                                <Fingerprint size={24} className="text-emerald-500"/> Infrastructure
                            </h2>
                            <ul className="space-y-6">
                                {["Encrypted Booking Engine", "Secure Transaction Gateways", "Personalized Intel Dashboards", "24/7 Global Surveillance (Support)"].map((item, i) => (
                                    <li key={i}
                                        className="flex items-center gap-4 text-zinc-200 font-medium text-sm md:text-base">
                                        <div
                                            className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                            <ShieldCheck size={18}/>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div
                        className="reveal-section relative h-[500px] md:h-[650px] rounded-[3rem] overflow-hidden border border-white/10 group shadow-[0_30px_80px_rgba(0,0,0,0.8)] cursor-default"
                        onMouseMove={(e) => handle3DHover(e, 5)}
                        onMouseLeave={handle3DLeave}
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                            alt="Command Center" fill
                            className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out opacity-70"/>
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/50 to-transparent"/>

                        <div
                            className="absolute top-8 right-8 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-xl">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                            <span
                                className="text-red-500 font-mono text-[10px] uppercase tracking-widest">LIVE FEED</span>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                            <div
                                className="bg-black/70 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50"></div>
                                <p className="text-white font-medium italic text-base md:text-lg leading-relaxed">"Technology
                                    links the network, but the physical environment connects the soul."</p>
                                <div className="mt-6 flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white shadow-inner">
                                        AP
                                    </div>
                                    <div>
                                        <div
                                            className="text-white font-black uppercase tracking-wider text-sm md:text-base">Arghya
                                            Pal
                                        </div>
                                        <div
                                            className="text-orange-500 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">Lead
                                            Technical Engineer
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 👥 COMMAND HIERARCHY (TEAM) */}
            <div className="team-section max-w-7xl mx-auto px-4 md:px-8 mb-24 md:mb-32 relative z-10">
                <div className="text-center mb-16">
                    <div
                        className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-mono uppercase tracking-[0.3em] mb-4">
                        <ShieldCheck size={14}/> Vanguard Unit
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Command <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Hierarchy</span>
                    </h2>
                    <p className="text-zinc-400 font-medium tracking-wide">The architects behind your global
                        deployments.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            role: "Commander / Founder",
                            name: "Arghya Pal",
                            icon: Crown,
                            img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
                            color: "text-orange-500",
                            glow: "shadow-orange-500/20"
                        },
                        {
                            role: "Vanguard Co-Founder",
                            name: "Aarav Sharma",
                            icon: Zap,
                            img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
                            color: "text-emerald-500",
                            glow: "shadow-emerald-500/20"
                        },
                        {
                            role: "Logistics Manager",
                            name: "Priya Desai",
                            icon: Briefcase,
                            img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
                            color: "text-blue-500",
                            glow: "shadow-blue-500/20"
                        }
                    ].map((member, i) => (
                        <div
                            key={i}
                            onMouseMove={(e) => handle3DHover(e, 10)}
                            onMouseLeave={handle3DLeave}
                            className={`team-card p-6 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all group relative overflow-hidden shadow-2xl ${member.glow}`}
                        >
                            <div
                                className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-6 border border-white/10 bg-[#111]">
                                <Image src={member.img} alt={member.name} fill
                                       className="object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80"/>
                                <div
                                    className={`absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center ${member.color}`}>
                                    <member.icon size={20}/>
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight pl-2">{member.name}</h3>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] pl-2">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 📡 SECURE COMMS RELAY (CONTACT) - 🔌 CONNECTED TO DB */}
            <div className="contact-section max-w-7xl mx-auto px-4 md:px-8 mb-24 md:mb-32 relative z-10">
                <div
                    className="bg-[#111]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                        <div
                            className="absolute right-[-10%] top-[-20%] w-[600px] h-[600px] rounded-full border-[1px] border-white/20 animate-[spin_20s_linear_infinite]"></div>
                        <div
                            className="absolute right-[5%] top-[5%] w-[400px] h-[400px] rounded-full border-[1px] border-white/20 animate-[spin_15s_linear_infinite_reverse]"></div>
                    </div>

                    <div className="text-center md:text-left mb-12 relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter flex items-center justify-center md:justify-start gap-4">
                            <Radar size={40} className="text-blue-500"/> Secure Comms Relay
                        </h2>
                        <p className="text-zinc-400 font-medium tracking-wide">Establish a direct line
                            to {sysSettings.siteName} Headquarters for operational support.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {[
                            {
                                title: "Voice Uplink",
                                value: sysSettings.supportPhone,
                                desc: "Available 24/7 for active agents",
                                icon: Phone,
                                color: "text-emerald-500",
                                border: "border-emerald-500/30",
                                bg: "bg-emerald-500/10"
                            },
                            {
                                title: "Encrypted Mail",
                                value: sysSettings.supportEmail,
                                desc: "Response within 1200 hours",
                                icon: Mail,
                                color: "text-orange-500",
                                border: "border-orange-500/30",
                                bg: "bg-orange-500/10"
                            },
                            {
                                title: "HQ Coordinates",
                                value: "Simurali, West Bengal, India",
                                desc: "Kolkata Base Station",
                                icon: MapPin,
                                color: "text-blue-500",
                                border: "border-blue-500/30",
                                bg: "bg-blue-500/10"
                            }
                        ].map((contact, i) => (
                            <div
                                key={i}
                                onMouseMove={(e) => handle3DHover(e, 12)}
                                onMouseLeave={handle3DLeave}
                                className="contact-node p-8 rounded-[2rem] bg-black/50 border border-white/10 hover:border-white/30 transition-all cursor-default shadow-xl"
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl ${contact.bg} ${contact.border} border flex items-center justify-center mb-6 shadow-inner ${contact.color}`}>
                                    <contact.icon size={20}/>
                                </div>
                                <h3 className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-2">{contact.title}</h3>
                                <p className="text-white font-bold text-lg tracking-wide mb-2 truncate">{contact.value}</p>
                                <p className="text-zinc-600 text-xs font-medium">{contact.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🏁 INITIATION CTA */}
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <div
                    className="reveal-section relative rounded-[3rem] overflow-hidden px-6 py-24 text-center bg-black border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent opacity-60"/>

                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter">Ready
                            for Deployment?</h2>
                        <p className="text-zinc-400 mb-10 max-w-lg font-medium text-lg">Access the global database and
                            secure your next mission coordinates today.</p>
                        <Link
                            href="/tours"
                            className="px-12 py-5 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:shadow-[0_0_60px_rgba(234,88,12,0.6)] active:scale-95 border border-transparent"
                        >
                            Access Archives <ArrowRight size={18}/>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
}