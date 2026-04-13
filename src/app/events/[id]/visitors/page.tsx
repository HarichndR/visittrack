"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowLeft, 
  Search, 
  Filter, 
  FileDown,
  Mail,
  Phone,
  Clock,
  ChevronRight,
  Eye,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function EventVisitorsPage() {
  const { id: eventId } = useParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState<any>(null);

  // Fetch Event Details
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await api.get(`/events/${eventId}`);
      return response.data.data;
    }
  });

  // Fetch Visitors for this event
  const { data: visitorsData, isLoading } = useQuery({
    queryKey: ['event-visitors', eventId, search],
    queryFn: async () => {
      const response = await api.get(`/visitors?eventId=${eventId}&search=${search}`);
      return response.data.data;
    }
  });

  const visitors = visitorsData?.results || [];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.back()}
                className="h-12 w-12 rounded-xl border border-slate-100 bg-white"
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold uppercase tracking-tighter text-slate-900 italic">Visitor Roster</h1>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] pl-0.5">Attendee intelligence for {event?.name}</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-12 border-slate-200 rounded-xl px-6 font-black uppercase text-[10px] tracking-widest shadow-sm">
                <FileDown className="mr-2 h-4 w-4 text-google-green" /> Export Sheet
             </Button>
          </div>
        </header>

        <Card className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-premium overflow-hidden">
           <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
              <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <Input 
                    placeholder="search participant name or email..." 
                    className="h-12 pl-12 bg-slate-50 border-none rounded-xl font-bold italic tracking-tight uppercase text-xs"
                    value={search || ""}
                    onChange={(e) => setSearch(e.target.value)}
                  />
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">
                 <Users className="h-4 w-4" /> {visitorsData?.totalResults || 0} Registered
              </div>
           </CardHeader>
           <CardContent className="p-0">
              <Table>
                 <TableHeader className="bg-slate-50/50 h-16">
                    <TableRow className="border-b border-slate-100 hover:bg-transparent">
                       <TableHead className="px-10 font-black uppercase text-[9px] tracking-widest text-slate-400">Identitiy</TableHead>
                       <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400">Contact Details</TableHead>
                       <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400">Status</TableHead>
                       <TableHead className="font-black uppercase text-[9px] tracking-widest text-slate-400">Intended Protocol</TableHead>
                       <TableHead className="px-10 text-right font-black uppercase text-[9px] tracking-widest text-slate-400">Perspective</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {isLoading ? (
                       Array.from({ length: 4 }).map((_, i) => (
                          <TableRow key={i} className="h-24">
                             <TableCell className="px-10"><div className="h-10 w-48 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                             <TableCell><div className="h-10 w-32 bg-slate-50 animate-pulse rounded-lg" /></TableCell>
                             <TableCell><div className="h-6 w-20 bg-slate-50 animate-pulse rounded-full" /></TableCell>
                             <TableCell><div className="h-6 w-32 bg-slate-50 animate-pulse rounded-full" /></TableCell>
                             <TableCell className="px-10 text-right"><div className="h-10 w-10 ml-auto bg-slate-50 animate-pulse rounded-xl" /></TableCell>
                          </TableRow>
                       ))
                    ) : visitors.length === 0 ? (
                       <TableRow className="h-96">
                          <TableCell colSpan={5} className="text-center p-20">
                             <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                                <Users className="h-16 w-16" />
                                <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Participant Records Synced</p>
                             </div>
                          </TableCell>
                       </TableRow>
                    ) : (
                       visitors.map((visitor: any) => (
                          <TableRow key={visitor._id} className="h-24 border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                             <TableCell className="px-10">
                                <div className="flex items-center gap-4">
                                   <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center font-black text-white italic text-lg shadow-xl shadow-slate-900/10 group-hover:scale-105 transition-transform">
                                      {visitor.name?.[0] || 'V'}
                                   </div>
                                   <div>
                                      <p className="font-black text-slate-900 uppercase italic text-sm leading-none mb-1">{visitor.name}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global ID: {visitor._id.slice(-8).toUpperCase()}</p>
                                   </div>
                                </div>
                             </TableCell>
                             <TableCell>
                                <div className="space-y-1">
                                   <p className="text-[10px] font-bold text-slate-600 flex items-center gap-2"><Mail className="h-3 w-3 text-google-blue" /> {visitor.email}</p>
                                   <p className="text-[10px] font-bold text-slate-600 flex items-center gap-2"><Phone className="h-3 w-3 text-slate-300" /> {visitor.phone}</p>
                                </div>
                             </TableCell>
                             <TableCell>
                                <Badge className={cn(
                                   "font-black uppercase text-[8px] tracking-widest px-3 py-1 border-none",
                                   visitor.status === 'CHECKED_IN' ? "bg-google-green text-white" : "bg-slate-100 text-slate-400"
                                )}>
                                   {visitor.status || 'PENDING'}
                                </Badge>
                             </TableCell>
                             <TableCell>
                                {visitor.metadata && Object.keys(visitor.metadata).length > 0 ? (
                                   <Badge variant="outline" className="border-google-blue/30 text-google-blue font-black uppercase text-[8px] tracking-widest bg-google-blue/5">
                                      Custom Form Submitted
                                   </Badge>
                                ) : (
                                   <span className="text-[9px] font-bold text-slate-300 uppercase italic">Digital Entry Pack</span>
                                )}
                             </TableCell>
                             <TableCell className="px-10 text-right">
                                <Button 
                                    onClick={() => setSelectedVisitor(visitor)}
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-12 w-12 rounded-xl border border-slate-100 hover:bg-white hover:border-google-blue/30 text-slate-300 hover:text-google-blue transition-all"
                                >
                                   <Eye className="h-5 w-5" />
                                </Button>
                             </TableCell>
                          </TableRow>
                       ))
                    )}
                 </TableBody>
              </Table>
           </CardContent>
        </Card>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedVisitor} onOpenChange={(open) => !open && setSelectedVisitor(null)}>
        <DialogContent className="max-w-2xl bg-white border border-slate-100 p-12 rounded-[4rem] shadow-premium overflow-hidden">
           <DialogHeader className="space-y-6">
              <div className="flex items-center gap-6">
                 <div className="h-20 w-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center font-black text-3xl italic shadow-2xl">
                    {selectedVisitor?.name?.[0] || 'V'}
                 </div>
                 <div className="space-y-1">
                    <DialogTitle className="text-4xl font-black uppercase tracking-tighter text-slate-900 italic leading-none">{selectedVisitor?.name}</DialogTitle>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Participant Intelligence Profile</p>
                 </div>
              </div>
              <DialogDescription className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Email Connectivity</p>
                    <p className="text-sm font-black text-slate-900">{selectedVisitor?.email}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Phone Identity</p>
                    <p className="text-sm font-black text-slate-900">{selectedVisitor?.phone}</p>
                 </div>
              </DialogDescription>
           </DialogHeader>

           <div className="mt-12 space-y-8">
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 pl-1 italic">Dynamic Form Responses</h4>
                 <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedVisitor?.metadata && Object.keys(selectedVisitor.metadata).length > 0 ? (
                       Object.entries(selectedVisitor.metadata).map(([key, value]: [string, any], idx) => (
                          <div key={idx} className="p-8 bg-white border-2 border-slate-50 rounded-[2.5rem] space-y-2 group hover:border-google-blue/20 transition-all">
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{key.replace('step-0-field-', 'PHASE 0 FIELD ')}</p>
                             <p className="text-sm font-black text-slate-900 uppercase italic leading-relaxed">
                                {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : (value || 'NOT PROVIDED')}
                             </p>
                          </div>
                       ))
                    ) : (
                       <div className="p-20 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center space-y-4 opacity-30 text-center">
                          <Users className="h-10 w-10" />
                          <p className="text-[9px] font-black uppercase tracking-widest">Standard Digital Registration Flow used</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>

           <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <Badge className="bg-google-blue text-white font-black uppercase text-[8px] tracking-widest px-3 py-1">Authorized</Badge>
                 <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest italic flex items-center gap-2">
                    <Clock className="h-3 w-3" /> Registered {selectedVisitor?.createdAt ? format(new Date(selectedVisitor.createdAt), 'MMM d, p') : 'Pending Signal'}
                 </span>
              </div>
              <Button onClick={() => setSelectedVisitor(null)} variant="ghost" className="h-12 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900">
                 Close Profile
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
