"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnRef = useRef(null);

  // GSAP Animation on Page Load
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
      })
      .from(subtitleRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      }, "-=0.5")
      .from(btnRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
      }, "-=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col gap-12 min-h-[80vh] justify-center">

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-start max-w-3xl">
        <div className="overflow-hidden">
            <h1 ref={titleRef} className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6">
            EXPLORE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                THE UNSEEN
            </span>
            </h1>
        </div>

        <p ref={subtitleRef} className="text-xl text-zinc-400 mb-8 max-w-xl leading-relaxed">
            Premium travel experiences curated for the modern adventurer.
            Discover hidden gems in Kashmir, Sikkim, and beyond with
            <span className="text-white font-semibold"> DD Tours</span>.
        </p>

        <div ref={btnRef} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
            href="/tours"
            className="group flex items-center justify-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95"
            >
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 text-zinc-300 transition-colors">
                <MapPin className="w-5 h-5 text-orange-500" />
                View Destinations
            </button>
        </div>
      </section>

      {/* Featured Stats (Optional Visual Flair) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/10 pt-8 mt-8">
        {[
            { label: "Happy Travelers", value: "2k+" },
            { label: "Destinations", value: "15+" },
            { label: "Years Experience", value: "5+" },
            { label: "Rating", value: "4.9/5" },
        ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{stat.label}</p>
            </div>
        ))}
      </div>

    </div>
  );
}