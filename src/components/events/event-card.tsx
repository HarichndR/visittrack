"use client";

import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  ArrowRight,
  MoreVertical,
  Layers,
  Heart
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Event } from "@/types";

interface EventCardProps {
  event: Event;
  isVisitor: boolean;
  user: any;
  isSaved: boolean;
  onSaveToggle: (id: string) => void;
  onRegister: (event: Event) => void;
  onStallRequest?: (event: Event) => void;
  onManage?: (id: string) => void;
}

export function EventCard({ 
  event, 
  isVisitor, 
  user,
  isSaved, 
  onSaveToggle, 
  onRegister,
  onStallRequest,
  onManage 
}: EventCardProps) {
  const now = new Date();
  const start = new Date(event.startDate);
  const end = new Date(event.endDate || event.startDate);

  return (
    <Card className="bg-white border-2 border-slate-200 rounded-[2.5rem] shadow-solid hover:shadow-lg hover:border-slate-800 transition-all flex flex-col h-full group overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <img 
          src={event.banner || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"} 
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        <div className="absolute top-4 right-4">
           {isVisitor && (
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 rounded-full bg-white border-2 border-slate-900 text-slate-900 shadow-solid transition-all hover:bg-slate-100",
                  isSaved && "text-google-red bg-slate-50 border-google-red"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveToggle(event._id);
                }}
              >
                <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
              </Button>
            )}
        </div>
      </div>

      <CardHeader className="p-6 pb-2">
        <div className="flex items-center gap-2 mb-2">
          {(() => {
            if (event.isActive === false || end < now) {
              return <Badge className="font-bold uppercase text-[8px] px-2 py-0.5 tracking-widest border-none bg-slate-100 text-slate-400">Past</Badge>;
            } else if (start <= now && end >= now) {
              return <Badge className="font-bold uppercase text-[8px] px-2 py-0.5 tracking-widest border-none bg-google-green text-white">Live</Badge>;
            } else {
              return <Badge className="font-bold uppercase text-[8px] px-2 py-0.5 tracking-widest border-none bg-google-blue text-white">Upcoming</Badge>;
            }
          })()}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{event.location}</span>
        </div>
        <CardTitle className="text-xl font-black tracking-tight uppercase text-slate-900 line-clamp-1">
          {event.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 pt-2 space-y-4">
        <div className="flex items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <CalendarIcon className="h-3 w-3 text-google-blue mr-2" />
            {format(new Date(event.startDate), 'MMM d, yyyy')}
        </div>
        <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3">
        <Button 
          variant="outline"
          className="h-10 rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
          onClick={() => window.location.href = `/events/${event._id}`}
        >
          Details
        </Button>
        {isVisitor ? (
          <Button 
            className="h-10 bg-google-blue text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
            onClick={() => onRegister(event)}
          >
            Join
          </Button>
        ) : user?.role === 'EXHIBITOR' ? (
          <Button 
            className="h-10 bg-google-yellow text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-2"
            onClick={() => onStallRequest?.(event)}
          >
            Request Stall
          </Button>
        ) : (
          <Button 
            className="h-10 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl px-2"
            onClick={() => onManage?.(event._id)}
          >
            Manage
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
