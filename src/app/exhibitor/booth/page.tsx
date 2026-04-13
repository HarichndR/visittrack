"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { ImageUpload } from "@/components/common/image-upload";
import { toast } from "sonner";
import { useAuth } from "@/store/use-auth";
import { 
  Building2, 
  Users, 
  Calendar, 
  MapPin, 
  QrCode,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExhibitorBoothPage() {
  const { user } = useAuth();

  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-stall-bookings'],
    queryFn: async () => {
      const response = await api.get('/stalls/my-bookings');
      return response.data.data;
    },
    enabled: !!user
  });

  const updateLogoMutation = useMutation({
    mutationFn: async ({ exhibitorId, logoUrl }: { exhibitorId: string, logoUrl: string }) => {
      await api.patch(`/exhibitors/${exhibitorId}`, { logoUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-stall-bookings'] });
      toast.success("Branding Updated", {
        description: "Your company logo has been synchronized across the platform."
      });
    }
  });

  const confirmedBookings = bookings?.filter((b: any) => b.status === 'APPROVED') || [];

  return (
    <DashboardLayout allowedRoles={['EXHIBITOR', 'ORGANIZER']}>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              Booth <span className="text-google-yellow">Operations</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
              Manage your presence across all global exhibitions.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
             <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Status: Real-time</span>
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-8">
            <Skeleton className="h-[300px] w-full rounded-[3rem] bg-slate-50" />
            <Skeleton className="h-[300px] w-full rounded-[3rem] bg-slate-50" />
          </div>
        ) : confirmedBookings.length > 0 ? (
          <div className="space-y-12">
            {confirmedBookings.map((booking: any) => (
              <Card key={booking._id} className="border-none shadow-premium bg-white rounded-[3.5rem] overflow-hidden group hover:shadow-2xl transition-all duration-500 border-l-8 border-l-google-yellow">
                <div className="grid lg:grid-cols-12">
                   {/* Left Section: Event Info */}
                   <div className="lg:col-span-5 p-10 bg-slate-100 flex flex-col justify-between border-r border-slate-200">
                      <div className="space-y-8">
                         <div className="flex items-center gap-6">
                             <ImageUpload 
                               value={booking.exhibitorId?.logoUrl}
                               onChange={(url) => updateLogoMutation.mutate({ exhibitorId: booking.exhibitorId?._id || booking._id, logoUrl: url })}
                               onRemove={() => updateLogoMutation.mutate({ exhibitorId: booking.exhibitorId?._id || booking._id, logoUrl: "" })}
                               aspectRatio="square"
                               className="w-24"
                               label="Company Logo"
                             />
                             <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned To</p>
                                <p className="font-black text-slate-900 uppercase tracking-tight">
                                   {booking.companyName || booking.company}
                                </p>
                             </div>
                          </div>
                         <div className="space-y-2">
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic leading-none group-hover:text-google-yellow transition-colors">
                               {booking.eventId.name}
                            </h2>
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                               <MapPin className="h-4 w-4" />
                               {booking.eventId.location}
                            </div>
                         </div>
                      </div>
                      <Button asChild variant="outline" className="mt-8 h-14 justify-between border-2 border-slate-200 rounded-2xl font-black uppercase italic tracking-widest text-[10px] bg-white group-hover:border-google-yellow/30 group-hover:bg-google-yellow/5">
                         <Link href={`/events/${booking.eventId._id}`}>
                            View Event Intelligence <ArrowRight className="h-4 w-4" />
                         </Link>
                      </Button>
                   </div>

                   {/* Right Section: Stall Details */}
                   <div className="lg:col-span-7 p-10 space-y-10">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                         <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned ID</p>
                            <div className="flex items-baseline gap-2">
                               <span className="text-5xl font-black tracking-tighter text-slate-900">{booking.stallId}</span>
                               <ShieldCheck className="h-5 w-5 text-google-green" />
                            </div>
                         </div>
                         <div className="space-y-4">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-google-blue/10 rounded-xl text-google-blue">
                                  <Users className="h-5 w-5" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Staff Limit</p>
                                  <p className="font-black text-slate-900">{booking.maxStaff} Personnel</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-google-red/10 rounded-xl text-google-red">
                                  <Clock className="h-5 w-5" />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                                  <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-3">Active</Badge>
                               </div>
                            </div>
                         </div>
                         <div className="hidden md:flex flex-col items-center justify-center bg-slate-100 rounded-3xl p-4 border border-slate-200">
                            <QrCode className="h-16 w-16 text-slate-300" />
                            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">Booth QR Pass</p>
                         </div>
                      </div>

                      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
                            <Zap className="h-24 w-24" />
                         </div>
                         <div className="relative z-10 space-y-6">
                            <h3 className="text-xl font-black uppercase tracking-tight italic">Operations Hub</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <Button asChild size="lg" className="h-14 bg-white text-slate-900 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 shadow-xl shadow-black/20">
                                  <Link href="/leads/scan">Capture Leads</Link>
                               </Button>
                               <Button size="lg" variant="outline" className="h-14 border-white/20 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 opacity-50 cursor-not-allowed">
                                  Staff Roster (Upcoming)
                               </Button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 space-y-8 bg-slate-50/50 rounded-[4rem] border-4 border-dashed border-slate-100">
             <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Building2 className="h-10 w-10 text-slate-200" />
             </div>
             <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-slate-900 uppercase italic">No Booths Identified</h3>
                <p className="text-sm font-bold text-slate-400 max-w-sm mx-auto">
                   Explore upcoming events and request booth space to begin operating.
                </p>
             </div>
             <Button asChild size="lg" className="h-16 px-12 rounded-2xl bg-google-blue text-white font-black uppercase italic tracking-widest text-sm shadow-xl shadow-google-blue/20">
                <Link href="/events">Explore Calendar</Link>
             </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
