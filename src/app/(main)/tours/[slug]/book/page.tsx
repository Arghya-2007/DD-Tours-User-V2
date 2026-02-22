"use client";

import {useEffect, useState, useRef} from "react";
import {useParams, useRouter} from "next/navigation";
import Image from "next/image";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {
    ArrowLeft, Users, ShieldCheck, CreditCard, Loader2, IndianRupee, MapPin,
    AlertCircle, Calendar, Clock, Lock, Sparkles, CheckCircle2, MessageCircle
} from "lucide-react";
import {api} from "@/lib/axios";
import {useAuthStore} from "@/store/authStore";
import Link from "next/link";

if (typeof window !== "undefined") {
    gsap.config({force3D: true});
}

interface Tour {
    tourId: string;
    tourTitle: string;
    slug: string;
    tourDuration: string;
    tourPrice: number;
    availableSeats: number;
    startLocation?: string;
    isFixedDate: boolean;
    fixedDate?: string | null;
    images: string[];
}

interface Guest {
    name: string;
    age: string;
    gender: string;
}

export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const {user, isAuthenticated} = useAuthStore();

    const containerRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false); // 🔥 The bulletproof animation lock

    // Data States
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [guestsCount, setGuestsCount] = useState<number>(1);
    const [contactPhone, setContactPhone] = useState("");
    const [guests, setGuests] = useState<Guest[]>([{name: "", age: "", gender: ""}]);

    const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop";

    // Fetch Tour Data & Auth Check
    useEffect(() => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/tours/${params.slug}/book`);
            return;
        }

        const fetchTour = async () => {
            try {
                const {data} = await api.get(`/tours/${params.slug}`);
                setTour(data.data);
            } catch (err) {
                setError("Failed to load tour details. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchTour();
    }, [params.slug, isAuthenticated, router]);

    // 🔥 FIX: Locked GSAP Entrance Animation
    useGSAP(() => {
        // Wait until loading is done, the tour exists, and ensure it hasn't animated yet
        if (loading || !tour || !containerRef.current || hasAnimated.current) return;

        // Lock the animation so React Strict Mode or state changes can't re-trigger it
        hasAnimated.current = true;

        const tl = gsap.timeline({defaults: {ease: "expo.out"}});

        tl.fromTo(".anim-header",
            {y: 20, opacity: 0},
            {y: 0, opacity: 1, duration: 1, stagger: 0.1}
        )
            .fromTo(".anim-card",
                {y: 40, opacity: 0, scale: 0.98},
                {y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, clearProps: "all"},
                "-=0.6"
            )
            .fromTo(".anim-sidebar",
                {x: 30, opacity: 0},
                {x: 0, opacity: 1, duration: 0.8, clearProps: "all"},
                "-=0.6"
            );

    }, {scope: containerRef, dependencies: [loading, tour]});

    // Error Shake Animation
    useEffect(() => {
        if (error) {
            gsap.fromTo(".error-box",
                {x: -10},
                {x: 10, clearProps: "x", duration: 0.1, repeat: 5, yoyo: true, ease: "sine.inOut"}
            );
        }
    }, [error]);

    // Handle Guest Count Changes Dynamically
    const handleGuestCountChange = (newCount: number) => {
        if (newCount < 1 || (tour && newCount > tour.availableSeats)) return;
        setGuestsCount(newCount);

        const newGuests = [...guests];
        while (newGuests.length < newCount) newGuests.push({name: "", age: "", gender: ""});
        while (newGuests.length > newCount) newGuests.pop();
        setGuests(newGuests);
    };

    const handleGuestDetailChange = (index: number, field: keyof Guest, value: string) => {
        const updated = [...guests];
        updated[index][field] = value;
        setGuests(updated);
    };

    // Submit Booking
    const handleInitiateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tour) return;

        setIsSubmitting(true);
        setError(null);

        const payload = {
            tourId: tour.tourId,
            totalGuests: guestsCount,
            totalPrice: tour.tourPrice * guestsCount,
            guestDetails: guests.map((guest, index) => ({
                name: guest.name,
                age: Number(guest.age) || 0,
                gender: guest.gender,
                contactPhone: index === 0 ? contactPhone : undefined,
                isPrimary: index === 0
            })),
            paymentMethod: "UPI"
        };

        try {
            const response = await api.post("/bookings", payload);
            const newBookingId = response.data.data.bookingId;
            router.push(`/bookings/${newBookingId}/pay`);
        } catch (err: any) {
            setError(err.response?.data?.message || err.response?.data?.issues?.[0]?.message || "Booking failed. Please verify your details and try again.");
            setIsSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-background">
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-24 h-24 border-t-4 border-orange-600 rounded-full animate-spin"></div>
                <ShieldCheck size={36} className="text-orange-500 animate-pulse"/>
            </div>
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Preparing Your
                Journey...</p>
        </div>
    );

    if (!tour) return (
        <div className="text-center py-40 h-screen flex flex-col items-center justify-center bg-background">
            <AlertCircle size={64} className="text-zinc-700 mb-6"/>
            <h2 className="font-heading text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">Tour
                Unavailable</h2>
            <Link href="/tours"
                  className="px-10 py-4 bg-orange-600 rounded-full text-white font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-all shadow-lg">
                Back to Tours
            </Link>
        </div>
    );

    const totalPrice = tour.tourPrice * guestsCount;

    const whatsappNumber = "+919679812235";
    const whatsappMessage = encodeURIComponent(
        `Hi DD Tours! 🧭 I am currently finalizing my booking for the "${tour.tourTitle}" tour. Could you please help me with a quick question before I proceed to checkout?`
    );
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return (
        <div ref={containerRef}
             className="min-h-screen bg-background relative overflow-hidden pb-24 md:pb-32 selection:bg-orange-600 selection:text-white">

            <div
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
            <div
                className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">

                <div className="anim-header flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <button onClick={() => router.back()}
                            className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 font-bold text-xs uppercase tracking-widest transition-colors group w-max bg-white/5 px-4 py-2 rounded-full border border-white/10">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Cancel
                    </button>

                    <div className="flex items-center gap-3 md:gap-4 text-xs font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2 text-orange-500">
                            <span
                                className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center">1</span>
                            <span className="hidden sm:inline">Details</span>
                        </div>
                        <div className="w-8 md:w-12 h-px bg-white/20"></div>
                        <div className="flex items-center gap-2 text-zinc-600">
                            <span
                                className="w-6 h-6 rounded-full border border-zinc-700 flex items-center justify-center">2</span>
                            <span className="hidden sm:inline">Payment</span>
                        </div>
                    </div>
                </div>

                <div className="anim-header mb-10 md:mb-14">
                    <div
                        className="flex items-center gap-2 text-emerald-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-3">
                        <Lock size={14}/> 256-Bit Encrypted Checkout
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-xl">
                        Secure Your <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Spot</span>
                    </h1>
                </div>

                <form onSubmit={handleInitiateBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    <div className="lg:col-span-7 xl:col-span-8 space-y-6 md:space-y-8">

                        {error && (
                            <div
                                className="error-box anim-card bg-red-500/10 backdrop-blur-md border border-red-500/30 text-red-200 p-5 rounded-2xl flex items-start gap-4 shadow-lg">
                                <AlertCircle size={24} className="text-red-500 shrink-0 mt-0.5"/>
                                <p className="text-sm font-medium leading-relaxed">{error}</p>
                            </div>
                        )}

                        <div
                            className="anim-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 md:p-8 shadow-2xl">
                            <h2 className="font-heading text-xl md:text-2xl font-black text-white uppercase tracking-tight mb-6 md:mb-8 flex items-center gap-3">
                                <ShieldCheck
                                    className="text-orange-500 w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"/>
                                Lead Traveler
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                                <div className="space-y-2">
                                    <label
                                        className="text-[10px] md:text-xs text-zinc-500 uppercase font-black tracking-[0.2em] ml-1">Full
                                        Name</label>
                                    <input type="text" disabled value={user?.name || ""}
                                           className="w-full bg-black/40 border border-white/5 rounded-xl p-3.5 md:p-4 text-zinc-500 cursor-not-allowed font-medium text-sm md:text-base"/>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        className="text-[10px] md:text-xs text-zinc-500 uppercase font-black tracking-[0.2em] ml-1">Email
                                        Address</label>
                                    <input type="email" disabled value={user?.email || ""}
                                           className="w-full bg-black/40 border border-white/5 rounded-xl p-3.5 md:p-4 text-zinc-500 cursor-not-allowed font-medium text-sm md:text-base"/>
                                </div>
                                <div className="sm:col-span-2 space-y-2 group">
                                    <label
                                        className="text-[10px] md:text-xs text-zinc-400 uppercase font-black tracking-[0.2em] ml-1 group-focus-within:text-orange-500 transition-colors">WhatsApp
                                        / Contact Number *</label>
                                    <input type="tel" required placeholder="+91 98765 43210" value={contactPhone}
                                           onChange={(e) => setContactPhone(e.target.value)}
                                           className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 md:p-4 text-white placeholder:text-zinc-600 focus:border-orange-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all font-medium text-base"/>
                                </div>
                            </div>
                        </div>

                        <div
                            className="anim-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 md:p-8 shadow-2xl">
                            <div
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-white/10">
                                <h2 className="font-heading text-xl md:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <Users
                                        className="text-orange-500 w-6 h-6 md:w-8 md:h-8 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]"/>
                                    Guest Details
                                </h2>

                                <div
                                    className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-full p-1.5 shadow-inner w-max">
                                    <button type="button" onClick={() => handleGuestCountChange(guestsCount - 1)}
                                            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all text-xl font-light">-
                                    </button>
                                    <span className="text-white font-black text-lg w-6 text-center">{guestsCount}</span>
                                    <button type="button" onClick={() => handleGuestCountChange(guestsCount + 1)}
                                            className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.4)] active:scale-95 transition-all text-xl font-light">+
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-5 md:space-y-6">
                                {guests.map((guest, index) => (
                                    <div key={index}
                                         className="p-5 md:p-6 rounded-2xl border border-white/10 bg-black/20 relative overflow-hidden group hover:border-white/20 transition-all shadow-inner">

                                        <div
                                            className="absolute -top-4 -right-2 text-7xl md:text-8xl font-black text-white/5 pointer-events-none select-none z-0 transition-transform group-hover:scale-110">
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-5 md:mb-6">
                                                <span
                                                    className="bg-orange-500/20 text-orange-500 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-[0.2em] border border-orange-500/20 shadow-sm">
                                                    Guest {index + 1}
                                                </span>
                                                {index === 0 && <span
                                                    className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">(Primary)</span>}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                                                <div className="sm:col-span-6 md:col-span-5 space-y-1.5">
                                                    <input type="text" required placeholder="Full Name (As per ID)"
                                                           value={guest.name}
                                                           onChange={(e) => handleGuestDetailChange(index, "name", e.target.value)}
                                                           className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-base text-white placeholder:text-zinc-600 focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all"/>
                                                </div>
                                                <div className="sm:col-span-3 space-y-1.5">
                                                    <input type="number" required placeholder="Age" min="1" max="120"
                                                           value={guest.age}
                                                           onChange={(e) => handleGuestDetailChange(index, "age", e.target.value)}
                                                           className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-base text-white placeholder:text-zinc-600 focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all"/>
                                                </div>
                                                <div className="sm:col-span-3 md:col-span-4 space-y-1.5 relative">
                                                    <select required value={guest.gender}
                                                            onChange={(e) => handleGuestDetailChange(index, "gender", e.target.value)}
                                                            className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl p-3.5 text-base text-white focus:border-orange-500 focus:bg-white/10 focus:outline-none transition-all [&>option]:bg-[#141414]">
                                                        <option value="" disabled className="text-zinc-600">Gender
                                                        </option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                    <div
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                                             stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path d="m6 9 6 6 6-6"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 xl:col-span-4 relative mt-4 lg:mt-0">
                        <div
                            className="anim-sidebar lg:sticky lg:top-28 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl shadow-black/50 overflow-hidden">

                            <div
                                className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                            <h3 className="font-heading text-lg md:text-xl font-black text-white uppercase tracking-tight mb-6 md:mb-8 flex items-center gap-2">
                                <Sparkles size={18} className="text-orange-500"/> Order Summary
                            </h3>

                            <div
                                className="flex gap-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/10 relative z-10">
                                <div
                                    className="relative w-20 h-24 md:w-24 md:h-28 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                                    <Image src={tour.images[0] || FALLBACK_IMAGE} alt="Tour" fill sizes="100px"
                                           className="object-cover"/>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <h4 className="font-heading text-white font-black text-base md:text-lg leading-tight uppercase line-clamp-2 mb-2">{tour.tourTitle}</h4>
                                    <div
                                        className="flex items-center gap-1.5 text-zinc-400 text-[9px] md:text-[10px] font-bold tracking-widest">
                                        <MapPin size={12} className="text-orange-500 shrink-0"/> <span
                                        className="truncate">Start From: {tour.startLocation || "Multiple Origins"}</span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="space-y-4 md:space-y-5 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/10 relative z-10">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2.5 text-zinc-400 font-medium">
                                        <Calendar size={16} className="text-zinc-500"/>
                                        <span>Schedule</span>
                                    </div>
                                    <span
                                        className="text-white font-bold text-[10px] md:text-xs uppercase tracking-wider">
                                        {tour.isFixedDate && tour.fixedDate
                                            ? new Date(tour.fixedDate).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })
                                            : "Flexible Dates"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2.5 text-zinc-400 font-medium">
                                        <Clock size={16} className="text-zinc-500"/>
                                        <span>Duration</span>
                                    </div>
                                    <span
                                        className="text-white font-bold text-[10px] md:text-xs uppercase tracking-wider">{tour.tourDuration}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2.5 text-zinc-400 font-medium">
                                        <Users size={16} className="text-zinc-500"/>
                                        <span>Total Slots</span>
                                    </div>
                                    <span
                                        className="text-emerald-400 font-bold text-[10px] md:text-xs uppercase tracking-wider bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">{tour.availableSeats} Left</span>
                                </div>
                            </div>

                            <div
                                className="space-y-3 md:space-y-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/10 relative z-10">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-medium">Base Price (x{guestsCount})</span>
                                    <span
                                        className="font-heading text-white font-black flex items-center tracking-tight text-sm md:text-base"><IndianRupee
                                        size={14}/> {tour.tourPrice.toLocaleString("en-IN")}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-zinc-400 font-medium">Taxes & Govt Fees</span>
                                    <span
                                        className="text-emerald-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Included</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-end mb-8 relative z-10">
                                <span
                                    className="text-zinc-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] mb-1">Total Amount</span>
                                <span
                                    className="font-heading text-3xl md:text-4xl font-black text-white flex items-center tracking-tighter leading-none drop-shadow-md">
                                    <IndianRupee size={24}
                                                 className="text-orange-500 mr-0.5 md:mr-1"/> {totalPrice.toLocaleString("en-IN")}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="relative w-full py-4 md:py-5 bg-orange-600 disabled:bg-white/5 disabled:text-zinc-500 text-white font-black uppercase tracking-[0.15em] md:tracking-[0.2em] rounded-xl md:rounded-2xl transition-all active:scale-[0.98] overflow-hidden group border disabled:border-white/10 border-transparent shadow-[0_0_30px_rgba(234,88,12,0.3)] disabled:shadow-none z-10"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out z-0"></div>

                                <span
                                    className="relative z-10 flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base">
                                    {isSubmitting ? <><Loader2 size={18}
                                                               className="animate-spin"/> Processing...</> : <>
                                        <CreditCard size={18}
                                                    className="group-hover:scale-110 transition-transform"/> Proceed to
                                        Pay</>}
                                </span>
                            </button>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 w-full py-3.5 md:py-4 bg-green-600 hover:bg-green-500/10 border border-white/10 font-bold uppercase tracking-widest text-[11px] rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={20} className="text-green-950;"/>
                                Ask an Expert
                            </a>

                            <div className="mt-6 space-y-3 relative z-10">
                                <div
                                    className="flex items-center justify-center gap-2 text-[9px] md:text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                                    <ShieldCheck size={14} className="text-emerald-500"/> Secure 256-bit AES Encryption
                                </div>
                                <div
                                    className="flex items-center justify-center gap-2 text-[9px] md:text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                                    <CheckCircle2 size={14} className="text-blue-500"/> Instant Booking Confirmation
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}