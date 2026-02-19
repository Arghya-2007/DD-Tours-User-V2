"use client";
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore"; // 🚨 Import your store

export function TopBar() {
  // 🚨 Pull state from Zustand
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          {/* Mobile Logo */}
          <Link href="/" className="md:hidden font-bold text-xl text-white tracking-tighter">
            DD <span className="text-orange-500">Tours</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 focus-within:border-orange-500/50 transition-colors w-96">
            <Search size={18} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search tours, destinations..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-500 w-full"
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0a0a0a]"></span>
          </button>

          {/* 🚨 DYNAMIC Mobile Profile Icon */}
          {isAuthenticated ? (
            <Link
              href="/profile"
              className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-orange-500/20"
            >
              {user?.name?.charAt(0).toUpperCase() || <User size={16} />}
            </Link>
          ) : (
            <Link
              href="/login"
              className="md:hidden text-[10px] font-bold uppercase tracking-widest text-orange-500 border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 rounded-full hover:bg-orange-500 hover:text-white transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}