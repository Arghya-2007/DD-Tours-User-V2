"use client";

import {useEffect, useState, useRef} from "react";
import {useParams, useRouter} from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {
    Calendar, User, ArrowLeft, Loader2, Youtube, Facebook,
    MonitorPlay, Radio, Fingerprint, Share2, Globe, Compass
} from "lucide-react";
import {api} from "@/lib/axios";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface BlogPost {
    _id: string;
    title: string;
    content: string;
    coverImage?: string;
    youtubeUrl?: string;
    facebookUrl?: string;
    author?: { userName: string };
    createdAt: string;
}

export default function SingleBlogPage() {
    const params = useParams();
    const router = useRouter();

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false); // 🔥 The bulletproof animation lock

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const {data} = await api.get(`/blogs/${params.slug}`);
                setBlog(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchBlog();
    }, [params.slug]);

    // 🎬 CINEMATIC GSAP ORCHESTRATION (Locked to run ONCE)
    useGSAP(() => {
        // Wait for data to load and ensure it hasn't animated yet
        if (loading || !blog || !containerRef.current || hasAnimated.current) return;

        // Lock the gate!
        hasAnimated.current = true;

        const customScroller = document.querySelector("#main-scroll-container");
        const scrollerTarget = customScroller || window;

        const tl = gsap.timeline();

        // 1. Hero Lens Focus Reveal
        tl.fromTo(".hero-bg-img",
            {scale: 1.2, filter: "blur(20px)", opacity: 0},
            {scale: 1, filter: "blur(0px)", opacity: 0.8, duration: 1.5, ease: "power3.out"}
        )
            .fromTo(".hero-hud",
                {y: -20, opacity: 0},
                {y: 0, opacity: 1, duration: 0.8, ease: "power2.out"},
                "-=1"
            )
            .fromTo(".hero-title",
                {y: 50, opacity: 0, rotationX: -20},
                {y: 0, opacity: 1, rotationX: 0, duration: 1, ease: "expo.out", transformPerspective: 1000},
                "-=0.8"
            );

        // 2. Prose Content Scroll Reveals
        const contentElements = gsap.utils.toArray(".blog-prose-content > *");
        contentElements.forEach((el: any) => {
            gsap.fromTo(el,
                {y: 30, opacity: 0},
                {
                    y: 0, opacity: 1, duration: 0.8, ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        scroller: scrollerTarget,
                        start: "top 90%"
                    }
                }
            );
        });

        // 3. Video Fold-in
        if (videoRef.current) {
            gsap.fromTo(videoRef.current,
                {y: 80, opacity: 0, rotationX: 20, scale: 0.95},
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    scale: 1,
                    duration: 1.2,
                    ease: "back.out(1.2)",
                    transformPerspective: 1000,
                    scrollTrigger: {trigger: videoRef.current, scroller: scrollerTarget, start: "top 85%"}
                }
            );
        }

    }, {scope: containerRef, dependencies: [loading, blog]});

    // 🖱️ 3D Hover Physics for Video Container
    const handle3DHover = (e: React.MouseEvent<HTMLElement>, strength: number = 5) => {
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
        gsap.to(e.currentTarget, {rotationY: 0, rotationX: 0, duration: 0.8, ease: "elastic.out(1, 0.5)"});
    };

    // Helper to get YouTube Embed ID
    const getYoutubeEmbedUrl = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#020202]">
                <div className="relative flex items-center justify-center mb-8">
                    <div className="absolute w-32 h-32 border border-orange-600/30 rounded-full animate-ping"></div>
                    <div
                        className="absolute w-24 h-24 border-t-2 border-l-2 border-orange-500 rounded-full animate-spin"></div>
                    <Compass size={40} className="text-orange-500 animate-pulse"/>
                </div>
                <div
                    className="font-mono text-orange-500 text-sm tracking-[0.3em] uppercase overflow-hidden whitespace-nowrap animate-pulse">
                    Loading Travel Story...
                </div>
            </div>
        );
    }

    if (!blog) return (
        <div className="text-center py-40 h-screen flex flex-col items-center justify-center bg-[#020202]">
            <h2 className="font-heading text-4xl font-black text-white mb-6 uppercase tracking-widest">Story Not
                Found</h2>
            <Link href="/blogs"
                  className="px-8 py-3 bg-white/10 rounded-full text-white font-mono uppercase text-xs tracking-widest hover:bg-orange-600 transition-all border border-white/10">
                Back to Journals
            </Link>
        </div>
    );

    return (
        <article ref={containerRef}
                 className="pb-24 md:pb-32 bg-[#020202] text-white min-h-[100svh] selection:bg-orange-600">

            {/* 🌐 TACTICAL GRID */}
            <div
                className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 fixed"></div>

            {/* 🔙 Floating Terminal Back Button */}
            <button
                onClick={() => router.back()}
                className="fixed top-24 left-4 md:left-8 z-[100] bg-black/60 backdrop-blur-xl px-4 py-3 rounded-full text-zinc-300 font-mono text-[10px] uppercase tracking-[0.2em] border border-white/10 hover:border-orange-500 hover:text-orange-500 transition-all active:scale-95 hidden xl:flex items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            >
                <ArrowLeft size={14}/> Back
            </button>

            {/* ==================================================== */}
            {/* 🖼️ HERO SECTION (Cinematic Parallax)                   */}
            {/* ==================================================== */}
            <div
                className="relative w-full h-[60svh] md:h-[75vh] rounded-b-[2rem] md:rounded-b-[4rem] overflow-hidden mb-12 md:mb-20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-b border-white/10 z-10 bg-black">

                <Image
                    src={blog.coverImage || "/placeholder-travel.jpg"}
                    alt={blog.title}
                    fill
                    className="hero-bg-img object-cover opacity-80"
                    priority
                />

                {/* Tactical Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent"/>
                <div
                    className="absolute inset-0 bg-gradient-to-r from-[#020202]/80 via-[#020202]/20 to-transparent md:block hidden"/>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-20">
                    <div className="max-w-4xl mx-auto">
                        <div
                            className="hero-hud flex flex-wrap items-center gap-4 text-[10px] md:text-xs font-mono text-zinc-300 mb-6 uppercase tracking-[0.2em]">
                            <span
                                className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-md border border-white/10 shadow-lg">
                                <Calendar size={14} className="text-orange-500"/>
                                {new Date(blog.createdAt).toLocaleDateString('en-GB')}
                            </span>
                            {blog.author && (
                                <span
                                    className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-md border border-white/10 shadow-lg">
                                    <User size={14} className="text-orange-500"/>
                                    {blog.author.userName}
                                </span>
                            )}
                        </div>

                        <h1 className="hero-title font-heading text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] md:leading-[1.05] tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,1)]">
                            {blog.title}
                        </h1>
                    </div>
                </div>
            </div>

            {/* ==================================================== */}
            {/* 📄 CONTENT CONTAINER (Highly Readable Typography)      */}
            {/* ==================================================== */}
            <div className="max-w-3xl mx-auto px-4 relative z-10">

                {/* Blog Body Text */}
                <div
                    dangerouslySetInnerHTML={{__html: blog.content}}
                    className="blog-prose-content prose prose-lg md:prose-xl prose-invert max-w-none
            prose-headings:font-heading prose-headings:font-black prose-headings:tracking-tight prose-headings:text-white
            prose-p:text-zinc-300 prose-p:leading-[1.8] prose-p:font-medium
            prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-3xl prose-img:shadow-[0_20px_50px_rgba(0,0,0,0.5)] prose-img:border prose-img:border-white/5
            prose-strong:text-white prose-strong:font-bold
            prose-blockquote:border-orange-500 prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:text-zinc-200 prose-blockquote:not-italic"
                />

                {/* ==================================================== */}
                {/* 🎥 VIDEO EMBED SECTION                               */}
                {/* ==================================================== */}
                {blog.youtubeUrl && getYoutubeEmbedUrl(blog.youtubeUrl) && (
                    <div ref={videoRef} onMouseMove={(e) => handle3DHover(e, 3)} onMouseLeave={handle3DLeave}
                         className="mt-20 mb-16 relative">

                        {/* HUD Header for Video */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
                            <h3 className="font-heading text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <MonitorPlay className="text-orange-500" size={28}/> Video Experience
                            </h3>
                            <div
                                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1.5 rounded-md w-max">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                                <span className="text-red-500 font-mono text-[10px] uppercase tracking-widest">Watch Tour</span>
                            </div>
                        </div>

                        {/* Video Container */}
                        <div
                            className="relative w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] bg-black group">
                            {/* Fake Scanline */}
                            <div
                                className="absolute top-0 left-0 w-full h-[2px] bg-orange-500/30 opacity-0 group-hover:opacity-100 z-50 pointer-events-none animate-[scan_3s_linear_infinite]"
                                style={{boxShadow: '0 0 20px 2px rgba(234,88,12,0.5)'}}></div>

                            <iframe
                                src={getYoutubeEmbedUrl(blog.youtubeUrl)!}
                                title="Tour Video Log"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* ==================================================== */}
                {/* 🔗 SOCIAL LINKS                                      */}
                {/* ==================================================== */}
                {(blog.facebookUrl || blog.youtubeUrl) && (
                    <div
                        className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 bg-[#0a0a0a]/50 p-8 rounded-3xl backdrop-blur-md">
                        <div>
                            <h4 className="font-heading text-white font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Globe size={18} className="text-emerald-500"/> Connect With Us
                            </h4>
                            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em]">Explore more
                                photos and videos on our social channels.</p>
                        </div>
                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            {blog.facebookUrl && (
                                <a href={blog.facebookUrl} target="_blank" rel="noopener noreferrer"
                                   className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(24,119,242,0.2)]">
                                    <Facebook size={16}/> Facebook
                                </a>
                            )}
                            {blog.youtubeUrl && (
                                <a href={blog.youtubeUrl} target="_blank" rel="noopener noreferrer"
                                   className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#FF0000]/10 border border-[#FF0000]/50 hover:bg-[#FF0000] text-[#FF0000] hover:text-white font-mono font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                                    <Youtube size={16}/> YouTube
                                </a>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}