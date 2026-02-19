"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, MapPin, Compass, ShieldCheck, HeartHandshake, Tent, Mountain, Map, Search, Calendar, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.config({ force3D: true });
}

// --- Dummy Data ---
const heroImages = [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1074&auto=format&fit=crop",
];

const featuredTours = [
    { id: 1, title: "Spiti Valley Expedition", location: "Himachal Pradesh", price: "₹24,999", img: "https://images.unsplash.com/photo-1657894736581-ccc35d62d9e2?q=80&w=687&auto=format&fit=crop" },
    { id: 2, title: "Kashmir Great Lakes", location: "Jammu & Kashmir", price: "₹18,500", img: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Meghalaya Monsoons", location: "North East India", price: "₹21,000", img: "https://images.unsplash.com/photo-1625826415766-001bd75aaf52?q=80&w=735&auto=format&fit=crop" },
    { id: 4, title: "Zanskar Frozen River", location: "Ladakh", price: "₹35,000", img: "https://images.unsplash.com/photo-1600438831035-48f5f196d3bf?q=80&w=1170&auto=format&fit=crop" },
];

const testimonials = [
    { name: "Rahul S.", text: "DD Tours made our Kashmir trip completely frictionless. Highly recommended!" },
    { name: "Priya M.", text: "The Spiti expedition changed my life. The local guides were phenomenal." },
    { name: "Ankit D.", text: "Best travel agency in Kolkata. Period. Their attention to detail is insane." },
    { name: "Sneha K.", text: "Affordable, safe, and wildly adventurous. Can't wait for my next trip." },
];

export default function HomePage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const horizontalRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [currentImg, setCurrentImg] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useGSAP(() => {
        // 1. HERO LOAD ANIMATION
        const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
        heroTl.fromTo(".hero-bg-overlay", { opacity: 1 }, { opacity: 0.7, duration: 2 })
            .fromTo(".hero-text-line", { y: 150, skewY: 5 }, { y: 0, skewY: 0, duration: 1.5, stagger: 0.1 }, "-=1.5")
            .fromTo(".hero-subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=1")
            .fromTo(".hero-search", { y: 30, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: "back.out(1.2)" }, "-=0.8");

        // 2. SCROLL REVEALS
        gsap.utils.toArray(".reveal-up").forEach((elem: any) => {
            gsap.fromTo(elem,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
            );
        });

        // 3. WHAT WE PROVIDE
        gsap.fromTo(".feature-card",
            { y: 100, opacity: 0, scale: 0.9 },
            { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: "back.out(1.2)", scrollTrigger: { trigger: ".features-section", start: "top 75%" } }
        );

        // 4. HOW WE WORK
        const workTl = gsap.timeline({
            scrollTrigger: { trigger: ".work-section", start: "top 60%", end: "bottom 80%", scrub: 1 }
        });
        workTl.fromTo(".progress-line-fill", { height: "0%" }, { height: "100%", ease: "none" });

        gsap.utils.toArray(".work-step").forEach((step: any, i) => {
            gsap.fromTo(step,
                { x: i % 2 === 0 ? -50 : 50, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: step, start: "top 80%" } }
            );
        });

        // 5. BEST TOURS - THE ANTI-VOID HORIZONTAL SCROLL
        // Wrap in requestAnimationFrame to guarantee the DOM is painted first
        requestAnimationFrame(() => {
            const track = trackRef.current;
            const section = horizontalRef.current;

            if (track && section) {
                // Get exact width needed to scroll (Track Width - Screen Width)
                const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

                const tween = gsap.to(track, {
                    x: getScrollAmount,
                    ease: "none"
                });

                ScrollTrigger.create({
                    trigger: section,
                    start: "top top", // Pin exactly when the section hits the top of the browser
                    end: () => `+=${track.scrollWidth - window.innerWidth}`, // Scroll exactly the distance we are moving
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true,
                });
            }

            // THE MAGIC NEXT.JS FIX: Force GSAP to recalculate the math
            // after the images and layouts have safely loaded on the client.
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);

            // Double-failsafe for slower connections
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 500);
        });

        // 6. MARQUEE
        gsap.to(".marquee-track", { xPercent: -50, ease: "none", duration: 20, repeat: -1 });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-[#050505]">

            {/* HERO SECTION */}
            <section className="relative h-[100svh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
                {heroImages.map((src, index) => (
                    <div key={index} className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentImg ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}>
                        <Image src={src} alt={`Hero ${index}`} fill sizes="100vw" className="object-cover" priority={index === 0} />
                    </div>
                ))}
                <div className="hero-bg-overlay absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/40 to-[#050505]"></div>
                <div className="relative z-10 max-w-6xl mt-20 flex flex-col items-center">
                    <div className="overflow-hidden mb-2"><h1 className="hero-text-line text-5xl md:text-[8rem] leading-[0.85] font-black tracking-tighter text-white uppercase">CHASE THE</h1></div>
                    <div className="overflow-hidden mb-8"><h1 className="hero-text-line text-5xl md:text-[8rem] leading-[0.85] font-black tracking-tighter uppercase"><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4500] to-[#E63946] drop-shadow-[0_0_30px_rgba(255,69,0,0.5)]">UNKNOWN</span></h1></div>
                    <p className="hero-subtitle text-lg md:text-2xl text-zinc-300 mb-10 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-lg px-4">Immersive, off-beat, and unforgettable journeys across India. Pack your bags, <span className="text-white font-bold">DD Tours</span> has the rest covered.</p>

                    <div className="hero-search w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-2 md:rounded-full rounded-2xl shadow-2xl flex flex-col md:flex-row md:items-center">
                        <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
                            <MapPin className="text-[#FF4500] w-5 h-5 shrink-0" /><input type="text" placeholder="Where to?" className="bg-transparent border-none outline-none text-white placeholder:text-zinc-400 w-full" />
                        </div>
                        <div className="flex-1 hidden sm:flex items-center gap-3 px-4 py-3 border-b md:border-b-0 md:border-r border-white/10">
                            <Calendar className="text-[#FF4500] w-5 h-5 shrink-0" /><input type="text" placeholder="When?" className="bg-transparent border-none outline-none text-white placeholder:text-zinc-400 w-full" />
                        </div>
                        <Link href="/tours" className="w-full md:w-auto mt-2 md:mt-0 bg-gradient-to-r from-[#FF4500] to-[#E63946] text-white px-8 py-4 md:py-3 rounded-xl md:rounded-full font-bold transition-transform hover:scale-105 shadow-[0_0_20px_rgba(255,69,0,0.4)] flex items-center justify-center gap-2 group"><Search size={18} /><span>Find Tours</span></Link>
                    </div>
                </div>
            </section>

            {/* BENTO GRID */}
            <section className="py-24 md:py-32 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="reveal-up text-center mb-12 md:mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Top <span className="text-[#FF4500]">Destinations</span></h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
                    <Link href="/tours" className="reveal-up group relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden h-[300px] md:h-full block">
                        <Image src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1000&auto=format&fit=crop" alt="Kashmir" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6"><h3 className="text-3xl md:text-4xl font-black text-white group-hover:text-[#FF4500] transition-colors">Kashmir</h3></div>
                    </Link>
                    <Link href="/tours" className="reveal-up group relative md:col-span-2 md:row-span-1 rounded-3xl overflow-hidden h-[250px] md:h-full block">
                        <Image src="https://images.unsplash.com/photo-1657894736581-ccc35d62d9e2?q=80&w=687&auto=format&fit=crop" alt="Spiti" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6"><h3 className="text-2xl font-black text-white group-hover:text-[#FF4500] transition-colors">Spiti Valley</h3></div>
                    </Link>
                    <Link href="/tours" className="reveal-up group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden h-[250px] md:h-full block">
                        <Image src="https://images.unsplash.com/photo-1625826415766-001bd75aaf52?q=80&w=735&auto=format&fit=crop" alt="Meghalaya" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6"><h3 className="text-xl font-black text-white group-hover:text-[#FF4500] transition-colors">Meghalaya</h3></div>
                    </Link>
                    <Link href="/tours" className="reveal-up group relative md:col-span-1 md:row-span-1 rounded-3xl overflow-hidden h-[250px] md:h-full block">
                        <Image src="https://images.unsplash.com/photo-1600438831035-48f5f196d3bf?q=80&w=1170&auto=format&fit=crop" alt="Ladakh" fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6"><h3 className="text-xl font-black text-white group-hover:text-[#FF4500] transition-colors">Ladakh</h3></div>
                    </Link>
                </div>
            </section>

            {/* WHAT WE PROVIDE */}
            <section className="features-section py-24 px-6 lg:px-12 max-w-7xl mx-auto border-t border-white/5">
                <div className="text-center mb-16"><h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">Why <span className="text-[#FF4500]">Choose Us</span></h2></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[{ icon: Compass, title: "Expert Local Guides", desc: "Navigate hidden trails with locals who know the land." }, { icon: ShieldCheck, title: "100% Secure & Safe", desc: "From vetted transport to emergency support, safety is priority." }, { icon: HeartHandshake, title: "Hassle-Free Planning", desc: "Permits, stays, and meals are pre-arranged. Just enjoy." }].map((feature, i) => (
                        <div key={i} className="feature-card bg-[#111] border border-white/5 p-8 rounded-3xl hover:bg-white/5 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF4500]/20 to-[#E63946]/20 flex items-center justify-center mb-6"><feature.icon className="w-8 h-8 text-[#FF4500]" /></div>
                            <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW WE WORK */}
            <section className="work-section py-24 bg-[#0a0a0a] relative">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-20"><h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">How It <span className="text-[#FF4500]">Works</span></h2></div>
                    <div className="relative">
                        <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-white/10 md:-translate-x-1/2 rounded-full overflow-hidden"><div className="progress-line-fill w-full bg-gradient-to-b from-[#FF4500] to-[#E63946]"></div></div>
                        {[{ icon: Map, step: "01", title: "Pick a Destination", desc: "Browse our curated list of off-beat locations." }, { icon: Tent, step: "02", title: "Book & Pack", desc: "Secure your spot. We handle the complex logistics." }, { icon: Mountain, step: "03", title: "Live the Adventure", desc: "Meet your squad and let the journey unfold." }].map((item, i) => (
                            <div key={i} className={`work-step relative flex items-center mb-24 last:mb-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-[#050505] border-4 border-[#FF4500] rounded-full flex items-center justify-center md:-translate-x-1/2 z-10 shadow-[0_0_20px_rgba(255,69,0,0.5)]"><item.icon className="w-6 h-6 text-white" /></div>
                                <div className={`ml-20 md:ml-0 w-full md:w-5/12 ${i % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                                    <p className="text-[#FF4500] font-black text-xl mb-2">STEP {item.step}</p><h3 className="text-3xl font-bold text-white mb-3">{item.title}</h3><p className="text-zinc-400 text-lg">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= BULLETPROOF HORIZONTAL SCROLL ================= */}
            <section ref={horizontalRef} className="relative h-screen w-full bg-[#050505] overflow-hidden flex flex-col justify-center">

                <div className="absolute top-24 left-4 md:left-20 z-10 pointer-events-none">
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight drop-shadow-md">Our <span className="text-[#FF4500]">Best Tours</span></h2>
                    <p className="text-zinc-400 text-lg mt-2">Scroll to explore.</p>
                </div>

                <div ref={trackRef} className="flex flex-nowrap items-center gap-6 md:gap-8 px-4 md:px-20 w-max pr-[15vw] md:pr-[25vw] pt-20">
                    {featuredTours.map((tour) => (
                        <Link href={`/tours/${tour.id}`} key={tour.id} className="tour-card block w-[85vw] md:w-[45vw] lg:w-[35vw] shrink-0 group relative h-[50vh] md:h-[65vh] rounded-3xl overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-white/5">
                            <Image src={tour.img} alt={tour.title} fill sizes="(max-width: 768px) 85vw, 40vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full md:translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="flex items-center gap-2 text-[#FF4500] font-bold text-xs md:text-sm mb-2 uppercase tracking-wider">
                                    <MapPin size={16} /> {tour.location}
                                </div>
                                <h3 className="text-2xl md:text-4xl font-black text-white mb-3">{tour.title}</h3>
                                <div className="flex justify-between items-center opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mt-3 md:mt-0">
                                    <span className="text-xl md:text-2xl font-bold text-white">{tour.price}</span>
                                    <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-2 rounded-full font-bold text-sm md:text-base md:hover:bg-[#FF4500] transition-colors">
                                        Details
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </section>

            {/* MARQUEE */}
            <section className="py-24 bg-[#0a0a0a] overflow-hidden border-t border-white/5">
                <div className="reveal-up text-center mb-12"><h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">Wall of <span className="text-[#FF4500]">Love</span></h2></div>
                <div className="relative flex overflow-hidden w-full group">
                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none"></div>

                    <div className="marquee-track flex gap-6 w-max pl-4 group-hover:[animation-play-state:paused]">
                        {[...testimonials, ...testimonials].map((review, i) => (
                            <div key={i} className="w-[300px] md:w-[400px] bg-[#111] border border-white/5 p-6 rounded-3xl shrink-0">
                                <div className="flex text-[#FF4500] mb-4">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} fill="currentColor" />)}</div>
                                <p className="text-zinc-300 mb-6">"{review.text}"</p>
                                <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#FF4500] flex items-center justify-center font-bold text-white">{review.name.charAt(0)}</div><span className="text-white font-bold">{review.name}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 relative px-4 flex justify-center text-center bg-[#050505]">
                <div className="reveal-up relative z-10 max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">Ready to <br/><span className="text-[#FF4500]">Pack Your Bags?</span></h2>
                    <p className="text-zinc-400 text-lg mb-10">Stop dreaming. Start exploring. Join thousands of travelers who trust DD Tours with their weekend escapes.</p>
                    <Link href="/contact" className="inline-flex items-center justify-center gap-3 bg-white text-black hover:bg-[#FF4500] hover:text-white px-10 py-5 rounded-full font-black text-lg transition-all hover:scale-105">Contact Us Today</Link>
                </div>
            </section>

        </div>
    );
}