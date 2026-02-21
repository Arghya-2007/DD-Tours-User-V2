"use client";

import {useRef} from "react";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {FileText, ArrowLeft, ShieldAlert} from "lucide-react";
import {useRouter} from "next/navigation";

export default function TermsPage() {
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
             className="min-h-screen bg-[#020202] text-white selection:bg-orange-600 relative pb-24 overflow-hidden">

            {/* Tactical Background */}
            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 fixed"></div>
            <div
                className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 md:pt-32 relative z-10">

                {/* Back Button */}
                <button onClick={() => router.back()}
                        className="header-anim flex items-center gap-2 text-zinc-400 hover:text-orange-500 font-mono text-xs uppercase tracking-widest transition-colors mb-12">
                    <ArrowLeft size={16}/> Return to Base
                </button>

                <div className="header-anim mb-16 border-b border-white/10 pb-10">
                    <div
                        className="flex items-center gap-3 text-orange-500 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4">
                        <ShieldAlert size={16}/> Legal Directive
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-xl">
                        Terms of <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Service</span>
                    </h1>
                    <p className="text-zinc-400 font-medium tracking-wide">Last Updated: October 2023 • DD Tours &
                        Travels, Ranaghat HQ</p>
                </div>

                <div
                    className="prose-anim prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-orange-500">
                    <h2>1. Acceptance of Terms</h2>
                    <p>By accessing and using the DD Tours & Travels platform to book expeditions, you agree to be bound
                        by these operational terms. If you do not agree to these terms, please do not use our
                        services.</p>

                    <h2>2. Booking and Payments</h2>
                    <p>All mission bookings are subject to availability. A booking is only confirmed once full payment
                        or the required advance has been successfully processed through our secure gateway (Razorpay).
                        Prices are subject to change without prior notice, but confirmed bookings will not be affected
                        by subsequent price alterations.</p>

                    <h2>3. Cancellations and Refunds</h2>
                    <ul>
                        <li><strong>30+ Days before departure:</strong> 100% refund minus processing fees.</li>
                        <li><strong>15-29 Days before departure:</strong> 50% refund.</li>
                        <li><strong>Less than 15 Days:</strong> No refund will be issued.</li>
                    </ul>
                    <p>In the event that DD Tours must cancel an expedition due to extreme weather, security risks, or
                        logistical failures, a full refund or alternative mission date will be provided.</p>

                    <h2>4. Operative Responsibilities</h2>
                    <p>Travelers are responsible for maintaining valid identification (Aadhar, Passport) and ensuring
                        they meet the physical requirements of their chosen destination. DD Tours is not liable for
                        entry denials due to missing documentation.</p>

                    <h2>5. Limitation of Liability</h2>
                    <p>While we prioritize your safety above all else, DD Tours acts as an agent for third-party
                        transport and accommodation providers. We are not liable for delays, injuries, or losses caused
                        by external factors beyond our direct command.</p>
                </div>
            </div>
        </div>
    );
}