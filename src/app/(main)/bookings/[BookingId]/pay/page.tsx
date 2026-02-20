"use client";

import {useEffect, useState, useRef} from "react";
import {useParams, useRouter, usePathname} from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {
    ShieldCheck, CreditCard, IndianRupee, Lock, CheckCircle, AlertTriangle,
    Landmark, Globe, Rocket, ArrowRight, XCircle, Cpu, ScanFace, Radar
} from "lucide-react";
import {api} from "@/lib/axios";

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

interface Booking {
    bookingId: string;
    totalPrice: number;
    totalGuests: number;
    tour: { tourTitle: string; images?: string[] };
    user: { userName: string; userEmail: string };
}

type PaymentMode = "ONLINE" | "OFFLINE";
type SuccessState = "ONLINE_SUCCESS" | "OFFLINE_SUCCESS" | "FAILED" | null;

export default function PaymentPage() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();

    const urlId = pathname.split("/")[2];
    const idToFetch = (params?.bookingId || params?.id || params?.slug || urlId) as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [paymentMode, setPaymentMode] = useState<PaymentMode>("ONLINE");
    const [paymentStatus, setPaymentStatus] = useState<SuccessState>(null);

    // Terminal logs state for the "Crazy" processing effect
    const [terminalLog, setTerminalLog] = useState<string>("");

    const containerRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);
    const floatingCardRef = useRef<HTMLDivElement>(null);

    // Initial Fetch
    useEffect(() => {
        if (!idToFetch || idToFetch === "undefined") {
            setLoading(false);
            setError("Invalid Booking URL. Mission aborted.");
            return;
        }

        const fetchBooking = async () => {
            try {
                const {data} = await api.get(`/bookings/${idToFetch}`);
                setBooking(data.data);
            } catch (err: any) {
                setError("Unable to decrypt mission coordinates. Access denied.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [idToFetch]);

    // Terminal Processing Sequence Simulation
    useEffect(() => {
        if (processing && !paymentStatus) {
            const logs = [
                "INITIATING SECURE UPLINK...",
                "ESTABLISHING AES-256 TUNNEL...",
                "VERIFYING OPERATIVE CREDENTIALS...",
                "BYPASSING REGIONAL NODES...",
                "AWAITING GATEWAY HANDSHAKE...",
                "TRANSMITTING ENCRYPTED PAYLOAD..."
            ];
            let i = 0;
            setTerminalLog(logs[0]);
            const interval = setInterval(() => {
                i++;
                if (i < logs.length) setTerminalLog(logs[i]);
            }, 600);
            return () => clearInterval(interval);
        }
    }, [processing, paymentStatus]);

    // Auto-Redirect
    useEffect(() => {
        if (paymentStatus === "ONLINE_SUCCESS" || paymentStatus === "OFFLINE_SUCCESS") {
            const timer = setTimeout(() => {
                router.push("/profile");
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [paymentStatus, router]);

    // ==========================================
    // 🎬 ADVANCED GSAP ORCHESTRATION
    // ==========================================
    useGSAP(() => {
        if (loading || paymentStatus || !containerRef.current) return;

        const tl = gsap.timeline();

        tl.fromTo(".bg-grid-overlay", {opacity: 0}, {opacity: 0.5, duration: 1.5, ease: "power2.inOut"}, 0);

        tl.fromTo(".dossier-panel",
            {x: -150, opacity: 0, rotationY: 25, filter: "blur(10px)"},
            {x: 0, opacity: 1, rotationY: 0, filter: "blur(0px)", duration: 1.5, ease: "power4.out"},
            0.2
        )
            .fromTo(".terminal-panel",
                {x: 150, opacity: 0, rotationY: -25, filter: "blur(10px)"},
                {x: 0, opacity: 1, rotationY: 0, filter: "blur(0px)", duration: 1.5, ease: "power4.out"},
                0.3
            );

        tl.fromTo(".data-line",
            {width: "0%", opacity: 0},
            {width: "100%", opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out"},
            0.8
        );

        gsap.fromTo(".scanner-line",
            {top: "-10%", opacity: 0},
            {top: "110%", opacity: 1, duration: 2.5, repeat: -1, ease: "linear"}
        );

    }, {scope: containerRef, dependencies: [loading, paymentStatus]});

    // Interactive 3D Mouse Hover Effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!floatingCardRef.current || processing) return;
        const card = floatingCardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(card, {
            rotationY: (x / rect.width) * 15,
            rotationX: -(y / rect.height) * 15,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000,
        });
    };

    const handleMouseLeave = () => {
        if (!floatingCardRef.current || processing) return;
        gsap.to(floatingCardRef.current, {
            rotationY: 0,
            rotationX: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)",
        });
    };

    // Cinematic Aperture Success Wipe & Stamp
    useGSAP(() => {
        if (!paymentStatus || !successRef.current) return;

        const tl = gsap.timeline();

        if (paymentStatus === "FAILED") {
            tl.to(".pay-container", {
                filter: "invert(1) hue-rotate(180deg)",
                opacity: 0,
                duration: 0.3,
                yoyo: true,
                repeat: 3
            })
                .to(".pay-container", {display: "none"})
                .fromTo(".success-content", {scale: 1.5, opacity: 0, filter: "blur(20px)"}, {
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                });
        } else {
            tl.fromTo(".wipe-overlay",
                {clipPath: "circle(0% at 50% 50%)"},
                {clipPath: "circle(150% at 50% 50%)", duration: 1.8, ease: "power4.inOut"}
            )
                .to(".pay-container", {display: "none", duration: 0}, "-=0.5")
                .fromTo(".success-video", {scale: 1.2, opacity: 0}, {
                    scale: 1,
                    opacity: 0.4,
                    duration: 2,
                    ease: "power2.out"
                }, "-=1")
                .fromTo(".boarding-pass-3d",
                    {y: 200, opacity: 0, rotationX: -60, scale: 0.8},
                    {y: 0, opacity: 1, rotationX: 0, scale: 1, duration: 1.5, ease: "back.out(1.2)"},
                    "-=1"
                )
                // The satisfying physical "STAMP" effect
                .fromTo(".auth-stamp",
                    {scale: 5, opacity: 0, rotation: 15},
                    {scale: 1, opacity: 1, rotation: -5, duration: 0.5, ease: "bounce.out"},
                    "-=0.2"
                );
        }
    }, {scope: containerRef, dependencies: [paymentStatus]});

    const handleOnlinePayment = async () => {
        if (!booking) return;
        setProcessing(true);
        setError(null);

        try {
            const isScriptLoaded = await loadRazorpayScript();
            if (!isScriptLoaded) throw new Error("Uplink failed. Check connection.");

            const {data: orderResponse} = await api.post("/payment/create-order", {
                bookingId: booking.bookingId,
            });
            const orderData = orderResponse.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY",
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: "DD Tours Terminal",
                description: `Target: ${booking.tour?.tourTitle}`,
                order_id: orderData.id,
                prefill: {
                    name: booking.user?.userName || "Operative",
                    email: booking.user?.userEmail || "operative@ddtours.com",
                },
                theme: {color: "#ea580c"},
                handler: async function (response: any) {
                    try {
                        await api.post("/payment/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        setProcessing(false);
                        setPaymentStatus("ONLINE_SUCCESS");
                    } catch (verificationError: any) {
                        setProcessing(false);
                        setPaymentStatus("FAILED");
                    }
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.on("payment.failed", function () {
                setProcessing(false);
                setPaymentStatus("FAILED");
            });
            paymentObject.open();

        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Uplink authorization failed.");
            setProcessing(false);
        }
    };

    const handleOfflinePayment = () => {
        setProcessing(true);
        setError(null);
        // Let the terminal animation play out for 3 seconds before succeeding
        setTimeout(() => {
            setProcessing(false);
            setPaymentStatus("OFFLINE_SUCCESS");
        }, 3500);
    };

    // 1. Biometric Loading Screen
    if (loading) {
        return (
            <div
                className="flex flex-col justify-center items-center h-screen bg-[#020202] text-orange-500 overflow-hidden relative">
                <div
                    className="absolute inset-0 bg-[linear-gradient(rgba(234,88,12,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,88,12,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                <div className="relative flex items-center justify-center mb-10">
                    <div className="absolute w-40 h-40 border border-orange-600/20 rounded-full animate-ping"></div>
                    <div
                        className="absolute w-32 h-32 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin"></div>
                    <Radar size={56} className="text-orange-500 animate-pulse"/>
                </div>
                <div
                    className="font-mono text-xs tracking-[0.4em] uppercase overflow-hidden whitespace-nowrap animate-pulse border-r-2 border-orange-500 pr-1">
                    Decrypting Mission Coordinates...
                </div>
                {/* Fake Hex Codes flashing */}
                <div
                    className="absolute bottom-10 left-10 font-mono text-[8px] text-orange-500/30 w-32 h-32 overflow-hidden opacity-50">
                    {Array.from({length: 10}).map((_, i) => (
                        <div key={i} className="animate-pulse" style={{animationDelay: `${i * 0.1}s`}}>
                            {Math.random().toString(16).substr(2, 8).toUpperCase()} {Math.random().toString(16).substr(2, 8).toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef}
             className="relative min-h-[100svh] bg-[#020202] text-white selection:bg-orange-600 overflow-hidden font-sans perspective-[1000px]">

            {/* 🌐 TACTICAL GRID BACKGROUND */}
            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#020202]/80 to-[#020202] pointer-events-none z-0"></div>

            {/* Ambient Moving Orbs */}
            <div
                className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse"></div>
            <div
                className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            {/* ========================================= */}
            {/* 🎬 CINEMATIC SUCCESS / FAILED SCREEN      */}
            {/* ========================================= */}
            <div ref={successRef}
                 className={`absolute inset-0 z-50 overflow-hidden ${!paymentStatus ? 'hidden' : 'block'}`}>

                {/* The Aperture Wipe Overlay */}
                <div className="wipe-overlay absolute inset-0 bg-[#050505] z-10 clip-path-[circle(0%_at_50%_50%)]">
                    {paymentStatus !== "FAILED" && (
                        <video autoPlay loop muted playsInline
                               className="success-video absolute inset-0 w-full h-full object-cover">
                            {/* High quality nature landscape replacement */}
                            <source
                                src="https://assets.mixkit.co/videos/preview/mixkit-beautiful-landscape-of-a-mountain-valley-with-a-river-4293-large.mp4"
                                type="video/mp4"/>
                        </video>
                    )}
                    <div
                        className={`absolute inset-0 bg-gradient-to-t ${paymentStatus === 'FAILED' ? 'from-red-950/40 to-[#020202]' : 'from-[#050505] via-[#050505]/70 to-[#050505]/40'}`}/>
                </div>

                {paymentStatus && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                        <div
                            className="success-content boarding-pass-3d relative z-30 max-w-xl w-full bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">

                            <div
                                className={`absolute top-0 left-0 w-full h-1 ${paymentStatus === 'FAILED' ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]' : 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]'}`}></div>

                            {/* GSAP Slams this stamp down! */}
                            {paymentStatus !== "FAILED" && (
                                <div
                                    className="auth-stamp absolute top-8 right-8 border-4 border-emerald-500 text-emerald-500 px-4 py-2 font-black text-2xl uppercase tracking-widest opacity-0 z-50 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] mix-blend-screen pointer-events-none">
                                    AUTHORIZED
                                </div>
                            )}

                            <div
                                className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-8 border ${paymentStatus === 'FAILED' ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'}`}>
                                {paymentStatus === 'FAILED' ? <XCircle size={40}/> : <CheckCircle size={40}/>}
                            </div>

                            <h1 className="text-center text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
                                {paymentStatus === 'FAILED' ? 'Uplink Failed' : 'Target Secured'}
                            </h1>

                            <p className="text-center text-zinc-400 font-mono text-sm tracking-wider mb-10">
                                {paymentStatus === "ONLINE_SUCCESS" && `FUNDS VERIFIED • STANDBY FOR DEPLOYMENT`}
                                {paymentStatus === "OFFLINE_SUCCESS" && `INTENT LOGGED • AWAITING MANUAL WIRE TRANSFER`}
                                {paymentStatus === "FAILED" && `TRANSACTION REJECTED • NO FUNDS DEBITED`}
                            </p>

                            {paymentStatus !== "FAILED" && (
                                <div
                                    className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 mb-10 relative overflow-hidden">
                                    <div
                                        className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-1 opacity-20 pointer-events-none h-16">
                                        {[1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 1, 4].map((w, i) => <div key={i}
                                                                                                 style={{width: `${w}px`}}
                                                                                                 className="bg-white h-full"></div>)}
                                    </div>

                                    <div className="relative z-10">
                                        <span
                                            className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] block mb-1">Target Identity</span>
                                        <span
                                            className="text-white font-bold text-lg leading-none uppercase mb-6 block truncate pr-16">{booking?.tour?.tourTitle}</span>

                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span
                                                    className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] block mb-1">Authorization Code</span>
                                                <span
                                                    className="text-orange-500 font-mono text-xl tracking-widest">{booking?.bookingId.split('-')[0].toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paymentStatus === "FAILED" ? (
                                <button onClick={() => setPaymentStatus(null)}
                                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-mono uppercase tracking-widest text-sm rounded-xl transition-colors border border-white/20">
                                    Re-Initiate Sequence
                                </button>
                            ) : (
                                <button onClick={() => router.push("/profile")}
                                        className="w-full relative py-4 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] flex items-center justify-center gap-3">
                                    Access Headquarters <ArrowRight size={16}/>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================= */}
            {/* 💻 CINEMATIC PAYMENT TERMINAL (Split Layout)*/}
            {/* ========================================= */}
            <div
                className="pay-container max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 relative z-10 min-h-screen flex flex-col justify-center">

                {/* Header HUD */}
                <div className="flex items-center justify-between mb-12 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-orange-600/20 rounded-lg border border-orange-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                            <Lock size={18} className="text-orange-500"/>
                        </div>
                        <div>
                            <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest">Secure
                                Uplink</h1>
                            <p className="font-mono text-[10px] md:text-xs text-orange-500 tracking-[0.3em] animate-pulse">AES-256
                                ENCRYPTION ACTIVE</p>
                        </div>
                    </div>
                    <button onClick={() => router.back()} disabled={processing}
                            className="text-zinc-500 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors flex items-center gap-2 disabled:opacity-50">
                        <span className="hidden sm:inline">Abort</span> [ESC]
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT: MISSION DOSSIER (Interactive 3D Hologram) */}
                    <div className="dossier-panel relative" onMouseMove={handleMouseMove}
                         onMouseLeave={handleMouseLeave}>
                        <div ref={floatingCardRef}
                             className="relative bg-black/40 backdrop-blur-2xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-shadow hover:shadow-[0_20px_60px_rgba(234,88,12,0.2)]">

                            {/* Scanner line overlay */}
                            <div
                                className="scanner-line absolute left-0 w-full h-[2px] bg-orange-500/80 shadow-[0_0_20px_#ea580c] z-50 pointer-events-none"></div>

                            <div
                                className="flex items-center justify-between mb-10 pb-6 border-b border-white/10 pointer-events-none">
                                <h2 className="text-zinc-400 font-mono text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                                    <Cpu size={14} className="text-orange-500"/> Target Details
                                </h2>
                                <span
                                    className="text-orange-500 font-mono text-[10px] font-bold tracking-widest bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20">DOSSIER</span>
                            </div>

                            <div className="space-y-8 pointer-events-none">
                                <div className="data-line overflow-hidden border-l-2 border-orange-500 pl-4">
                                    <span
                                        className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] block mb-1">Operation Code</span>
                                    <div className="text-white font-mono text-lg tracking-widest">
                                        {booking?.bookingId.split('-')[0].toUpperCase()}
                                    </div>
                                </div>

                                <div className="data-line overflow-hidden border-l-2 border-white/20 pl-4">
                                    <span
                                        className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] block mb-1">Destination</span>
                                    <div
                                        className="text-white font-bold text-2xl md:text-3xl uppercase tracking-wide leading-tight">
                                        {booking?.tour?.tourTitle}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-4">
                                    <div className="data-line overflow-hidden border-l-2 border-white/20 pl-4">
                                        <span
                                            className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] block mb-1">Operatives</span>
                                        <div className="text-white font-mono text-xl">{booking?.totalGuests}</div>
                                    </div>
                                    <div className="data-line overflow-hidden border-l-2 border-emerald-500 pl-4">
                                        <span
                                            className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] block mb-1">Required Funds</span>
                                        <div className="text-emerald-400 font-mono text-2xl flex items-center">
                                            <IndianRupee size={20}
                                                         className="mr-1"/> {booking?.totalPrice?.toLocaleString("en-IN")}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="mt-12 pt-6 border-t border-white/5 flex gap-1 h-12 opacity-30 pointer-events-none">
                                {[1, 3, 2, 1, 5, 2, 1, 4, 1, 2, 3, 1, 1, 2, 4, 2, 1].map((w, i) => <div key={i}
                                                                                                        style={{width: `${w * 2}px`}}
                                                                                                        className="bg-white h-full"></div>)}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: PAYMENT TERMINAL */}
                    <div className="terminal-panel">
                        <div
                            className="bg-[#050505] border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">

                            {error && (
                                <div
                                    className="bg-red-500/10 border-l-4 border-red-500 text-red-400 p-4 rounded bg-opacity-20 flex items-start gap-3 mb-8 font-mono text-xs uppercase tracking-wide">
                                    <AlertTriangle size={16} className="shrink-0 text-red-500 mt-0.5"/> {error}
                                </div>
                            )}

                            <h3 className="text-white font-black text-xl uppercase tracking-widest mb-6 flex items-center gap-3">
                                <ScanFace className="text-orange-500"/> Select Uplink
                            </h3>

                            {/* Hardware-Style Toggle Buttons (Disabled while processing) */}
                            <div
                                className={`flex bg-black/50 border border-white/10 rounded-xl p-1.5 mb-10 transition-opacity ${processing ? 'opacity-30 pointer-events-none' : ''}`}>
                                <button
                                    onClick={() => setPaymentMode("ONLINE")}
                                    className={`flex-1 py-3.5 rounded-lg font-mono text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${paymentMode === "ONLINE" ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]" : "text-zinc-500 hover:text-zinc-300"}`}
                                >
                                    <Globe size={16}/> Digital
                                </button>
                                <button
                                    onClick={() => setPaymentMode("OFFLINE")}
                                    className={`flex-1 py-3.5 rounded-lg font-mono text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${paymentMode === "OFFLINE" ? "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]" : "text-zinc-500 hover:text-zinc-300"}`}
                                >
                                    <Landmark size={16}/> Manual
                                </button>
                            </div>

                            {/* Terminal Action Area */}
                            <div className="min-h-[220px] flex flex-col justify-end">

                                {/* 🟢 THE HACKER TERMINAL (Shows during processing) */}
                                {processing ? (
                                    <div
                                        className="bg-[#020202] border border-green-500/30 rounded-xl p-6 font-mono text-xs h-full flex flex-col justify-center shadow-[inset_0_0_20px_rgba(34,197,94,0.1)]">
                                        <div className="text-green-500 mb-4 flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                            SYSTEM OVERRIDE IN PROGRESS
                                        </div>
                                        <div className="text-green-400 opacity-80 space-y-2">
                                            <p className="typing-effect">&gt; {terminalLog}</p>
                                            <p className="animate-pulse opacity-50">&gt; _</p>
                                        </div>
                                    </div>
                                ) : paymentMode === "ONLINE" ? (
                                    <div className="animate-in fade-in zoom-in-95 duration-300">
                                        <button
                                            onClick={handleOnlinePayment}
                                            className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_30px_rgba(234,88,12,0.2)] border border-transparent active:scale-[0.98] flex items-center justify-center gap-3 group"
                                        >
                                            <CreditCard size={20}
                                                        className="group-hover:scale-110 transition-transform"/> Authorize
                                            Transfer
                                        </button>
                                        <div
                                            className="mt-5 text-center font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
                                            Powered by Razorpay Gateway
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in zoom-in-95 duration-300">
                                        <div
                                            className="bg-black/50 border border-white/5 rounded-xl p-5 mb-6 text-xs text-zinc-400 font-mono tracking-wide space-y-3">
                                            <p className="text-emerald-500 font-bold uppercase mb-3 border-b border-emerald-500/20 pb-2 flex items-center gap-2">
                                                <Landmark size={14}/> HQ Bank Details
                                            </p>
                                            <p className="flex justify-between"><span>Bank:</span> <span
                                                className="text-white">State Bank of India</span></p>
                                            <p className="flex justify-between"><span>Acct:</span> <span
                                                className="text-white">DD Tours & Travels</span></p>
                                            <p className="flex justify-between"><span>No:</span> <span
                                                className="text-white bg-white/10 px-2 py-0.5 rounded">0000 1234 5678</span>
                                            </p>
                                            <p className="flex justify-between"><span>IFSC:</span> <span
                                                className="text-white">SBIN0001234</span></p>
                                        </div>
                                        <button
                                            onClick={handleOfflinePayment}
                                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] flex justify-center items-center gap-3 active:scale-[0.98]"
                                        >
                                            Confirm Intent to Transfer
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}