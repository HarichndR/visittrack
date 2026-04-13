"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Zap } from "lucide-react";
import { StaticNavbar as Navbar } from "@/components/static/navbar";
import { StaticFooter as Footer } from "@/components/static/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      
      <section className="pt-40 pb-20 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-6xl font-bold uppercase tracking-tighter leading-none">Get in Touch</h1>
              <p className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase">VisiTrack Support & Sales Hub</p>
            </motion.div>

            <div className="grid gap-6">
              {[
                { icon: Mail, label: "Email Support", value: "connect@visitrack.in", desc: "For general inquiries and tech support." },
                { icon: Phone, label: "Call Center", value: "+91 98765 43210", desc: "Available Mon-Fri, 9AM to 6PM IST." },
                { icon: MapPin, label: "Headquarters", value: "Ahmedabad, Gujarat, India", desc: "Visit our innovation lab." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-indigo-500/30 transition-all">
                  <div className="h-14 w-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <item.icon className="h-7 w-7 text-indigo-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                    <p className="text-xl font-bold tracking-tight">{item.value}</p>
                    <p className="text-xs font-medium text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-8 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
                <Zap className="absolute -bottom-10 -right-10 h-32 w-32 text-white/10 group-hover:rotate-12 transition-transform" />
                <h3 className="text-xl font-bold uppercase tracking-tighter mb-2">Immediate Assistance?</h3>
                <p className="text-indigo-100 text-sm font-bold">Our average response time for high-tier accounts is under 45 minutes.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 p-10 rounded-[2.5rem] border border-white/5 shadow-3xl backdrop-blur-md"
          >
            <div className="mb-10 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-indigo-500" />
                </div>
                <h2 className="text-3xl font-bold uppercase tracking-tighter">Submit Request</h2>
                <p className="text-muted-foreground font-bold text-xs uppercase tracking-widest">Global response grid active</p>
            </div>

            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                  <Input 
                    placeholder="Enter Name" 
                    className="h-14 bg-white/5 border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl focus:ring-indigo-600/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Business Email</label>
                  <Input 
                    placeholder="Connect@Company" 
                    className="h-14 bg-white/5 border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl focus:ring-indigo-600/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                <Input 
                  placeholder="Inquiry Type" 
                  className="h-14 bg-white/5 border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl focus:ring-indigo-600/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message Grid</label>
                <Textarea 
                  placeholder="How can we help you scale your next event?" 
                  className="min-h-[150px] bg-white/5 border-white/10 font-bold uppercase tracking-widest text-xs rounded-xl focus:ring-indigo-600/50 p-4"
                />
              </div>
              <Button className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 font-bold text-xl tracking-tighter uppercase rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                <Send className="mr-2 h-6 w-6" />
                SEND MESSAGE
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
