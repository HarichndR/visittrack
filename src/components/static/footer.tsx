"use client";

import Link from "next/link";
import { Zap, Globe, Share2, Mail, MapPin, Phone, MessageSquare, Info } from "lucide-react";

export function StaticFooter() {
  return (
    <footer className="bg-slate-950 text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          {/* Brand & Social */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="bg-google-blue p-2.5 rounded-2xl shadow-xl shadow-google-blue/20">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter uppercase italic leading-none">
                  Visi<span className="text-google-blue">Track</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-google-blue mt-1">Tracking Simplified</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              Transform your event management experience with our powerful platform. Designed for excellence and global scale.
            </p>
            <div className="flex gap-4">
              {[Globe, Share2, MessageSquare, Info].map((Icon, i) => (
                <Link key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-google-blue hover:border-google-blue transition-all">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-lg font-black tracking-tight uppercase italic">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Events", href: "/events" },
                { name: "Pricing", href: "/pricing" },
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm font-bold text-slate-400 hover:text-google-blue transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <h3 className="text-lg font-black tracking-tight uppercase italic">Features</h3>
            <ul className="space-y-4">
              {[
                "Event Registration",
                "Check-in Management",
                "Event Analytics",
                "Digital Badges",
                "Feedback Collection"
              ].map((item) => (
                <li key={item} className="text-sm font-bold text-slate-400 cursor-default hover:text-white transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-8">
            <h3 className="text-lg font-black tracking-tight uppercase italic">Contact Us</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-google-blue/10 group-hover:border-google-blue transition-colors">
                  <MapPin className="h-4 w-4 text-google-red" />
                </div>
                <p className="text-sm font-bold text-slate-400 leading-relaxed max-w-[200px]">
                  A-407, Ganesh Glory 11 Nr.Bsnl Office, SG highway Jagatpur, Road, Gota, Ahmedabad, Gujarat 382470
                </p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-google-blue/10 group-hover:border-google-blue transition-colors">
                  <Mail className="h-4 w-4 text-google-blue" />
                </div>
                <p className="text-sm font-bold text-slate-400">visitrackinfo@gmail.com</p>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl group-hover:bg-google-blue/10 group-hover:border-google-blue transition-colors">
                  <Phone className="h-4 w-4 text-google-green" />
                </div>
                <p className="text-sm font-bold text-slate-400">+91 97277 72798</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-slate-500 tracking-wide">
            © {new Date().getFullYear()} Visitrack. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

