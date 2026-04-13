"use client";

import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  QrCode,
  CheckCircle2,
  Loader2,
  Scan,
  ShieldCheck,
  History,
  Zap,
  Activity,
  User,
  AlertCircle
} from "lucide-react";
import api from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VisitorData {
  _id: string;
  name: string;
  email: string;
  organizationName?: string;
  avatarUrl?: string;
  ticketType?: string;
  status?: string;
}

export default function ScannerPage() {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [visitorId, setVisitorId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentScans, setRecentScans] = useState<VisitorData[]>([]);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    visitor?: VisitorData;
  } | null>(null);

  const handleInputChange = (val: string) => {
    setVisitorId(val);
    if (result) setResult(null); // Clear result immediately on new scan attempt
  };

  // Auto-focus the input for continuous scanning
  useEffect(() => {
    inputRef.current?.focus();
  }, [result, isLoading]);

  const getErrorMessage = (error: unknown): string | undefined => {
    if (typeof error !== 'object' || error === null) return undefined;
    const errObj = error as { response?: { data?: { message?: unknown } } };
    return typeof errObj.response?.data?.message === 'string' ? errObj.response.data.message : undefined;
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorId) return;

    setIsLoading(true);
    setResult(null);
    try {
      const response = await api.post(`/visitors/${visitorId}/check-in`);
      const visitor = response.data.data;
      
      setResult({
        success: true,
        message: "Identity Authorized: Entry Permitted",
        visitor
      });

      // Add to recent scans history (keep last 5)
      setRecentScans(prev => [visitor, ...prev.slice(0, 4)]);

      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      queryClient.invalidateQueries({ queryKey: ["visitors"] });

      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setResult({
        success: false,
        message: errorMessage || "Invalid pass or access denied"
      });
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate(400);
      }
    } finally {
      setIsLoading(false);
      setVisitorId("");
      // Refocus happens via useEffect
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10 pb-20">
        <header className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-google-blue/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-google-blue/5">
            <ShieldCheck className="h-8 w-8 text-google-blue" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase italic">Verification Scanner</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Entry Terminal | Main Entrance</p>
        </header>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Main Scanner Card */}
          <div className="lg:col-span-3">
            <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-google-blue via-google-green to-google-red pr-0" />

              <CardHeader className="text-center pt-12 pb-6">
                <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900 italic">Entry Validation</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Scan participant QR code</CardDescription>
              </CardHeader>

              <CardContent className="px-10 pb-12 space-y-10">
                <div className="relative aspect-square max-w-[280px] mx-auto bg-slate-50 rounded-[3rem] border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group">
                  <div className="absolute inset-8 border-2 border-dashed border-google-blue/20 rounded-[2rem] animate-pulse" />
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-google-blue/50 shadow-[0_0_15px_rgba(66,133,244,0.5)] animate-scan-line-fast" />
                  <QrCode className="h-20 w-20 text-slate-200 group-hover:text-google-blue transition-colors duration-500" />
                  <div className="absolute bottom-6 flex items-center gap-2">
                    <Activity className="h-3 w-3 text-google-blue animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Scanner Ready</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <form onSubmit={handleScan} className="flex flex-col gap-4">
                    <div className="relative">
                      <User className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-300" />
                      <Input
                        ref={inputRef}
                        placeholder="SCAN PASS OR INPUT ID..."
                        value={visitorId || ""}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="h-16 pl-14 bg-slate-50 border-slate-200 text-center text-lg font-black tracking-[0.2em] placeholder:text-slate-200 rounded-2xl focus:ring-google-blue/20 transition-all font-mono uppercase"
                        autoComplete="off"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !visitorId}
                      className="h-16 bg-google-blue hover:bg-google-blue/90 text-white font-black text-xs tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-google-blue/20 active:scale-95 transition-all"
                    >
                      {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="flex items-center gap-2"><Scan className="h-5 w-5" /> VALIDATE ENTRY</div>}
                    </Button>
                  </form>
                </div>

                <AnimatePresence mode="wait">
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className={`p-8 rounded-[2.5rem] border-2 shadow-2xl ${result.success ? "bg-google-green/5 border-google-green/20" : "bg-google-red/5 border-google-red/20"}`}
                    >
                      <div className="flex flex-col items-center gap-6 text-center">
                        {result.success ? (
                          <div className="p-5 bg-google-green/10 rounded-full shadow-lg shadow-google-green/5">
                            <CheckCircle2 className="h-12 w-12 text-google-green" />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-5 bg-google-red/10 rounded-full shadow-lg shadow-google-red/5">
                              <AlertCircle className="h-12 w-12 text-google-red" />
                            </div>
                            <Button 
                              variant="ghost" 
                              onClick={() => { setVisitorId(""); inputRef.current?.focus(); }}
                              className="text-[9px] font-black uppercase tracking-widest text-google-red hover:bg-google-red/5 px-4 h-8 rounded-full border border-google-red/20"
                            >
                              Tap to clear & retry
                            </Button>
                          </div>
                        )}
                        <div className="space-y-2">
                          <h3 className={`text-3xl font-black uppercase italic tracking-tighter ${result.success ? "text-google-green" : "text-google-red"}`}>
                            {result.success ? "Access Granted" : "Entry Denied"}
                          </h3>
                          <div className={cn(
                            "px-6 py-2 rounded-xl inline-block",
                            result.success ? "bg-google-green/10 text-google-green" : "bg-google-red/10 text-google-red"
                          )}>
                            <p className="font-black uppercase tracking-widest text-[10px]">
                              {result.message}
                            </p>
                          </div>
                        </div>

                        {result.success && result.visitor && (
                          <div className="w-full mt-6 perspective-1000">
                            <motion.div 
                              initial={{ rotateX: -20, opacity: 0 }}
                              animate={{ rotateX: 0, opacity: 1 }}
                              className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-google-green/5 rounded-bl-[5rem] -mr-8 -mt-8 flex items-center justify-center pt-8 pl-8">
                                    <ShieldCheck className="h-8 w-8 text-google-green/40" />
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-10">
                                    {/* Identity Portait */}
                                    <div className="relative">
                                        <div className="h-44 w-44 rounded-[3.5rem] bg-slate-50 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                            {result.visitor.avatarUrl ? (
                                                <img src={result.visitor.avatarUrl} alt="ID" className="h-full w-full object-cover" />
                                            ) : (
                                                <User className="h-20 w-20 text-slate-200" />
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 bg-google-green text-white p-3 rounded-2xl shadow-lg">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                    </div>

                                    {/* Identity Details */}
                                    <div className="flex-1 text-center md:text-left space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center md:justify-start gap-2">
                                                <Badge className="bg-google-blue text-white font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full border-none shadow-lg shadow-google-blue/20">
                                                    {result.visitor.ticketType || 'Standard Entry'}
                                                </Badge>
                                                <Badge className="bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full border-none">
                                                    {result.visitor.status === 'CHECKED_IN' ? 'ACTIVE' : 'VALIDATED'}
                                                </Badge>
                                            </div>
                                            <h4 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-tight">
                                                {result.visitor.name}
                                            </h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                {result.visitor.organizationName || 'Independent Participant'}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                            <div className="bg-slate-50/50 p-4 rounded-3xl">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Clearance Time</p>
                                                <p className="text-sm font-black text-slate-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="bg-slate-50/50 p-4 rounded-3xl">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Pass Sequence</p>
                                                <p className="text-sm font-black text-slate-700 font-mono">#{result.visitor._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Side History & Stats */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium h-full min-h-[500px] flex flex-col">
              <CardHeader className="p-10 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-xl">
                    <History className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase italic tracking-tight text-slate-900">Recent History</CardTitle>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live portal activity log</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 flex-1">
                <div className="space-y-4">
                  {recentScans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20 space-y-4">
                      <Activity className="h-10 w-10" />
                      <p className="text-[10px] font-black uppercase tracking-[0.4em]">Listening for Input...</p>
                    </div>
                  ) : (
                    recentScans.map((scan, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={`${scan._id}-${index}`}
                        className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:bg-white hover:border-google-green/20 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center font-black text-google-green italic text-xs">
                            {scan.name?.charAt(0) || 'V'}
                          </div>
                          <div>
                            <p className="text-[11px] font-black uppercase text-slate-900 tracking-tight leading-none mb-1">{scan.name}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{scan.organizationName || 'Individual'}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className="bg-google-green/10 text-google-green border-none text-[8px] font-black px-2 py-0.5 rounded-md">
                            AUTHORIZED
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border border-slate-200/60 rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-1 shadow-sm">
                <div className="text-2xl font-black italic tracking-tighter text-slate-900">124</div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Total Clearances</p>
              </Card>
              <Card className="bg-white border border-slate-200/60 rounded-[2rem] p-6 flex flex-col items-center justify-center space-y-1 shadow-sm">
                <div className="text-2xl font-black italic tracking-tighter text-slate-900 text-google-green">ONLINE</div>
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">System Status</p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-line-fast {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .animate-scan-line-fast {
          animation: scan-line-fast 2s infinite ease-in-out;
        }
      `}</style>
    </DashboardLayout>
  );
}
