"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Loader2, Youtube, Facebook, Share2 } from "lucide-react";
import { api } from "@/lib/axios";

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  coverImage?: string;
  youtubeUrl?: string;  // 🆕
  facebookUrl?: string; // 🆕
  author?: { userName: string };
  createdAt: string;
}

export default function SingleBlogPage() {
  const params = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await api.get(`/blogs/${params.slug}`);
        setBlog(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params.slug) fetchBlog();
  }, [params.slug]);

  // Helper to get YouTube Embed ID
  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh]">
      <Loader2 className="animate-spin text-orange-500 w-12 h-12" />
    </div>
  );

  if (!blog) return (
    <div className="text-center py-32">
      <h2 className="text-3xl font-bold text-white mb-6">Story Not Found</h2>
      <Link href="/blogs" className="px-6 py-3 bg-orange-600 rounded-full text-white font-bold hover:bg-orange-700">Return Home</Link>
    </div>
  );

  return (
    <article className="pb-20">

      {/* 🔙 Back Button (Floating) */}
      <button
        onClick={() => router.back()}
        className="fixed top-24 left-4 md:left-8 z-50 bg-black/50 backdrop-blur-md p-3 rounded-full text-white hover:bg-orange-600 transition-all border border-white/10 hidden xl:flex"
      >
        <ArrowLeft size={24} />
      </button>

      {/* 🖼️ Hero Section (Parallax Style) */}
      <div className="relative w-full h-[50vh] md:h-[70vh] rounded-3xl overflow-hidden mb-12 group">
        <Image
          src={blog.coverImage || "/placeholder-travel.jpg"}
          alt={blog.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-[2s]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-300 mb-6 uppercase tracking-wider">
                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                        <Calendar size={16} className="text-orange-500" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                    </span>
                    {blog.author && (
                        <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                            <User size={16} className="text-orange-500" />
                            {blog.author.userName}
                        </span>
                    )}
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-4 drop-shadow-2xl">
                    {blog.title}
                </h1>
            </div>
        </div>
      </div>

      {/* 📄 Content Container */}
      <div className="max-w-3xl mx-auto px-4">

        {/* Body Text */}
        <div
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="prose prose-lg prose-invert max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-2xl prose-img:shadow-xl"
        />

        {/* 🎥 Video Embed Section */}
        {blog.youtubeUrl && getYoutubeEmbedUrl(blog.youtubeUrl) && (
            <div className="mt-16 mb-10">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Youtube className="text-red-600" /> Watch the Vlog
                </h3>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                    <iframe
                        src={getYoutubeEmbedUrl(blog.youtubeUrl)!}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    ></iframe>
                </div>
            </div>
        )}

        {/* 🔗 External Links / Socials */}
        {(blog.facebookUrl || blog.youtubeUrl) && (
            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-zinc-400 font-medium">Liked this story? Check us out on social media.</div>
                <div className="flex gap-4">
                    {blog.facebookUrl && (
                        <a href={blog.facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold transition-all hover:-translate-y-1">
                            <Facebook size={20} /> Facebook
                        </a>
                    )}
                    {blog.youtubeUrl && (
                        <a href={blog.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#FF0000] hover:bg-[#d90000] text-white font-bold transition-all hover:-translate-y-1">
                            <Youtube size={20} /> Channel
                        </a>
                    )}
                </div>
            </div>
        )}

      </div>
    </article>
  );
}