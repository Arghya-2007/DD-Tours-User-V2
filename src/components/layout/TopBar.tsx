"use client";
import Link from "next/link";
import { Bell, Search, User } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-4">
          {/* Mobile Logo (Visible only on Mobile) */}
          <div className="md:hidden font-bold text-xl text-white">
            DD <span className="text-orange-500">Tours</span>
          </div>

          {/* Desktop Search Bar (Hidden on Mobile) */}
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
          {/* Notification Bell (Always Visible) */}
          <button className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#0a0a0a]"></span>
          </button>

          {/* Mobile Profile Icon (Visible ONLY on Mobile) */}
          <Link
            href="/profile"
            className="md:hidden w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20"
          >
            <User size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}