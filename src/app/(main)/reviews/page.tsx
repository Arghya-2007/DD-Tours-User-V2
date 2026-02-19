"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Star, MessageSquare, Trash2, Loader2, Plus, X, Image as ImageIcon, Upload
} from "lucide-react";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

// Type based on your API response
interface Review {
  reviewId: string;
  reviewText: string;
  rating: number;
  tourName: string;
  photoUrl?: string; // 🆕 Added Optional Image
  user: {
    userName: string;
  };
  createdAt: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Data State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tourName: "",
    reviewText: "",
    rating: 5,
    photoUrl: "" // Store the URL here after upload
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Animation Refs
  const containerRef = useRef(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Fetch Reviews
  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/reviews");
      setReviews(data.data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // 2. GSAP Staggered Animation
  useLayoutEffect(() => {
    if (!loading && reviews.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(".review-card", {
          y: 50, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out",
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, reviews]);

  // 3. Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Show local preview immediately
    }
  };

  // 4. Handle Submit (Upload First -> Then Post Review)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push("/login");

    setSubmitting(true);
    let finalPhotoUrl = formData.photoUrl;

    try {
      // Step A: Upload Image (if selected)
      if (selectedFile) {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("images", selectedFile); // Key matches backend

        const { data: uploadRes } = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // Backend returns: { data: { urls: ["url1", "url2"] } }
        if (uploadRes.data.urls && uploadRes.data.urls.length > 0) {
            finalPhotoUrl = uploadRes.data.urls[0];
        }
        setUploading(false);
      }

      // Step B: Create Review
      await api.post("/reviews", {
        ...formData,
        photoUrl: finalPhotoUrl,
      });

      // Reset & Close
      setShowModal(false);
      setFormData({ tourName: "", reviewText: "", rating: 5, photoUrl: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchReviews();

    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to post review");
      setUploading(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter((r) => r.reviewId !== reviewId));
    } catch (err) { alert("Failed to delete"); }
  };

  return (
    <div ref={containerRef} className="pb-20">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            WALL OF <span className="text-orange-500">LOVE</span>
          </h1>
          <p className="text-zinc-400 max-w-lg">
            See what our travelers are saying about their adventures.
          </p>
        </div>
        <button
          onClick={() => isAuthenticated ? setShowModal(true) : router.push("/login")}
          className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95"
        >
          {isAuthenticated ? <Plus size={20} /> : <MessageSquare size={20} />}
          {isAuthenticated ? "Write a Review" : "Login to Review"}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500 w-10 h-10" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">No reviews yet. Be the first!</div>
      ) : (
        /* Masonry Grid */
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {reviews.map((review, index) => (
            <div
              key={review.reviewId}
              className="review-card break-inside-avoid relative bg-zinc-900/50 border border-white/10 p-5 rounded-2xl backdrop-blur-sm hover:border-orange-500/30 transition-all group"
            >
              {/* Image (If exists) */}
              {review.photoUrl && (
                <div className="mb-4 rounded-xl overflow-hidden relative w-full h-48">
                  <Image
                    src={review.photoUrl}
                    alt="Trip memory"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {/* User Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center font-bold text-white text-xs">
                    {review.user.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{review.user.userName}</h3>
                    <p className="text-[10px] text-zinc-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-lg">
                  <Star size={12} className="fill-orange-500 text-orange-500" />
                  <span className="text-orange-500 text-xs font-bold">{review.rating}.0</span>
                </div>
              </div>

              {/* Text Content */}
              <h4 className="text-sm font-medium text-white mb-1">{review.tourName}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">"{review.reviewText}"</p>

              {/* Admin Delete */}
              {user?.role === "ADMIN" && (
                <button
                    onClick={() => handleDelete(review.reviewId)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                >
                    <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-bold text-white mb-6">Share Experience</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Tour Name & Rating Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text" required placeholder="Tour Name (e.g. Sikkim)"
                    value={formData.tourName}
                    onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                    className="bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                  />
                  <div className="flex items-center gap-1 justify-center bg-black/50 border border-white/10 rounded-xl px-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="p-1">
                            <Star size={20} className={formData.rating >= star ? "fill-orange-500 text-orange-500" : "text-zinc-600"} />
                        </button>
                    ))}
                  </div>
              </div>

              {/* Review Text */}
              <textarea
                required rows={3} placeholder="What did you love?"
                value={formData.reviewText}
                onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none resize-none text-sm"
              />

              {/* Image Upload Area */}
              <div className="relative group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`border-2 border-dashed rounded-xl p-4 flex items-center justify-center gap-3 transition-all ${previewUrl ? 'border-orange-500/50 bg-orange-500/5' : 'border-zinc-700 bg-black/30 hover:bg-zinc-800'}`}>
                    {previewUrl ? (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden">
                             <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-medium">Click to change</span>
                             </div>
                        </div>
                    ) : (
                        <>
                            <div className="p-2 bg-zinc-800 rounded-full text-zinc-400"><ImageIcon size={20} /></div>
                            <span className="text-sm text-zinc-400">Click to upload a photo (Optional)</span>
                        </>
                    )}
                </div>
              </div>

              <button
                type="submit" disabled={submitting || uploading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {uploading ? "Uploading Image..." : submitting ? "Posting..." : "Post Review"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}