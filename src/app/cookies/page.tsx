"use client";

import {useRef} from "react";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {Radar, ArrowLeft, Cookie} from "lucide-react";
import {useRouter} from "next/navigation";

export default function CookiesPage() {
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.fromTo(".bg-grid-overlay", {opacity: 0}, {opacity: 0.5, duration: 1.5, ease: "power2.inOut"}, 0)
            .fromTo(".header-anim", {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 1, ease: "expo.out"}, 0.2)
            .fromTo(".prose-anim > *",
                {y: 20, opacity: 0},
                {y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "power2.out"},
                0.5
            );
    }, {scope: containerRef});

    return (
        <div ref={containerRef}
             className="min-h-screen bg-[#020202] text-white selection:bg-blue-600 relative pb-24 overflow-hidden">

            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 fixed"></div>
            <div
                className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 md:pt-32 relative z-10">

                <button onClick={() => router.back()}
                        className="header-anim flex items-center gap-2 text-zinc-400 hover:text-blue-500 font-mono text-xs uppercase tracking-widest transition-colors mb-12">
                    <ArrowLeft size={16}/> Return to Base
                </button>

                <div className="header-anim mb-16 border-b border-white/10 pb-10">
                    <div
                        className="flex items-center gap-3 text-blue-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4">
                        <Radar size={16}/> Tracking & Beacons
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-xl">
                        Cookie <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Policy</span>
                    </h1>
                    <p className="text-zinc-400 font-medium tracking-wide">Last Updated: October 2023 • DD Tours &
                        Travels</p>
                </div>

                <div
                    className="prose-anim prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-blue-500">
                    <h2>1. What Are Cookies?</h2>
                    <p>Cookies are small digital beacons stored on your terminal (browser) when you visit DD Tours. They
                        allow our systems to remember your authorization status, preferences, and session data.</p>

                    <h2>2. How We Use Them</h2>
                    <ul>
                        <li><strong>Essential Beacons (Required):</strong> Used to maintain your secure uplink (login
                            session) so you do not have to re-authenticate on every page.
                        </li>
                        <li><strong>Analytics Beacons:</strong> Used to track which expedition pages are most popular,
                            helping us improve our mission offerings.
                        </li>
                        <li><strong>Performance Beacons:</strong> Helps our servers route data to you faster based on
                            your global coordinates.
                        </li>
                    </ul>

                    <div
                        className="bg-[#111] border border-white/10 p-6 rounded-2xl my-8 flex items-start gap-4 shadow-xl">
                        <Cookie className="text-blue-500 shrink-0 mt-1" size={24}/>
                        <p className="m-0 text-sm text-zinc-300">We do not use tracking cookies for aggressive
                            third-party marketing or cross-site surveillance.</p>
                    </div>

                    <h2>3. Managing Your Preferences</h2>
                    <p>You have the authority to block non-essential cookies via your browser settings. However,
                        disabling essential session cookies will prevent you from accessing your Operative Headquarters
                        and booking missions.</p>
                </div>
            </div>
        </div>
    );
}