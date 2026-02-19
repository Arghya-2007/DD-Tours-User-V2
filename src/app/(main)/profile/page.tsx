"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import {
  User, Mail, Phone, MapPin, Calendar, Edit2, Save, Trash2,
  Loader2, LogOut, CreditCard, Compass, Star, ArrowRight, AlertTriangle,
  CheckCircle, Clock, ShieldCheck, Download, IndianRupee
} from "lucide-react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

interface UserProfile {
  userName: string;
  userEmail: string;
  phoneNumber: string;
  userAddress: string | null;
  aadharNumber: string | null;
  dob: string | null;
}

interface Booking {
  bookingId: string;
  totalPrice: number;
  bookingDate: string;
  bookingStatus: string;
  paymentStatus: string;
  tour: {
    slug: string;
    tourTitle: string;
    tourStatus: string;
    images: string[];
  };
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop";

export default function ProfilePage() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PROFILE" | "MISSIONS">("PROFILE");
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 🆕 NEW: State to track which pass is currently downloading
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  const formatDateForInput = (isoString: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split('T')[0];
  };

  const formatDateForDisplay = (isoString: string | null) => {
    if (!isoString) return "Not set";
    return new Date(isoString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  };

useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
            api.get("/user/me"),
            api.get("/bookings")
        ]);

        setProfile(profileRes.data.data);
        setFormData(profileRes.data.data);

        const fetchedBookings = bookingsRes.data?.data?.data || bookingsRes.data?.data || [];
        if (Array.isArray(fetchedBookings)) setBookings(fetchedBookings);

      } catch (err) {
        setError("Failed to initialize Headquarters. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useLayoutEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from(".reveal-anim", { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, activeTab]);

  const handleSave = async () => {
    if (!formData) return;
    setSaving(true); setError(""); setSuccessMsg("");

    try {
      const payload = {
        userName: formData.userName,
        phoneNumber: formData.phoneNumber,
        userAddress: formData.userAddress || null,
        aadharNumber: formData.aadharNumber || null,
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
      };

      await api.patch("/user/update-profile", payload);
      setProfile(formData);
      setIsEditing(false);
      setSuccessMsg("Intel updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update intel.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("CRITICAL: Terminate account? This cannot be undone.")) return;
    try {
      await api.delete("/user/delete-account");
      logout(); router.push("/login");
    } catch (err: any) {
      alert("Termination failed: " + (err.response?.data?.message));
    }
  };

  const handleLogout = async () => {
     try { await api.post("/auth/logout"); logout(); router.push("/login"); }
     catch (e) { console.error(e); }
  };

  // 🚀 NEW: Generate & Download Pass Function
  const handleDownloadPass = async (bookingId: string) => {
    setDownloadingId(bookingId);
    try {
      // 1. Fetch the invoice JSON from your Backend
      const { data } = await api.get(`/bookings/${bookingId}/invoice`);
      const invoice = data.data;

      // 2. Open a hidden print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) throw new Error("Pop-up blocked");

      // 3. Generate a beautiful boarding-pass HTML design
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Mission Pass - ${invoice.invoiceId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; background: #fff; color: #111; padding: 40px; margin: 0; }
            .pass-card { max-width: 700px; margin: 0 auto; border: 2px solid #e5e7eb; border-radius: 24px; overflow: hidden; page-break-inside: avoid; }
            .pass-header { background: #ea580c; color: white; padding: 30px; display: flex; justify-content: space-between; align-items: center; }
            .pass-header h1 { margin: 0; font-size: 28px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; }
            .pass-header p { margin: 5px 0 0 0; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 4px; }
            .pass-body { padding: 40px 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
            .field-group { margin-bottom: 20px; }
            .label { font-size: 10px; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 4px; }
            .value { font-size: 16px; font-weight: 700; color: #111; text-transform: uppercase; }
            .value.destination { font-size: 24px; color: #ea580c; font-weight: 900; }
            .pass-footer { background: #f9fafb; padding: 20px 30px; border-top: 2px dashed #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              @page { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="pass-card">
            <div class="pass-header">
              <div>
                <h1>DD Tours</h1>
                <p>Official Mission Pass</p>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 16px; font-weight: 900; opacity: 1; letter-spacing: 1px;">${invoice.invoiceId}</p>
                <p style="letter-spacing: 1px; margin-top: 4px;">CONFIRMED</p>
              </div>
            </div>
            <div class="pass-body">
              <div class="field-group" style="grid-column: span 2;">
                <div class="label">Target Destination</div>
                <div class="value destination">${invoice.tourTitle}</div>
              </div>
              <div class="field-group">
                <div class="label">Primary Operative</div>
                <div class="value">${invoice.customerName}</div>
              </div>
              <div class="field-group">
                <div class="label">Party Size</div>
                <div class="value">${invoice.guests} PAX</div>
              </div>
              <div class="field-group">
                <div class="label">Issue Date</div>
                <div class="value">${new Date(invoice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              <div class="field-group">
                <div class="label">Total Investment</div>
                <div class="value">INR ${invoice.amount.toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div class="pass-footer">
              Valid for entry. Present this document to your expedition leader.
            </div>
          </div>
          <script>
            // Auto-trigger print dialog, then close window
            window.onload = function() {
                setTimeout(function() {
                    window.print();
                    window.close();
                }, 500);
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

    } catch (err) {
      console.error(err);
      alert("Failed to generate mission pass. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[70vh]"><Loader2 className="animate-spin text-orange-600 w-12 h-12" /></div>;
  if (!profile) return null;

  return (
    <div ref={containerRef} className="max-w-6xl mx-auto px-4 py-8 md:py-12 pb-24">

      {/* 🌟 HEADER */}
      <div className="reveal-anim mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
            Operative <span className="text-orange-600">Headquarters</span>
        </h1>
        <p className="text-zinc-400 mt-2 text-sm tracking-widest uppercase">Access your intel and mission logs.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* 📱 LEFT SIDEBAR */}
        <div className="lg:w-1/3 flex flex-col gap-6 reveal-anim">
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl text-center">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-600/20 to-transparent" />

                <div className="relative w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-4xl font-black text-white shadow-[0_0_30px_rgba(234,88,12,0.3)] mb-4 border-4 border-[#141414]">
                    {profile.userName.charAt(0).toUpperCase()}
                </div>

                <h2 className="text-2xl font-black text-white uppercase tracking-wide relative z-10">{profile.userName}</h2>
                <p className="text-zinc-400 text-sm flex items-center justify-center gap-2 mt-2 relative z-10">
                    <Mail size={14} className="text-orange-500" /> {profile.userEmail}
                </p>

                <div className="mt-8 flex flex-col gap-3 relative z-10">
                    <button
                        onClick={() => setActiveTab("PROFILE")}
                        className={`py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === "PROFILE" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                    >
                        <User size={16} /> Personal Intel
                    </button>
                    <button
                        onClick={() => setActiveTab("MISSIONS")}
                        className={`py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === "MISSIONS" ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"}`}
                    >
                        <Compass size={16} /> Mission Logs
                    </button>
                </div>
            </div>

            <div className="bg-[#111] border border-red-500/10 rounded-3xl p-6">
                <p className="text-red-500/50 text-[10px] font-bold uppercase tracking-widest mb-4">Danger Zone</p>
                <div className="flex flex-col gap-3">
                    <button onClick={handleLogout} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-all text-xs font-bold uppercase tracking-widest">
                        Sign Out <LogOut size={14} />
                    </button>
                    <button onClick={handleDelete} className="flex items-center justify-between px-4 py-3 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500 transition-all text-xs font-bold uppercase tracking-widest">
                        Terminate Account <Trash2 size={14} />
                    </button>
                </div>
            </div>
        </div>

        {/* 💻 RIGHT MAIN CONTENT AREA */}
        <div ref={contentRef} className="lg:w-2/3">

            {activeTab === "PROFILE" && (
                <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 md:p-10 shadow-xl reveal-anim">
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <h3 className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                            <ShieldCheck className="text-orange-500" /> Identity Data
                        </h3>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all">
                                <Edit2 size={14} /> Edit Intel
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg bg-transparent hover:bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-widest transition-all">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase tracking-widest transition-all">
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                                </button>
                            </div>
                        )}
                    </div>

                    {error && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2"><AlertTriangle size={16}/> {error}</div>}
                    {successMsg && <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"><CheckCircle size={16}/> {successMsg}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Operative Name</label>
                            {isEditing ? (
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                                    <input type="text" value={formData?.userName} onChange={(e) => setFormData({...formData!, userName: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-orange-500 focus:outline-none" />
                                </div>
                            ) : (<div className="p-3.5 bg-[#111] rounded-xl text-zinc-300 border border-white/5 text-sm">{profile.userName}</div>)}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Comm Link (Phone)</label>
                            {isEditing ? (
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                                    <input type="tel" value={formData?.phoneNumber} onChange={(e) => setFormData({...formData!, phoneNumber: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-orange-500 focus:outline-none" />
                                </div>
                            ) : (<div className="p-3.5 bg-[#111] rounded-xl text-zinc-300 border border-white/5 text-sm">{profile.phoneNumber || "Not provided"}</div>)}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Govt ID (Aadhar)</label>
                            {isEditing ? (
                                <div className="relative">
                                    <CreditCard className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                                    <input type="text" placeholder="XXXX-XXXX-XXXX" value={formData?.aadharNumber || ""} onChange={(e) => setFormData({...formData!, aadharNumber: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-orange-500 focus:outline-none" />
                                </div>
                            ) : (<div className="p-3.5 bg-[#111] rounded-xl text-zinc-300 border border-white/5 text-sm font-mono tracking-widest">{profile.aadharNumber || "Not Provided"}</div>)}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date of Birth</label>
                            {isEditing ? (
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                                    <input type="date" value={formatDateForInput(formData?.dob || null)} onChange={(e) => setFormData({...formData!, dob: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-orange-500 focus:outline-none [color-scheme:dark]" />
                                </div>
                            ) : (<div className="p-3.5 bg-[#111] rounded-xl text-zinc-300 border border-white/5 text-sm">{formatDateForDisplay(profile.dob)}</div>)}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Base Coordinates (Address)</label>
                            {isEditing ? (
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-zinc-500" size={16} />
                                    <textarea value={formData?.userAddress || ""} onChange={(e) => setFormData({...formData!, userAddress: e.target.value})} className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:border-orange-500 focus:outline-none min-h-[100px]" placeholder="Enter full address" />
                                </div>
                            ) : (<div className="p-3.5 bg-[#111] rounded-xl text-zinc-300 border border-white/5 text-sm min-h-[60px]">{profile.userAddress || "Location Unknown"}</div>)}
                        </div>
                    </div>
                </div>
            )}

            {/* ============================== */}
            {/* 🚀 TAB 2: MISSION LOGS */}
            {/* ============================== */}
            {activeTab === "MISSIONS" && (
                <div className="space-y-6 reveal-anim">
                    {bookings.length === 0 ? (
                        <div className="bg-[#141414] border border-white/5 rounded-3xl p-12 text-center shadow-xl">
                            <Compass size={48} className="mx-auto text-zinc-700 mb-6" />
                            <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">No Missions Found</h3>
                            <p className="text-zinc-500 text-sm mb-6">You have not booked any expeditions yet.</p>
                            <Link href="/tours" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20">
                                Explore Destinations <ArrowRight size={14} />
                            </Link>
                        </div>
                    ) : (
                        bookings.map((booking) => {
                            const isPaid = booking.paymentStatus === "COMPLETED";
                            const tourActiveOrDone = booking.tour?.tourStatus === "COMPLETED" || booking.tour?.tourStatus === "ONGOING";
                            const canReview = isPaid && tourActiveOrDone;

                            // 🚀 NEW: Condition to download pass
                            const canDownloadPass = booking.bookingStatus === "CONFIRMED";

                            const coverImage = booking.tour?.images?.[0] || FALLBACK_IMAGE;

                            return (
                                <div key={booking.bookingId} className="bg-[#141414] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row group transition-all hover:border-white/10 relative">

                                    {/* 🚀 NEW: Floating Download Button for Desktop */}
                                    {canDownloadPass && (
                                        <button
                                            onClick={() => handleDownloadPass(booking.bookingId)}
                                            disabled={downloadingId === booking.bookingId}
                                            className="absolute top-4 right-4 z-20 hidden md:flex items-center justify-center w-10 h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/20 transition-transform hover:scale-105"
                                            title="Download Mission Pass"
                                        >
                                            {downloadingId === booking.bookingId ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                        </button>
                                    )}

                                    {/* Left: Image Box */}
                                    <div className="relative w-full md:w-64 h-48 md:h-auto shrink-0 bg-[#0a0a0a]">
                                        <Image src={coverImage} alt="Tour" fill sizes="(max-width: 768px) 100vw, 256px" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] md:bg-gradient-to-r md:from-transparent md:to-[#141414] opacity-100" />

                                        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                            <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest text-white border border-white/10 shadow-lg">
                                                {booking.tour?.tourStatus || "UNKNOWN"}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border shadow-lg backdrop-blur-md ${
                                                booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                                booking.bookingStatus === 'CANCELLED' ? 'bg-red-500/20 border-red-500/50 text-red-400' :
                                                'bg-zinc-500/20 border-zinc-500/50 text-zinc-300'
                                            }`}>
                                                Booking: {booking.bookingStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right: Content Box */}
                                    <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10 bg-[#141414] md:bg-transparent">
                                        <div className="flex justify-between items-start gap-4 mb-4">
                                            <div className="pr-10 md:pr-0">
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">
                                                    ID: {booking.bookingId.split('-')[0].toUpperCase()}
                                                </span>
                                                <h3 className="text-2xl font-black text-white uppercase tracking-wide leading-tight line-clamp-2">
                                                    {booking.tour?.tourTitle || "Custom Tour"}
                                                </h3>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Investment</span>
                                                <span className="text-xl font-black text-white flex items-center tracking-tighter">
                                                    <IndianRupee size={16} className="text-orange-500 mr-0.5" />
                                                    {booking.totalPrice?.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-white/5">
                                            <div>
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Payment Status</span>
                                                <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                                                    booking.paymentStatus === 'COMPLETED' ? 'text-emerald-500' :
                                                    booking.paymentStatus === 'FAILED' ? 'text-red-500' : 'text-orange-500'
                                                }`}>
                                                    {booking.paymentStatus === 'COMPLETED' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                    {booking.paymentStatus}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Log Date</span>
                                                <span className="text-zinc-300 text-xs font-bold uppercase tracking-widest">
                                                    {formatDateForDisplay(booking.bookingDate)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex flex-wrap gap-3">
                                            {booking.paymentStatus === 'PENDING' && booking.bookingStatus !== 'CANCELLED' && (
                                                <Link href={`/bookings/${booking.bookingId}/pay`} className="flex-1 min-w-[140px] py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2">
                                                    <CreditCard size={14} /> Complete Payment
                                                </Link>
                                            )}

                                            {canReview && (
                                                <Link
                                                    href={booking.tour?.slug ? `/tours/${booking.tour.slug}/review` : "#"}
                                                    className="flex-1 min-w-[140px] py-2.5 bg-emerald-600/10 border border-emerald-500 hover:bg-emerald-600 hover:text-white text-emerald-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                                                >
                                                    <Star size={14} /> Write Review
                                                </Link>
                                            )}

                                            {/* 🚀 NEW: Mobile Download Button */}
                                            {canDownloadPass && (
                                                <button
                                                    onClick={() => handleDownloadPass(booking.bookingId)}
                                                    disabled={downloadingId === booking.bookingId}
                                                    className="flex-1 min-w-[140px] md:hidden py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                                                >
                                                    {downloadingId === booking.bookingId ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} Download Pass
                                                </button>
                                            )}

                                            <Link
                                                href={booking.tour?.slug ? `/tours/${booking.tour.slug}` : "#"}
                                                className={`flex-1 min-w-[140px] py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center`}
                                            >
                                                View Mission
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}