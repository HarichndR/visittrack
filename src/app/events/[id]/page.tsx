"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/store/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  ArrowLeft,
  Share2,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ListTodo
} from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { RegistrationModal } from "@/components/events/registration-modal";
import { StallRequestModal } from "@/components/modals/stall-request-modal";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";
import { Event } from "@/types";



export default function EventDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [stallRequestEvent, setStallRequestEvent] = useState<Event | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showStallSuccess, setShowStallSuccess] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const response = await api.get(`/events/${id}`);
      return response.data.data;
    },
  });

  const { data: stallBookings, isLoading: isLoadingStalls } = useQuery({
    queryKey: ['event-stalls', id],
    queryFn: async () => {
      const response = await api.get(`/stalls/event/${id}`);
      return response.data.data;
    },
  });

  const stallRequestMutation = useMutation({
    mutationFn: async ({ event, notes }: { event: Event, notes: string }) => {
      const response = await api.post('/stalls', {
        eventId: event._id,
        companyName: user?.businessName || user?.name || "Company",
        notes
      });
      return response.data;
    },
    onSuccess: () => {
      setShowStallSuccess(true);
      toast.success("Stall request submitted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  });

  const bookingMutation = useMutation({
    mutationFn: async ({ event, metadata }: { event: Event, metadata?: any }) => {
      const response = await api.post('/visitors', {
        name: user?.name,
        email: user?.email,
        phone: user?.phone || "0000000000",
        eventId: event._id,
        metadata
      });
      return response.data;
    },
    onSuccess: () => {
      setShowSuccess(true);
      setBookingEvent(null);
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      toast.success("Registration Successful");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout isPublic>
        <div className="space-y-8 animate-pulse">
           <Skeleton className="h-[400px] w-full rounded-[3rem] bg-slate-50" />
           <div className="space-y-4">
              <Skeleton className="h-12 w-2/3 bg-slate-50" />
              <Skeleton className="h-6 w-1/3 bg-slate-50" />
           </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) return null;

  return (
    <DashboardLayout isPublic>
      <div className="max-w-6xl mx-auto pb-20">
        <Button variant="ghost" asChild className="mb-8 -ml-4 hover:bg-slate-50 rounded-full font-bold uppercase text-[10px] tracking-widest text-slate-400">
          <Link href="/events" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Calendar
          </Link>
        </Button>

        <div className="grid lg:grid-cols-12 gap-12">
           {/* LEFT COLUMN: Main Info */}
           <div className="lg:col-span-8 space-y-12">
              <div className="relative h-[450px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl">
                 <img src={event.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"} className="h-full w-full object-cover" alt={event.name} />
                 <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent flex items-end p-12">
                    <div className="space-y-4">
                       <Badge className="bg-google-blue text-white font-black uppercase text-[10px] px-4 py-1.5 rounded-full border-none tracking-widest">
                          Premier Event
                       </Badge>
                       <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                          {event.name}
                       </h1>
                    </div>
                 </div>
              </div>

              <div className="space-y-6">
                 <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">About the Event</h2>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed">
                    {event.description}
                 </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-google-blue shadow-sm">
                       <Clock className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Schedule</p>
                       <p className="text-lg font-black text-slate-900 tracking-tight">Starts: {format(new Date(event.startDate), 'MMMM d, yyyy')}</p>
                       <p className="text-sm font-bold text-slate-400">Ends: {format(new Date(event.endDate || event.startDate), 'MMMM d, yyyy')}</p>
                    </div>
                 </div>
                  <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-start gap-6">
                     <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-google-red shadow-sm">
                        <MapPin className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Venue</p>
                        <p className="text-lg font-black text-slate-900 tracking-tight">{event.location}</p>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{event.location.includes("Online") ? "Virtual Link Provided" : "Physical Attendance Required"}</p>
                     </div>
                  </div>
               </div>

               {/* Booked Stalls Section */}
               <div className="space-y-8 pt-8 border-t border-slate-100">
                   <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">Exhibitor Directory</h2>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                           <Store className="h-3 w-3" /> {stallBookings?.filter((s: any) => s.status === 'APPROVED').length || 0} Confirmed
                        </div>
                        {event.maxStalls && event.maxStalls > 0 && (
                          <div className={cn(
                            "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border",
                            (event.maxStalls - (stallBookings?.filter((s:any) => s.status === 'APPROVED').length || 0)) > 0
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-google-red/5 text-google-red border-google-red/10"
                          )}>
                             {Math.max(0, event.maxStalls - (stallBookings?.filter((s:any) => s.status === 'APPROVED').length || 0))} Stalls Left
                          </div>
                        )}
                      </div>
                   </div>
                  
                  {isLoadingStalls ? (
                     <div className="grid sm:grid-cols-2 gap-4">
                        <Skeleton className="h-24 w-full rounded-2xl bg-slate-50" />
                        <Skeleton className="h-24 w-full rounded-2xl bg-slate-50" />
                     </div>
                  ) : stallBookings?.filter((s:any) => s.status === 'APPROVED').length > 0 ? (
                     <div className="grid sm:grid-cols-2 gap-6">
                        {stallBookings.filter((s: any) => s.status === 'APPROVED').map((stall: any) => (
                           <div key={stall._id} className="p-6 bg-white border-2 border-slate-100 rounded-3xl flex items-center gap-6 group hover:border-slate-800 transition-all shadow-sm">
                              <div className="h-14 w-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-slate-900/20 group-hover:scale-110 transition-transform">
                                 {stall.stallId}
                              </div>
                              <div>
                                 <p className="font-black text-slate-900 uppercase tracking-tight text-sm line-clamp-1">{stall.companyName}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Confirmed Partner</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="p-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center">
                           <Store className="h-6 w-6 text-slate-200" />
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Stall mapping in progress...</p>
                     </div>
                  )}
               </div>
            </div>

           {/* RIGHT COLUMN: Sidebar Stats & CTA */}
           <div className="lg:col-span-4 space-y-8">
              <div className="p-10 bg-white border border-slate-200 shadow-premium rounded-[3rem] space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-google-blue/10 flex items-center justify-center text-google-blue">
                       <Building2 className="h-7 w-7" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Host Institution</p>
                       <h4 className="font-black text-slate-900 uppercase italic tracking-tight">{event.host || "VisiTrack Events"}</h4>
                    </div>
                 </div>

                 <div className="space-y-4">
                    {[
                      { icon: ShieldCheck, text: "Authorized Admission", color: "text-google-green" },
                      { icon: Users, text: "Networking Opportunities", color: "text-google-blue" },
                      { icon: CheckCircle2, text: "Digital Certification", color: "text-google-yellow" }
                    ].map((item, i) => (
                       <div key={i} className="flex items-center gap-4 font-bold text-xs text-slate-400 uppercase tracking-tight">
                          <item.icon className={cn("h-4 w-4", item.color)} /> {item.text}
                       </div>
                    ))}
                 </div>

                   <div className="pt-6 space-y-4">
                    {user?.role === 'EXHIBITOR' ? (
                       <Button 
                        disabled={stallBookings?.some((s: any) => s.exhibitorId?._id === user._id)}
                        onClick={() => setStallRequestEvent(event)}
                        className="w-full h-16 bg-google-yellow text-white font-black uppercase italic tracking-widest text-sm rounded-2xl shadow-xl shadow-google-yellow/20 transition-all hover:scale-[1.02]"
                      >
                         {stallBookings?.some((s: any) => s.exhibitorId?._id === user._id) ? "Request Pending" : "Request Stall Space"}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setBookingEvent(event)}
                        className="w-full h-16 bg-google-blue text-white font-black uppercase italic tracking-widest text-sm rounded-2xl shadow-xl shadow-google-blue/20 transition-all hover:scale-[1.02]"
                      >
                        Join This Event
                      </Button>
                    )}
                  </div>

                  {/* Organizer Quick Actions */}
                  {(user?.role === 'ORGANIZER' || user?.role === 'STAFF') && (
                    <div className="pt-8 border-t border-slate-50 space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 pl-1">Organizer Console</p>
                        <div className="grid grid-cols-1 gap-3">
                            <Button variant="outline" asChild className="h-14 justify-start border-slate-100 hover:border-google-blue/30 hover:bg-google-blue/5 rounded-2xl font-black uppercase italic tracking-widest text-[9px]">
                                <Link href={`/events/${id}/visitors`} className="flex items-center gap-3">
                                    <Users className="h-4 w-4 text-google-blue" /> Visitor Roster
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-14 justify-start border-slate-100 hover:border-google-blue/30 hover:bg-google-blue/5 rounded-2xl font-black uppercase italic tracking-widest text-[9px]">
                                <Link href={`/events/${id}/form`} className="flex items-center gap-3">
                                    <ListTodo className="h-4 w-4 text-google-green" /> Form Architecture
                                </Link>
                            </Button>
                            <Button variant="outline" asChild className="h-14 justify-start border-slate-100 hover:border-google-blue/30 hover:bg-google-blue/5 rounded-2xl font-black uppercase italic tracking-widest text-[9px]">
                                <Link href={`/events/${id}/stalls`} className="flex items-center gap-3">
                                    <Store className="h-4 w-4 text-google-yellow" /> Stall Mapping
                                </Link>
                            </Button>
                        </div>
                    </div>
                  )}

                 <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-50">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300">
                       <Share2 className="h-4 w-4" />
                    </Button>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Share Event</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <StallRequestModal 
        event={stallRequestEvent}
        isOpen={!!stallRequestEvent}
        onClose={() => { setStallRequestEvent(null); setShowStallSuccess(false); }}
        onSubmit={(notes) => stallRequestMutation.mutate({ event: stallRequestEvent!, notes })}
        isPending={stallRequestMutation.isPending}
        success={showStallSuccess}
      />

      <RegistrationModal 
        event={bookingEvent}
        user={user}
        isOpen={!!bookingEvent}
        onClose={() => setBookingEvent(null)}
        onRegister={(metadata) => bookingMutation.mutate({ event: bookingEvent!, metadata })}
        isPending={bookingMutation.isPending}
        success={showSuccess}
        onSuccessClose={() => setShowSuccess(false)}
      />
    </DashboardLayout>
  );
}
