"use client";

import {useEffect, useState, useRef} from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {
    Search, MapPin, ArrowRight, Calendar, Clock, Loader2, Compass, AlertTriangle, IndianRupee, Sparkles
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
    coveredPlaces: string[];
    images: string[];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop";

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch Tours Logic
    const fetchTours = async (pageNum: number, isNewSearch = false) => {
        try {
            if (isNewSearch) setLoading(true);
            else setLoadingMore(true);

            const queryParams = new URLSearchParams({
                page: pageNum.toString(),
                limit: "9",
            });

            const response = await api.get(`/tours?${queryParams.toString()}`);
            const fetchedTours = response.data?.data?.data || response.data?.data || [];

            if (isNewSearch) {
                setTours(fetchedTours);
            } else {
                setTours((prev) => [...prev, ...fetchedTours]);
            }

            setHasMore(fetchedTours.length >= 9);
            setTimeout(() => ScrollTrigger.refresh(), 100);
        } catch (err) {
            console.error("Failed to fetch tours", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setPage(1);
            fetchTours(1, true);
        }, 300);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTours(nextPage, false);
    };

    // Premium GSAP Animations
    useGSAP(() => {
        if (loading) return;

        // Cinematic Hero Entrance
        gsap.fromTo(".hero-anim",
            {y: 40, opacity: 0, scale: 0.95},
            {y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.15, ease: "expo.out"}
        );

        // Batch Animation for Poster Cards
        ScrollTrigger.batch(".tour-poster", {
            interval: 0.15,
            batchMax: 3,
            onEnter: (elements) => {
                gsap.fromTo(elements,
                    {y: 60, opacity: 0, rotationX: 5},
                    {y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.15, ease: "expo.out", overwrite: "auto"}
                );
            },
            once: true
        });

    }, {scope: containerRef, dependencies: [tours, loading]});

    const displayTours = tours.filter(tour =>
        tour.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tour.startLocation && tour.startLocation.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div ref={containerRef} className="pb-32 relative overflow-hidden">

            {/* Cinematic Background Glow */}
            <div
                className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] h-[500px] bg-orange-600/15 blur-[150px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* 🌟 Top Header & Glassmorphic Search */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 pt-20 px-4 md:px-8">
                    <div className="hero-anim max-w-2xl">
                        <div
                            className="flex items-center gap-2 text-orange-500 text-sm font-black uppercase tracking-[0.2em] mb-4">
                            <Sparkles size={16} className="text-orange-500"/> Expedition Archive
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.85] drop-shadow-2xl">
                            Select Your <br/>
                            <span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Destination</span>
                        </h1>
                    </div>

                    <div className="hero-anim relative w-full lg:w-[450px] group">
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
                        <div
                            className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 transition-all duration-300 group-focus-within:border-orange-500/50 group-focus-within:bg-white/10">
                            <div className="pl-4 pr-2 text-orange-500">
                                <Search size={22}/>
                            </div>
                            <input
                                type="text"
                                placeholder="Search destinations or coordinates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none py-3 pr-4 text-white text-base focus:outline-none placeholder:text-zinc-500 font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* 🛑 Loading State (Cinematic Skeletons) */}
                {loading ? (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 animate-pulse">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n}
                                 className="bg-white/5 rounded-[2rem] h-[550px] border border-white/5 flex flex-col justify-end p-8">
                                <div className="h-8 w-3/4 bg-white/10 rounded-lg mb-4"></div>
                                <div className="h-4 w-1/2 bg-white/10 rounded-md mb-8"></div>
                                <div className="h-12 w-full bg-white/10 rounded-xl"></div>
                            </div>
                        ))}
                    </div>
                ) : displayTours.length === 0 ? (
                    <div
                        className="text-center py-32 bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/5 mx-4 md:mx-8 shadow-2xl">
                        <Compass size={56} className="mx-auto text-zinc-700 mb-6 animate-spin-slow"/>
                        <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">No missions
                            found</h3>
                        <p className="text-zinc-400 text-lg">Adjust your coordinates and scan again.</p>
                    </div>
                ) : (
                    <>
                        {/* 📱 / 💻 Premium Poster Grid */}
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-8 perspective-[1000px]">
                            {displayTours.map((tour, index) => (
                                <TourPosterCard key={tour.tourId} tour={tour} index={index}/>
                            ))}
                        </div>

                        {/* 🔄 Glowing Load More Button */}
                        {hasMore && !searchQuery && (
                            <div className="flex justify-center mt-20 px-4">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="relative group px-12 py-5 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-[0.2em] text-sm rounded-full overflow-hidden transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10 disabled:opacity-50"
                                >
                                    <div
                                        className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>
                                    <span className="relative z-10 flex items-center gap-3">
                                        {loadingMore ? <><Loader2 size={18}
                                                                  className="animate-spin"/> Scanning...</> : "Load More Missions"}
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// ==========================================
// 🧩 CINEMATIC POSTER CARD (Full-Bleed Image)
// ==========================================

function TourPosterCard({tour, index}: { tour: Tour; index: number }) {

    // Calculate Days Left
    const getDaysLeft = (deadline?: string | null) => {
        if (!deadline) return null;
        const diff = new Date(deadline).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        if (days < 0) return "CLOSED";
        return `${days} DAYS LEFT`;
    };

    // Format Fixed Date
    const getFormattedDate = (dateString?: string | null) => {
        if (!dateString) return null;
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short'
        }).toUpperCase();
    };

    const daysLeftText = getDaysLeft(tour.bookingDeadline);
    const isUrgent = daysLeftText && !daysLeftText.includes("CLOSED") && parseInt(daysLeftText) < 15;
    const fixedDateText = getFormattedDate(tour.fixedDate);
    const coverImage = (tour.images && tour.images.length > 0) ? tour.images[0] : FALLBACK_IMAGE;

    return (
        <Link
            href={`/tours/${tour.slug}`}
            className="tour-poster group relative h-[500px] md:h-[550px] w-full rounded-[2.5rem] overflow-hidden block border border-white/10 hover:border-orange-500/50 transition-colors duration-500 shadow-2xl shadow-black/50"
        >
            {/* 🖼️ Full-Bleed Background Image */}
            <Image
                src={coverImage}
                alt={tour.tourTitle}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 6}
                className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[1.5s] ease-out"
            />

            {/* 🌌 Multi-Layer Deep Gradient (Essential for text legibility) */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-80"/>
            <div
                className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"/>

            {/* 🏷️ Top Badges (Floating on image) */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
                {/* Date / Flexible Badge */}
                {tour.isFixedDate && fixedDateText ? (
                    <div
                        className="bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                        <Calendar size={14}/> {fixedDateText}
                    </div>
                ) : (
                    <div
                        className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-400 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                        <Compass size={14}/> FLEXIBLE
                    </div>
                )}

                {/* Urgent/Days Left Badge */}
                {daysLeftText && (
                    <div
                        className={`backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg ${isUrgent ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-black/60 text-white border-white/20'}`}>
                        <AlertTriangle size={14}/> {daysLeftText}
                    </div>
                )}
            </div>

            {/* 📝 Content Body (Anchored to Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col z-20">

                {/* Tags */}
                <div
                    className="flex flex-wrap gap-2 mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                    {tour.coveredPlaces && tour.coveredPlaces.slice(0, 3).map((place, i) => (
                        <span key={i}
                              className="bg-white/10 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                            {place}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-3xl font-black text-white leading-[1.1] uppercase mb-3 drop-shadow-lg line-clamp-2">
                    {tour.tourTitle}
                </h3>

                {/* Location & Duration (Grouped Together) */}
                <div
                    className="flex flex-wrap items-center gap-3 text-zinc-300 text-xs font-bold uppercase tracking-widest mb-6">
                    {tour.startLocation && (
                        <span className="flex items-center gap-1.5 text-white drop-shadow-md">
                            <MapPin size={14} className="text-orange-500"/> {tour.startLocation}
                        </span>
                    )}
                    {tour.startLocation && <span className="w-1 h-1 rounded-full bg-orange-500/50"></span>}
                    <span className="flex items-center gap-1.5 text-white drop-shadow-md">
                        <Clock size={14} className="text-orange-500"/> {tour.tourDuration}
                    </span>
                </div>

                {/* 💳 Footer Line: Price & Action */}
                <div
                    className="pt-5 border-t border-white/10 flex items-end justify-between group-hover:border-orange-500/30 transition-colors duration-500">
                    <div>
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">Total Investment</span>
                        <div className="flex items-center text-white font-black text-3xl drop-shadow-lg">
                            <IndianRupee size={24} className="mr-0.5 text-orange-500"/>
                            {tour.tourPrice?.toLocaleString("en-IN")}
                        </div>
                    </div>

                    <div
                        className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-orange-500 group-hover:border-orange-400 flex items-center justify-center text-white transition-all duration-500 shadow-xl">
                        <ArrowRight size={24}
                                    className="group-hover:-rotate-45 transition-transform duration-500 ease-out"/>
                    </div>
                </div>
            </div>
        </Link>
    );
}