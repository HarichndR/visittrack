"use client";

import { motion } from "framer-motion";
import { Check, Zap, Rocket, Layers, ShieldCheck } from "lucide-react";
import { StaticNavbar as Navbar } from "@/components/static/navbar";
import { StaticFooter as Footer } from "@/components/static/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "49",
      description: "Perfect for single event organizers and small trade fairs.",
      icon: Rocket,
      features: [
        "Up to 100 Attendees",
        "Basic Management",
        "Email Support",
        "QR Badges",
        "CSV Export"
      ]
    },
    {
      name: "Professional",
      price: "99",
      description: "Designed for scaling exhibitions and multi-day conferences.",
      icon: Layers,
      highlight: true,
      features: [
        "Up to 500 Attendees",
        "Priority Support",
        "Custom Branding",
        "API Access",
        "Advanced Analytics",
        "Custom Badge Designer"
      ]
    },
    {
      name: "Enterprise",
      price: "199",
      description: "Bespoke solutions for global expo management firms.",
      icon: ShieldCheck,
      features: [
        "Unlimited Attendees",
        "Full Suite Features",
        "Custom Integrations",
        "White-label Solution",
        "Dedicated Account Manager",
        "99.9% Uptime SLA"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <section className="pt-40 pb-20 px-4 text-center bg-indigo-50/30">
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">Choose Your Plan</h1>
            <p className="text-xl font-bold text-muted-foreground lowercase italic tracking-tight leading-relaxed px-8">
                Scaling your exhibition performance doesn&rsquo;t have to be complex. Choose the plan that fits your growth.
            </p>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`p-10 rounded-[3rem] border-2 flex flex-col h-full relative transition-all hover:scale-105 ${plan.highlight ? 'bg-indigo-600 border-indigo-600 shadow-3xl text-white' : 'bg-white border-slate-100 shadow-2xl hover:border-indigo-100'}`}
            >
              {plan.highlight && (
                <div className="absolute top-8 right-8">
                    <Badge className="bg-white text-indigo-900 font-black uppercase tracking-widest text-[10px] px-4 py-1">MOST POPULAR</Badge>
                </div>
              )}

              <div className="mb-10">
                <div className={`h-16 w-16 rounded-3xl flex items-center justify-center mb-6 shadow-xl ${plan.highlight ? 'bg-white/10 border border-white/20' : 'bg-indigo-50 text-indigo-600'}`}>
                    <plan.icon className={`h-8 w-8 ${plan.highlight ? 'text-white' : 'text-indigo-600'}`} />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                   <span className="text-sm font-black uppercase tracking-widest text-muted-foreground mr-1">INR</span>
                   <span className="text-5xl font-black italic tracking-tighter">{plan.price}</span>
                   <span className="text-sm font-bold text-muted-foreground">/event</span>
                </div>
                <p className={`text-sm font-bold mt-4 ${plan.highlight ? 'text-indigo-100/60' : 'text-muted-foreground'}`}>{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className={`p-1 rounded-full ${plan.highlight ? 'bg-white/20' : 'bg-indigo-50'}`}>
                        <Check className={`h-4 w-4 ${plan.highlight ? 'text-white' : 'text-indigo-600'}`} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest leading-none">{feature}</span>
                  </div>
                ))}
              </div>

              <Button asChild className={`h-16 w-full font-black text-xl tracking-tighter uppercase rounded-2xl shadow-xl transition-all active:scale-95 ${plan.highlight ? 'bg-white text-indigo-950 hover:bg-slate-100 shadow-black/20' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'}`}>
                <Link href="/register">Get Started →</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-slate-950 text-white text-center px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/5 p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
            <Zap className="absolute top-0 right-0 h-96 w-96 text-white/5 -rotate-12 translate-x-20 -translate-y-20 group-hover:scale-110 transition-transform duration-700" />
            <div className="text-center lg:text-left relative z-10 space-y-4">
                <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">Scale to Unlimited?</h2>
                <p className="text-xl font-bold text-muted-foreground lowercase italic tracking-tight">Need a custom framework for your global event series?</p>
            </div>
            <Button asChild className="h-16 px-16 bg-white text-slate-950 hover:bg-slate-100 font-black text-xl tracking-tighter uppercase rounded-2xl shadow-2xl relative z-10 transition-all hover:scale-105 active:scale-95">
                <Link href="/contact">Inquiry Portal →</Link>
            </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
