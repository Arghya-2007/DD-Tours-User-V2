"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { Calendar, User, ArrowRight, Loader2, Youtube, Facebook } from "lucide-react";
import { api } from "@/lib/axios";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  youtubeUrl?: string;  // 🆕 Added
  facebookUrl?: string; // 🆕 Added
  author?: {
    userName: string;
  };
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs");
        // Check both data.data and data.data.data structure
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

  useLayoutEffect(() => {
    if (!loading && blogs.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".blog-card", {
          y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out"
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, blogs]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="pb-20">

      {/* 🌟 Hero Header */}
      <div className="relative py-16 md:py-24 mb-12 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[120px] -z-10" />

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
          TRAVEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">DIARIES</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Explore the world through our stories. From hidden waterfalls in Sikkim to the snowy peaks of Kashmir.
        </p>
      </div>

      {/* 📝 Blog Grid */}
      {blogs.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-white/5 mx-auto max-w-lg">
          <p className="text-zinc-500 text-lg">No stories published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {blogs.map((blog, index) => (
            <Link
              href={`/blogs/${blog.slug}`}
              key={blog._id || blog.slug || index}
              className="blog-card group flex flex-col h-full bg-[#111] border border-white/10 rounded-3xl overflow-hidden hover:border-orange-500/50 hover:shadow-2xl hover:shadow-orange-900/20 transition-all duration-500 relative"
            >
              {/* Image Section */}
              <div className="relative w-full h-64 overflow-hidden">
                <Image
                  src={blog.coverImage || "/placeholder-travel.jpg"}
                  alt={blog.title}
                  fill
                  priority={index < 3}
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80" />

                {/* 🏷️ Badges (Youtube/FB) */}
                <div className="absolute top-4 right-4 flex gap-2">
                    {blog.youtubeUrl && (
                        <div className="bg-red-600 text-white p-2 rounded-full shadow-lg scale-90 group-hover:scale-100 transition-transform">
                            <Youtube size={16} fill="currentColor" />
                        </div>
                    )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 flex flex-col relative">
                {/* Date & Author */}
                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500 mb-4 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-orange-500" />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                  {blog.author && (
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-orange-500" />
                      <span>{blog.author.userName}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-orange-500 transition-colors">
                  {blog.title}
                </h3>

                {/* Excerpt */}
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                  {blog.excerpt || "Click to read the full story and watch the video..."}
                </p>

                {/* Footer Link */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <span className="text-white/40 text-xs group-hover:text-white transition-colors">Read Story</span>
                    <div className="bg-white/5 p-2 rounded-full text-white group-hover:bg-orange-600 transition-colors">
                        <ArrowRight size={16} />
                    </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}