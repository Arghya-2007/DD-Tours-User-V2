"use client";

import {useEffect, useState, useRef} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";
import {
    Star, MessageSquare, Trash2, Loader2, Plus, X, Image as ImageIcon,
    Radar, ShieldCheck, Crosshair, Cpu, Fingerprint, Target
} from "lucide-react";
import {api} from "@/lib/axios";
import {useAuthStore} from "@/store/authStore";

interface Review {
    reviewId: string;
    reviewText: string;
    rating: number;
    tourName: string;
    photoUrl?: string;
    user: { userName: string };
    createdAt: string;
}

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop";

export default function ReviewsPage() {
    const router = useRouter();
    const {user, isAuthenticated} = useAuthStore();

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({tourName: "", reviewText: "", rating: 5, photoUrl: ""});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Reviews
    const fetchReviews = async () => {
        try {
            const {data} = await api.get("/reviews");
            setReviews(data.data);
        } catch (err) {
            console.error("Failed to decrypt intel", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // 2. CRAZY 3D ENTRANCE ANIMATIONS
    useGSAP(() => {
        if (loading || reviews.length === 0 || !containerRef.current) return;

        const tl = gsap.timeline();

        // Background Ambience
        tl.fromTo(".bg-grid-overlay", {opacity: 0}, {opacity: 0.5, duration: 1.5, ease: "power2.inOut"}, 0)
            .fromTo(".bg-glow", {scale: 0.8, opacity: 0}, {scale: 1, opacity: 1, duration: 2, ease: "power3.out"}, 0);

        // Header reveal
        tl.fromTo(".header-anim",
            {y: -50, opacity: 0, rotationX: -20},
            {y: 0, opacity: 1, rotationX: 0, duration: 1, ease: "expo.out", transformPerspective: 1000},
            0.2
        );

        // 3D "Origami" Card Stagger
        tl.fromTo(".review-card",
            {y: 100, opacity: 0, rotationX: 45, rotationY: () => Math.random() * 20 - 10, scale: 0.8},
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: "back.out(1.5)",
                transformPerspective: 1000
            },
            0.4
        );

    }, {scope: containerRef, dependencies: [loading, reviews]});

    // Modal Animation Hook
    useEffect(() => {
        if (showModal && modalRef.current) {
            gsap.fromTo(modalRef.current,
                {scale: 0.8, opacity: 0, rotationX: 20},
                {scale: 1, opacity: 1, rotationX: 0, duration: 0.6, ease: "back.out(1.5)", transformPerspective: 1000}
            );
        }
    }, [showModal]);

    // 3. UNIVERSAL 3D HOVER PHYSICS
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
            rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)",
        });
    };

    // 4. Form Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) return router.push("/login");

        setSubmitting(true);
        let finalPhotoUrl = formData.photoUrl;

        try {
            if (selectedFile) {
                setUploading(true);
                const uploadData = new FormData();
                uploadData.append("images", selectedFile);

                const {data: uploadRes} = await api.post("/upload", uploadData, {
                    headers: {"Content-Type": "multipart/form-data"},
                });

                if (uploadRes.data.urls && uploadRes.data.urls.length > 0) {
                    finalPhotoUrl = uploadRes.data.urls[0];
                }
                setUploading(false);
            }

            await api.post("/reviews", {...formData, photoUrl: finalPhotoUrl});

            setShowModal(false);
            setFormData({tourName: "", reviewText: "", rating: 5, photoUrl: ""});
            setSelectedFile(null);
            setPreviewUrl(null);

            // Re-trigger fetch and animation
            setLoading(true);
            fetchReviews();

        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to transmit intel.");
            setUploading(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId: string) => {
        if (!confirm("Wipe this record from the database?")) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter((r) => r.reviewId !== reviewId));
        } catch (err) {
            alert("Wipe failed.");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#020202]">
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute w-32 h-32 border border-emerald-600/30 rounded-full animate-ping"></div>
                    <div
                        className="absolute w-24 h-24 border-t-2 border-l-2 border-emerald-500 rounded-full animate-spin"></div>
                    <Radar size={40} className="text-emerald-500 animate-pulse"/>
                </div>
                <div
                    className="font-mono text-emerald-500 text-sm tracking-[0.3em] uppercase overflow-hidden whitespace-nowrap animate-pulse">
                    Decrypting Mission Logs...
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef}
             className="relative min-h-[100svh] bg-[#020202] text-white selection:bg-emerald-600 pb-24 overflow-hidden perspective-[1000px]">

            {/* 🌐 TACTICAL BACKGROUND */}
            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
            <div
                className="bg-glow absolute top-0 right-0 w-[50vw] h-[50vw] bg-emerald-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
            <div
                className="bg-glow absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 md:pt-24 relative z-10">

                {/* 🌟 CINEMATIC HEADER */}
                <div
                    className="header-anim flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-white/10 pb-10">
                    <div>
                        <div
                            className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 text-[10px] font-mono uppercase tracking-[0.3em] mb-3">
                            <Cpu size={14}/> Verified Global Intel
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            WALL OF <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600"> LOVE</span>
                        </h1>
                        <p className="text-zinc-400 mt-4 max-w-lg font-medium tracking-wide">
                            Access classified reviews, experiences, and post-mission intel directly from our official
                            agents.
                        </p>
                    </div>

                    <button
                        onClick={() => isAuthenticated ? setShowModal(true) : router.push("/login")}
                        className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] active:scale-[0.98] overflow-hidden"
                    >
                        <div
                            className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <span className="relative z-10 flex items-center gap-3">
                {isAuthenticated ? <Plus size={18}/> : <MessageSquare size={18}/>}
                            {isAuthenticated ? "Submit Intel" : "Login to Submit"}
            </span>
                    </button>
                </div>

                {/* 📄 REVIEWS MASONRY GRID */}
                {reviews.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500 font-mono tracking-widest uppercase">No Intel Found
                        in Database.</div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review.reviewId}
                                onMouseMove={(e) => handle3DHover(e, 8)}
                                onMouseLeave={handle3DLeave}
                                className="review-card break-inside-avoid relative bg-black/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl hover:shadow-[0_20px_60px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all group overflow-hidden cursor-default"
                            >
                                {/* Decorative Tech Overlay */}
                                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                    <Fingerprint size={80}/>
                                </div>

                                {/* Optional Image Evidence */}
                                {review.photoUrl && (
                                    <div
                                        className="mb-6 rounded-2xl overflow-hidden relative w-full h-56 border border-white/5">
                                        <Image
                                            src={review.photoUrl}
                                            alt="Mission Evidence"
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-80"/>
                                        <span
                                            className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-emerald-500 tracking-widest border border-emerald-500/30">
                        EVIDENCE LOGGED
                    </span>
                                    </div>
                                )}

                                {/* User Header */}
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center font-black text-white shadow-inner">
                                            {review.user.userName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-base leading-tight">{review.user.userName}</h3>
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Op
                                                Date: {new Date(review.createdAt).toLocaleDateString('en-GB')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tour Name & Rating */}
                                <div
                                    className="flex items-center justify-between mb-4 bg-white/5 p-3 rounded-xl border border-white/5 relative z-10">
                                    <div className="flex items-center gap-2 text-emerald-400">
                                        <Target size={16}/>
                                        <h4 className="text-xs font-black uppercase tracking-wider">{review.tourName}</h4>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star size={14}
                                              className="fill-orange-500 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"/>
                                        <span className="text-white text-sm font-bold">{review.rating}.0</span>
                                    </div>
                                </div>

                                {/* The highly readable Review Text */}
                                <p className="text-zinc-300 text-base leading-relaxed font-medium relative z-10">
                                    "{review.reviewText}"
                                </p>

                                {/* Admin Delete */}
                                {user?.role === "ADMIN" && (
                                    <button
                                        onClick={() => handleDelete(review.reviewId)}
                                        className="absolute top-4 right-4 p-2.5 bg-red-500/20 border border-red-500/50 hover:bg-red-500 text-red-200 hover:text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-95 shadow-lg z-20"
                                    >
                                        <Trash2 size={16}/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ==================================================== */}
                {/* 🚀 UPLOAD INTEL MODAL (Cinematic Form)               */}
                {/* ==================================================== */}
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                        {/* Blur Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
                            onClick={() => setShowModal(false)}
                        />

                        <div ref={modalRef}
                             className="bg-[#050505] border border-white/10 w-full max-w-xl rounded-[2.5rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,1)] relative z-10 overflow-hidden">

                            {/* Internal Tech Accents */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 blur-[80px] rounded-full pointer-events-none"></div>
                            <div
                                className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

                            <button onClick={() => setShowModal(false)}
                                    className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-white/5 p-2 rounded-full border border-white/10 hover:border-white/30">
                                <X size={20}/>
                            </button>

                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase flex items-center gap-3">
                                <ShieldCheck className="text-emerald-500" size={32}/> Submit Intel
                            </h2>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] mb-8 border-b border-white/10 pb-6">Log
                                your expedition details securely.</p>

                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                                <div className="space-y-2 group">
                                    <label
                                        className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-emerald-500 transition-colors">Target
                                        Designation (Tour Name)</label>
                                    <input
                                        type="text" required placeholder="e.g. Operation Kashmir"
                                        value={formData.tourName}
                                        onChange={(e) => setFormData({...formData, tourName: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-base focus:border-emerald-500 focus:bg-emerald-500/5 focus:outline-none transition-all shadow-inner"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Mission
                                        Success Level (Rating)</label>
                                    <div
                                        className="flex items-center gap-2 bg-black/50 border border-white/10 rounded-xl p-3 w-max">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button"
                                                    onClick={() => setFormData({...formData, rating: star})}
                                                    className="p-1 hover:scale-110 transition-transform">
                                                <Star size={28}
                                                      className={formData.rating >= star ? "fill-orange-500 text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" : "text-zinc-700"}/>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 group">
                                    <label
                                        className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500 group-focus-within:text-emerald-500 transition-colors">Operative
                                        Feedback</label>
                                    <textarea
                                        required rows={4} placeholder="Detail your experience on the field..."
                                        value={formData.reviewText}
                                        onChange={(e) => setFormData({...formData, reviewText: e.target.value})}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white text-base leading-relaxed focus:border-emerald-500 focus:bg-emerald-500/5 focus:outline-none resize-none transition-all shadow-inner"
                                    />
                                </div>

                                {/* Cinematic Image Dropzone */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Attach
                                        Evidence (Optional Photo)</label>
                                    <div className="relative group cursor-pointer">
                                        <input
                                            type="file" accept="image/*" onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div
                                            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${previewUrl ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-zinc-700 bg-[#0a0a0a] group-hover:border-emerald-500/50 group-hover:bg-[#111]'}`}>
                                            {previewUrl ? (
                                                <div
                                                    className="relative w-full h-40 rounded-xl overflow-hidden shadow-lg border border-white/10">
                                                    <Image src={previewUrl} alt="Evidence Preview" fill
                                                           className="object-cover"/>
                                                    <div
                                                        className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ImageIcon size={24} className="text-white mb-2"/>
                                                        <span
                                                            className="text-white font-mono text-xs uppercase tracking-widest">Replace Target</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        className="p-4 bg-zinc-900 rounded-full text-zinc-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-colors shadow-inner">
                                                        <Crosshair size={28}/>
                                                    </div>
                                                    <span
                                                        className="text-xs font-mono uppercase tracking-widest text-zinc-500 group-hover:text-zinc-300">Click to upload imagery</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit" disabled={submitting || uploading}
                                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-white/5 disabled:text-zinc-600 text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:shadow-none flex justify-center items-center gap-3 active:scale-[0.98] border border-transparent disabled:border-white/10"
                                >
                                    {uploading ? <><Loader2 size={20} className="animate-spin"/> Transmitting
                                        File...</> : submitting ? <><Loader2 size={20}
                                                                             className="animate-spin"/> Encrypting...</> : "Transmit Intel"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}