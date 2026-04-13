"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";
import { Zap, ArrowRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export function StaticNavbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 bg-white border-b-2 border-slate-200 py-4 shadow-sm",
      scrolled ? "py-3 shadow-solid" : "py-5"
    )}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-16">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="bg-google-blue p-2.5 rounded-2xl shadow-xl shadow-google-blue/20 group-hover:scale-110 transition-transform duration-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                  Visi<span className="text-google-blue">Track</span>
                </span>
            </Link>
            
            <div className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Home", href: "/" },
                { name: "Events", href: "/events" },
                { name: "Features", href: "/#features" },
                { name: "About", href: "/about" },
                { name: "Pricing", href: "/pricing" },
                { name: "Contact", href: "/contact" }
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-bold text-slate-700 hover:text-google-blue transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Button asChild className="bg-slate-900 hover:bg-black text-white font-black text-[10px] tracking-widest uppercase px-8 h-12 rounded-xl shadow-xl shadow-black/10 transition-all">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="outline" className="hidden sm:flex border-2 border-google-blue/20 text-google-blue font-bold px-8 h-12 rounded-xl hover:bg-google-blue/5">
                  <Link href="/register">Register</Link>
                </Button>
                <Button asChild className="bg-google-blue hover:bg-google-blue/90 text-white font-bold px-8 h-12 rounded-xl shadow-xl shadow-google-blue/20">
                  <Link href="/login">Get Demo</Link>
                </Button>
              </>
            )}
            <button className="lg:hidden p-2 text-slate-900">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
