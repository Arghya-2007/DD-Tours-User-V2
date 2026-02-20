"use client";

import {useEffect, useState, useRef, useLayoutEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {
    User, Mail, Phone, MapPin, Calendar, Edit2, Save, Trash2,
    Loader2, LogOut, CreditCard, Compass, Star, ArrowRight, AlertTriangle,
    CheckCircle, Clock, ShieldCheck, Download, IndianRupee, Fingerprint, Cpu, Target, ScanFace, Radar
} from "lucide-react";
import {api} from "@/lib/axios";
import {useAuthStore} from "@/store/authStore";

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
    const {logout, isAuthenticated} = useAuthStore();

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"PROFILE" | "MISSIONS">("PROFILE");
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState<UserProfile | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    const formatDateForInput = (isoString: string | null) => {
        if (!isoString) return "";
        return new Date(isoString).toISOString().split('T')[0];
    };

    const formatDateForDisplay = (isoString: string | null) => {
        if (!isoString) return "CLASSIFIED";
        return new Date(isoString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
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
                setError("Failed to initialize Headquarters. Signal lost.");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    // 🎬 ADVANCED GSAP ORCHESTRATION
    useGSAP(() => {
        if (loading) return;

        const tl = gsap.timeline();

        // Background & Header
        tl.fromTo(".bg-grid-overlay", {opacity: 0}, {opacity: 0.5, duration: 1.5, ease: "power2.inOut"}, 0)
            .fromTo(".header-anim", {y: -30, opacity: 0}, {y: 0, opacity: 1, duration: 1, ease: "expo.out"}, 0.2);

        // Sidebar 3D Reveal
        tl.fromTo(".sidebar-anim",
            {x: -50, opacity: 0, rotationY: 15},
            {x: 0, opacity: 1, rotationY: 0, duration: 1.2, ease: "power3.out"},
            0.3
        );

        // Continuous Sidebar Hologram Float
        if (sidebarRef.current) {
            gsap.to(sidebarRef.current, {
                y: -10, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
        }

        // Infinite Scanner Line
        gsap.fromTo(".scanner-line",
            {top: "-10%", opacity: 0},
            {top: "110%", opacity: 1, duration: 3, repeat: -1, ease: "linear"}
        );

    }, {scope: containerRef, dependencies: [loading]});

    // Tab Switch Animation (Origami Fold)
    useLayoutEffect(() => {
        if (!loading && contentRef.current) {
            const ctx = gsap.context(() => {
                gsap.fromTo(".tab-content-anim",
                    {y: 50, opacity: 0, rotationX: -20, transformOrigin: "50% 100%", scale: 0.95},
                    {
                        y: 0,
                        opacity: 1,
                        rotationX: 0,
                        scale: 1,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "back.out(1.2)",
                        clearProps: "all"
                    }
                );
            }, contentRef);
            return () => ctx.revert();
        }
    }, [activeTab, loading]);

    // 🖱️ 3D HOVER PHYSICS
    const handle3DHover = (e: React.MouseEvent<HTMLElement>, strength: number = 8) => {
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
        gsap.to(e.currentTarget, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)",
        });
    };

    const handleSave = async () => {
        if (!formData) return;
        setSaving(true);
        setError("");
        setSuccessMsg("");

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
            setSuccessMsg("Intel updated and encrypted successfully.");
            setTimeout(() => setSuccessMsg(""), 4000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to update intel.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("CRITICAL WARNING: Terminate operative account? All mission logs will be wiped. This cannot be undone.")) return;
        try {
            await api.delete("/user/delete-account");
            logout();
            router.push("/login");
        } catch (err: any) {
            alert("Termination failed: " + (err.response?.data?.message));
        }
    };

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            logout();
            router.push("/login");
        } catch (e) {
            console.error(e);
        }
    };

    const handleDownloadPass = async (bookingId: string) => {
        setDownloadingId(bookingId);
        try {
            const {data} = await api.get(`/bookings/${bookingId}/invoice`);
            const invoice = data.data;

            const printWindow = window.open('', '_blank');
            if (!printWindow) throw new Error("Pop-up blocked");

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
                <div class="value">${new Date(invoice.date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            })}</div>
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
            alert("Failed to generate mission pass. Signal lost.");
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#020202]">
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute w-32 h-32 border border-orange-600/30 rounded-full animate-ping"></div>
                    <div
                        className="absolute w-24 h-24 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin"></div>
                    <Fingerprint size={40} className="text-orange-500 animate-pulse"/>
                </div>
                <div
                    className="font-mono text-orange-500 text-sm tracking-[0.3em] uppercase overflow-hidden whitespace-nowrap animate-pulse">
                    Authenticating Operative...
                </div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div ref={containerRef}
             className="relative min-h-[100svh] bg-[#020202] text-white selection:bg-orange-600 overflow-hidden font-sans perspective-[1000px] pb-24">

            {/* 🌐 TACTICAL GRID & AMBIENT GLOWS */}
            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
            <div
                className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse"></div>
            <div
                className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16 relative z-10">

                {/* 🌟 HEADER */}
                <div
                    className="header-anim mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
                    <div>
                        <div
                            className="flex items-center justify-center md:justify-start gap-2 text-orange-500 text-[10px] font-mono uppercase tracking-[0.3em] mb-3">
                            <Cpu size={14}/> Encrypted Uplink Active
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(234,88,12,0.3)]">
                            Operative <span className="text-orange-500">PROFILE</span>
                        </h1>
                    </div>
                    <div
                        className="font-mono text-[10px] text-zinc-500 uppercase tracking-[0.2em] text-right hidden md:block">
                        <p>STATUS: <span className="text-emerald-500">SECURE</span></p>
                        <p>AUTHORIZATION: LEVEL 4</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* 📱 LEFT SIDEBAR (Interactive Hologram ID Card) */}
                    <div className="lg:w-1/3 flex flex-col gap-6 sidebar-anim">
                        <div
                            ref={sidebarRef}
                            onMouseMove={(e) => handle3DHover(e, 5)}
                            onMouseLeave={handle3DLeave}
                            className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center transition-shadow hover:shadow-[0_20px_60px_rgba(234,88,12,0.15)]"
                        >
                            {/* Scanner line overlay */}
                            <div
                                className="scanner-line absolute left-0 w-full h-[2px] bg-orange-500/50 shadow-[0_0_15px_#ea580c] z-50 pointer-events-none"></div>
                            <div
                                className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-600/20 to-transparent pointer-events-none"/>

                            <div
                                className="relative w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-5xl font-black text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] mb-6 border border-white/20">
                                {profile.userName.charAt(0).toUpperCase()}
                            </div>

                            <h2 className="text-2xl font-black text-white uppercase tracking-wide relative z-10">{profile.userName}</h2>
                            <p className="text-zinc-400 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 mt-2 relative z-10">
                                <Mail size={12} className="text-orange-500"/> {profile.userEmail}
                            </p>

                            <div className="mt-8 flex flex-col gap-3 relative z-10">
                                <button
                                    onClick={() => setActiveTab("PROFILE")}
                                    className={`py-4 px-6 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center gap-3 border ${activeTab === "PROFILE" ? "bg-orange-600 text-white border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]" : "bg-[#111] text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"}`}
                                >
                                    <User size={16}/> Personal Intel
                                </button>
                                <button
                                    onClick={() => setActiveTab("MISSIONS")}
                                    className={`py-4 px-6 rounded-xl font-bold uppercase tracking-widest transition-all flex items-center gap-3 border ${activeTab === "MISSIONS" ? "bg-orange-600 text-white border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]" : "bg-[#111] text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"}`}
                                >
                                    <Target size={16}/> Mission Logs
                                </button>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div
                            className="bg-[#111]/80 backdrop-blur-md border border-red-500/20 rounded-3xl p-6 shadow-xl">
                            <p className="text-red-500/80 text-[10px] font-mono uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <AlertTriangle size={12}/> Danger Zone
                            </p>
                            <div className="flex flex-col gap-3">
                                <button onClick={handleLogout}
                                        className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 text-zinc-300 transition-all text-xs font-bold uppercase tracking-widest">
                                    Sign Out <LogOut size={14}/>
                                </button>
                                <button onClick={handleDelete}
                                        className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all text-xs font-bold uppercase tracking-widest">
                                    Terminate Account <Trash2 size={14}/>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 💻 RIGHT MAIN CONTENT AREA */}
                    <div ref={contentRef} className="lg:w-2/3 perspective-[1000px]">

                        {/* ============================== */}
                        {/* 🛡️ TAB 1: PERSONAL INTEL */}
                        {/* ============================== */}
                        {activeTab === "PROFILE" && (
                            <div
                                className="tab-content-anim bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-4">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                                        <ScanFace className="text-orange-500"/> Operative Dossier
                                    </h3>
                                    {!isEditing ? (
                                        <button onClick={() => setIsEditing(true)}
                                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-all">
                                            <Edit2 size={14}/> Update Intel
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button onClick={() => setIsEditing(false)}
                                                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-transparent border border-white/10 hover:bg-white/5 text-zinc-400 text-xs font-bold uppercase tracking-widest transition-all">Cancel
                                            </button>
                                            <button onClick={handleSave} disabled={saving}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                                                {saving ? <Loader2 size={14} className="animate-spin"/> :
                                                    <Save size={14}/>} Encrypt
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {error && <div
                                    className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center gap-3">
                                    <AlertTriangle size={18} className="shrink-0"/> {error}</div>}
                                {successMsg && <div
                                    className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-3">
                                    <CheckCircle size={18} className="shrink-0"/> {successMsg}</div>}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                                    {/* Input Blocks with Focus Glow */}
                                    <div className="space-y-2 group">
                                        <label
                                            className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-orange-500 transition-colors">Operative
                                            Designation</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <User
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors"
                                                    size={18}/>
                                                <input type="text" value={formData?.userName}
                                                       onChange={(e) => setFormData({
                                                           ...formData!,
                                                           userName: e.target.value
                                                       })}
                                                       className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:border-orange-500 focus:bg-white/5 focus:outline-none transition-all shadow-inner"/>
                                            </div>
                                        ) : (<div
                                            className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-zinc-200 text-sm font-medium">{profile.userName}</div>)}
                                    </div>

                                    <div className="space-y-2 group">
                                        <label
                                            className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-orange-500 transition-colors">Comm
                                            Link (Phone)</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Phone
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors"
                                                    size={18}/>
                                                <input type="tel" value={formData?.phoneNumber}
                                                       onChange={(e) => setFormData({
                                                           ...formData!,
                                                           phoneNumber: e.target.value
                                                       })}
                                                       className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:border-orange-500 focus:bg-white/5 focus:outline-none transition-all shadow-inner"/>
                                            </div>
                                        ) : (<div
                                            className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-zinc-200 text-sm font-medium">{profile.phoneNumber || "UNASSIGNED"}</div>)}
                                    </div>

                                    <div className="space-y-2 group">
                                        <label
                                            className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-orange-500 transition-colors">Govt
                                            ID (Aadhar)</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <CreditCard
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors"
                                                    size={18}/>
                                                <input type="text" placeholder="XXXX-XXXX-XXXX"
                                                       value={formData?.aadharNumber || ""}
                                                       onChange={(e) => setFormData({
                                                           ...formData!,
                                                           aadharNumber: e.target.value
                                                       })}
                                                       className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white font-mono text-sm focus:border-orange-500 focus:bg-white/5 focus:outline-none transition-all shadow-inner"/>
                                            </div>
                                        ) : (<div
                                            className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-zinc-300 text-sm font-mono tracking-widest">{profile.aadharNumber || "UNASSIGNED"}</div>)}
                                    </div>

                                    <div className="space-y-2 group">
                                        <label
                                            className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-orange-500 transition-colors">Date
                                            of Origin</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <Calendar
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors"
                                                    size={18}/>
                                                <input type="date" value={formatDateForInput(formData?.dob || null)}
                                                       onChange={(e) => setFormData({
                                                           ...formData!,
                                                           dob: e.target.value
                                                       })}
                                                       className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:border-orange-500 focus:bg-white/5 focus:outline-none transition-all shadow-inner [color-scheme:dark]"/>
                                            </div>
                                        ) : (<div
                                            className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-zinc-200 text-sm font-medium">{formatDateForDisplay(profile.dob)}</div>)}
                                    </div>

                                    <div className="space-y-2 md:col-span-2 group">
                                        <label
                                            className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-orange-500 transition-colors">Base
                                            Coordinates (Address)</label>
                                        {isEditing ? (
                                            <div className="relative">
                                                <MapPin
                                                    className="absolute left-4 top-4 text-zinc-500 group-focus-within:text-orange-500 transition-colors"
                                                    size={18}/>
                                                <textarea value={formData?.userAddress || ""}
                                                          onChange={(e) => setFormData({
                                                              ...formData!,
                                                              userAddress: e.target.value
                                                          })}
                                                          className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white text-sm focus:border-orange-500 focus:bg-white/5 focus:outline-none transition-all shadow-inner min-h-[120px] resize-none"
                                                          placeholder="Enter full address"/>
                                            </div>
                                        ) : (<div
                                            className="p-4 bg-[#0a0a0a] border border-white/5 rounded-xl text-zinc-200 text-sm font-medium min-h-[80px]">{profile.userAddress || "LOCATION UNKNOWN"}</div>)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ============================== */}
                        {/* 🚀 TAB 2: MISSION LOGS */}
                        {/* ============================== */}
                        {activeTab === "MISSIONS" && (
                            <div className="space-y-6">
                                {bookings.length === 0 ? (
                                    <div
                                        className="tab-content-anim bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-16 text-center shadow-2xl">
                                        <Radar size={64} className="mx-auto text-zinc-700 mb-6"/>
                                        <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-3">No
                                            Target Acquired</h3>
                                        <p className="text-zinc-400 text-sm mb-8">You have not initiated any operational
                                            deployments yet.</p>
                                        <Link href="/tours"
                                              className="inline-flex items-center gap-3 px-8 py-4 bg-orange-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                                            Browse Operations <ArrowRight size={16}/>
                                        </Link>
                                    </div>
                                ) : (
                                    bookings.map((booking) => {
                                        const isPaid = booking.paymentStatus === "COMPLETED";
                                        const tourActiveOrDone = booking.tour?.tourStatus === "COMPLETED" || booking.tour?.tourStatus === "ONGOING";
                                        const canReview = isPaid && tourActiveOrDone;
                                        const canDownloadPass = booking.bookingStatus === "CONFIRMED";
                                        const coverImage = booking.tour?.images?.[0] || FALLBACK_IMAGE;

                                        return (
                                            <div
                                                key={booking.bookingId}
                                                onMouseMove={(e) => handle3DHover(e, 4)}
                                                onMouseLeave={handle3DLeave}
                                                className="tab-content-anim bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row group transition-shadow hover:shadow-[0_20px_60px_rgba(234,88,12,0.15)] hover:border-white/20 relative"
                                            >

                                                {/* Desktop Boarding Pass Download */}
                                                {canDownloadPass && (
                                                    <button
                                                        onClick={() => handleDownloadPass(booking.bookingId)}
                                                        disabled={downloadingId === booking.bookingId}
                                                        className="absolute top-6 right-6 z-20 hidden md:flex items-center justify-center w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95"
                                                        title="Extract Mission Pass"
                                                    >
                                                        {downloadingId === booking.bookingId ?
                                                            <Loader2 size={20} className="animate-spin"/> :
                                                            <Download size={20}/>}
                                                    </button>
                                                )}

                                                {/* Left: Cinematic Image Box */}
                                                <div
                                                    className="relative w-full md:w-72 h-56 md:h-auto shrink-0 bg-[#050505] overflow-hidden">
                                                    <Image src={coverImage} alt="Tour" fill
                                                           sizes="(max-width: 768px) 100vw, 300px"
                                                           className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80"/>
                                                    <div
                                                        className="absolute inset-0 bg-gradient-to-t from-[#020202] md:bg-gradient-to-r md:from-transparent md:via-[#020202]/50 md:to-[#020202] opacity-100"/>

                                                    {/* Status Badges Overlay */}
                                                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                                <span
                                                    className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest text-orange-500 border border-orange-500/30 shadow-lg">
                                                    OP: {booking.tour?.tourStatus || "UNKNOWN"}
                                                </span>
                                                        <span
                                                            className={`px-3 py-1.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border shadow-lg backdrop-blur-md ${
                                                                booking.bookingStatus === 'CONFIRMED' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' :
                                                                    booking.bookingStatus === 'CANCELLED' ? 'bg-red-500/10 border-red-500/50 text-red-400' :
                                                                        'bg-zinc-500/10 border-zinc-500/50 text-zinc-400'
                                                            }`}>
                                                    LOG: {booking.bookingStatus}
                                                </span>
                                                    </div>
                                                </div>

                                                {/* Right: Dossier Content */}
                                                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10">
                                                    <div className="flex justify-between items-start gap-4 mb-6">
                                                        <div className="pr-10 md:pr-14">
                                                    <span
                                                        className="text-zinc-500 text-[10px] font-mono font-bold uppercase tracking-[0.2em] block mb-1">
                                                        UPLINK ID: {booking.bookingId.split('-')[0].toUpperCase()}
                                                    </span>
                                                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none line-clamp-2">
                                                                {booking.tour?.tourTitle || "Classified Target"}
                                                            </h3>
                                                        </div>
                                                        <div className="text-right shrink-0 hidden md:block">
                                                            <span
                                                                className="text-zinc-500 text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">Investment</span>
                                                            <span
                                                                className="text-2xl font-black text-white flex items-center tracking-tighter">
                                                        <IndianRupee size={20} className="text-orange-500 mr-0.5"/>
                                                                {booking.totalPrice?.toLocaleString("en-IN")}
                                                    </span>
                                                        </div>
                                                    </div>

                                                    {/* Mission Details Breakdown */}
                                                    <div
                                                        className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 pb-6 border-b border-white/5 font-mono text-xs">
                                                        <div>
                                                            <span
                                                                className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] block mb-1">Payment Status</span>
                                                            <span
                                                                className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                                                    booking.paymentStatus === 'COMPLETED' ? 'text-emerald-500' :
                                                                        booking.paymentStatus === 'FAILED' ? 'text-red-500' : 'text-orange-500'
                                                                }`}>
                                                        {booking.paymentStatus === 'COMPLETED' ?
                                                            <CheckCircle size={12}/> : <Clock size={12}/>}
                                                                {booking.paymentStatus}
                                                    </span>
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] block mb-1">Creation Date</span>
                                                            <span
                                                                className="text-zinc-300 font-bold uppercase tracking-wider">
                                                        {formatDateForDisplay(booking.bookingDate)}
                                                    </span>
                                                        </div>
                                                        <div className="col-span-2 md:col-span-1 md:hidden mt-2">
                                                            <span
                                                                className="text-zinc-500 text-[9px] uppercase tracking-[0.2em] block mb-1">Investment</span>
                                                            <span
                                                                className="text-lg font-black text-white flex items-center font-sans tracking-tighter">
                                                        <IndianRupee size={16} className="text-orange-500 mr-0.5"/>
                                                                {booking.totalPrice?.toLocaleString("en-IN")}
                                                    </span>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="mt-auto flex flex-wrap gap-3">
                                                        {booking.paymentStatus === 'PENDING' && booking.bookingStatus !== 'CANCELLED' && (
                                                            <Link href={`/bookings/${booking.bookingId}/pay`}
                                                                  className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                                                                <CreditCard size={14}/> Resume Payment
                                                            </Link>
                                                        )}

                                                        {canReview && (
                                                            <Link
                                                                href={booking.tour?.slug ? `/tours/${booking.tour.slug}/review` : "#"}
                                                                className="flex-1 py-3 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white text-emerald-500 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                                                            >
                                                                <Star size={14}/> Debrief (Review)
                                                            </Link>
                                                        )}

                                                        {/* Mobile Download Pass */}
                                                        {canDownloadPass && (
                                                            <button
                                                                onClick={() => handleDownloadPass(booking.bookingId)}
                                                                disabled={downloadingId === booking.bookingId}
                                                                className="flex-1 md:hidden py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2"
                                                            >
                                                                {downloadingId === booking.bookingId ?
                                                                    <Loader2 size={14} className="animate-spin"/> :
                                                                    <Download size={14}/>} Extract Pass
                                                            </button>
                                                        )}

                                                        <Link
                                                            href={booking.tour?.slug ? `/tours/${booking.tour.slug}` : "#"}
                                                            className={`flex-1 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all text-center flex items-center justify-center`}
                                                        >
                                                            View Target
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
        </div>
    );
}