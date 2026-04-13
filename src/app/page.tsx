"use client";

import { StaticNavbar } from "@/components/static/navbar";
import { StaticFooter } from "@/components/static/footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";
import {
  Users,
  QrCode,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  Globe,
  Star,
  Quote,
  Check
} from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Easy Registration",
    desc: "Streamline your event registration process with our user-friendly platform. Adaptive flows built for enterprise speed.",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    icon: Users,
    color: "bg-google-blue"
  },
  {
    title: "Real-time Analytics",
    desc: "Get instant insights into your event attendance and engagement. Interactive dashboards for data-driven decisions.",
    image: "https://images.unsplash.com/photo-1551288049-bbbda536339a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    icon: BarChart3,
    color: "bg-google-red"
  },
  {
    title: "Quick Check-in",
    desc: "Efficient check-in process with QR code scanning and digital badges. Rapid validation in under one second.",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    icon: QrCode,
    color: "bg-google-green"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Director",
    content: "VisiTrack has completely transformed how we manage our events. The check-in process is seamless, and the analytics provide invaluable insights.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Michael Chen",
    role: "Marketing Manager",
    content: "The platform's ease of use and comprehensive features have made event management a breeze. Highly recommended for any serious event organizer.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
  },
  {
    name: "Emily Rodriguez",
    role: "Conference Organizer",
    content: "Visitrack's digital badges and real-time analytics have significantly improved our event experience. It's truly a game-changer.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily"
  }
];

const faqs = [
  {
    q: "How does Visitrack handle event registration?",
    a: "Visitrack provides a customizable registration portal that supports multiple ticket tiers, automated email confirmations, and instant QR pass generation."
  },
  {
    q: "Can I customize the check-in process?",
    a: "Yes. Our check-in system is fully customizable. You can define specific gates, VIP entry points, and visual ID verification protocols for security staff."
  },
  {
    q: "What kind of analytics does Visitrack provide?",
    a: "We provide real-time occupancy tracking, attendee demographic breakdowns, exhibitor lead velocity, and peak entry-time heatmaps."
  },
  {
    q: "Is Visitrack suitable for both small and large events?",
    a: "Designed for scale. Whether it's a 50-person workshop or a 50,000-attendee summit, Visitrack's infrastructure handles the load without latency."
  }
];

