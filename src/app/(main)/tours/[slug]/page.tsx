"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  MapPin, Calendar, Clock, Loader2, Compass, AlertTriangle,
  IndianRupee, Users, CheckCircle, ShieldCheck, ArrowLeft, ChevronRight, ChevronLeft
} from "lucide-react";
import { api } from "@/lib/axios";

gsap.registerPlugin(ScrollTrigger);

// 🛡️ Exact match to your Prisma Tour Model
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

  // 🚨 FIX 1: Safely grab the slug whether the folder is [slug] or [id]
  const urlSlug = pathname.split("/")[2];
  const slugToFetch = (params?.slug || params?.id || urlSlug) as string;

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Tour Details
  useEffect(() => {
    // 🚨 FIX 2: Do NOT fetch if the slug is missing or "undefined"
    if (!slugToFetch || slugToFetch === "undefined") return;

    const fetchTour = async () => {
      try {
        const { data } = await api.get(`/tours/${slugToFetch}`);
        setTour(data.data);
      } catch (err) {
        console.error("Failed to fetch tour", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slugToFetch]); // Depend on slugToFetch instead of params.slug

  // 2. Auto Image Slider Logic
  useEffect(() => {
    if (!tour || !tour.images || tour.images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImg((prev) => (prev + 1) % tour.images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tour]);

  // 3. Reveal Animations
  useLayoutEffect(() => {
    if (!loading && tour) {
      const ctx = gsap.context(() => {
        gsap.from(".reveal-up", {
          y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out"
        });
        gsap.from(".sidebar-anim", {
          x: 40, opacity: 0, duration: 0.8, delay: 0.3, ease: "power3.out"
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, tour]);

  // Helper Functions
  const getDaysLeft = (deadline?: string | null) => {
    if (!deadline) return null;
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days < 0 ? "CLOSED" : `${days} DAYS LEFT`;
  };

  const getFormattedDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin text-orange-600 w-12 h-12" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="text-center py-32">
        <Compass size={48} className="mx-auto text-zinc-700 mb-6" />
        <h2 className="text-3xl font-black text-white mb-4 uppercase">Mission Not Found</h2>
        <Link href="/tours" className="px-8 py-3 bg-orange-600 rounded-full text-white font-bold uppercase text-sm hover:bg-orange-700 transition-colors">Return to Archive</Link>
      </div>
    );
  }

  const images = tour.images?.length > 0 ? tour.images : [FALLBACK_IMAGE];
  const daysLeft = getDaysLeft(tour.bookingDeadline);
  const isUrgent = daysLeft && !daysLeft.includes("CLOSED") && parseInt(daysLeft) < 15;
  const isSoldOut = tour.availableSeats <= 0;

  return (
    <div ref={containerRef} className="pb-32 md:pb-24 w-full max-w-full overflow-hidden">

      {/* 🔙 Back Button */}
      <button
        onClick={() => router.back()}
        className="fixed top-24 left-4 md:left-8 z-50 bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:bg-orange-600 transition-all border border-white/10 hidden xl:flex shadow-2xl"
      >
        <ArrowLeft size={24} />
      </button>

      {/* 🖼️ HERO IMAGE SLIDER */}
      <div className="relative w-full h-[50vh] md:h-[70vh] rounded-b-[40px] md:rounded-3xl overflow-hidden mb-12 bg-[#0a0a0a]">
        {images.map((img, index) => (
            <Image
                key={index}
                src={img}
                alt={`${tour.tourTitle} - Image ${index + 1}`}
                fill
                priority={index === 0}
                className={`object-cover transition-opacity duration-1000 ease-in-out ${index === activeImg ? 'opacity-100' : 'opacity-0'}`}
            />
        ))}
        {/* Gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 to-transparent" />

        {/* Manual Slider Controls (Only if >1 image) */}
        {images.length > 1 && (
            <div className="absolute bottom-6 right-6 z-30 flex gap-2">
                <button onClick={() => setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1))} className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-orange-600 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={() => setActiveImg((prev) => (prev + 1) % images.length)} className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-orange-600 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {images.map((_, idx) => (
                    <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === activeImg ? 'w-8 bg-orange-500' : 'w-2 bg-white/50'}`} />
                ))}
            </div>
        )}

        {/* Hero Content Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-orange-600/90 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-black uppercase tracking-widest border border-orange-500/50 shadow-lg">
                            {tour.tourCategory || "EXPEDITION"}
                        </span>
                        {tour.startLocation && (
                            <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                                <MapPin size={14} className="text-orange-500" /> Starts: {tour.startLocation}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] uppercase drop-shadow-2xl">
                        {tour.tourTitle}
                    </h1>
                </div>
            </div>
        </div>
      </div>

      {/* 📄 MAIN CONTENT SPLIT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT COLUMN: Details (2/3 width) */}
        <div className="lg:col-span-2 space-y-12">

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal-up">
                <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                    <Clock size={24} className="text-orange-500" />
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Duration</span>
                    <span className="text-white font-bold">{tour.tourDuration}</span>
                </div>
                <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                    <Users size={24} className="text-blue-500" />
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Group Size</span>
                    <span className="text-white font-bold">Max {tour.maxSeats} Pax</span>
                </div>
                <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                    <Compass size={24} className="text-emerald-500" />
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Tour Type</span>
                    <span className="text-white font-bold">{tour.isFixedDate ? "Fixed Departure" : "Flexible Dates"}</span>
                </div>
                <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                    <ShieldCheck size={24} className="text-purple-500" />
                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Status</span>
                    <span className="text-white font-bold">{tour.tourStatus}</span>
                </div>
            </div>

            {/* Mission Brief (Description) */}
            <div className="reveal-up bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                    <span className="w-2 h-8 bg-orange-600 rounded-full" /> Mission Brief
                </h2>
                <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-lg">
                    {/* Splits by newline and renders paragraphs */}
                    {tour.tourDescription.split('\n').map((paragraph, idx) => (
                        paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : null
                    ))}
                </div>
            </div>

            {/* Coordinates / Places Covered */}
            {tour.coveredPlaces && tour.coveredPlaces.length > 0 && (
                <div className="reveal-up">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-orange-600 rounded-full" /> Coordinates Covered
                    </h2>
                    <div className="flex flex-wrap gap-3">
                        {tour.coveredPlaces.map((place, i) => (
                            <div key={i} className="bg-[#141414] border border-white/10 px-5 py-3 rounded-xl flex items-center gap-2 text-zinc-300 font-medium hover:border-orange-500/50 transition-colors">
                                <MapPin size={16} className="text-orange-600" /> {place}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Included Provisions */}
            {tour.includedItems && tour.includedItems.length > 0 && (
                <div className="reveal-up bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8">
                    <h2 className="text-2xl font-black text-white uppercase tracking-wide mb-6 flex items-center gap-3">
                        <span className="w-2 h-8 bg-orange-600 rounded-full" /> Provisions Included
                    </h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tour.includedItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-3 text-zinc-300">
                                <CheckCircle size={20} className="text-emerald-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

        {/* RIGHT COLUMN: Sticky Booking Sidebar (Hidden on mobile) */}
        <div className="hidden lg:block sidebar-anim relative">
            <div className="sticky top-28 bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-2xl">

                {/* Price Section */}
                <div className="mb-8 border-b border-white/10 pb-8">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest block mb-2">Total Investment</span>
                    <div className="flex items-end gap-2 text-white">
                        <IndianRupee size={36} className="text-orange-500 mb-1" />
                        <span className="text-5xl font-black tracking-tighter">{tour.tourPrice?.toLocaleString("en-IN")}</span>
                        <span className="text-zinc-500 font-medium mb-1.5">/ person</span>
                    </div>
                </div>

                {/* Logistics */}
                <div className="space-y-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-orange-500">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Schedule</p>
                            {tour.isFixedDate && tour.fixedDate ? (
                                <p className="text-white font-bold">{getFormattedDate(tour.fixedDate)}</p>
                            ) : (
                                <p className="text-white font-bold">{tour.expectedMonth ? `${tour.expectedMonth} (Flexible)` : 'Flexible Dates'}</p>
                            )}
                        </div>
                    </div>

                    {daysLeft && (
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isUrgent ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-zinc-400'}`}>
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Registration Closes</p>
                                <p className={`font-bold ${isUrgent ? 'text-red-400' : 'text-white'}`}>{getFormattedDate(tour.bookingDeadline)}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-emerald-500">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Availability</p>
                            <p className="text-white font-bold">
                                {isSoldOut ? <span className="text-red-500">SOLD OUT</span> : `${tour.availableSeats} Slots Remaining`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={() => router.push(`/tours/${tour.slug}/book`)}
                    disabled={isSoldOut || daysLeft === "CLOSED"}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-orange-600/30 active:scale-95"
                >
                    {isSoldOut ? "Mission Full" : daysLeft === "CLOSED" ? "Registration Closed" : "Initiate Booking"}
                </button>
            </div>
        </div>
      </div>

      {/* 📱 MOBILE FIXED BOTTOM ACTION BAR */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
            <div>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Investment</p>
                <div className="flex items-center text-white font-black text-xl leading-none">
                    <IndianRupee size={16} className="text-orange-500" /> {tour.tourPrice?.toLocaleString("en-IN")}
                </div>
            </div>
            <button
                onClick={() => router.push(`/tours/${tour.slug}/book`)}
                disabled={isSoldOut || daysLeft === "CLOSED"}
                className="flex-1 py-3.5 bg-orange-600 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest text-sm rounded-xl transition-all active:scale-95 text-center"
            >
                {isSoldOut ? "Full" : daysLeft === "CLOSED" ? "Closed" : "Book Now"}
            </button>
        </div>
      </div>

    </div>
  );
}