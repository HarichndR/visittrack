"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Grid3X3, 
  MousePointer2, 
  Save, 
  Settings, 
  Info,
  Building2,
  Search,
  CheckCircle2,
  X,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Stall {
  id: string;
  number: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'ASSIGNING';
  exhibitor?: string;
  category: 'PREMIUM' | 'STANDARD' | 'ECONOMY';
}

export default function StallMapperPage() {
  const [stalls, setStalls] = useState<Stall[]>(
    Array.from({ length: 48 }).map((_, i) => ({
      id: `${i + 1}`,
      number: `${String.fromCharCode(65 + Math.floor(i / 12))}-${100 + (i % 12)}`,
      status: i % 8 === 0 ? 'OCCUPIED' : 'AVAILABLE',
      exhibitor: i % 8 === 0 ? "Global Tech Solutions" : undefined,
      category: i < 12 ? 'PREMIUM' : i < 36 ? 'STANDARD' : 'ECONOMY'
    }))
  );

  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [searchExhibitor, setSearchExhibitor] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  const handleStallClick = (stall: Stall) => {
    if (stall.status === 'OCCUPIED') {
      toast.info(`Stall ${stall.number} is already occupied by ${stall.exhibitor}`);
      return;
    }
    setSelectedStall(stall);
    setIsAssigning(true);
  };

  const assignExhibitor = (exhibitorName: string) => {
    if (!selectedStall) return;
    
    setStalls(prev => prev.map(s => 
      s.id === selectedStall.id 
        ? { ...s, status: 'OCCUPIED', exhibitor: exhibitorName } 
        : s
    ));
    
    toast.success(`Allocated stall ${selectedStall.number} to ${exhibitorName}`);
    setIsAssigning(false);
    setSelectedStall(null);
  };

  const occupiedCount = stalls.filter(s => s.status === 'OCCUPIED').length;
  const occupancyRate = Math.round((occupiedCount / stalls.length) * 100);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold uppercase tracking-tighter text-white">Visual Stall Mapper</h1>
            <p className="text-slate-500 font-medium lowercase tracking-tight">Real-time geospatial floor plan management for Expo 2026 intelligence.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 border-white/5 bg-white/5 hover:bg-white/10 rounded-xl px-6 font-bold uppercase tracking-tighter transition-all hover:scale-105 active:scale-95">
              <Settings className="mr-2 h-4 w-4" />
              Configure Layout
            </Button>
            <Button className="h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 font-bold uppercase tracking-tighter shadow-lg shadow-indigo-600/20 transition-all hover:scale-105 active:scale-95">
              <Save className="mr-2 h-4 w-4 fill-white" />
              Publish Plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <Card className="xl:col-span-3 border-white/5 bg-[#0A0F1E] overflow-hidden rounded-[2.5rem] shadow-2xl">
             <CardHeader className="bg-white/10 border-b border-white/10 p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                   <div className="flex items-center space-x-3">
                      <div className="bg-indigo-500/10 p-2 rounded-lg">
                        <Grid3X3 className="h-5 w-5 text-indigo-500" />
                      </div>
                      <span className="font-black uppercase italic tracking-tighter text-xl text-white">Interactive Floor Grid</span>
                   </div>
                   <div className="flex flex-wrap items-center gap-6 bg-black/60 px-6 py-2.5 rounded-2xl border border-white/10">
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full mr-2 shadow-[0_0_12px_rgba(79,70,229,0.8)]"/> Available
                      </div>
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-[0_0_12px_rgba(239,68,68,0.6)]"/> Occupied
                      </div>
                      <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                        <div className="w-3 h-3 bg-white/20 border border-white/30 rounded-full mr-2"/> Premium
                      </div>
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-10">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-5">
                   {stalls.map((stall) => (
                     <motion.button
                        key={stall.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStallClick(stall)}
                        className={`
                          aspect-square rounded-[1.25rem] border-2 transition-all flex flex-col items-center justify-center gap-2 relative group overflow-hidden
                          ${stall.status === 'AVAILABLE' ? "border-white/20 bg-white/20 hover:border-indigo-500 hover:bg-indigo-500/10" : ""}
                          ${stall.status === 'OCCUPIED' ? "border-red-500 bg-red-500/30" : ""}
                        `}
                     >
                        {/* Stall Category Indicator */}
                        {stall.category === 'PREMIUM' && (
                          <div className="absolute top-0 right-0 p-1 bg-white/10 border-l border-b border-white/20 rounded-bl-lg">
                            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                          </div>
                        )}
                        <span className={`text-[12px] font-black tracking-tighter ${stall.status === 'OCCUPIED' ? "text-red-300" : "text-white"}`}>
                          {stall.number}
                        </span>
                        
                        {stall.status === 'OCCUPIED' ? (
                          <Building2 className="h-5 w-5 text-red-500/30" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-indigo-500/20 group-hover:bg-indigo-500/80 transition-all shadow-[0_0_10px_rgba(79,70,229,0)] group-hover:shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                        )}
                        
                        {stall.exhibitor && (
                          <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-[#0A0F1E] transition-all flex flex-col items-center justify-center p-4 text-center">
                            <Building2 className="h-4 w-4 text-indigo-500 mb-2 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all" />
                            <div className="text-[10px] font-bold uppercase tracking-tighter text-white opacity-0 group-hover:opacity-100 transition-all leading-tight">
                              {stall.exhibitor}
                            </div>
                          </div>
                        )}
                     </motion.button>
                   ))}
                </div>
             </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none shadow-[0_30px_60px_-15px_rgba(79,70,229,0.3)] rounded-[2.5rem] overflow-hidden group">
              <CardContent className="p-8 relative">
                <div className="absolute -right-8 -bottom-8 p-12 opacity-10 group-hover:scale-125 transition-transform duration-700">
                  <BarChart3 className="h-32 w-32" />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Revenue Occupancy</div>
                <div className="text-6xl font-bold tracking-tighter mt-2">{occupancyRate}%</div>
                <div className="mt-8 h-2 w-full bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancyRate}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                  />
                </div>
                <p className="text-[10px] mt-4 font-bold lowercase tracking-tight opacity-70 flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" />
                  {occupiedCount} of {stalls.length} segments allocated.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#0A0F1E] border-white/10 rounded-[2.5rem]">
               <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-sm font-black uppercase italic tracking-tighter">Quick Allocation</CardTitle>
               </CardHeader>
               <CardContent className="p-8 pt-0 space-y-4">
                  <Button variant="outline" className="w-full justify-start h-14 bg-white/5 border-white/5 hover:bg-white/10 hover:border-indigo-500/30 rounded-2xl font-black uppercase italic tracking-tighter text-xs">
                     <Info className="mr-3 h-4 w-4 text-indigo-500" /> Auto-Dense Mapping
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-14 bg-white/5 border-white/5 hover:bg-white/10 hover:border-red-500/30 rounded-2xl font-black uppercase italic tracking-tighter text-xs text-red-400">
                     <X className="mr-3 h-4 w-4" /> Purge Mapping
                  </Button>
               </CardContent>
            </Card>

            <div className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[2.5rem]">
               <div className="flex gap-4">
                  <Info className="h-6 w-6 text-indigo-500 shrink-0 mt-1" />
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed tracking-tight lowercase italic">
                    All geospatial changes are recorded in the <span className="text-indigo-400">Phase 5 audit log</span> for end-to-end data sovereignty and operational compliance.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Dialog */}
      <Dialog open={isAssigning} onOpenChange={setIsAssigning}>
        <DialogContent className="max-w-md bg-[#020617] border-white/5 p-10 rounded-[2.5rem]">
          <DialogHeader className="space-y-4">
            <div className="bg-indigo-500/10 w-16 h-16 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto">
              <Building2 className="h-8 w-8" />
            </div>
            <DialogTitle className="text-3xl font-black uppercase italic tracking-tighter text-center">Assign Exhibitor</DialogTitle>
            <DialogDescription className="text-center text-slate-500 font-medium lowercase italic tracking-tight">
              Select an authorized entity to allocate <span className="text-white font-black">{selectedStall?.number}</span> stall space.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 space-y-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
              <Input 
                placeholder="search premium exhibitors..." 
                className="h-14 pl-12 bg-white/5 border-white/5 focus:border-indigo-500/50 rounded-2xl font-bold italic tracking-tight lowercase shadow-inner"
                value={searchExhibitor}
                onChange={(e) => setSearchExhibitor(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-height-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {["CloudScale Systems", "Future Mobiles Ltd", "Green Energy Corp", "Astra Space Solutions", "Quantum Soft"]
                .filter(name => name.toLowerCase().includes(searchExhibitor.toLowerCase()))
                .map((name, i) => (
                  <button
                    key={i}
                    onClick={() => assignExhibitor(name)}
                    className="w-full flex items-center justify-between p-5 bg-white/5 hover:bg-indigo-600/10 border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all group"
                  >
                    <span className="font-bold lowercase tracking-tight">{name}</span>
                    <CheckCircle2 className="h-4 w-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
                ))}
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button variant="ghost" onClick={() => setIsAssigning(false)} className="h-14 font-black uppercase italic tracking-tighter text-slate-500 hover:text-white">
              Cancel Allocation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
