"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft, Users, ShieldCheck, CreditCard, Loader2, IndianRupee, MapPin, AlertCircle, Calendar, Clock
} from "lucide-react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

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

// 🚨 FIX 1: Added gender to the Guest Interface
interface Guest {
  name: string;
  age: string;
  gender: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Data States
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [contactPhone, setContactPhone] = useState("");
  // 🚨 FIX 2: Added gender to initial state
  const [guests, setGuests] = useState<Guest[]>([{ name: "", age: "", gender: "" }]);

  // Fetch Tour Data & Auth Check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/tours/${params.slug}/book`);
      return;
    }

    const fetchTour = async () => {
      try {
        const { data } = await api.get(`/tours/${params.slug}`);
        setTour(data.data);
      } catch (err) {
        setError("Failed to load tour details.");
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) fetchTour();
  }, [params.slug, isAuthenticated, router]);

  // Handle Guest Count Changes Dynamically
  const handleGuestCountChange = (newCount: number) => {
    if (newCount < 1 || (tour && newCount > tour.availableSeats)) return;
    setGuestsCount(newCount);

    const newGuests = [...guests];
    // 🚨 FIX 3: Push gender when adding new guests
    while (newGuests.length < newCount) newGuests.push({ name: "", age: "", gender: "" });
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

    // 🚨 FIX 4: Include gender in the payload exactly as Zod expects
    const payload = {
      tourId: tour.tourId,
      totalGuests: guestsCount,
      totalPrice: tour.tourPrice * guestsCount,
      guestDetails: guests.map((guest, index) => ({
        name: guest.name,
        age: Number(guest.age) || 0,
        gender: guest.gender, // <--- Now it sends "Male", "Female", or "Other"
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
      setError(err.response?.data?.message || err.response?.data?.issues?.[0]?.message || "Failed to initiate booking. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-orange-600 w-12 h-12" /></div>
  );

  if (!tour) return (
    <div className="text-center py-20 text-white">Tour not found.</div>
  );

  const totalPrice = tour.tourPrice * guestsCount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 pb-24">

      {/* Header */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft size={18} /> Back to Mission Details
      </button>

      <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-10">
        Secure <span className="text-orange-600">Checkout</span>
      </h1>

      <form onSubmit={handleInitiateBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* LEFT COLUMN: User Input Form */}
        <div className="lg:col-span-2 space-y-8">

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                </div>
            )}

            {/* Section 1: Contact Info */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white uppercase tracking-wide mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-orange-600" /> Primary Contact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2 block">Full Name</label>
                        <input type="text" disabled value={user?.name || ""} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-zinc-400 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2 block">Email Address</label>
                        <input type="email" disabled value={user?.email || ""} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-zinc-400 cursor-not-allowed" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-2 block">WhatsApp / Contact Number *</label>
                        <input type="tel" required placeholder="+91 98765 43210" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="w-full bg-transparent border border-white/20 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                    </div>
                </div>
            </div>

            {/* Section 2: Guest Details */}
            <div className="bg-[#111] border border-white/5 rounded-3xl p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-white uppercase tracking-wide flex items-center gap-2">
                        <Users className="text-orange-600" /> Passenger Details
                    </h2>

                    {/* Guest Counter */}
                    <div className="flex items-center gap-4 bg-[#1a1a1a] border border-white/10 rounded-full px-2 py-1">
                        <button type="button" onClick={() => handleGuestCountChange(guestsCount - 1)} className="w-8 h-8 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-orange-600 transition-colors">-</button>
                        <span className="text-white font-bold w-4 text-center">{guestsCount}</span>
                        <button type="button" onClick={() => handleGuestCountChange(guestsCount + 1)} className="w-8 h-8 rounded-full bg-white/5 text-white flex items-center justify-center hover:bg-orange-600 transition-colors">+</button>
                    </div>
                </div>

                <div className="space-y-6">
                    {guests.map((guest, index) => (
                        <div key={index} className="p-4 rounded-2xl border border-white/5 bg-[#141414]">
                            <h3 className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-4">Passenger {index + 1} {index === 0 && "(Primary)"}</h3>
                            {/* 🚨 FIX 5: Adjusted Grid to include the Gender Select Dropdown */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <input type="text" required placeholder="Full Name as per Govt ID" value={guest.name} onChange={(e) => handleGuestDetailChange(index, "name", e.target.value)} className="w-full bg-transparent border border-white/20 rounded-xl p-3 text-sm text-white focus:border-orange-500 focus:outline-none transition-colors" />
                                </div>
                                <div className="md:col-span-1">
                                    <input type="number" required placeholder="Age" min="1" max="120" value={guest.age} onChange={(e) => handleGuestDetailChange(index, "age", e.target.value)} className="w-full bg-transparent border border-white/20 rounded-xl p-3 text-sm text-white focus:border-orange-500 focus:outline-none transition-colors" />
                                </div>
                                <div className="md:col-span-1">
                                    <select
                                        required
                                        value={guest.gender}
                                        onChange={(e) => handleGuestDetailChange(index, "gender", e.target.value)}
                                        className="w-full bg-[#141414] border border-white/20 rounded-xl p-3 text-sm text-white focus:border-orange-500 focus:outline-none transition-colors"
                                    >
                                        <option value="" disabled>Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Sticky Order Summary */}
        <div className="lg:col-span-1 relative">
            <div className="sticky top-28 bg-[#141414] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
                <h3 className="text-lg font-black text-white uppercase tracking-wide mb-6">Order Summary</h3>

                {/* Mini Tour Card */}
                <div className="flex gap-4 mb-6 pb-6 border-b border-white/5">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <Image src={tour.images[0] || "/placeholder.jpg"} alt="Tour" fill sizes="80px" className="object-cover" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold leading-tight uppercase line-clamp-2 mb-2 tracking-wide">{tour.tourTitle}</h4>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                            <MapPin size={12} className="text-orange-500" /> {tour.startLocation || "Multiple Origins"}
                        </div>
                    </div>
                </div>

                {/* Tour Details Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-white/5">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Calendar size={16} className="text-zinc-500" />
                            <span>Schedule</span>
                        </div>
                        <span className="text-white font-bold text-right text-xs uppercase tracking-wider">
                            {tour.isFixedDate && tour.fixedDate
                                ? new Date(tour.fixedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                                : "Flexible Dates"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Clock size={16} className="text-zinc-500" />
                            <span>Duration</span>
                        </div>
                        <span className="text-white font-bold text-right text-xs uppercase tracking-wider">{tour.tourDuration}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Users size={16} className="text-zinc-500" />
                            <span>Availability</span>
                        </div>
                        <span className="text-emerald-500 font-bold text-right text-xs uppercase tracking-wider">{tour.availableSeats} Slots Left</span>
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-white/5">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Base Price (x{guestsCount})</span>
                        <span className="text-white font-bold flex items-center tracking-tight"><IndianRupee size={14}/> {tour.tourPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Taxes & Fees</span>
                        <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-wider">Included</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-end mb-8">
                    <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Investment</span>
                    <span className="text-3xl font-black text-orange-500 flex items-center tracking-tighter">
                        <IndianRupee size={24} /> {totalPrice.toLocaleString("en-IN")}
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-orange-600/30 flex justify-center items-center gap-2 active:scale-95"
                >
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Securing Seats...</> : <><CreditCard size={18} /> Proceed to Pay</>}
                </button>
                <p className="text-center text-[10px] text-zinc-500 mt-4 uppercase tracking-widest">Secure 256-bit encryption</p>
            </div>
        </div>

      </form>
    </div>
  );
}