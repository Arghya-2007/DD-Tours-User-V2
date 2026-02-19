"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Globe, ShieldCheck, Heart, Users, Map, Smartphone,
  ArrowRight, Award, Star
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // 1. Hero Animation
      gsap.from(".hero-text", {
        y: 50, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.2
      });

      // 2. Stats Counter
      gsap.from(".stat-item", {
        scrollTrigger: {
          trigger: ".stats-section",
          start: "top 90%", // 👈 Trigger earlier
        },
        y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.7)"
      });

      // 3. Team/System Reveal
      gsap.from(".reveal-section", {
        scrollTrigger: {
          trigger: ".reveal-section",
          start: "top 85%",
        },
        y: 40, opacity: 0, duration: 0.8, ease: "power2.out"
      });

      // 4. Features Stagger (THE FIX)
      // Use fromTo to ensure start and end states are explicit
      gsap.fromTo(".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-section",
            start: "top 90%", // 👈 Trigger much earlier (when top of section hits bottom of screen)
          }
        }
      );

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="pb-20 overflow-hidden bg-[#0a0a0a]">

      {/* 🌍 HERO */}
      <div className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
            alt="Travel Adventure" fill className="object-cover opacity-60" priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-[#0a0a0a]/60 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="hero-text inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-sm font-medium mb-6 backdrop-blur-md">
            <Globe size={16} /> Exploring the Unseen Since 2020
          </div>
          <h1 className="hero-text text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6 leading-[0.9]">
            WE CRAFT <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">MEMORIES</span>
          </h1>
          <p className="hero-text text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Your gateway to the world's most breathtaking experiences.
          </p>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="stats-section container mx-auto px-4 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-12 bg-white/5 rounded-3xl backdrop-blur-sm">
          {[
            { label: "Happy Travelers", value: "2,000+", icon: Users },
            { label: "Destinations", value: "15+", icon: Map },
            { label: "Years Experience", value: "5+", icon: Award },
            { label: "Average Rating", value: "4.9/5", icon: Star },
          ].map((stat, i) => (
            <div key={i} className="stat-item text-center">
              <div className="flex justify-center mb-3 text-orange-500"><stat.icon size={32} /></div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 MISSION */}
      <div className="container mx-auto px-4 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="reveal-section space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-zinc-400 leading-relaxed text-lg">
                We believe travel should be seamless, safe, and soul-stirring. Our mission is to remove the hassle of planning so you can focus on the adventure.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">The System</h2>
              <ul className="space-y-4">
                {["Real-time Booking Engine", "Secure Payments", "User Dashboards", "24/7 Support"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0"><ShieldCheck size={14} /></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="reveal-section relative h-[500px] rounded-3xl overflow-hidden border border-white/10 group">
             <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Team" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
             <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                    <p className="text-white font-medium italic">"Technology connects us, but travel brings us together."</p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold text-white">AP</div>
                        <div><div className="text-white font-bold text-sm">Arghya Pal</div><div className="text-orange-400 text-xs">Founder & Lead Developer</div></div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ✨ FEATURES (FIXED VISIBILITY) */}
      <div className="features-section container mx-auto px-4 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Why Choose DD Tours?</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">We don't just sell packages; we curate experiences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Handpicked Destinations", desc: "Every location is visited and vetted by our team.", icon: Map, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "Seamless Booking", desc: "From browsing to booking, our platform is effortless.", icon: Smartphone, color: "text-purple-500", bg: "bg-purple-500/10" },
            { title: "Customer First", desc: "Your comfort is our priority. 24/7 support available.", icon: Heart, color: "text-red-500", bg: "bg-red-500/10" }
          ].map((feature, i) => (
            <div key={i} className="feature-card p-8 rounded-3xl bg-zinc-800 border border-white/10 hover:border-orange-500/30 transition-all hover:-translate-y-2 group relative z-10">
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🏁 CTA */}
      <div className="container mx-auto px-4">
        <div className="reveal-section relative rounded-3xl overflow-hidden px-6 py-20 text-center border border-white/10 bg-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to Start?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tours" className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">Explore Tours <ArrowRight size={20} /></Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}