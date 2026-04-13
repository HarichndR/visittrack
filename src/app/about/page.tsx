"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  History, 
  Lightbulb, 
  ShieldCheck, 
  HeartHandshake
} from "lucide-react";
import { StaticNavbar as Navbar } from "@/components/static/navbar";
import { StaticFooter as Footer } from "@/components/static/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center bg-indigo-50/30">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 tracking-tighter uppercase italic">Our Mission</h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed font-bold italic">
          At <span className="text-indigo-600">VisiTrack</span>, our mission is to revolutionize event management by making it simpler, more efficient, and more enjoyable for everyone involved.
        </p>
      </section>

      {/* Story Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">Revolutionizing Events.</h2>
            <p className="text-muted-foreground font-bold leading-relaxed">
              Visitrack was founded with a clear goal: to simplify the complex world of event management. We understand the challenges organizers face, and we&rsquo;re here to provide an all-in-one platform that streamlines every step of the process.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
              <div className="flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-indigo-600">
                <Users className="h-5 w-5" />
                <span>1.2M+ Attendees Managed</span>
              </div>
              <div className="flex items-center space-x-3 text-sm font-black uppercase tracking-widest text-indigo-600">
                <History className="h-5 w-5" />
                <span>500+ Events Successfully Organized</span>
              </div>
            </div>
          </motion.div>
          <div className="bg-indigo-600 aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative group">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575861501-7ce0e220648c?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60" />
             <div className="absolute inset-x-8 bottom-8 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <p className="text-white font-black italic tracking-tighter uppercase text-xl">&quot;Making event management simpler, more efficient, and more enjoyable.&quot;</p>
             </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-950 text-white px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Our Core Identity</h2>
            <p className="text-muted-foreground font-bold tracking-widest text-xs uppercase mt-2">The principles that drive our innovation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Lightbulb, name: "Innovation", desc: "Delivering cutting-edge solutions for modern event challenges." },
              { icon: ShieldCheck, name: "Security", desc: "Prioritizing data privacy and platform reliability at every level." },
              { icon: Users, name: "Community", desc: "Building strong relationships with our clients and stakeholders." }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all group shadow-2xl">
                <div className="mb-6 p-4 bg-indigo-600/10 rounded-2xl w-fit group-hover:scale-110 transition-transform">
                  <item.icon className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight mb-3">{item.name}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-6">&quot;Transforming how expos are managed.&quot;</h2>
          <Button asChild className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 font-bold text-lg rounded-xl shadow-xl shadow-indigo-600/20">
              <Link href="/contact" className="flex items-center">Get in Touch →</Link>
          </Button>
      </section>

      <Footer />
    </div>
  );
}
