"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MapPin, Compass, ShieldCheck, HeartHandshake, Tent, Mountain, Map as MapIcon, Search, Calendar, Star, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
    ScrollTrigger.config({ ignoreMobileResize: true });
}

// --- Local Image Data ---
const heroImages = [
    "/images/hero-1.webp",
    "/images/hero-2.webp",
    "/images/hero-3.webp",
    "/images/hero-4.webp"
];

const memoryImages = [
    "/images/kashmir.webp",
    "/images/spiti.webp",
    "/images/meghalaya.webp",
    "/images/zanskar.webp",
    "/images/vrindavan.webp",
    "/images/varanasi.webp",
    "/images/kerala.webp",
    "/images/sikkim.webp",
    "/images/arunachal.webp",
    "/images/kedarnath.webp",
];

const featuredTours = [
    { id: 1, title: "Spiti Valley Expedition", location: "Himachal Pradesh", price: "₹24,999", img: "/images/spiti.webp" },
    { id: 2, title: "Kashmir Great Lakes", location: "Jammu & Kashmir", price: "₹18,500", img: "/images/kashmir.webp" },
    { id: 3, title: "Meghalaya Monsoons", location: "North East India", price: "₹21,000", img: "/images/meghalaya.webp" },
    { id: 4, title: "Zanskar Frozen River", location: "Ladakh", price: "₹35,000", img: "/images/zanskar.webp" },
    { id: 5, title: "Vrindavan", location: "Uttarakhand", price: "₹15,000", img: "/images/vrindavan.webp" },
    { id: 6, title: "Varanasi", location: "Uttar Pradesh", price: "₹12,000", img: "/images/varanasi.webp" },
    { id: 7, title: "Kerala", location: "Kerala", price: "₹18000", img: "/images/kerala.webp", },
    { id: 8, title: "Sikkim", location: "Sikkim", price: "₹20,000", img: "/images/sikkim.webp" },
    { id: 9, title: "Arunachal Pradesh", location: "Arunachal Pradesh", price: "₹25,000", img: "/images/arunachal.webp" },
    { id: 10, title: "Kedarnath", location: "Himachal Pradesh", price: "₹22,000", img: "/images/kedarnath.webp" },
];

const bentoCards = [
    { id: 1, title: "Mountain", img: "/images/mountain.webp", classes: "lg:col-span-2 lg:row-span-2" },
    { id: 2, title: "Jungle", img: "/images/jungle.webp", classes: "lg:col-span-2 lg:row-span-1" },
    { id: 3, title: "Ocean", img: "/images/ocean.webp", classes: "lg:col-span-1 lg:row-span-1" },
    { id: 4, title: "Desert", img: "/images/desert.webp", classes: "lg:col-span-1 lg:row-span-1" },
];

