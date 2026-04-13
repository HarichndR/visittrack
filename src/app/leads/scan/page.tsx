"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    QrCode,
    Activity,
    Sparkles,
    ArrowRight,
    User,
    Star,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/store/use-auth";

interface LeadVisitorData {
    _id: string;
    name: string;
    organizationName?: string;
    email?: string;
    v_id?: string;
}

export default function LeadScannerPage() {
    const { user } = useAuth();
    const [visitorId, setVisitorId] = useState("");
    const [visitorData, setVisitorData] = useState<LeadVisitorData | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [loading, setLoading] = useState(false);

    // Lead enrichment states
    const [rating, setRating] = useState(3);
    const [interestLevel, setInterestLevel] = useState("WARM");
    const [notes, setNotes] = useState("");

    const handleVerifyId = async (idToVerify: string) => {
        if (!idToVerify) return;
        setLoading(true);
        try {
            const response = await api.get(`/visitors/${idToVerify}`);
            setVisitorData(response.data.data);
            toast.success("Identity Verified", {
                description: `Visitor: ${response.data.data.name}`
            });
        } catch {
            toast.error("Verification Failed", {
                description: "No active participant found with this ID."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCaptureLead = async () => {
        if (!visitorData) return;
        setLoading(true);
        try {
            await api.post('/leads', {
                visitorId: visitorData._id,
                capturedBy: user?._id,
                rating,
                interestLevel,
                notes
            });
            toast.success("Lead Captured Successfully", {
                description: `${visitorData.name} has been added to your inventory.`
            });
            resetFlow();
        } catch {
            toast.error("Capture Error", {
                description: "Unable to process lead at this time."
            });
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setVisitorData(null);
        setVisitorId("");
        setRating(3);
        setInterestLevel("WARM");
        setNotes("");
    };

    return (
        <DashboardLayout>
            <div className="max-w-2xl mx-auto space-y-10 pb-20">
                <header className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-google-blue/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-google-blue/5">
                        <Sparkles className="h-8 w-8 text-google-blue" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase">Lead Scanner</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instant Visitor Enrichment Interface</p>
                </header>

                <AnimatePresence mode="wait">
                    {!visitorData ? (
                        <motion.div
                            key="scan-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden overflow-hidden relative group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-google-blue via-google-red to-google-yellow" />
                                <CardHeader className="text-center pt-12 pb-6">
                                    <CardTitle className="text-xl font-bold uppercase text-slate-900 tracking-tight">Start Scan</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Position badge within range or enter manual ID</CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 space-y-10">
                                    <div className="relative aspect-square max-w-[300px] mx-auto bg-slate-50 rounded-[3rem] border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group">
                                        <div className={cn(
                                            "absolute inset-0 border-[6px] border-google-blue transition-all duration-500",
                                            isScanning ? "opacity-100 scale-100" : "opacity-0 scale-110"
                                        )} />

                                        {!isScanning ? (
                                            <div className="flex flex-col items-center gap-6">
                                                <QrCode className="h-20 w-20 text-slate-200 group-hover:text-google-blue transition-colors" />
                                                <Button
                                                    disabled={loading}
                                                    onClick={() => {
                                                        if (!visitorId) {
                                                            toast.error("Input Required", {
                                                                description: "Please enter or scan a Participant ID to begin verification.",
                                                            });
                                                            return;
                                                        }
                                                        setIsScanning(true);
                                                        setTimeout(() => {
                                                            handleVerifyId(visitorId);
                                                        }, 1500);
                                                    }}
                                                    className="relative z-20 bg-slate-900 hover:bg-black text-white px-8 py-6 rounded-2xl font-bold uppercase tracking-widest text-xs h-auto shadow-xl shadow-black/20"
                                                >
                                                    Activate Scanner
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-6 animate-pulse">
                                                <Activity className="h-16 w-16 text-google-blue" />
                                                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-google-blue">Scanning in progress...</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-slate-100"></span>
                                        </div>
                                        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                                            <span className="bg-white px-6 text-slate-300">Manual ID Entry</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="ENTER PARTICIPANT ID..."
                                                className="pl-12 h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest focus:ring-google-blue/20"
                                                value={visitorId || ""}
                                                onChange={(e) => setVisitorId(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            disabled={!visitorId || loading}
                                            onClick={() => handleVerifyId(visitorId)}
                                            className="h-14 w-14 p-0 bg-google-blue hover:bg-google-blue/90 rounded-2xl shadow-lg shadow-google-blue/10"
                                        >
                                            <ArrowRight className="h-5 w-5 text-white" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="enrich-view"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                        >
                            <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
                                <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-20 bg-white border border-slate-200 rounded-[2rem] flex items-center justify-center shadow-xl text-3xl font-bold text-google-blue">
                                            {visitorData.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <CheckCircle2 className="h-4 w-4 text-google-green" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-google-green">Identity Confirmed</span>
                                            </div>
                                            <CardTitle className="text-3xl font-bold uppercase tracking-tighter text-slate-900 leading-none">
                                                {visitorData.name}
                                            </CardTitle>
                                            <CardDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                {visitorData.organizationName}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10 space-y-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-1">Interest Graph</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['COLD', 'WARM', 'HOT'].map((level) => (
                                                <button
                                                    key={level}
                                                    onClick={() => setInterestLevel(level)}
                                                    className={cn(
                                                        "py-4 rounded-2xl border-2 font-bold uppercase text-[10px] tracking-widest transition-all",
                                                        interestLevel === level
                                                            ? (level === 'HOT' ? 'bg-google-red/5 border-google-red text-google-red' :
                                                                level === 'WARM' ? 'bg-google-yellow/5 border-google-yellow text-google-yellow' :
                                                                    'bg-google-blue/5 border-google-blue text-google-blue')
                                                            : "bg-white border-slate-100 text-slate-300 hover:border-slate-200"
                                                    )}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-1">Lead Potential</p>
                                        <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setRating(s)}
                                                    className="p-2 transition-transform hover:scale-125 hover:rotate-12"
                                                >
                                                    <Star className={cn("h-8 w-8", s <= rating ? "text-google-yellow fill-google-yellow" : "text-slate-200")} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 px-1">Enrichment Notes</p>
                                        <Textarea
                                            placeholder="INITIAL NOTES..."
                                            className="min-h-[120px] bg-slate-50 border-slate-200 rounded-2xl p-6 font-bold text-slate-900 uppercase tracking-tight text-sm focus:ring-google-blue/20"
                                            value={notes || ""}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={resetFlow}
                                            className="h-16 px-8 rounded-2xl border-slate-200 font-bold uppercase text-xs tracking-widest text-slate-400 flex-1"
                                        >
                                            Dismiss
                                        </Button>
                                        <Button
                                            onClick={handleCaptureLead}
                                            disabled={loading}
                                            className="h-16 px-8 rounded-2xl bg-google-blue hover:bg-google-blue/90 text-white font-bold uppercase text-xs tracking-[0.2em] flex-[2] shadow-xl shadow-google-blue/20"
                                        >
                                            Save Lead
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-center gap-6 opacity-30">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">TLS SECURE</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="h-3 w-3" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">REAL-TIME SYNC</span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
