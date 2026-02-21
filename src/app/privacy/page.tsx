"use client";

import {useRef} from "react";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {Lock, ArrowLeft, Fingerprint} from "lucide-react";
import {useRouter} from "next/navigation";

export default function PrivacyPage() {
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
             className="min-h-screen bg-[#020202] text-white selection:bg-emerald-600 relative pb-24 overflow-hidden">

            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 fixed"></div>
            <div
                className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 md:pt-32 relative z-10">

                <button onClick={() => router.back()}
                        className="header-anim flex items-center gap-2 text-zinc-400 hover:text-emerald-500 font-mono text-xs uppercase tracking-widest transition-colors mb-12">
                    <ArrowLeft size={16}/> Return to Base
                </button>

                <div className="header-anim mb-16 border-b border-white/10 pb-10">
                    <div
                        className="flex items-center gap-3 text-emerald-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4">
                        <Lock size={16}/> Data Protection
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-xl">
                        Privacy <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Policy</span>
                    </h1>
                    <p className="text-zinc-400 font-medium tracking-wide">Last Updated: October 2023 • DD Tours &
                        Travels</p>
                </div>

                <div
                    className="prose-anim prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-emerald-500">
                    <h2>1. Information We Collect</h2>
                    <p>To securely facilitate your expeditions, DD Tours collects specific personal intel when you
                        register or book a tour. This includes your Name, Encrypted Email, Phone Number, Government ID
                        (Aadhar), and Date of Birth.</p>

                    <h2>2. How We Use Your Data</h2>
                    <p>Your data is strictly utilized for operational purposes. We use it to verify identities for hotel
                        check-ins, secure permits for restricted areas (like Ladakh or Sikkim), and process your
                        payments via Razorpay. We do not sell your intel to third-party data brokers.</p>

                    <h2>3. Data Security & Encryption</h2>
                    <p>We implement AES-256 equivalent encryption standards for your passwords. Our database
                        architecture ensures that unauthorized personnel cannot access your Operative Dossier. Payments
                        are processed via highly secure external gateways; we do not store your credit card information
                        on our servers.</p>

                    <div
                        className="bg-[#111] border border-white/10 p-6 rounded-2xl my-8 flex items-start gap-4 shadow-xl">
                        <Fingerprint className="text-emerald-500 shrink-0 mt-1" size={24}/>
                        <p className="m-0 text-sm text-zinc-300"><strong>Classified Notice:</strong> You have the right
                            to request the complete deletion of your Operative Account and associated data at any time
                            via your Headquarters dashboard.</p>
                    </div>

                    <h2>4. Third-Party Sharing</h2>
                    <p>Intel is only shared with trusted on-the-ground partners (hotel managers, expedition drivers)
                        solely for the purpose of executing your booked tour safely and efficiently.</p>
                </div>
            </div>
        </div>
    );
}