const partners = [
  { name: "Google", color: "text-slate-400" },
  { name: "Microsoft", color: "text-slate-400" },
  { name: "Triangle", color: "text-slate-400" },
  { name: "Circle", color: "text-slate-400" },
  { name: "Polygon", color: "text-slate-400" }
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-google-blue/15 selection:text-google-blue overflow-x-hidden">
      <StaticNavbar />

      <main>
        {/* HERO SECTION WITH VIDEO */}
        <section className="relative h-[100vh] w-full flex items-end justify-start overflow-hidden">
           {/* YouTube Background Video Overlay */}
           <div className="absolute inset-0 z-0 bg-black/60">
              <iframe 
                className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-125 brightness-[0.4] contrast-[1.1]"
                src="https://www.youtube.com/embed/qcTG5NXzuR0?autoplay=1&mute=1&controls=0&loop=1&playlist=qcTG5NXzuR0&showinfo=0&rel=0&iv_load_policy=3" 
                frameBorder="0" 
                allow="autoplay; encrypted-media" 
                allowFullScreen
              ></iframe>
              {/* Dynamic Vignette Effect */}
              <div className="absolute inset-0 bg-radial-[at_bottom_left] from-google-blue/10 via-transparent to-black/80 pointer-events-none" />
           </div>
           
           <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 pb-20 md:pb-32">
              <motion.div
                initial={{ opacity: 0, x: -60, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-slate-950 border-2 border-slate-800 rounded-[3.5rem] px-10 md:px-16 py-12 md:py-20 text-left text-white max-w-3xl overflow-hidden group"
              >
                <h1 className="relative z-10 text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
                  Experience <br/> 
                  <span className="text-google-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">Precision Events</span>
                </h1>
                
                <p className="relative z-10 mt-8 max-w-xl text-lg md:text-xl font-bold tracking-tight text-white/80 leading-relaxed border-l-2 border-white/10 pl-6">
                  VisiTrack delivers high-fidelity event management. Real-time scanning, cloud-native analytics, and seamless attendee flows.
                </p>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-start gap-6 pt-12">
                   <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-google-blue hover:bg-google-blue/90 text-white font-black uppercase italic tracking-widest text-sm transition-all hover:translate-y-[-4px] active:translate-y-0">
                      <Link href={user ? "/dashboard" : "/register"}>{user ? "Jump to Hub" : "Initialize Portal"}</Link>
                   </Button>
                   <Button asChild size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-2 border-slate-700 bg-slate-900 text-white font-black uppercase italic tracking-widest text-sm hover:bg-white hover:text-slate-900 transition-all hover:translate-y-[-4px]">
                      <Link href="/events">Explore Calendar</Link>
                   </Button>
                </div>
              </motion.div>
           </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-32 bg-white">
           <div className="mx-auto max-w-7xl px-6 lg:px-12">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic">
                  Features Optimized for Control
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-12">
                 {features.map((feature, idx) => (
                    <motion.div 
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                       <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden mb-8 transition-transform duration-500 group-hover:-translate-y-2">
                          <img src={feature.image} alt={feature.title} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                          <div className={cn("absolute top-6 right-6 h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg", feature.color)}>
                             <feature.icon className="h-5 w-5" />
                          </div>
                       </div>
                       <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-4">{feature.title}</h3>
                       <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-32 bg-slate-50/50">
           <div className="mx-auto max-w-7xl px-6 lg:px-12">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 uppercase italic">
                          About <span className="text-google-blue">VisiTrack</span>
                       </h2>
                       <p className="text-lg text-slate-600 font-medium leading-relaxed">
                          Visitrack is a leading event management platform that helps organizations streamline their event processes. Our mission is to make event management simple, efficient, and enjoyable for everyone involved.
                       </p>
                    </div>

                    <div className="space-y-4">
                       {[
                         "Easy-to-use platform for event registration and management",
                         "Real-time analytics and reporting for better decision making",
                         "Secure and reliable platform trusted by leading organizations"
                       ].map(item => (
                          <div key={item} className="flex items-center gap-4 group">
                             <div className="h-6 w-6 rounded-full bg-google-blue/10 flex items-center justify-center group-hover:bg-google-blue transition-colors">
                                <Check className="h-3 w-3 text-google-blue group-hover:text-white" />
                             </div>
                             <span className="text-sm font-bold text-slate-700">{item}</span>
                          </div>
                       ))}
                    </div>

                    <Button asChild className="h-14 px-10 bg-google-blue text-white font-black uppercase text-[10px] tracking-widest rounded-xl">
                       <Link href="/about">Learn More</Link>
                    </Button>
                 </div>

                 <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                      alt="Event" 
                      className="relative z-10 rounded-[3rem] shadow-3xl border-8 border-white w-full h-[500px] object-cover"
                    />
                 </div>
              </div>
           </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-32 bg-white">
           <div className="mx-auto max-w-7xl px-6 lg:px-12">
              <div className="text-center mb-20 text-slate-900">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
                  Client Feedback
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {testimonials.map((t, idx) => (
                    <Card key={idx} className="bg-slate-50 border-none rounded-[3rem] p-10 hover:shadow-xl transition-all group">
                       <Quote className="h-8 w-8 text-google-red opacity-10 mb-6 group-hover:opacity-100 transition-opacity" />
                       <p className="text-sm font-bold text-slate-600 leading-relaxed mb-8 italic">
                          "{t.content}"
                       </p>
                       <div className="flex items-center gap-4">
                          <img src={t.image} alt={t.name} className="h-14 w-14 rounded-2xl object-cover bg-white p-1" />
                          <div>
                             <h4 className="font-black text-slate-900 text-sm uppercase">{t.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                          </div>
                       </div>
                    </Card>
                 ))}
              </div>
           </div>
        </section>

        {/* TRUSTED BY */}
        <section className="py-20 bg-slate-50/30 overflow-hidden">
           <div className="mx-auto max-w-7xl px-6 lg:px-12 text-center">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-12">Trusted by Global Entities</h3>
              <div className="flex flex-wrap items-center justify-center gap-16 md:gap-24 grayscale opacity-40">
                 {partners.map(p => (
                    <span key={p.name} className={cn("text-3xl font-black uppercase tracking-tighter italic", p.color)}>{p.name}</span>
                 ))}
              </div>
           </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-32 bg-white">
           <div className="mx-auto max-w-4xl px-6 lg:px-12">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 uppercase italic text-center mb-16">
                 Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                 {faqs.map((f, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-none bg-slate-50 rounded-3xl px-8 overflow-hidden">
                       <AccordionTrigger className="hover:no-underline py-6">
                          <span className="text-left font-black text-slate-900 text-lg">{f.q}</span>
                       </AccordionTrigger>
                       <AccordionContent className="pb-6 text-slate-500 font-medium leading-relaxed">
                          {f.a}
                       </AccordionContent>
                    </AccordionItem>
                 ))}
              </Accordion>
           </div>
        </section>
      </main>

      <StaticFooter />
    </div>
  );
}

// Quick Card proxy for inline use
function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("bg-white text-slate-950 shadow-sm", className)}>{children}</div>;
}
