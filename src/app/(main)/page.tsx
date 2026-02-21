"use client";

import {useRef, useState, useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {
    MapPin, Compass, ShieldCheck, HeartHandshake, Tent, Mountain,
    Map as MapIcon, Search, Calendar, Star, Camera, ArrowRight, Fingerprint,
    Train, Hotel, Navigation, Home
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({force3D: true}); // Hardware acceleration
    ScrollTrigger.config({ignoreMobileResize: true});
}

// --- Local Image Data ---
const heroImages = [
    "/images/hero-1.webp", "/images/hero-2.webp", "/images/hero-3.webp", "/images/hero-4.webp"
];

const memoryImages = [
    "/images/memory-1.webp", "/images/memory-2.webp", "/images/memory-3.webp", "/images/memory-4.webp",
    "/images/memory-5.webp", "/images/memory-6.webp", "/images/memory-7.webp", "/images/memory-8.webp",
    "/images/memory-9.webp", "/images/memory-10.webp", "/images/memory-11.webp",
];

const featuredTours = [
    {id: 1, title: "Spiti Valley", location: "Himachal Pradesh", price: "₹24,999", img: "/images/spiti.webp"},
    {id: 2, title: "Kashmir", location: "Jammu & Kashmir", price: "₹18,500", img: "/images/kashmir.webp"},
    {id: 3, title: "Meghalaya", location: "North East India", price: "₹21,000", img: "/images/meghalaya.webp"},
    {id: 4, title: "Zanskar", location: "Ladakh", price: "₹35,000", img: "/images/zanskar.webp"},
    {id: 5, title: "Vrindavan", location: "Uttarakhand", price: "₹15,000", img: "/images/vrindavan.webp"},
    {id: 6, title: "Varanasi", location: "Uttar Pradesh", price: "₹12,000", img: "/images/varanasi.webp"},
    {id: 7, title: "Kerala", location: "Kerala", price: "₹18000", img: "/images/kerala.webp"},
    {id: 8, title: "Sikkim", location: "Sikkim", price: "₹20,000", img: "/images/sikkim.webp"},
    {id: 9, title: "Arunachal Pradesh", location: "Arunachal Pradesh", price: "₹25,000", img: "/images/arunachal.webp"},
    {id: 10, title: "Kedarnath", location: "Himachal Pradesh", price: "₹22,000", img: "/images/kedarnath.webp"},
];

const bentoCards = [
    {id: 1, title: "Mountain", img: "/images/mountain.webp", classes: "lg:col-span-2 lg:row-span-2"},
    {id: 2, title: "Jungle", img: "/images/jungle.webp", classes: "lg:col-span-2 lg:row-span-1"},
    {id: 3, title: "Ocean", img: "/images/ocean.webp", classes: "lg:col-span-1 lg:row-span-1"},
    {id: 4, title: "Desert", img: "/images/desert.webp", classes: "lg:col-span-1 lg:row-span-1"},
];

const testimonials = [
    {name: "Rahul S.", text: "DD Tours made our Kashmir trip completely frictionless. Highly recommended!"},
    {name: "Priya M.", text: "The Spiti expedition changed my life. The local guides were phenomenal."},
    {name: "Ankit D.", text: "Best travel agency. Period. Their attention to detail is insane."},
    {name: "Sneha K.", text: "Affordable, safe, and wildly adventurous. Can't wait for my next trip."},
    {name: "Argha P.", text: "Best travel agency. Period. Their attention to detail is insane."},
    {name: "Puja V.", text: "DD Tours made our Kashmir trip completely frictionless. Highly recommended!"},
    {name: "Gaurav S.", text: "My family become very happy with this Tour Package"},
    {name: "Deepak K.", text: "Best travel agency. Period. Their attention to detail is insane."}
];

const journeySteps = [
    {icon: MapPin, title: "Rendezvous", desc: "Meet the squad at the designated start location."},
    {icon: Train, title: "Transit to Basecamp", desc: "Travel comfortably via pre-booked Train or Flight."},
    {icon: Hotel, title: "Check-in & Rest", desc: "Arrive at our verified hotel partners to drop bags."},
    {icon: Compass, title: "Primary Exploration", desc: "Begin the guided tour of the main attractions."},
    {icon: Navigation, title: "Inter-City Transit", desc: "Move to the next major location comfortably."},
    {icon: Mountain, title: "Secondary Exploration", desc: "Conquer the remaining terrains."},
    {icon: Home, title: "Return Journey", desc: "Safe transit back to the original start point."}
];

export default function HomePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const bestToursRef = useRef<HTMLDivElement>(null);
    const bestToursTrackRef = useRef<HTMLDivElement>(null);

    const [currentImg, setCurrentImg] = useState(0);

    // Hero Image Carousel Loop
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Disable 3D hover on mobile devices for better battery/performance
    const handle3DHover = (e: React.MouseEvent<HTMLElement>, strength: number = 10) => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
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
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
        gsap.to(e.currentTarget, {
            rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)",
        });
    };

    // 🔥 SMART DEGRADATION ANIMATIONS (Glitch-Free)
    useGSAP(() => {
        if (!containerRef.current) return;

        const customScroller = document.querySelector("#main-scroll-container");
        const scrollerTarget = customScroller || window;
        const pinMode = customScroller ? "transform" : "fixed";

        // Create GSAP MatchMedia for perfect Desktop vs Mobile handling
        let mm = gsap.matchMedia();

        // 💻 DESKTOP: FULL 3D CINEMATIC ANIMATIONS
        mm.add("(min-width: 768px)", () => {

            const heroTl = gsap.timeline({defaults: {ease: "power3.out"}});
            heroTl.fromTo(".hero-bg-overlay", {opacity: 1}, {opacity: 0.6, duration: 2})
                .fromTo(".hero-text-line", {y: 150, skewY: 5, rotationX: -20, opacity: 0}, {
                    y: 0,
                    skewY: 0,
                    rotationX: 0,
                    opacity: 1,
                    duration: 1.5,
                    stagger: 0.1
                }, "-=1.5")
                .fromTo(".hero-subtitle", {y: 30, opacity: 0}, {y: 0, opacity: 1, duration: 1}, "-=1")
                .fromTo(".hero-search", {y: 50, opacity: 0, scale: 0.9, rotationX: 20}, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotationX: 0,
                    duration: 1.2,
                    ease: "back.out(1.5)"
                }, "-=0.8");

            gsap.utils.toArray(".text-reveal").forEach((elem: any) => {
                gsap.fromTo(elem,
                    {y: 60, opacity: 0, rotationX: -30},
                    {
                        y: 0,
                        opacity: 1,
                        rotationX: 0,
                        duration: 1.2,
                        ease: "back.out(1.2)",
                        scrollTrigger: {trigger: elem, scroller: scrollerTarget, start: "top 85%"}
                    }
                );
            });

            gsap.fromTo(".feature-card",
                {y: 80, opacity: 0, scale: 0.8, rotationY: 15},
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    rotationY: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "back.out(1.5)",
                    scrollTrigger: {trigger: ".features-section", scroller: scrollerTarget, start: "top 75%"}
                }
            );

            gsap.utils.toArray(".journey-node").forEach((node: any) => {
                gsap.fromTo(node, {x: -30, opacity: 0, filter: "blur(5px)"}, {
                    x: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {trigger: node, scroller: scrollerTarget, start: "top 85%"}
                });
            });

            gsap.utils.toArray(".work-step").forEach((step: any, i) => {
                gsap.fromTo(step, {x: i % 2 === 0 ? -30 : 30, opacity: 0, filter: "blur(5px)"}, {
                    x: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {trigger: step, scroller: scrollerTarget, start: "top 80%"}
                });
            });

            // Desktop Horizontal Scroll Pinning
            gsap.utils.toArray(".bento-reveal").forEach((elem: any) => {
                gsap.fromTo(elem, {y: 80, opacity: 0, rotationX: 10, scale: 0.95}, {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "expo.out",
                    scrollTrigger: {trigger: elem, scroller: scrollerTarget, start: "top 85%"}
                });
            });

            const track = bestToursTrackRef.current;
            const section = bestToursRef.current;
            if (track && section) {
                const getScrollAmount = () => -(track.scrollWidth - section.offsetWidth);
                const tween = gsap.to(track, {x: getScrollAmount, ease: "none"});
                ScrollTrigger.create({
                    trigger: section,
                    scroller: scrollerTarget,
                    pinType: pinMode as any,
                    start: "top top",
                    end: () => `+=${track.scrollWidth - section.offsetWidth}`,
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true
                });
            }
        });

        // 📱 MOBILE: OPTIMIZED 2D ANIMATIONS (No blurs, no 3D rotations to save battery & prevent lag)
        mm.add("(max-width: 767px)", () => {

            const heroTl = gsap.timeline({defaults: {ease: "power2.out"}});
            heroTl.fromTo(".hero-bg-overlay", {opacity: 1}, {opacity: 0.6, duration: 1})
                .fromTo(".hero-text-line", {y: 40, opacity: 0}, {y: 0, opacity: 1, duration: 1, stagger: 0.1}, "-=0.5")
                .fromTo(".hero-subtitle", {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.8}, "-=0.8")
                .fromTo(".hero-search", {y: 20, opacity: 0}, {y: 0, opacity: 1, duration: 0.8}, "-=0.6");

            gsap.utils.toArray(".text-reveal").forEach((elem: any) => {
                gsap.fromTo(elem, {y: 30, opacity: 0}, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {trigger: elem, scroller: scrollerTarget, start: "top 90%"}
                });
            });

            gsap.fromTo(".feature-card", {y: 40, opacity: 0}, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {trigger: ".features-section", scroller: scrollerTarget, start: "top 85%"}
            });

            gsap.utils.toArray(".journey-node").forEach((node: any) => {
                gsap.fromTo(node, {x: -15, opacity: 0}, {
                    x: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {trigger: node, scroller: scrollerTarget, start: "top 90%"}
                });
            });

            gsap.utils.toArray(".work-step").forEach((step: any) => {
                gsap.fromTo(step, {y: 30, opacity: 0}, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {trigger: step, scroller: scrollerTarget, start: "top 90%"}
                });
            });
        });

        // 🌍 UNIVERSAL ANIMATIONS (Shared across all devices)
        mm.add("all", () => {
            gsap.to(".memory-track-1", {xPercent: -50, ease: "none", duration: 35, repeat: -1});
            gsap.fromTo(".memory-track-2", {xPercent: -50}, {xPercent: 0, ease: "none", duration: 35, repeat: -1});

            gsap.fromTo(".marquee-track-1", {xPercent: -50}, {xPercent: 0, ease: "none", duration: 25, repeat: -1});
            gsap.fromTo(".marquee-track-2", {xPercent: 0}, {xPercent: -50, ease: "none", duration: 25, repeat: -1});

            const journeyTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".journey-section",
                    scroller: scrollerTarget,
                    start: "top 60%",
                    end: "bottom 80%",
                    scrub: 1
                }
            });
            journeyTl.fromTo(".journey-line-fill", {height: "0%"}, {height: "100%", ease: "none"});

            const workTl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".work-section",
                    scroller: scrollerTarget,
                    start: "top 60%",
                    end: "bottom 80%",
                    scrub: 1
                }
            });
            workTl.fromTo(".progress-line-fill", {height: "0%"}, {height: "100%", ease: "none"});
        });

    }, {scope: containerRef, dependencies: []}); // 👈 Empty dependency array prevents multiple refreshing!

    const handleMarqueeEnter = () => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
        gsap.getTweensOf(".marquee-track-1").forEach((t) => t.pause());
        gsap.getTweensOf(".marquee-track-2").forEach((t) => t.pause());
    };

    const handleMarqueeLeave = () => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return;
        gsap.getTweensOf(".marquee-track-1").forEach((t) => t.play());
        gsap.getTweensOf(".marquee-track-2").forEach((t) => t.play());
    };

    return (
        <div ref={containerRef}
             className="relative w-full overflow-hidden bg-[#020202] text-white selection:bg-orange-600 perspective-[1000px]">
            <div
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 fixed will-change-transform"></div>

            {/* HERO SECTION */}
            <section
                className="relative h-[100svh] flex flex-col justify-center items-center text-center px-3 sm:px-4 overflow-hidden rounded-b-[2rem] md:rounded-b-[4rem] shadow-[0_30px_80px_rgba(0,0,0,0.9)] z-10 border-b border-white/10">
                {heroImages.map((src, index) => (
                    <div key={index}
                         className={`absolute inset-0 transition-all duration-1000 ease-in-out will-change-transform ${index === currentImg ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                        {/* Mobile Performance: Preload only the first image */}
                        <Image src={src} alt={`Hero ${index}`} fill sizes="100vw" className="object-cover"
                               priority={index === 0} quality={80}/>
                    </div>
                ))}
                <div
                    className="hero-bg-overlay absolute inset-0 bg-gradient-to-b from-[#020202]/90 via-[#020202]/40 to-[#020202]"></div>

                <div className="relative z-10 w-full max-w-6xl mt-16 sm:mt-20 flex flex-col items-center">
                    <div className="overflow-hidden mb-1 sm:mb-2">
                        {/* Responsive Fix: Scaled text for foldables (text-3xl) */}
                        <h1 className="hero-text-line font-heading text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] font-black tracking-tighter text-white uppercase drop-shadow-[0_0_30px_rgba(0,0,0,1)] break-words">
                            CHASE THE
                        </h1>
                    </div>
                    <div className="overflow-hidden mb-6 sm:mb-8">
                        <h1 className="hero-text-line font-heading text-3xl sm:text-6xl md:text-7xl lg:text-[7rem] leading-[0.9] font-black tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(0,0,0,1)] break-words">
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">UNKNOWN</span>
                        </h1>
                    </div>
                    <p className="hero-subtitle text-sm sm:text-base md:text-xl text-zinc-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-2xl px-2 sm:px-4">
                        Immersive, off-beat, and unforgettable journeys. You pack your bags, <span
                        className="text-white font-bold">DD Tours</span> handles the adventure.
                    </p>

                    {/* Highly Optimized Responsive Search Bar */}
                    <div
                        className="hero-search w-full max-w-3xl bg-[#111] md:bg-black/50 md:backdrop-blur-xl border border-white/20 p-1.5 sm:p-2 rounded-2xl md:rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center transition-shadow hover:shadow-[0_20px_50px_rgba(234,88,12,0.2)]"
                        onMouseMove={(e) => handle3DHover(e, 5)} onMouseLeave={handle3DLeave}>
                        <div
                            className="flex-1 flex items-center gap-2 sm:gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b md:border-b-0 md:border-r border-white/10 group min-w-0">
                            <MapPin
                                className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5 shrink-0 group-focus-within:scale-110 transition-transform"/>
                            <input type="text" placeholder="Where to?"
                                   className="bg-transparent border-none outline-none text-white placeholder:text-zinc-500 w-full font-medium tracking-wide text-sm sm:text-base min-w-0"/>
                        </div>
                        <div
                            className="flex-1 hidden sm:flex items-center gap-3 px-6 py-4 border-b md:border-b-0 md:border-r border-white/10 group min-w-0">
                            <Calendar
                                className="text-orange-500 w-5 h-5 shrink-0 group-focus-within:scale-110 transition-transform"/>
                            <input type="text" placeholder="When?"
                                   className="bg-transparent border-none outline-none text-white placeholder:text-zinc-500 w-full font-medium tracking-wide text-base min-w-0"/>
                        </div>
                        <Link href="/tours"
                              className="w-full md:w-auto mt-2 md:mt-0 bg-orange-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl md:rounded-full font-black uppercase tracking-widest text-xs sm:text-sm transition-transform hover:bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2 group active:scale-95 border border-transparent hover:border-orange-400">
                            <Search size={16}
                                    className="group-hover:rotate-90 transition-transform sm:w-[18px] sm:h-[18px]"/><span>Find Tours</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* OUR BEST MEMORIES */}
            <section className="py-16 sm:py-20 md:py-32 relative z-10 overflow-hidden">
                <div
                    className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-orange-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0 will-change-transform"></div>

                <div className="text-center mb-10 sm:mb-12 relative z-10 px-4">
                    <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                        <Camera className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5"/>
                        <span
                            className="text-orange-500 font-mono text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Captured Wanderlust</span>
                    </div>
                    <h2 className="text-reveal font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-lg break-words">
                        Timeless <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Memories</span>
                    </h2>
                </div>

                <div className="relative flex flex-col gap-4 sm:gap-6 overflow-hidden w-full z-10">
                    <div
                        className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-40 bg-gradient-to-r from-[#020202] to-transparent z-10 pointer-events-none"></div>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-40 bg-gradient-to-l from-[#020202] to-transparent z-10 pointer-events-none"></div>

                    <div
                        className="memory-track-1 flex gap-3 sm:gap-4 md:gap-6 w-max transform-gpu will-change-transform">
                        {[...memoryImages, ...memoryImages].map((img, i) => (
                            <div key={i} onMouseMove={(e) => handle3DHover(e, 15)} onMouseLeave={handle3DLeave}
                                 className="w-[140px] h-[100px] sm:w-[180px] sm:h-[140px] md:w-[400px] md:h-[280px] shrink-0 rounded-[1rem] sm:rounded-[1.5rem] md:rounded-3xl overflow-hidden relative border border-white/10 shadow-xl cursor-pointer bg-[#111]">
                                <Image src={img} alt="Travel Memory" fill sizes="(max-width: 768px) 180px, 400px"
                                       className="object-cover" quality={50} loading="lazy"/>
                                <div
                                    className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-500"></div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="memory-track-2 flex gap-3 sm:gap-4 md:gap-6 w-max -ml-10 sm:-ml-20 transform-gpu will-change-transform">
                        {[...memoryImages, ...memoryImages].reverse().map((img, i) => (
                            <div key={i} onMouseMove={(e) => handle3DHover(e, 15)} onMouseLeave={handle3DLeave}
                                 className="w-[140px] h-[100px] sm:w-[180px] sm:h-[140px] md:w-[400px] md:h-[280px] shrink-0 rounded-[1rem] sm:rounded-[1.5rem] md:rounded-3xl overflow-hidden relative border border-white/10 shadow-xl cursor-pointer bg-[#111]">
                                <Image src={img} alt="Travel Memory" fill sizes="(max-width: 768px) 180px, 400px"
                                       className="object-cover" quality={50} loading="lazy"/>
                                <div
                                    className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FLAWLESS INFINITE BENTO GRID */}
            <section className="py-16 sm:py-20 lg:py-32 w-full relative z-10 overflow-hidden">
                <div className="text-center mb-10 sm:mb-12 lg:mb-20 px-4">
                    <h2 className="text-reveal font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 uppercase tracking-tighter drop-shadow-lg break-words">
                        Epic <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Terrains</span>
                    </h2>
                </div>

                <div
                    className="group flex overflow-hidden w-full lg:overflow-visible lg:max-w-7xl lg:mx-auto px-4 lg:px-8 perspective-[1000px]">
                    {/* Mobile: Horizontal scroll. Desktop: CSS Grid */}
                    <div
                        className="flex w-max lg:w-full gap-3 sm:gap-4 pr-4 lg:pr-0 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:h-[600px] animate-marquee lg:animate-none group-active:[animation-play-state:paused] hover:[animation-play-state:paused] will-change-transform transform-gpu">
                        {bentoCards.map((card) => (
                            <Link key={card.id} href="/tours" onMouseMove={(e) => handle3DHover(e, 8)}
                                  onMouseLeave={handle3DLeave}
                                  className={`bento-reveal shrink-0 w-[75vw] sm:w-[50vw] lg:w-auto h-[300px] sm:h-[400px] lg:h-full relative group/card rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden block border border-white/10 shadow-2xl bg-[#0a0a0a] ${card.classes}`}>
                                <Image src={card.img} alt={card.title} fill sizes="(max-width: 1024px) 80vw, 50vw"
                                       className="object-cover transition-transform duration-1000 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                       quality={60} loading="lazy"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#020202]/90 via-[#020202]/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                                    <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">{card.title}</h3>
                                </div>
                            </Link>
                        ))}
                        {/* Duplicate for mobile scroll loop */}
                        {bentoCards.map((card) => (
                            <Link key={`dup-${card.id}`} href="/tours"
                                  className={`lg:hidden shrink-0 w-[75vw] sm:w-[50vw] h-[300px] sm:h-[400px] relative group/card rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden block border border-white/10 shadow-2xl bg-[#0a0a0a]`}>
                                <Image src={card.img} alt={card.title} fill sizes="(max-width: 1024px) 80vw, 50vw"
                                       className="object-cover transition-transform duration-1000 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                       quality={60} loading="lazy"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#020202]/90 via-[#020202]/40 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
                                    <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight drop-shadow-md">{card.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHAT WE PROVIDE */}
            <section className="features-section py-16 sm:py-24 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
                <div
                    className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0 will-change-transform"></div>

                <div className="text-center mb-12 sm:mb-16 relative z-10">
                    <h2 className="text-reveal font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 uppercase tracking-tighter break-words">
                        Why <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Choose Us</span>
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-10">
                    {[
                        {
                            icon: Compass,
                            title: "Expert Local Guides",
                            desc: "Navigate hidden trails with locals who know the land."
                        },
                        {
                            icon: ShieldCheck,
                            title: "100% Secure & Safe",
                            desc: "From vetted transport to emergency support, safety is priority."
                        },
                        {
                            icon: HeartHandshake,
                            title: "Hassle-Free Planning",
                            desc: "Permits, stays, and meals are pre-arranged. Just enjoy."
                        }
                    ].map((feature, i) => (
                        <div key={i} onMouseMove={(e) => handle3DHover(e, 12)} onMouseLeave={handle3DLeave}
                             className="feature-card bg-[#111] md:bg-black/60 backdrop-blur-sm md:backdrop-blur-xl border border-white/10 p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] shadow-xl hover:shadow-[0_20px_50px_rgba(234,88,12,0.15)] hover:border-orange-500/30 transition-colors group cursor-default">
                            <div
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-5 sm:mb-8 shadow-inner group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500"/>
                            </div>
                            <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-black text-white mb-2 sm:mb-3 uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 🆕 EXPEDITION PROTOCOL */}
            <section className="journey-section py-16 sm:py-24 relative z-10 bg-[#050505] border-y border-white/5">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-20">
                        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                            <MapPin className="text-emerald-500 w-4 h-4 sm:w-5 sm:h-5"/>
                            <span
                                className="text-emerald-500 font-mono text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Expedition Protocol</span>
                        </div>
                        <h2 className="text-reveal font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 uppercase tracking-tighter">
                            The <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Journey</span>
                        </h2>
                        <p className="text-zinc-400 text-xs sm:text-sm md:text-base px-2">A transparent look at how we
                            execute our tours from start to finish.</p>
                    </div>

                    <div className="relative">
                        {/* Responsive Fix: Timeline positioning for mobile */}
                        <div
                            className="absolute left-[18px] sm:left-[24px] md:left-12 top-0 bottom-0 w-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="journey-line-fill w-full bg-gradient-to-b from-emerald-500 to-teal-500 shadow-[0_0_15px_#10b981] will-change-transform"></div>
                        </div>

                        {journeySteps.map((step, i) => (
                            <div key={i} className="journey-node relative flex items-start mb-10 sm:mb-16 last:mb-0">
                                {/* Glowing Node Icon - Scaled for mobile */}
                                <div
                                    className="absolute left-0 sm:left-[6px] md:left-[26px] w-10 h-10 sm:w-12 sm:h-12 bg-[#050505] border-2 border-emerald-500 rounded-[0.8rem] sm:rounded-xl flex items-center justify-center z-10 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400"/>
                                </div>

                                {/* Content Box */}
                                <div
                                    className="ml-14 sm:ml-20 md:ml-32 w-full bg-[#111] md:bg-white/5 md:backdrop-blur-md border border-white/10 p-5 sm:p-6 md:p-8 rounded-[1.2rem] sm:rounded-[1.5rem] shadow-xl hover:border-emerald-500/30 transition-colors">
                                    <div
                                        className="text-emerald-500 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1.5 sm:mb-2">Phase
                                        0{i + 1}</div>
                                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-black text-white mb-1.5 sm:mb-2 uppercase tracking-tight">{step.title}</h3>
                                    <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-medium">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW TO START */}
            <section className="work-section py-16 sm:py-24 relative z-10 bg-[#020202]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12 sm:mb-20">
                        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                            <Fingerprint className="text-orange-500 w-4 h-4 sm:w-5 sm:h-5"/>
                            <span
                                className="text-orange-500 font-mono text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">Initiation</span>
                        </div>
                        <h2 className="text-reveal font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 uppercase tracking-tighter">
                            How To <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Start</span>
                        </h2>
                    </div>
                    <div className="relative">
                        <div
                            className="absolute left-[18px] sm:left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-white/5 md:-translate-x-1/2 rounded-full overflow-hidden">
                            <div
                                className="progress-line-fill w-full bg-gradient-to-b from-orange-500 to-red-600 shadow-[0_0_15px_#ea580c] will-change-transform"></div>
                        </div>
                        {[
                            {
                                icon: MapIcon,
                                step: "01",
                                title: "Select Target",
                                desc: "Browse our curated database of off-beat locations."
                            },
                            {
                                icon: Tent,
                                step: "02",
                                title: "Secure Booking",
                                desc: "Confirm your spot. We handle the complex logistics."
                            },
                            {
                                icon: Mountain,
                                step: "03",
                                title: "Deploy",
                                desc: "Meet your squad and let the journey unfold."
                            }
                        ].map((item, i) => (
                            <div key={i}
                                 className={`work-step relative flex items-center mb-16 sm:mb-24 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div
                                    className="absolute left-0 sm:left-[10px] md:left-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-[#0a0a0a] border-2 border-orange-500 rounded-[0.8rem] sm:rounded-xl flex items-center justify-center md:-translate-x-1/2 z-10 shadow-[0_0_20px_rgba(234,88,12,0.6)]">
                                    <item.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white"/>
                                </div>
                                <div
                                    className={`ml-14 sm:ml-20 md:ml-0 w-full md:w-5/12 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                                    <p className="text-orange-500 font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-2">STEP {item.step}</p>
                                    <h3 className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 sm:mb-3 uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FLAWLESS INFINITE BEST TOURS */}
            <section ref={bestToursRef}
                     className="relative py-16 sm:py-24 lg:py-0 lg:h-screen w-full bg-[#050505] overflow-hidden flex flex-col lg:justify-center border-t border-white/10 z-20">
                <div
                    className="text-center mb-10 sm:mb-12 lg:mb-0 lg:absolute lg:top-24 lg:left-20 lg:text-left lg:z-10 lg:pointer-events-none px-4">
                    <h2 className="text-reveal font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter drop-shadow-xl">
                        Our <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Best Tours</span>
                    </h2>
                    <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-[0.3em] mt-4 hidden lg:block">Swipe
                        to explore expeditions.</p>
                </div>

                <div
                    className="group flex overflow-hidden w-full lg:overflow-visible lg:w-max lg:px-20 lg:pr-[25vw] lg:pt-20 perspective-[1000px]">
                    <div ref={bestToursTrackRef}
                         className="flex gap-4 sm:gap-6 pr-4 sm:pr-6 lg:gap-10 lg:pr-0 w-max animate-marquee lg:animate-none group-active:[animation-play-state:paused] hover:[animation-play-state:paused] px-4 lg:px-0 transform-gpu will-change-transform">
                        {featuredTours.map((tour) => (
                            <Link href={`/tours`} key={tour.id} onMouseMove={(e) => handle3DHover(e, 8)}
                                  onMouseLeave={handle3DLeave}
                                  className="shrink-0 w-[75vw] sm:w-[45vw] lg:w-[35vw] group/card relative h-[40vh] sm:h-[50vh] lg:h-[65vh] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden block border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a]">
                                <Image src={tour.img} alt={tour.title} fill sizes="(max-width: 1024px) 85vw, 40vw"
                                       className="object-cover transition-transform duration-1000 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                       quality={70} loading="lazy"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#020202]/90 via-[#020202]/40 to-transparent"></div>

                                <div
                                    className="absolute bottom-0 left-0 p-5 sm:p-6 md:p-10 w-full lg:translate-y-6 group-hover/card:translate-y-0 transition-transform duration-500">
                                    <div
                                        className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-mono text-[9px] sm:text-[10px] md:text-xs mb-2 sm:mb-3 uppercase tracking-widest shadow-black">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4"/> {tour.location}
                                    </div>
                                    <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 uppercase tracking-tighter leading-none drop-shadow-md">{tour.title}</h3>
                                    <div
                                        className="flex justify-between items-center opacity-100 lg:opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100 mt-2 sm:mt-4 md:mt-0">
                                        <span
                                            className="font-heading text-lg sm:text-xl md:text-3xl font-black text-white tracking-tighter">{tour.price}</span>
                                        <span
                                            className="bg-[#111] md:bg-white/10 md:backdrop-blur-md border border-white/20 text-white px-4 sm:px-5 md:px-8 py-2 md:py-3 rounded-lg sm:rounded-xl font-bold text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest md:hover:bg-emerald-600 transition-colors shadow-lg">
                                            Discover
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {/* Duplicate for mobile scroll loop */}
                        {featuredTours.map((tour) => (
                            <Link href={`/tours/${tour.id}`} key={`dup-${tour.id}`}
                                  className="lg:hidden shrink-0 w-[75vw] sm:w-[45vw] group/card relative h-[40vh] sm:h-[50vh] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden block border border-white/10 shadow-2xl bg-[#0a0a0a]">
                                <Image src={tour.img} alt={tour.title} fill sizes="(max-width: 1024px) 85vw, 40vw"
                                       className="object-cover transition-transform duration-1000 group-hover/card:scale-110 opacity-80 group-hover/card:opacity-100"
                                       quality={70} loading="lazy"/>
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-[#020202]/90 via-[#020202]/40 to-transparent"></div>

                                <div
                                    className="absolute bottom-0 left-0 p-5 sm:p-6 w-full transition-transform duration-500">
                                    <div
                                        className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 font-mono text-[9px] sm:text-[10px] mb-1.5 sm:mb-2 uppercase tracking-widest">
                                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4"/> {tour.location}
                                    </div>
                                    <h3 className="font-heading text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3 uppercase tracking-tighter leading-none">{tour.title}</h3>
                                    <div
                                        className="flex justify-between items-center opacity-100 transition-opacity duration-500 mt-1.5 sm:mt-2">
                                        <span
                                            className="font-heading text-base sm:text-lg md:text-xl font-black text-white tracking-tighter">{tour.price}</span>
                                        <span
                                            className="bg-[#111] border border-white/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-bold text-[8px] sm:text-[9px] uppercase tracking-widest">
                                            Discover
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* WALL OF LOVE MARQUEE */}
            <section
                className="py-16 sm:py-24 bg-[#020202] overflow-hidden border-y border-white/10 relative z-10 perspective-[1000px]">
                <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-reveal font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter">
                        Traveler <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Voices</span>
                    </h2>
                </div>

                <div className="relative flex flex-col gap-4 sm:gap-6 md:gap-8 overflow-hidden w-full py-2 sm:py-4"
                     onMouseEnter={handleMarqueeEnter} onMouseLeave={handleMarqueeLeave}>
                    <div
                        className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-40 bg-gradient-to-r from-[#020202] to-transparent z-10 pointer-events-none"></div>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-40 bg-gradient-to-l from-[#020202] to-transparent z-10 pointer-events-none"></div>

                    <div
                        className="marquee-track-1 flex gap-3 sm:gap-4 md:gap-6 w-max transform-gpu will-change-transform">
                        {[...testimonials, ...testimonials].map((review, i) => (
                            <div key={i} onMouseMove={(e) => handle3DHover(e, 8)} onMouseLeave={handle3DLeave}
                                 className="w-[240px] sm:w-[280px] md:w-[450px] bg-[#111] md:bg-black/60 md:backdrop-blur-xl border border-white/10 p-5 sm:p-6 md:p-8 rounded-[1.2rem] sm:rounded-[1.5rem] md:rounded-[2rem] shrink-0 transition-shadow hover:shadow-[0_20px_50px_rgba(234,88,12,0.15)] cursor-default">
                                <div
                                    className="flex text-orange-500 mb-3 sm:mb-4 md:mb-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4"
                                                                         fill="currentColor"/>)}
                                </div>
                                <p className="text-zinc-300 font-medium leading-relaxed mb-4 sm:mb-6 md:mb-8 text-[11px] sm:text-xs md:text-sm">"{review.text}"</p>
                                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                    <div
                                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-black text-white shadow-inner text-xs sm:text-sm">{review.name.charAt(0)}</div>
                                    <span
                                        className="text-white font-bold uppercase tracking-wider text-[10px] sm:text-xs md:text-sm">{review.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        className="marquee-track-2 flex gap-3 sm:gap-4 md:gap-6 w-max transform-gpu -ml-12 sm:-ml-16 md:-ml-32 will-change-transform">
                        {[...testimonials, ...testimonials].map((review, i) => (
                            <div key={i} onMouseMove={(e) => handle3DHover(e, 8)} onMouseLeave={handle3DLeave}
                                 className="w-[240px] sm:w-[280px] md:w-[450px] bg-[#111] md:bg-black/60 md:backdrop-blur-xl border border-white/10 p-5 sm:p-6 md:p-8 rounded-[1.2rem] sm:rounded-[1.5rem] md:rounded-[2rem] shrink-0 transition-shadow hover:shadow-[0_20px_50px_rgba(234,88,12,0.15)] cursor-default">
                                <div
                                    className="flex text-orange-500 mb-3 sm:mb-4 md:mb-6 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
                                    {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4"
                                                                         fill="currentColor"/>)}
                                </div>
                                <p className="text-zinc-300 font-medium leading-relaxed mb-4 sm:mb-6 md:mb-8 text-[11px] sm:text-xs md:text-sm">"{review.text}"</p>
                                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                    <div
                                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-black text-white shadow-inner text-xs sm:text-sm">{review.name.charAt(0)}</div>
                                    <span
                                        className="text-white font-bold uppercase tracking-wider text-[10px] sm:text-xs md:text-sm">{review.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section onMouseMove={(e) => handle3DHover(e, 3)} onMouseLeave={handle3DLeave}
                     className="py-16 sm:py-20 md:py-32 relative px-4 flex justify-center text-center bg-[#050505] z-10 overflow-hidden">
                <div
                    className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/10 via-transparent to-transparent pointer-events-none"></div>

                <div
                    className="relative z-10 max-w-4xl bg-[#111] md:bg-black/40 md:backdrop-blur-2xl border border-white/10 p-6 sm:p-10 md:p-20 rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                    {/* 🔥 Changed to Premium Travel Copy */}
                    <h2 className="text-reveal font-heading text-2xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tighter drop-shadow-xl leading-tight">
                        Your Next Adventure <br className="hidden sm:block"/><span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Awaits</span>
                    </h2>
                    <p className="text-zinc-400 text-xs sm:text-sm md:text-lg mb-6 sm:mb-8 md:mb-10 font-medium px-2">Secure
                        your spot and let us handle the logistics. Your next great story starts here.</p>
                    <Link href="/tours"
                          className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-orange-600 text-white hover:bg-orange-500 px-8 sm:px-10 md:px-12 py-3.5 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs md:text-sm transition-all active:scale-95 shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_50px_rgba(234,88,12,0.6)] group border border-transparent w-full sm:w-auto">
                        Start Planning <ArrowRight
                        className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"/>
                    </Link>
                </div>
            </section>
        </div>
    );
}