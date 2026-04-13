"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { SearchSelect } from "@/components/common/search-select";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Map,
    Info,
    Users,
    Zap,
    Maximize2,
    MousePointer2,
    Sparkles,
    LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface StallData {
    stallNumber: string;
    organizationName?: string;
    email?: string;
    name?: string;
}

interface EmptyStall {
    stallNumber: string;
    empty: true;
}

const isEmptyStall = (stall: StallData | EmptyStall | null): stall is EmptyStall => {
    return !!stall && 'empty' in stall;
};

export default function FloorPlanPage() {
    const [selectedEventId, setSelectedEventId] = useState("");
    const [selectedStall, setSelectedStall] = useState<StallData | EmptyStall | null>(null);

    const { data: exhibitors } = useQuery<StallData[]>({
        queryKey: ["exhibitors", selectedEventId],
        queryFn: async () => {
            if (!selectedEventId) return [];
            const response = await api.get(`/exhibitors?eventId=${selectedEventId}&limit=100`);
            return response.data.data.results as StallData[];
        },
        enabled: !!selectedEventId
    });

    const rows = ['A', 'B', 'C', 'D', 'E'];
    const cols = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
        <DashboardLayout>
            <div className="space-y-10 pb-20">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Interactive Map</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Smart Stall Positioning & Navigation Grid</p>
                    </div>
                    <div className="w-full md:w-80">
                        <SearchSelect
                            type="EVENT"
                            placeholder="Select event..."
                            onSelect={(val) => setSelectedEventId(val)}
                        />
                    </div>
                </header>

                {!selectedEventId ? (
                    <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium py-24 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="p-10 bg-slate-50 rounded-full border border-slate-100 shadow-inner group">
                            <Map className="h-20 w-20 text-slate-200 group-hover:text-google-blue transition-colors duration-500" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-400">Map Initialization Pending</h3>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] leading-loose">Select an active event to load the interactive floor plan</p>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                        <div className="xl:col-span-2 space-y-8">
                            <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden border-t-8 border-t-google-blue relative">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 bg-slate-50/30 px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-google-blue/10 rounded-2xl shadow-lg shadow-google-blue/5">
                                            <Maximize2 className="h-5 w-5 text-google-blue" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Main Hall Grid</CardTitle>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time occupancy status</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-google-green/10 px-4 py-1.5 rounded-full border border-google-green/20">
                                        <div className="h-2 w-2 rounded-full bg-google-green animate-pulse" />
                                        <span className="text-[9px] font-black text-google-green uppercase tracking-widest">Live Sync Active</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-10">
                                    <div className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 overflow-auto custom-scrollbar shadow-inner">
                                        <div className="grid gap-6 min-w-[700px] justify-center">
                                            {rows.map(row => (
                                                <div key={row} className="flex gap-6 items-center">
                                                    <div className="w-10 text-xs font-black text-slate-300 italic uppercase">{row}</div>
                                                    <div className="flex gap-6">
                                                        {cols.map(col => {
                                                            const stallNum = `${row}${col}`;
                                                            const exhibitor = exhibitors?.find((e: StallData) => e.stallNumber === stallNum);
                                                            const isSelected = selectedStall?.stallNumber === stallNum;

                                                            return (
                                                                <motion.button
                                                                    key={col}
                                                                    whileHover={{ scale: 1.1, rotate: 2 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => setSelectedStall(exhibitor || { stallNumber: stallNum, empty: true })}
                                                                    className={cn(
                                                                        "w-16 h-16 rounded-[1.25rem] border-2 transition-all flex items-center justify-center relative group",
                                                                        exhibitor
                                                                            ? "bg-white border-google-blue shadow-lg shadow-google-blue/10"
                                                                            : "bg-white border-slate-100 text-slate-200 hover:border-slate-300",
                                                                        isSelected && "ring-4 ring-google-blue/20 border-google-blue border-3"
                                                                    )}
                                                                >
                                                                    <span className={cn(
                                                                        "text-[12px] font-black tracking-tighter",
                                                                        exhibitor ? "text-google-blue" : "text-slate-300 group-hover:text-slate-500"
                                                                    )}>{stallNum}</span>

                                                                    {exhibitor && (
                                                                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-google-blue rounded-lg border-2 border-white shadow-xl animate-bounce" />
                                                                    )}
                                                                </motion.button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-10 flex flex-wrap gap-8 justify-center border-t border-slate-50 pt-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-lg bg-white border-2 border-google-blue shadow-sm" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Occupied Stall</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-lg bg-white border-2 border-slate-100" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Stall</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-5 h-5 rounded-lg bg-white border-[3px] border-google-blue ring-4 ring-google-blue/10" />
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Selection</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            <AnimatePresence mode="wait">
                                {selectedStall ? (
                                    <motion.div
                                        key={selectedStall.stallNumber}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                    >
                                        <Card className={cn(
                                            "bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden",
                                            !isEmptyStall(selectedStall) && "border-l-8 border-l-google-blue"
                                        )}>
                                            <CardHeader className="p-10 pb-6">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                                        <Zap className={cn("h-6 w-6", isEmptyStall(selectedStall) ? "text-slate-200" : "text-google-blue")} />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5">Identifier</p>
                                                        <p className="text-4xl font-black italic tracking-tighter text-google-blue">{selectedStall.stallNumber}</p>
                                                    </div>
                                                </div>
                                                <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-tight">
                                                    {isEmptyStall(selectedStall) ? "Unassigned Stall" : (selectedStall.organizationName || "Unknown Entity")}
                                                </CardTitle>
                                                <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">
                                                    {isEmptyStall(selectedStall) ? "EXHIBIT SPACE AVAILABLE" : selectedStall.name}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-10 pt-6 space-y-8 border-t border-slate-50">
                                                {!isEmptyStall(selectedStall) ? (
                                                    <>
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 border-l-4 border-l-google-blue transition-colors hover:bg-white">
                                                                <Users className="h-5 w-5 text-google-blue" />
                                                                <div>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rep Intelligence</p>
                                                                    <p className="text-sm font-black text-slate-900 uppercase italic">{selectedStall.name}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 border-l-4 border-l-google-green transition-colors hover:bg-white">
                                                                <Info className="h-5 w-5 text-google-green" />
                                                                <div>
                                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Contact Info</p>
                                                                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{selectedStall.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button className="w-full h-16 bg-google-blue hover:bg-google-blue/90 text-white font-black uppercase italic tracking-widest text-xs rounded-2xl shadow-xl shadow-google-blue/20 transition-all active:scale-95">
                                                            Sync Exhibitor
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="space-y-8 text-center sm:text-left">
                                                        <p className="text-xs text-slate-400 font-bold leading-loose uppercase tracking-tighter border-l-4 border-slate-100 pl-6">
                                                            this premium exhibit stall is currently unassigned. add an exhibitor to activate the space.
                                                        </p>
                                                        <Button variant="outline" className="w-full h-16 border-slate-200 text-slate-900 font-black uppercase italic tracking-widest text-xs rounded-2xl hover:bg-slate-50 transition-all">
                                                            Assign Stall
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ) : (
                                    <Card className="bg-white border border-slate-200/60 rounded-[3rem] py-24 flex flex-col items-center justify-center text-center px-10 shadow-premium">
                                        <MousePointer2 className="h-12 w-12 text-slate-100 mb-8 animate-bounce" />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] leading-loose max-w-[200px]">
                                            select a stall to view exhibitor details
                                        </p>
                                    </Card>
                                )}
                            </AnimatePresence>

                            <Card className="bg-slate-900 border-none rounded-[3rem] p-10 space-y-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                                    <LayoutGrid className="h-40 w-40 text-google-blue" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Sparkles className="h-4 w-4 text-google-blue" />
                                        <span className="text-[10px] font-black text-google-blue uppercase tracking-widest">Map Meta-data</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="text-3xl font-black italic tracking-tighter text-white uppercase">{exhibitors?.length || 0}</div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Units</p>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="text-3xl font-black italic tracking-tighter text-white uppercase">{40 - (exhibitors?.length || 0)}</div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Empty Slots</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
          border: 3px solid #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
        </DashboardLayout>
    );
}