const testimonials = [
    { name: "Rahul S.", text: "DD Tours made our Kashmir trip completely frictionless. Highly recommended!" },
    { name: "Priya M.", text: "The Spiti expedition changed my life. The local guides were phenomenal." },
    { name: "Ankit D.", text: "Best travel agency. Period. Their attention to detail is insane." },
    { name: "Sneha K.", text: "Affordable, safe, and wildly adventurous. Can't wait for my next trip." },
    { name: "Argha P.", text: "Best travel agency. Period. Their attention to detail is insane."},
    { name: "Puja V.", text: "DD Tours made our Kashmir trip completely frictionless. Highly recommended!"},
    { name: "Gaurav S.", text: "My family become very happy with this Tour Package"},
    { name: "Deepak K.", text: "Best travel agency. Period. Their attention to detail is insane."}
    // Add more testimonials as needed
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

    useGSAP(() => {
        if (!containerRef.current) return;

        const timer = setTimeout(() => {
            const customScroller = document.querySelector("#main-scroll-container");
            if (customScroller) {
                ScrollTrigger.defaults({
                    scroller: customScroller,
                    pinType: "transform"
                });
            }

            // 1. HERO ANIMATIONS
            const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
            heroTl.fromTo(".hero-bg-overlay", { opacity: 1 }, { opacity: 0.7, duration: 2 })
                .fromTo(".hero-text-line", { y: 150, skewY: 5 }, { y: 0, skewY: 0, duration: 1.5, stagger: 0.1 }, "-=1.5")
                .fromTo(".hero-subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=1")
                .fromTo(".hero-search", { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "-=0.8");

            // 2. TEXT REVEALS
            gsap.utils.toArray(".text-reveal").forEach((elem: any) => {
                if (!elem) return;
                gsap.fromTo(elem,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
                );
            });

            // 3. MEMORIES DUAL MARQUEE (GSAP)
            gsap.to(".memory-track-1", { xPercent: -50, ease: "none", duration: 35, repeat: -1, scrollTrigger: { trigger: ".memory-track-1", start: "top bottom", toggleActions: "play pause resume pause" } });
            gsap.fromTo(".memory-track-2", { xPercent: -50 }, { xPercent: 0, ease: "none", duration: 35, repeat: -1, scrollTrigger: { trigger: ".memory-track-2", start: "top bottom", toggleActions: "play pause resume pause" } });

            // 4. WHY CHOOSE US
            const featureCards = gsap.utils.toArray(".feature-card");
            featureCards.forEach((card: any, index) => {
                if (!card) return;
                const xStart = index === 0 ? -100 : index === 2 ? 100 : 0;
                const yStart = index === 1 ? 100 : 0;
                gsap.fromTo(card,
                    { x: xStart, y: yStart, opacity: 0 },
                    { x: 0, y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".features-section", start: "top 75%" } }
                );
            });

            // 5. HOW WE WORK
            const workTl = gsap.timeline({ scrollTrigger: { trigger: ".work-section", start: "top 60%", end: "bottom 80%", scrub: 1 }});
            workTl.fromTo(".progress-line-fill", { height: "0%" }, { height: "100%", ease: "none" });

            gsap.utils.toArray(".work-step").forEach((step: any, i) => {
                if (!step) return;
                gsap.fromTo(step,
                    { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: step, start: "top 80%" } }
                );
            });

            // =========================================================
            // 6. GSAP MATCHMEDIA (DESKTOP ONLY PINNING - 1024px+)
            // Note: Tablets (768px-1023px) now use the mobile auto-scroll to avoid touch lag
            // =========================================================
            const mm = gsap.matchMedia();

            mm.add("(min-width: 1024px)", () => {

                // Desktop Bento Entrance
                gsap.utils.toArray(".bento-reveal").forEach((elem: any) => {
                    if (!elem) return;
                    gsap.fromTo(elem,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
                    );
                });

                // Desktop Best Tours Horizontal Pin
                const track = bestToursTrackRef.current;
                const section = bestToursRef.current;

                if (track && section) {
                    const getScrollAmount = () => -(track.scrollWidth - section.offsetWidth);
                    const tween = gsap.to(track, { x: getScrollAmount, ease: "none" });

                    ScrollTrigger.create({
                        trigger: section,
                        start: "top top",
                        end: () => `+=${track.scrollWidth - section.offsetWidth}`,
                        pin: true,
                        animation: tween,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    });
                }
            });

            ScrollTrigger.refresh();

            // 7. REVIEWS MARQUEE
            gsap.to(".marquee-track", { xPercent: -50, ease: "none", duration: 20, repeat: -1, scrollTrigger: { trigger: ".marquee-track", start: "top bottom", toggleActions: "play pause resume pause" } });

        }, 100);

        return () => clearTimeout(timer);
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-background">

            {/* CLASSIC STABLE HERO SECTION */}
            <section className="relative h-[100svh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
                {heroImages.map((src, index) => (
                    <div key={index} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentImg ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                        <Image src={src} alt={`Hero ${index}`} fill sizes="100vw" className="object-cover" priority={index === 0}/>
                    </div>
                ))}
                <div className="hero-bg-overlay absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background"></div>
                <div className="relative z-10 max-w-6xl mt-20 flex flex-col items-center">
                    <div className="overflow-hidden mb-2"><h1 className="hero-text-line text-5xl md:text-[8rem] leading-[0.85] font-black tracking-tighter text-white uppercase">CHASE THE</h1></div>
                    <div className="overflow-hidden mb-8">
                        <h1 className="hero-text-line text-5xl md:text-[8rem] leading-[0.85] font-black tracking-tighter uppercase">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-[0_0_30px_var(--color-primary)]">UNKNOWN</span>
                        </h1>
                    </div>
                    <p className="hero-subtitle text-lg md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-lg px-4">
                        Immersive, off-beat, and unforgettable journeys across India. Pack your bags, <span className="text-white font-bold">DD Tours</span> has the rest covered.
                    </p>

                    <div className="hero-search w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:rounded-full rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-center">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
                            <MapPin className="text-primary w-5 h-5 shrink-0" /><input type="text" placeholder="Where to?" className="bg-transparent border-none outline-none text-white placeholder:text-zinc-400 w-full" />
                        </div>
                        <div className="flex-1 hidden sm:flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
                            <Calendar className="text-primary w-5 h-5 shrink-0" /><input type="text" placeholder="When?" className="bg-transparent border-none outline-none text-white placeholder:text-zinc-400 w-full" />
                        </div>
                        <Link href="/tours" className="w-full md:w-auto mt-2 md:mt-0 bg-gradient-to-r from-primary to-accent text-white px-8 py-4 md:py-3 rounded-xl md:rounded-full font-bold transition-transform hover:scale-105 shadow-[0_0_20px_var(--color-primary)] flex items-center justify-center gap-2 group">
                            <Search size={18} /><span>Find Tours</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* OUR BEST MEMORIES (DUAL MARQUEE) */}
            <section className="py-16 md:py-24 bg-background overflow-hidden">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <Camera className="text-primary w-6 h-6" />
                        <span className="text-primary font-bold uppercase tracking-widest text-sm">DD Tours Gallery</span>
                    </div>
                    <h2 className="text-reveal text-3xl md:text-5xl font-black text-white uppercase tracking-tight">Our Best <span className="text-primary">Memories</span></h2>
                </div>

                <div className="relative flex flex-col gap-4 overflow-hidden w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>

                    <div className="memory-track-1 flex gap-4 w-max transform-gpu">
                        {[...memoryImages, ...memoryImages].map((img, i) => (
                            <div key={i} className="w-[200px] h-[150px] md:w-[350px] md:h-[250px] shrink-0 rounded-3xl overflow-hidden relative border border-white/5">
                                <Image src={img} alt="Travel Memory" fill sizes="(max-width: 768px) 200px, 350px" className="object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                    <div className="memory-track-2 flex gap-4 w-max -ml-20 transform-gpu">
                        {[...memoryImages, ...memoryImages].reverse().map((img, i) => (
                            <div key={i} className="w-[200px] h-[150px] md:w-[350px] md:h-[250px] shrink-0 rounded-3xl overflow-hidden relative border border-white/5">
                                <Image src={img} alt="Travel Memory" fill sizes="(max-width: 768px) 200px, 350px" className="object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FLAWLESS INFINITE BENTO GRID (Mobile/Tablet Marquee, Desktop Grid) */}
            <section className="py-16 lg:py-32 w-full bg-background overflow-hidden">
                <div className="text-center mb-10 lg:mb-20 px-4">
                    <h2 className="text-reveal text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Best <span className="text-primary">Locations</span></h2>
                </div>

                <div className="group flex overflow-hidden w-full lg:overflow-visible lg:max-w-7xl lg:mx-auto px-4 lg:px-8">
                    {/* The Flex Track:
                        - Mobile/Tablet: animate-marquee.
                        - Desktop (lg): CSS Grid.
                        - gap-4 + pr-4 ensures the math for the 50% loop matches perfectly!
                    */}
                    <div className="flex w-max lg:w-full gap-4 pr-4 lg:pr-0 lg:grid lg:grid-cols-4 lg:grid-rows-2 lg:h-[600px] animate-marquee lg:animate-none group-active:[animation-play-state:paused] hover:[animation-play-state:paused]">

                        {/* 1. ORIGINAL 4 CARDS */}
                        {bentoCards.map((card) => (
                            <Link key={card.id} href="/tours" className={`bento-reveal shrink-0 w-[75vw] sm:w-[45vw] lg:w-auto h-[400px] lg:h-full relative group/card rounded-3xl overflow-hidden block border border-white/5 ${card.classes}`}>
                                <Image src={card.img} alt={card.title} fill sizes="(max-width: 1024px) 75vw, 50vw" className="object-cover transition-transform duration-700 group-hover/card:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6"><h3 className="text-3xl md:text-4xl font-black text-white group-hover/card:text-primary transition-colors">{card.title}</h3></div>
                            </Link>
                        ))}

                        {/* 2. DUPLICATED 4 CARDS (Hidden on Desktop) - Creates the seamless loop! */}
                        {bentoCards.map((card) => (
                            <Link key={`dup-${card.id}`} href="/tours" className={`lg:hidden shrink-0 w-[75vw] sm:w-[45vw] h-[400px] relative group/card rounded-3xl overflow-hidden block border border-white/5`}>
                                <Image src={card.img} alt={card.title} fill sizes="(max-width: 1024px) 75vw, 50vw" className="object-cover transition-transform duration-700 group-hover/card:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6"><h3 className="text-3xl md:text-4xl font-black text-white group-hover/card:text-primary transition-colors">{card.title}</h3></div>
                            </Link>
                        ))}

                    </div>
                </div>
            </section>

            {/* WHAT WE PROVIDE */}
            <section className="features-section py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5 overflow-hidden">
                <div className="text-center mb-16"><h2 className="text-reveal text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Why <span className="text-primary">Choose Us</span></h2></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[{ icon: Compass, title: "Expert Local Guides", desc: "Navigate hidden trails with locals who know the land." }, { icon: ShieldCheck, title: "100% Secure & Safe", desc: "From vetted transport to emergency support, safety is priority." }, { icon: HeartHandshake, title: "Hassle-Free Planning", desc: "Permits, stays, and meals are pre-arranged. Just enjoy." }].map((feature, i) => (
                        <div key={i} className="feature-card bg-surface-hover border border-white/5 p-8 rounded-3xl hover:bg-white/5 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6"><feature.icon className="w-8 h-8 text-primary" /></div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW WE WORK */}
            <section className="work-section py-24 bg-surface relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-20"><h2 className="text-reveal text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">How It <span className="text-primary">Works</span></h2></div>
                    <div className="relative">
                        <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-white/10 md:-translate-x-1/2 rounded-full overflow-hidden">
                            <div className="progress-line-fill w-full bg-gradient-to-b from-primary to-accent"></div>
                        </div>
                        {[{ icon: MapIcon, step: "01", title: "Pick a Destination", desc: "Browse our curated list of off-beat locations." }, { icon: Tent, step: "02", title: "Book & Pack", desc: "Secure your spot. We handle the complex logistics." }, { icon: Mountain, step: "03", title: "Live the Adventure", desc: "Meet your squad and let the journey unfold." }].map((item, i) => (
                            <div key={i} className={`work-step relative flex items-center mb-24 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-background border-4 border-primary rounded-full flex items-center justify-center md:-translate-x-1/2 z-10 shadow-[0_0_20px_var(--color-primary)]">
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className={`ml-20 md:ml-0 w-full md:w-5/12 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                                    <p className="text-primary font-black text-xl mb-2">STEP {item.step}</p>
                                    <h3 className="text-3xl font-bold text-white mb-3">{item.title}</h3>
                                    <p className="text-zinc-400 text-lg">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FLAWLESS INFINITE BEST TOURS (Mobile/Tablet Marquee, Desktop GSAP Pin) */}
            <section ref={bestToursRef} className="relative py-24 lg:py-0 lg:h-screen w-full bg-background overflow-hidden flex flex-col lg:justify-center border-t border-white/5">

                {/* Header text */}
                <div className="text-center mb-8 lg:mb-0 lg:absolute lg:top-24 lg:left-20 lg:text-left lg:z-10 lg:pointer-events-none px-4">
                    <h2 className="text-reveal text-4xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-md">Our <span className="text-primary">Best Tours</span></h2>
                    <p className="text-zinc-400 text-lg mt-2 hidden lg:block">Scroll to explore.</p>
                </div>

                <div className="group flex overflow-hidden w-full lg:overflow-visible lg:w-max lg:px-20 lg:pr-[25vw] lg:pt-20">
                    {/* The Flex Track: gap-6 + pr-6 perfectly balances the math for the 50% loop!
                    */}
                    <div ref={bestToursTrackRef} className="flex gap-6 pr-6 lg:gap-8 lg:pr-0 w-max animate-marquee lg:animate-none group-active:[animation-play-state:paused] hover:[animation-play-state:paused] px-4 lg:px-0">

                        {/* 1. ORIGINAL TOURS */}
                        {featuredTours.map((tour) => (
                            <Link href={`/tours`} key={tour.id} className="shrink-0 w-[85vw] sm:w-[45vw] lg:w-[35vw] group/card relative h-[50vh] lg:h-[65vh] rounded-3xl overflow-hidden block border border-white/5">
                                <Image src={tour.img} alt={tour.title} fill sizes="(max-width: 1024px) 85vw, 40vw" className="object-cover transition-transform duration-700 group-hover/card:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full lg:translate-y-4 group-hover/card:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs md:text-sm mb-2 uppercase tracking-wider">
                                        <MapPin size={16} /> {tour.location}
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-3">{tour.title}</h3>
                                    <div className="flex justify-between items-center opacity-100 lg:opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-100 mt-3 md:mt-0">
                                        <span className="text-xl md:text-2xl font-bold text-white">{tour.price}</span>
                                        <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-full font-bold text-sm md:text-base md:hover:bg-primary transition-colors">
                                            Details
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* 2. DUPLICATED TOURS (Hidden on Desktop) - Creates the seamless loop! */}
                        {featuredTours.map((tour) => (
                            <Link href={`/tours/${tour.id}`} key={`dup-${tour.id}`} className="lg:hidden shrink-0 w-[85vw] sm:w-[45vw] group/card relative h-[50vh] rounded-3xl overflow-hidden block border border-white/5">
                                <Image src={tour.img} alt={tour.title} fill sizes="(max-width: 1024px) 85vw, 40vw" className="object-cover transition-transform duration-700 group-hover/card:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full group-hover/card:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs md:text-sm mb-2 uppercase tracking-wider">
                                        <MapPin size={16} /> {tour.location}
                                    </div>
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-3">{tour.title}</h3>
                                    <div className="flex justify-between items-center opacity-100 transition-opacity duration-500 delay-100 mt-3 md:mt-0">
                                        <span className="text-xl md:text-2xl font-bold text-white">{tour.price}</span>
                                        <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-full font-bold text-sm md:text-base md:hover:bg-primary transition-colors">
                                            Details
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                    </div>
                </div>
            </section>

            {/* MARQUEE */}
            <section className="py-24 bg-surface overflow-hidden border-t border-white/5">
                <div className="text-center mb-12"><h2 className="text-reveal text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Wall of <span className="text-primary">Love</span></h2></div>
                <div className="relative flex overflow-hidden w-full group">
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none"></div>

                    <div className="marquee-track flex gap-6 w-max pl-4 group-hover:[animation-play-state:paused] transform-gpu">
                        {[...testimonials, ...testimonials].map((review, i) => (
                            <div key={i} className="w-[300px] md:w-[400px] bg-surface-hover border border-white/5 p-6 rounded-3xl shrink-0">
                                <div className="flex text-primary mb-4">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}</div>
                                <p className="text-zinc-300 mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">{review.name.charAt(0)}</div>
                                    <span className="text-white font-bold">{review.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 relative px-4 flex justify-center text-center bg-background border-t border-white/5">
                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-reveal text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">Ready to <br/><span className="text-primary">Pack Your Bags?</span></h2>
                    <p className="text-zinc-400 text-lg mb-10">Stop dreaming. Start exploring. Join thousands of travelers who trust DD Tours with their weekend escapes.</p>
                    <Link href="/about" className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-primary hover:text-white px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105 shadow-xl hover:shadow-[0_0_30px_var(--color-primary)]">
                        Contact Us Today
                    </Link>
                </div>
            </section>

        </div>
    );
}