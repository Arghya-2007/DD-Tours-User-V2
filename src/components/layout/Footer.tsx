import Link from "next/link";
import {
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  MapPin, Phone, Mail, ArrowRight
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* 1. Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-white text-xl">
                DD
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                DD Tours
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Crafting unforgettable journeys since 2020. We believe in sustainable, immersive, and hassle-free travel experiences for the modern explorer.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-orange-600 hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Explore</h3>
            <ul className="space-y-4">
              {[
                { label: "All Tours", href: "/tours" },
                { label: "Travel Blogs", href: "/blogs" },
                { label: "Wall of Love", href: "/reviews" },
                { label: "About Us", href: "/about" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-zinc-400 hover:text-orange-500 text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-zinc-600 group-hover:bg-orange-500 transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-400 text-sm">
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span>123 Adventure Lane, Tech City,<br />Kolkata, WB 700001</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Phone size={18} className="text-orange-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-400 text-sm">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <span>support@ddtours.in</span>
              </li>
            </ul>
          </div>

          {/* 4. Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6">Newsletter</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-orange-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                className="absolute right-1.5 top-1.5 p-1.5 bg-orange-600 rounded-lg text-white hover:bg-orange-700 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} DD Tours & Travels. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-500 hover:text-white text-xs">Privacy Policy</Link>
            <Link href="#" className="text-zinc-500 hover:text-white text-xs">Terms of Service</Link>
            <Link href="#" className="text-zinc-500 hover:text-white text-xs">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};