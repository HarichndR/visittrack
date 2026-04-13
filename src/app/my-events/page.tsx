"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Ticket, 
  ChevronRight,
  Clock,
  ArrowRight,
  Zap,
  QrCode
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { TicketView } from "@/components/events/ticket-view";
import { cn } from "@/lib/utils";

interface Booking {
  _id: string;
  name: string;
  email: string;
  status: string;
  ticketType: string;
  createdAt: string;
  v_id?: string;
  eventId: {
    _id: string;
    name: string;
    startDate: string;
    location: string;
    description?: string;
  };
}

export default function MyEventsPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const response = await api.get('/visitors/my-bookings');
      return response.data.data.results;
    },
  });

  const bookings = (data as Booking[]) || [];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase">Your Tickets</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Manage your event registrations and entry passes</p>
          </div>
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
            <div className="h-2 w-2 rounded-full bg-google-blue animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Access Sync</span>
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-[2.5rem] bg-slate-50" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <Card className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-24 flex flex-col items-center justify-center space-y-6">
             <div className="p-10 bg-slate-50 rounded-full">
                <Ticket className="h-16 w-16 text-slate-200" />
             </div>
             <div className="text-center space-y-2">
                <p className="text-2xl font-bold uppercase tracking-tighter text-slate-400">Discovery Phase Active</p>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em] leading-loose">You haven't reserved any event slots yet</p>
             </div>
             <Button asChild className="mt-4 bg-google-blue text-white hover:bg-google-blue/90 font-bold uppercase px-8 rounded-xl h-12 text-[10px] tracking-widest">
               <a href="/events">Explore Live Events</a>
             </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card 
                key={booking._id} 
                className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-premium hover:shadow-xl transition-all group overflow-hidden hover:border-google-blue/30 cursor-pointer"
                onClick={() => setSelectedBooking(booking)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left: Event Details */}
                  <div className="flex-1 p-8 md:p-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-google-blue">{booking.eventId?.name || "Official Event"}</p>
                        <h3 className="text-3xl font-bold tracking-tighter text-slate-900 uppercase group-hover:text-google-blue transition-colors">
                          Registration Confirmed
                        </h3>
                      </div>
                      <Badge className={cn(
                        "uppercase text-[9px] font-bold px-4 py-1.5 rounded-xl border-none",
                        booking.status === 'CHECKED_IN' ? 'bg-google-green/10 text-google-green' : 'bg-google-blue/10 text-google-blue'
                      )}>
                        {booking.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 pt-4 border-t border-slate-50">
                       <div className="space-y-1.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Calendar className="h-3 w-3" /> Event Date
                          </p>
                          <p className="text-xs font-bold text-slate-600 uppercase">
                            {booking.eventId?.startDate 
                              ? format(new Date(booking.eventId.startDate), 'MMM dd, yyyy')
                              : "TBD"}
                          </p>
                       </div>
                       <div className="space-y-1.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-google-red" /> Venue
                          </p>
                          <p className="text-xs font-bold text-slate-600 uppercase truncate max-w-[150px]">
                            {booking.eventId?.location || "Site Unmapped"}
                          </p>
                       </div>
                       <div className="space-y-1.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Clock className="h-3 w-3 text-google-yellow" /> Reserved On
                          </p>
                          <p className="text-xs font-bold text-slate-600 uppercase">
                            {booking.createdAt 
                              ? format(new Date(booking.createdAt), 'MMM dd | HH:mm')
                              : "Recently Synced"}
                          </p>
                       </div>
                    </div>
                  </div>

                  {/* Right: Quick QR Action */}
                  <div className="md:w-64 bg-slate-50/50 p-8 flex flex-col items-center justify-center border-l border-slate-100 group-hover:bg-google-blue/5 transition-colors">
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                        <QrCode className="h-10 w-10 text-slate-300 group-hover:text-google-blue transition-colors" />
                     </div>
                     <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-4">Click to view pass</p>
                     <Button variant="ghost" className="h-10 rounded-xl font-bold uppercase text-[10px] tracking-widest group-hover:text-google-blue transition-colors">
                        Expand View <ChevronRight className="ml-2 h-4 w-4" />
                     </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Support Section */}
        <Card className="bg-slate-900 border-none rounded-[3rem] p-12 overflow-hidden relative shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
              <Zap className="h-48 w-48 text-google-blue" />
           </div>
           <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="space-y-4 max-w-xl text-center lg:text-left">
                 <h3 className="text-3xl font-bold uppercase tracking-tighter text-white">Need Technical Support?</h3>
                 <p className="text-slate-400 font-bold text-sm leading-relaxed lowercase tracking-tight border-l-4 border-google-blue pl-6 opacity-70">
                   If you're having trouble with your QR code or registration data, contact our 24/7 technical desk for immediate session verification.
                 </p>
              </div>
              <Button className="h-14 px-10 bg-white text-slate-900 hover:bg-slate-100 font-bold uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95">
                 Contact Helpdesk
              </Button>
           </div>
        </Card>
      </div>

      {/* Ticket Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-4xl bg-transparent border-none shadow-none p-0 overflow-visible">
          <DialogHeader className="sr-only">
            <DialogTitle>Your Official Event Pass</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <TicketView 
              visitor={selectedBooking} 
              event={selectedBooking.eventId} 
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
