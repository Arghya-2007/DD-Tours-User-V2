"use client";

import {useEffect, useState, useRef} from "react";
import {useParams, useRouter, usePathname} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {
    MapPin, Calendar, Clock, Loader2, Compass, AlertTriangle,
    IndianRupee, Users, CheckCircle, ShieldCheck, ArrowLeft, ArrowRight,
    Sparkles, ChevronRight, Eye, MessageCircle, ChevronDown, ChevronUp, Map
} from "lucide-react";
import {api} from "@/lib/axios";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface Tour {
    tourId: string;
    tourTitle: string;
    slug: string;
    tourDuration: string;
    tourDescription: string;
    tourPrice: number;
    startLocation?: string | null;
    tourCategory?: string | null;
    isFixedDate: boolean;
    fixedDate?: string | null;
    bookingDeadline?: string | null;
    expectedMonth?: string | null;
    coveredPlaces: string[];
    includedItems: string[];
    images: string[];
    tourStatus: string;
    maxSeats: number;
    availableSeats: number;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop";

export default function TourDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const pathname = usePathname();

    const urlSlug = pathname.split("/")[2];
    const slugToFetch = (params?.slug || params?.id || urlSlug) as string;

    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);

    const [viewers, setViewers] = useState(0);
    const [isDescExpanded, setIsDescExpanded] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Tour Details
    useEffect(() => {
        if (!slugToFetch || slugToFetch === "undefined") return;

        setViewers(Math.floor(Math.random() * (35 - 8 + 1) + 8));

        const fetchTour = async () => {
            try {
                const {data} = await api.get(`/tours/${slugToFetch}`);
                setTour(data.data);
            } catch (err) {
                console.error("Failed to fetch tour", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [slugToFetch]);

    // 2. THE "CRAZY" GSAP ORCHESTRATION
    useGSAP(() => {
        if (loading || !tour || !containerRef.current) return;

        const customScroller = document.querySelector("#main-scroll-container");
        const scrollerTarget = customScroller || window;

// --- MULTI-STATE CINEMATIC IMAGE TRANSITIONS ---
        const images = gsap.utils.toArray(".hero-auto-slide") as HTMLElement[];
        if (images.length > 1) {

            gsap.set(images, {opacity: 0, zIndex: 0});
            gsap.set(images[0], {opacity: 1, zIndex: 1});

            let currentIndex = 0;
            const displayDuration = 3.5;
            const transitionDuration = 1.6;

            const playNextImage = () => {
                const nextIndex = (currentIndex + 1) % images.length;
                const currentImg = images[currentIndex];
                const nextImg = images[nextIndex];

                const fadeTl = gsap.timeline({
                    onComplete: () => {
                        gsap.set(currentImg, {opacity: 0}); // Clean up
                        currentIndex = nextIndex;
                        setTimeout(playNextImage, displayDuration * 1000);
                    }
                });

                gsap.set(nextImg, {zIndex: 2, opacity: 1});
                gsap.set(currentImg, {zIndex: 1});

                // 🚨 Updated to cycle through 5 animations
                const animType = nextIndex % 5;

                if (animType === 0) {
                    // 💥 1. THE CYBER SLICE
                    fadeTl.fromTo(nextImg,
                        {
                            clipPath: "polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)",
                            scale: 1.5,
                            filter: "brightness(2) contrast(1.5)"
                        },
                        {
                            clipPath: "polygon(0% 0%, 150% 0%, 150% 100%, -20% 100%)",
                            scale: 1,
                            filter: "brightness(1) contrast(1)",
                            duration: transitionDuration,
                            ease: "expo.inOut"
                        }, 0
                    )
                        .to(currentImg, {
                            scale: 0.8,
                            x: -50,
                            filter: "blur(10px)",
                            duration: transitionDuration,
                            ease: "expo.inOut"
                        }, 0);
                } else if (animType === 1) {
                    // 💥 2. THE VERTICAL BLAST
                    fadeTl.fromTo(nextImg,
                        {clipPath: "inset(50% 0% 50% 0%)", scale: 2, filter: "brightness(3)"},
                        {
                            clipPath: "inset(0% 0% 0% 0%)",
                            scale: 1,
                            filter: "brightness(1)",
                            duration: transitionDuration,
                            ease: "power4.inOut"
                        }, 0
                    )
                        .to(currentImg, {
                            scale: 0.5,
                            rotationZ: 5,
                            filter: "blur(20px)",
                            duration: transitionDuration,
                            ease: "power4.inOut"
                        }, 0);
                } else if (animType === 2) {
                    // 💥 3. THE LENS SNAP
                    fadeTl.fromTo(nextImg,
                        {
                            clipPath: "circle(0% at 50% 50%)",
                            scale: 1.8,
                            rotationZ: -10,
                            filter: "saturate(3) hue-rotate(90deg)"
                        },
                        {
                            clipPath: "circle(150% at 50% 50%)",
                            scale: 1,
                            rotationZ: 0,
                            filter: "saturate(1) hue-rotate(0deg)",
                            duration: transitionDuration,
                            ease: "expo.inOut"
                        }, 0
                    )
                        .to(currentImg, {scale: 1.2, duration: transitionDuration, ease: "expo.inOut"}, 0);
                } else if (animType === 3) {
                    // 💥 4. NEW: THE BLOCK LOAD (Digital Matrix Glitch)
                    // Uses 'steps(8)' to force the animation to stutter block-by-block
                    fadeTl.fromTo(nextImg,
                        {clipPath: "inset(100% 0% 0% 0%)", scale: 1.2, filter: "hue-rotate(90deg) contrast(2)"},
                        {
                            clipPath: "inset(0% 0% 0% 0%)",
                            scale: 1,
                            filter: "hue-rotate(0deg) contrast(1)",
                            duration: transitionDuration,
                            ease: "steps(4)"
                        }, 0
                    )
                        .to(currentImg, {scale: 0.9, opacity: 0, duration: transitionDuration, ease: "steps(4)"}, 0);
                } else {
                    // 💥 5. NEW: THE PARTICLE IMPLOSION (Gooey Coalescence)
                    // Uses extreme blur and contrast to simulate pixels melting together
                    fadeTl.fromTo(nextImg,
                        {scale: 2.5, filter: "blur(40px) brightness(3) contrast(5)", opacity: 0, rotationZ: 15},
                        {
                            scale: 1,
                            filter: "blur(0px) brightness(1) contrast(1)",
                            opacity: 1,
                            rotationZ: 0,
                            duration: transitionDuration,
                            ease: "expo.inOut"
                        }, 0
                    )
                        .to(currentImg, {
                            scale: 0.5,
                            filter: "blur(20px)",
                            opacity: 0,
                            duration: transitionDuration,
                            ease: "expo.inOut"
                        }, 0);
                }
            };

            const slideTimer = setTimeout(playNextImage, displayDuration * 1000);
            return () => clearTimeout(slideTimer);
        }

        // --- WILD CONTENT REVEALS ---
        gsap.fromTo(".stat-card",
            {y: -80, opacity: 0, rotationZ: () => Math.random() * 20 - 10, scale: 0.5},
            {
                y: 0, opacity: 1, rotationZ: 0, scale: 1, duration: 1.2, stagger: 0.1, ease: "elastic.out(1, 0.5)",
                scrollTrigger: {trigger: ".stats-grid", scroller: scrollerTarget, start: "top 85%"}
            }
        );

        gsap.utils.toArray(".content-block").forEach((block: any) => {
            gsap.fromTo(block as HTMLElement,
                {y: 80, opacity: 0, rotationX: 45, transformOrigin: "50% 100%"},
                {
                    y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "power3.out",
                    scrollTrigger: {trigger: block as HTMLElement, scroller: scrollerTarget, start: "top 85%"}
                }
            );
        });

        gsap.fromTo(".pop-pill",
            {scale: 0, opacity: 0, rotationZ: 45},
            {
                scale: 1, opacity: 1, rotationZ: 0, duration: 0.6, stagger: 0.05, ease: "back.out(2.5)",
                scrollTrigger: {trigger: ".places-container", scroller: scrollerTarget, start: "top 85%"}
            }
        );

        gsap.fromTo(".booking-card",
            {x: 100, opacity: 0, rotationY: -30, scale: 0.9},
            {
                x: 0, opacity: 1, rotationY: 0, scale: 1, duration: 1.2, delay: 0.2, ease: "expo.out",
                scrollTrigger: {trigger: ".booking-card", scroller: scrollerTarget, start: "top 90%"}
            }
        );

        gsap.to(".bg-glow", {scale: 1.2, opacity: 0.8, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut"});

    }, {scope: containerRef, dependencies: [loading, tour]});

    // --- UNIVERSAL 3D HOVER PHYSICS ---
    const handle3DHover = (e: React.MouseEvent<HTMLElement>, strength: number = 10) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
            rotationY: (x / rect.width) * strength,
            rotationX: -(y / rect.height) * strength,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 800,
        });
    };

    const handle3DLeave = (e: React.MouseEvent<HTMLElement>) => {
        gsap.to(e.currentTarget, {
            rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)",
        });
    };

    const getDaysLeft = (deadline?: string | null) => {
        if (!deadline) return null;
        const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        return days < 0 ? "CLOSED" : `${days} Days Left`;
    };

    const getFormattedDate = (dateString?: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'});
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-background">
                <Loader2 size={48} className="text-orange-500 animate-spin mb-4"/>
                <div className="text-orange-500 text-sm font-bold uppercase tracking-widest animate-pulse">
                    Loading Destination...
                </div>
            </div>
        );
    }

    if (!tour) return (
        <div className="text-center py-40 h-screen flex flex-col items-center justify-center bg-background">
            <Map size={64} className="text-zinc-700 mb-6"/>
            {/* 🔥 Typography Fix */}
            <h2 className="font-heading text-4xl font-black text-white mb-4 uppercase tracking-tight">Tour Not
                Found</h2>
            {/* 🔥 Copy Fix */}
            <Link href="/tours"
                  className="px-10 py-4 bg-white/10 rounded-full text-white font-bold uppercase tracking-widest text-sm hover:bg-orange-600 transition-all">
                Explore Other Destinations
            </Link>
        </div>
    );

    const images = tour.images?.length > 0 ? tour.images : [FALLBACK_IMAGE];
    const daysLeft = getDaysLeft(tour.bookingDeadline);
    const isUrgent = daysLeft && !daysLeft.includes("CLOSED") && parseInt(daysLeft) < 15;
    const isSoldOut = tour.availableSeats <= 0;

    const allParagraphs = tour.tourDescription.split('\n').filter(p => p.trim());
    const showReadMore = allParagraphs.length > 2;
    const visibleParagraphs = isDescExpanded ? allParagraphs : allParagraphs.slice(0, 2);

    const whatsappNumber = "+919876543210";
    const whatsappMessage = encodeURIComponent(`Hi DD Tours! I am looking at the "${tour.tourTitle}" package. Can you share a few more details?`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div ref={containerRef}
             className="pb-20 md:pb-32 w-full bg-[#050505] text-white relative selection:bg-orange-600 selection:text-white overflow-hidden perspective-[1000px]">

            <div
                className="bg-glow absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-600/15 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            {/* ==================================================== */}
            {/* 🖼️ HERO GALLERY                                      */}
            {/* ==================================================== */}
            <div onMouseMove={(e) => handle3DHover(e, 3)} onMouseLeave={handle3DLeave}
                 className="relative w-full h-[65svh] md:h-[80vh] bg-black overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-10 cursor-default">
                <button onClick={() => router.back()}
                        className="absolute top-6 left-4 md:top-10 md:left-10 z-[100] bg-black/40 backdrop-blur-md px-5 py-3 rounded-full text-zinc-200 font-bold text-xs uppercase tracking-widest border border-white/10 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95 flex items-center gap-2">
                    <ArrowLeft size={16}/> Back
                </button>

                <div className="absolute inset-0 w-full h-full opacity-90 pointer-events-none">
                    {images.map((img, index) => (
                        <div key={`hero-img-${index}`} className="hero-auto-slide absolute inset-0 w-full h-full">
                            <Image src={img} alt={`${tour.tourTitle} Image ${index + 1}`} fill priority={index === 0}
                                   className="object-cover"/>
                        </div>
                    ))}
                </div>

                <div
                    className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-[50] pointer-events-none"/>
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent z-[50] md:block hidden pointer-events-none"/>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-[60] pb-10 md:pb-16 pointer-events-none">
                    <div className="max-w-7xl mx-auto flex flex-col justify-end">
                        <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-6 pointer-events-auto">
                            <span
                                className="bg-orange-600/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                                {tour.tourCategory || "Tour Package"}
                            </span>
                            {tour.startLocation && (
                                <span
                                    className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-zinc-200 text-[10px] md:text-xs font-bold uppercase tracking-widest border border-white/20 flex items-center gap-1.5 shadow-lg">
                                    <MapPin size={14} className="text-orange-500"/> Starts From: {tour.startLocation}
                                </span>
                            )}
                        </div>
                        {/* 🔥 Typography Fix & Scale Adjustment for Wide Fonts */}
                        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-white leading-[1] md:leading-[0.9] uppercase drop-shadow-2xl tracking-tighter">
                            {tour.tourTitle}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ==================================================== */}
            {/* 📄 MAIN CONTENT SPLIT                                */}
            {/* ==================================================== */}
            <div
                className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mt-12 md:mt-24 relative z-10 perspective-[1000px]">

                {/* LEFT COLUMN: Details */}
                <div className="lg:col-span-7 xl:col-span-8 space-y-12 md:space-y-16">

                    {/* Stats Grid */}
                    <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        {[
                            {icon: Clock, label: "Duration", val: tour.tourDuration, color: "text-orange-500"},
                            {icon: Users, label: "Group Size", val: `Max ${tour.maxSeats}`, color: "text-blue-500"},
                            {
                                icon: Compass,
                                label: "Tour Type",
                                val: tour.isFixedDate ? "Fixed Date" : "Flexible",
                                color: "text-emerald-500"
                            },
                            {icon: ShieldCheck, label: "Status", val: tour.tourStatus, color: "text-purple-500"}
                        ].map((stat, i) => (
                            <div key={i} onMouseMove={(e) => handle3DHover(e, 25)} onMouseLeave={handle3DLeave}
                                 className="stat-card bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl flex flex-col items-center text-center gap-2 hover:bg-white/10 transition-colors shadow-lg cursor-default">
                                <stat.icon size={28} className={stat.color}/>
                                <span
                                    className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{stat.label}</span>
                                <span className="text-white font-black text-sm md:text-base">{stat.val}</span>
                            </div>
                        ))}
                    </div>

                    {/* Tour Overview */}
                    <div
                        className="content-block desc-container relative bg-[#111]/50 border border-white/5 p-6 md:p-10 rounded-[2rem] shadow-2xl">
                        {/* 🔥 Typography Fix */}
                        <h2 className="font-heading text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                            <span
                                className="w-1.5 h-8 bg-orange-600 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.8)]"/>
                            Tour Overview
                        </h2>

                        <div
                            className="prose prose-invert max-w-none text-zinc-300 font-medium leading-relaxed text-base md:text-lg relative">
                            {visibleParagraphs.map((paragraph, idx) => (
                                <p key={idx} className="mb-5">{paragraph}</p>
                            ))}
                            {!isDescExpanded && showReadMore && (
                                <div
                                    className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>
                            )}
                        </div>

                        {showReadMore && (
                            <button onClick={() => setIsDescExpanded(!isDescExpanded)}
                                    className="mt-4 flex items-center justify-center w-full md:w-auto gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors bg-white/5 px-6 py-3.5 rounded-xl border border-white/10 hover:border-orange-500/50 shadow-lg">
                                {isDescExpanded ? <><ChevronUp size={16}/> Show Less</> : <><ChevronDown
                                    size={16}/> Read Full Overview</>}
                            </button>
                        )}
                    </div>

                    {/* Places Covered */}
                    {tour.coveredPlaces && tour.coveredPlaces.length > 0 && (
                        <div className="content-block places-container relative">
                            {/* 🔥 Typography Fix */}
                            <h2 className="font-heading text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                                <span
                                    className="w-1.5 h-8 bg-orange-600 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.8)]"/>
                                Places You'll Visit
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {tour.coveredPlaces.map((place, i) => (
                                    <div key={i} onMouseMove={(e) => handle3DHover(e, 30)} onMouseLeave={handle3DLeave}
                                         className="pop-pill bg-white/5 border border-white/10 px-5 py-3 rounded-xl flex items-center gap-2.5 text-zinc-200 text-sm font-bold tracking-wide shadow-lg hover:border-orange-500/50 cursor-default">
                                        <MapPin size={16} className="text-orange-500"/> {place}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* What's Included */}
                    {tour.includedItems && tour.includedItems.length > 0 && (
                        <div
                            className="content-block places-container relative bg-[#111]/50 border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl">
                            {/* 🔥 Typography Fix */}
                            <h2 className="font-heading text-2xl md:text-4xl font-black text-white uppercase tracking-tight mb-8 flex items-center gap-4">
                                <span
                                    className="w-1.5 h-8 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]"/>
                                What's Included
                            </h2>

                            <ul className="flex flex-wrap gap-3">
                                {tour.includedItems.map((item, i) => (
                                    <li key={i} onMouseMove={(e) => handle3DHover(e, 30)} onMouseLeave={handle3DLeave}
                                        className="pop-pill flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-full font-bold tracking-wide text-emerald-400 text-sm shadow-lg cursor-default">
                                        <CheckCircle size={16} className="shrink-0"/>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Interactive 3D Booking Card */}
                <div className="lg:col-span-5 xl:col-span-4 relative mt-4 lg:mt-0 z-50">
                    <div ref={sidebarRef} onMouseMove={(e) => handle3DHover(e, 15)} onMouseLeave={handle3DLeave}
                         className="booking-card lg:sticky lg:top-32 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden transition-shadow hover:shadow-[0_30px_80px_rgba(234,88,12,0.15)]">

                        {/* Live Social Proof Badge */}
                        <div
                            className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-8 flex items-center gap-2.5 relative z-10 w-max">
                            <div className="relative flex items-center justify-center">
                                <span
                                    className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-40"></span>
                                <Eye size={14} className="text-red-500 relative z-10"/>
                            </div>
                            {/* 🔥 Copy Fix: "Travelers" instead of "People" */}
                            <span
                                className="text-red-300 text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">
                                {viewers} Travelers looking right now
                            </span>
                        </div>

                        {/* Price Section */}
                        <div className="mb-8 border-b border-white/10 pb-8 relative z-10">
                            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest block mb-2">Total Fare</span>
                            <div className="flex items-end gap-1 text-white">
                                <IndianRupee size={28} className="text-orange-500 mb-1"/>
                                {/* 🔥 Typography Fix */}
                                <span
                                    className="font-heading text-4xl md:text-5xl font-black tracking-tighter leading-none">{tour.tourPrice?.toLocaleString("en-IN")}</span>
                            </div>
                            <span className="text-zinc-500 text-[11px] font-medium mt-2 block tracking-wide">Per person, including taxes.</span>
                        </div>

                        {/* Logistics */}
                        <div className="space-y-6 mb-10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-orange-500 shadow-inner">
                                    <Calendar size={20}/>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Departure
                                        Date</p>
                                    <p className="text-white font-bold text-sm tracking-wide">
                                        {tour.isFixedDate && tour.fixedDate ? getFormattedDate(tour.fixedDate) : tour.expectedMonth ? `${tour.expectedMonth} (Flexible)` : 'Flexible Dates'}
                                    </p>
                                </div>
                            </div>

                            {daysLeft && (
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-inner ${isUrgent ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-black/40 border-white/5 text-zinc-400'}`}>
                                        <AlertTriangle size={20}/>
                                    </div>
                                    <div>
                                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Booking
                                            Closes</p>
                                        <p className={`font-bold text-sm tracking-wide ${isUrgent ? 'text-red-400' : 'text-white'}`}>{getFormattedDate(tour.bookingDeadline)}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-emerald-500 shadow-inner">
                                    <Users size={20}/>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Availability</p>
                                    <p className="text-white font-bold text-sm tracking-wide">
                                        {isSoldOut ? <span
                                            className="text-red-500">Sold Out</span> : `${tour.availableSeats} Seats Left`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 relative z-10">
                            <button
                                onClick={() => router.push(`/tours/${tour.slug}/book`)}
                                disabled={isSoldOut || daysLeft === "CLOSED"}
                                className="w-full py-5 bg-orange-600 disabled:bg-white/5 disabled:text-zinc-600 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all hover:bg-orange-500 active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(234,88,12,0.4)] disabled:shadow-none border border-transparent"
                            >
                                {/* 🔥 Copy Fix: "Secure Your Spot" */}
                                {isSoldOut ? "Tour Full" : daysLeft === "CLOSED" ? "Booking Closed" : "Secure Your Spot"}
                                {!isSoldOut && daysLeft !== "CLOSED" && <ArrowRight size={18}/>}
                            </button>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-4 bg-[#111] hover:bg-green-600/10 border border-white/10 hover:border-green-500/30 text-zinc-300 hover:text-green-400 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={16}/> Ask an Expert
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}