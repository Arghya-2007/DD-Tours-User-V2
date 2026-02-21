"use client";

import {useEffect, useState, useRef} from "react";
import Link from "next/link";
import Image from "next/image";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {Calendar, User, ArrowRight, Youtube, Compass, BookOpen, Fingerprint} from "lucide-react";
import {api} from "@/lib/axios";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface BlogPost {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    coverImage?: string;
    youtubeUrl?: string;
    facebookUrl?: string;
    author?: {
        userName: string;
    };
    createdAt: string;
}

export default function BlogsPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get("/blogs");
                const blogList = response.data?.data?.data || response.data?.data || [];
                if (Array.isArray(blogList)) {
                    setBlogs(blogList);
                } else {
                    setBlogs([]);
                }
            } catch (err) {
                console.error("Failed to fetch blogs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // 🎬 CINEMATIC GSAP REVEALS (Optimized for Load & Footer Fix)
    useGSAP(() => {
        if (loading || hasAnimated.current || !containerRef.current) return;

        hasAnimated.current = true;

        const timer = setTimeout(() => {
            const tl = gsap.timeline();

            // Background & Hero Entrance
            tl.fromTo(".bg-grid-overlay", {opacity: 0}, {opacity: 0.5, duration: 1.5, ease: "power2.inOut"}, 0)
                .fromTo(".hero-anim",
                    {y: 30, opacity: 0, filter: "blur(10px)"},
                    {y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.15, ease: "expo.out"},
                    0.2
                );

            if (blogs.length > 0) {
                // 3D Card Staggered Fold-in
                gsap.fromTo(".blog-card",
                    {y: 80, opacity: 0, rotationX: 15, scale: 0.95},
                    {
                        y: 0, opacity: 1, rotationX: 0, scale: 1,
                        duration: 1, stagger: 0.1, ease: "power3.out",
                        scrollTrigger: {trigger: ".blog-grid", start: "top 85%"}
                    }
                );
            }

            // Refresh ScrollTrigger to ensure footer calculations are correct
            if (typeof window !== "undefined") {
                ScrollTrigger.refresh();
            }

        }, 100);

        return () => clearTimeout(timer);

    }, {scope: containerRef, dependencies: [loading, blogs]});

    // 🖱️ UNIVERSAL 3D HOVER PHYSICS
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

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#020202]">
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute w-32 h-32 border border-orange-600/30 rounded-full animate-ping"></div>
                    <div
                        className="absolute w-24 h-24 border-t-2 border-r-2 border-orange-500 rounded-full animate-spin"></div>
                    <BookOpen size={40} className="text-orange-500 animate-pulse"/>
                </div>
                <div
                    className="font-mono text-orange-500 text-sm tracking-[0.3em] uppercase overflow-hidden whitespace-nowrap animate-pulse">
                    Loading Travel Stories...
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef}
             className="relative min-h-[100svh] bg-[#020202] text-white selection:bg-orange-600 overflow-hidden perspective-[1000px] pb-24 md:pb-32">

            {/* 🌐 TACTICAL GRID & AMBIENT GLOWS - Mobile Optimized */}
            <div
                className="bg-grid-overlay absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 will-change-transform"></div>
            <div
                className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60vw] h-[40vw] bg-orange-600/15 blur-[80px] md:blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse will-change-transform"></div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-24 relative z-10">

                {/* 🌟 HERO HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-24 px-2 sm:px-0">
                    <div
                        className="hero-anim flex items-center justify-center gap-2 text-orange-500 text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] mb-3 md:mb-4">
                        <Compass size={14} className="md:w-4 md:h-4"/> Global Destinations
                    </div>
                    <h1 className="hero-anim font-heading text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 md:mb-6 drop-shadow-[0_0_30px_rgba(234,88,12,0.3)] leading-tight">
                        Travel <span
                        className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">Diaries</span>
                    </h1>
                    <p className="hero-anim text-zinc-400 text-sm md:text-lg leading-relaxed font-medium tracking-wide">
                        Read firsthand experiences, destination guides, and travel stories from our completed tours
                        across the globe.
                    </p>
                </div>

                {/* 📝 BLOG GRID */}
                {blogs.length === 0 ? (
                    <div
                        className="hero-anim text-center py-12 md:py-20 bg-[#111] md:bg-white/5 md:backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/10 mx-auto max-w-lg shadow-2xl px-4">
                        <Fingerprint size={40} className="mx-auto text-zinc-600 mb-4 md:w-12 md:h-12"/>
                        <p className="text-zinc-400 text-sm md:text-lg font-bold uppercase tracking-widest">No Stories
                            Found</p>
                    </div>
                ) : (
                    <div
                        className="blog-grid columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
                        {blogs.map((blog, index) => (
                            <Link
                                href={`/blogs/${blog.slug}`}
                                key={blog._id || blog.slug || index}
                                onMouseMove={(e) => handle3DHover(e, 6)}
                                onMouseLeave={handle3DLeave}
                                // Mobile fix: Removed heavy blur, kept dark base
                                className="blog-card block break-inside-avoid relative bg-[#050505] md:bg-black/60 md:backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-xl md:shadow-2xl hover:shadow-[0_20px_50px_rgba(234,88,12,0.15)] hover:border-white/20 transition-all duration-500 group"
                            >
                                {/* Image Section */}
                                <div
                                    className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-[#0a0a0a] border-b border-white/10">
                                    <Image
                                        src={blog.coverImage || "/placeholder-travel.jpg"}
                                        alt={blog.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 100vw"
                                        priority={index < 3}
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-[#050505] md:from-[#0a0a0a] via-transparent to-transparent"/>

                                    {/* 🏷️ YouTube Badge */}
                                    {blog.youtubeUrl && (
                                        <div
                                            className="absolute top-3 right-3 md:top-4 md:right-4 bg-red-600/90 backdrop-blur-md text-white p-1.5 md:p-2.5 rounded-lg md:rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] border border-red-500/50 flex items-center gap-1.5 md:gap-2 scale-95 group-hover:scale-100 transition-transform">
                                            <Youtube size={12} className="md:w-4 md:h-4" fill="currentColor"/>
                                            <span
                                                className="text-[7px] md:text-[9px] font-black uppercase tracking-widest">Video Tour</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div
                                    className="p-4 sm:p-5 md:p-8 flex flex-col relative z-10 bg-gradient-to-b from-[#050505] to-[#111] md:from-[#0a0a0a] h-full">

                                    {/* Decorative Scanner Line */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-orange-500/30"></div>

                                    {/* Date & Author - Flex Wrap handles long names nicely */}
                                    <div
                                        className="flex flex-wrap items-center gap-2 md:gap-4 text-[8px] md:text-[10px] font-mono text-zinc-500 mb-3 md:mb-4 uppercase tracking-[0.1em] md:tracking-[0.15em]">
                                        <div
                                            className="flex items-center gap-1 md:gap-1.5 bg-white/5 px-2 md:px-2.5 py-1 rounded-md border border-white/5">
                                            <Calendar size={10} className="text-orange-500 md:w-3 md:h-3"/>
                                            <span>{new Date(blog.createdAt).toLocaleDateString('en-GB')}</span>
                                        </div>
                                        {blog.author && (
                                            <div className="flex items-center gap-1 md:gap-1.5 min-w-0">
                                                <User size={10} className="text-zinc-600 md:w-3 md:h-3 shrink-0"/>
                                                <span
                                                    className="truncate max-w-[100px] md:max-w-[120px]">{blog.author.userName}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-black text-white mb-2 md:mb-3 leading-tight group-hover:text-orange-500 transition-colors tracking-tight">
                                        {blog.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-zinc-400 text-[11px] md:text-sm leading-relaxed line-clamp-3 mb-4 md:mb-8 font-medium">
                                        {blog.excerpt || "Read the full story to discover our favorite spots, travel tips, and breathtaking photos from this destination..."}
                                    </p>

                                    {/* Footer Link */}
                                    <div
                                        className="flex items-center justify-between mt-auto pt-3 md:pt-2 border-t border-white/5 sm:border-none sm:pt-0">
                                        <span
                                            className="text-orange-500 font-bold uppercase tracking-widest text-[9px] md:text-[11px] group-hover:text-white transition-colors">Read Full Story</span>
                                        <div
                                            className="bg-white/5 p-2 md:p-3 rounded-lg md:rounded-xl border border-white/10 text-white group-hover:bg-orange-600 group-hover:border-orange-500 transition-colors shadow-lg">
                                            <ArrowRight size={12}
                                                        className="md:w-4 md:h-4 group-hover:translate-x-1 transition-transform"/>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}