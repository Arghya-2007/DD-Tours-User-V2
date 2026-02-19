"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, MessageSquare, BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Tours", href: "/tours", icon: Map },
  { name: "Reviews", href: "/reviews", icon: MessageSquare },
  { name: "Blogs", href: "/blogs", icon: BookOpen },
  { name: "About Us", href: "/about", icon: Info },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-white/10 z-50 pb-safe">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1",
                isActive ? "text-orange-500" : "text-zinc-500"
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}