"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, BookOpen, Info, User, LogIn } from "lucide-react"; // 🚨 Added LogIn
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore"; // 🚨 Import your store

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Tours", href: "/tours", icon: Map },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Blogs", href: "/blogs", icon: BookOpen },
  { name: "About Us", href: "/about", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-[#0a0a0a] border-r border-white/10 fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">
          DD <span className="text-orange-500">Tours</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 🚨 DYNAMIC Profile Section (Bottom) */}
      <div className="p-4 border-t border-white/10">
        {isAuthenticated ? (
          // LOGGED IN STATE
          <Link
            href="/profile"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20 transition-transform group-hover:scale-105">
                {/* Show the first letter of their name */}
                {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
            </div>
            <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate w-32">{user?.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-orange-500">Operative Active</p>
            </div>
          </Link>
        ) : (
          // LOGGED OUT STATE
          <Link
            href="/login"
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <LogIn size={20} />
            </div>
            <div>
                <p className="text-sm font-bold text-white">Sign In</p>
                <p className="text-xs text-zinc-500">Join DD Tours</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}