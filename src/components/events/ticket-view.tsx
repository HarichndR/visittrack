"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  User, 
  QrCode as QrIcon, 
  Download, 
  Printer,
  ShieldCheck, 
  Zap
} from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TicketProps {
  visitor: {
    _id: string;
    name: string;
    email: string;
    v_id?: string;
    ticketType?: string;
    status?: string;
  };
  event: {
    name: string;
    startDate: string;
    location: string;
    description?: string;
  };
}

export function TicketView({ visitor, event }: TicketProps) {
  const qrData = visitor.v_id || visitor._id;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Print-specific Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .ticket-to-print, .ticket-to-print * {
            visibility: visible;
          }
          .ticket-to-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: auto;
            margin: 0mm;
          }
        }
      `}} />

      {/* Premium Ticket Main Card */}
      <Card className="ticket-to-print bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:rotate-12 transition-transform pointer-events-none">
           <QrIcon className="h-64 w-64 text-slate-900" />
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Left Section: Event Info */}
          <div className="flex-1 p-10 lg:p-14 space-y-10 border-b lg:border-b-0 lg:border-r border-slate-100">
            <div className="space-y-4">
              <Badge className="bg-google-blue/10 text-google-blue border-none font-black uppercase text-[10px] px-4 py-1 rounded-lg tracking-widest">
                Official Authorization
              </Badge>
              <h2 className="text-5xl font-bold uppercase tracking-tighter text-slate-900 leading-none">
                {(event?.name || "Official Event")}<span className="text-google-blue">.</span>Pass
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                   <Calendar className="h-3 w-3 text-google-blue" /> Scheduled Date
                </p>
                <p className="text-sm font-semibold text-slate-900 uppercase">
                  {event?.startDate ? format(new Date(event.startDate), 'MMMM d, yyyy | h:mm a') : 'TBD'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-google-red" /> Venue location
                </p>
                <p className="text-sm font-semibold text-slate-900 uppercase">
                  {event?.location || 'Official Venue'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <User className="h-3 w-3 text-google-green" /> Attendee
                </p>
                <p className="text-sm font-semibold text-slate-900 uppercase">
                  {visitor?.name || "Registered Attendee"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-3 w-3 text-google-yellow" /> Pass Tier
                </p>
                <p className="text-sm font-semibold text-slate-900 uppercase">
                  {visitor?.ticketType || 'Standard'} Access
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100/50">
               <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Gate Instructions</p>
               <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-70">
                 Present this digital pass at the entrance for identity verification. Valid for single entry only. Keep your QR code private for security reasons.
               </p>
            </div>
          </div>

          {/* Right Section: QR Focus */}
          <div className="w-full lg:w-[400px] p-10 lg:p-14 bg-slate-50/30 flex flex-col items-center justify-center space-y-8">
            <div className="relative group">
               <div className="absolute -inset-4 bg-google-blue/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
               <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-white relative z-10 transition-transform group-hover:rotate-2 group-hover:scale-105 duration-500">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`}
                    alt="Access QR"
                    width={200}
                    height={200}
                    className="w-full h-full object-contain filter grayscale contrast-125"
                  />
               </div>
            </div>

            <div className="text-center space-y-3">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                visitor.status === 'CHECKED_IN' 
                  ? "bg-google-green/10 text-google-green border-google-green/20" 
                  : "bg-google-blue/10 text-google-blue border-google-blue/20"
              )}>
                <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", visitor.status === 'CHECKED_IN' ? "bg-google-green" : "bg-google-blue")} />
                {visitor.status === 'CHECKED_IN' ? 'Validated' : 'Active Pass'}
              </div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em]">{(visitor._id || "v-id-pending").slice(-12).toUpperCase()}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Bar */}
      <div className="no-print flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-900 rounded-2xl">
            <Zap className="h-5 w-5 text-google-blue" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Clearance</p>
            <p className="text-sm font-semibold text-slate-900 uppercase">Digital Integrity Verified</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={handlePrint}
            variant="outline" 
            className="h-14 px-8 border-slate-200 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
          >
            <Printer className="mr-2 h-4 w-4 text-slate-400" /> Print Pass
          </Button>
          <Button 
            onClick={handlePrint}
            className="h-14 px-10 bg-google-blue hover:bg-google-blue/90 text-white font-bold uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-google-blue/10 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="mr-2 h-4 w-4" /> Download Digital PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
