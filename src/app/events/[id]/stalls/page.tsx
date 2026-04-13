"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Building2,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Store,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EventStallsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [manualStall, setManualStall] = useState({ email: '', company: '', stallId: '' });

  // Fetch Event Details
  const { data: event } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    },
  });

  // Fetch Stall Bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['event-stalls', id],
    queryFn: async () => {
      const response = await api.get(`/stalls/event/${id}`);
      return response.data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ bookingId, stallId }: { bookingId: string, stallId?: string }) => {
      await api.patch(`/stalls/approve/${bookingId}`, { stallId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-stalls', id] });
      toast.success("Stall approved and assigned");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Approval failed");
    }
  });

  const manualAddMutation = useMutation({
    mutationFn: async () => {
      await api.post('/stalls/manual', {
        eventId: id,
        exhibitorEmail: manualStall.email,
        companyName: manualStall.company,
        stallId: manualStall.stallId
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-stalls', id] });
      setIsAddModalOpen(false);
      setManualStall({ email: '', company: '', stallId: '' });
      toast.success("Stall added manually");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add stall");
    }
  });

  const pending = bookings?.filter((b: any) => b.status === 'PENDING') || [];
  const confirmed = bookings?.filter((b: any) => b.status === 'APPROVED') || [];

  return (
    <DashboardLayout allowedRoles={['ORGANIZER', 'STAFF']}>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              Stall <span className="text-google-yellow">Mapping</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
              {event?.name} <span className="mx-2 opacity-20">|</span> {confirmed.length} / {event?.maxStalls || '∞'} Stalls Occupied
            </p>
          </div>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 bg-slate-900 hover:bg-black text-white font-black uppercase italic tracking-widest text-[10px] rounded-2xl shadow-xl transition-all hover:-translate-y-1">
                <Plus className="mr-2 h-4 w-4" /> Add Stall Manually
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white rounded-[2.5rem] p-10 border-none shadow-premium">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Manual Stall Registry</DialogTitle>
                <DialogDescription className="text-slate-500 font-medium lowercase italic">Assign a booth to an exhibitor without the request flow.</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Exhibitor Email</Label>
                  <Input
                    placeholder="email@example.com"
                    value={manualStall.email || ""}
                    onChange={(e) => setManualStall({ ...manualStall, email: e.target.value })}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Company / Brand Name</Label>
                  <Input
                    placeholder="Acme Corp"
                    value={manualStall.company || ""}
                    onChange={(e) => setManualStall({ ...manualStall, company: e.target.value })}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stall ID (Optional - Auto-generated if empty)</Label>
                  <Input
                    placeholder="e.g. B1"
                    value={manualStall.stallId || ""}
                    onChange={(e) => setManualStall({ ...manualStall, stallId: e.target.value })}
                    className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => manualAddMutation.mutate()}
                  disabled={manualAddMutation.isPending}
                  className="w-full h-14 bg-google-blue text-white font-black uppercase italic tracking-widest text-[10px] rounded-xl shadow-lg"
                >
                  {manualAddMutation.isPending ? "Syncing..." : "Provision Stall Space"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <Tabs defaultValue="pending" className="w-full space-y-12">
          <TabsList className="bg-slate-50 p-1.5 rounded-2xl h-16 w-full max-w-md border border-slate-100 grid grid-cols-2">
            <TabsTrigger value="pending" className="rounded-xl font-black uppercase italic tracking-[0.2em] text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-google-yellow transition-all">
              Requests ({pending.length})
            </TabsTrigger>
            <TabsTrigger value="confirmed" className="rounded-xl font-black uppercase italic tracking-[0.2em] text-[10px] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-google-blue transition-all">
              Directory ({confirmed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-3xl bg-slate-50" />)}
              </div>
            ) : pending.length > 0 ? (
              <div className="grid gap-6">
                {pending.map((booking: any) => (
                  <Card key={booking._id} className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-premium group hover:border-google-yellow/20 transition-all">
                    <div className="p-8 flex flex-col md:flex-row items-center gap-8">
                      <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-400 group-hover:bg-google-yellow/5 group-hover:text-google-yellow transition-all">
                        <Building2 className="h-8 w-8" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="text-xl font-black tracking-tight text-slate-900 uppercase italic leading-none">{booking.companyName}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {booking.exhibitorId?.name} <span className="mx-2 opacity-20">|</span> {booking.exhibitorId?.email}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-4">
                        <Button
                          onClick={() => approveMutation.mutate({ bookingId: booking._id })}
                          disabled={approveMutation.isPending}
                          className="h-14 px-8 bg-google-green text-white font-black uppercase italic tracking-widest text-[9px] rounded-xl shadow-lg shadow-google-green/10"
                        >
                          {approveMutation.isPending ? "..." : "Approve & Auto-ID"}
                        </Button>
                        <Button variant="ghost" className="h-12 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-google-red hover:bg-google-red/5 rounded-xl">
                          Reject
                        </Button>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="px-8 pb-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[10px] font-medium text-slate-500 italic">
                          " {booking.notes} "
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] italic">Queue Optimized: No Pending Requests</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {confirmed.map((booking: any) => (
                <Card key={booking._id} className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-premium group hover:border-google-blue/20 transition-all border-l-4 border-l-google-blue">
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 bg-slate-900 text-white flex items-center justify-center rounded-xl font-black text-lg tracking-tight shadow-xl shadow-slate-900/10">
                        {booking.stallId}
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[8px] tracking-widest uppercase px-3 py-1">Confirmed</Badge>
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase italic line-clamp-1 leading-none">{booking.companyName}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{booking.exhibitorId?.name}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                        <Users className="h-3.5 w-3.5" /> Staff: {booking.maxStaff}
                      </div>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-slate-300 hover:text-google-blue">
                        <Zap className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
