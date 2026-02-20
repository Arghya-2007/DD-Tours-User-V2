"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search, MapPin, ArrowRight, Calendar, Clock, Loader2, Compass, AlertTriangle, IndianRupee
} from "lucide-react";
import { api } from "@/lib/axios";

gsap.registerPlugin(ScrollTrigger);

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

  const containerRef = useRef(null);

  // Fetch Tours Logic
  const fetchTours = async (pageNum: number, isNewSearch = false) => {
    try {
      if (isNewSearch) setLoading(true);
      else setLoadingMore(true);

      const queryParams = new URLSearchParams({
        page: pageNum.toString(),
        limit: "8",
      });

      const response = await api.get(`/tours?${queryParams.toString()}`);
      const fetchedTours = response.data?.data?.data || response.data?.data || [];

      if (isNewSearch) {
        setTours(fetchedTours);
      } else {
        setTours((prev) => [...prev, ...fetchedTours]);
      }

      setHasMore(fetchedTours.length >= 8);
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

  // GSAP Animations
  useLayoutEffect(() => {
    if (!loading && tours.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".hero-anim", {
          y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"
        });
        gsap.from(".tour-card", {
          scrollTrigger: { trigger: ".tour-grid", start: "top 90%" },
          y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out"
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, tours]);

  const displayTours = tours.filter(tour =>
    tour.tourTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tour.startLocation && tour.startLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div ref={containerRef} className="pb-24">

      {/* 🌟 Top Header & Search (MATCHING SCREENSHOT) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 pt-8 px-4 md:px-0">
        <div className="hero-anim">
          <div className="flex items-center gap-2 text-orange-600 text-sm font-bold uppercase tracking-widest mb-3">
            <Compass size={16} /> Expedition Archive
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">
            SELECT YOUR <span className="text-orange-600">MISSION</span>
          </h1>
        </div>

        <div className="hero-anim relative w-full lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-orange-600" />
          </div>
          <input
            type="text"
            placeholder="Search coordinates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border border-white/10 rounded-full py-3.5 pl-11 pr-4 text-white text-sm focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 transition-all"
          />
        </div>
      </div>

      {/* 🛑 Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse px-4 md:px-0">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-[#141414] rounded-3xl h-[500px] border border-white/5" />
          ))}
        </div>
      ) : displayTours.length === 0 ? (
        <div className="text-center py-32 bg-[#141414] rounded-3xl border border-white/5 mx-4 md:mx-0">
          <Compass size={40} className="mx-auto text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 uppercase">No missions found</h3>
          <p className="text-zinc-500 text-sm">Adjust your search parameters.</p>
        </div>
      ) : (
        <>
          {/* 📱 / 💻 Unified Responsive Grid */}
          <div className="tour-grid flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 px-4 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {displayTours.map((tour, index) => (
              <TourCard key={tour.tourId} tour={tour} index={index} />
            ))}
          </div>

          {/* 🔄 Load More Button */}
          {hasMore && !searchQuery && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-wider text-sm rounded-full hover:bg-orange-600 hover:border-orange-600 transition-all flex items-center gap-2"
              >
                {loadingMore ? <><Loader2 size={16} className="animate-spin" /> Retrieving...</> : "Load More Missions"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ==========================================
// 🧩 SLEEK TOUR CARD COMPONENT (Screenshot Replica)
// ==========================================

function TourCard({ tour, index }: { tour: Tour; index: number }) {

  // 1. Calculate Days Left
  const getDaysLeft = (deadline?: string | null) => {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) return "CLOSED";
    return `${days} DAYS LEFT`;
  };

  // 2. Format Fixed Date
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
    <div className="tour-card w-[85vw] sm:w-[360px] md:w-auto flex-none snap-center group bg-[#141414] rounded-3xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col relative">

      <Link href={`/tours/${tour.slug}`} className="absolute inset-0 z-20" aria-label={`View ${tour.tourTitle}`}></Link>

      {/* 🖼️ Cover Image */}
      <div className="relative w-full aspect-[4/3] bg-black">
        <Image
            src={coverImage}
            alt={tour.tourTitle}
            fill
            sizes="(max-width: 768px) 85vw, (max-width: 1200px) 50vw, 33vw"
            priority={index < 4}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Soft gradient bottom-up */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />

        {/* 🏷️ Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-30">
            {/* Duration */}
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} className="text-orange-500" /> {tour.tourDuration}
            </div>

            {/* Days Left (Red/Orange if urgent, otherwise gray) */}
            {daysLeftText && (
                <div className={`backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isUrgent ? 'bg-red-500/20 text-red-400' : 'bg-black/60 text-white'}`}>
                    <AlertTriangle size={12} /> {daysLeftText}
                </div>
            )}
        </div>

        {/* 🏷️ Bottom Left Badge (Fixed Date vs Flexible) */}
        <div className="absolute bottom-4 left-4 z-30">
            {tour.isFixedDate && fixedDateText ? (
                <div className="bg-green-500/20 backdrop-blur-md border border-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} /> {fixedDateText}
                </div>
            ) : (
                <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Compass size={12} /> FLEXIBLE
                </div>
            )}
        </div>
      </div>

      {/* 📝 Content Body */}
      <div className="p-6 flex flex-col flex-1 relative z-10">

        {/* Title & Location */}
        <h3 className="text-2xl font-black text-white leading-tight uppercase mb-2 group-hover:text-orange-500 transition-colors">
            {tour.tourTitle}
        </h3>
        {tour.startLocation && (
            <div className="flex items-center gap-1.5 text-zinc-400 text-sm font-medium mb-4">
                <MapPin size={14} className="text-orange-600" /> {tour.startLocation}
            </div>
        )}

        {/* Hash Tags (Mapping covered places) */}
        <div className="flex flex-wrap gap-2 mb-6">
            {tour.coveredPlaces && tour.coveredPlaces.slice(0, 3).map((place, i) => (
                <span key={i} className="bg-white/5 border border-white/5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                    # {place}
                </span>
            ))}
        </div>

        {/* 💳 Footer: Investment & Button */}
        <div className="mt-auto flex items-end justify-between">
            <div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Investment</span>
                <div className="flex items-center text-white font-black text-2xl">
                    <IndianRupee size={22} /> {tour.tourPrice?.toLocaleString("en-IN")}
                </div>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:bg-white group-hover:text-black flex items-center justify-center text-white transition-all duration-300">
                <ArrowRight size={20} className="group-hover:-rotate-45 transition-transform duration-300" />
            </div>
        </div>
      </div>

    </div>
  );
}