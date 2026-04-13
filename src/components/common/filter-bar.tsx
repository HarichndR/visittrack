"use client";

import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
  eventId?: string;
  onEventChange?: (value: string) => void;
  events?: { _id: string; name: string }[];
  placeholder?: string;
}

export function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  eventId,
  onEventChange,
  events,
  placeholder = "Search entries..."
}: FilterBarProps) {
  const hasActiveFilters = search || (status && status !== 'ALL') || (eventId && eventId !== 'ALL');

  const clearFilters = () => {
    onSearchChange("");
    onStatusChange?.("ALL");
    onEventChange?.("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-google-blue transition-colors" />
          <Input 
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="pl-12 h-14 bg-slate-50 border-slate-200 text-slate-900 font-bold placeholder:text-slate-300 placeholder:font-black placeholder:uppercase placeholder:text-[10px] placeholder:tracking-widest focus:ring-google-blue/20 rounded-2xl transition-all shadow-sm"
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3">
          {onStatusChange && (
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="h-14 w-full md:w-[180px] bg-white border-slate-200 font-black uppercase text-[10px] tracking-widest rounded-2xl focus:ring-google-blue/20 shadow-sm transition-all hover:bg-slate-50">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-google-blue opacity-70" />
                    <SelectValue placeholder="All Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 rounded-2xl shadow-premium">
                <SelectItem value="ALL" className="font-black uppercase text-[10px] tracking-widest text-slate-500 focus:bg-slate-50 focus:text-google-blue">All Status</SelectItem>
                <SelectItem value="PENDING" className="font-black uppercase text-[10px] tracking-widest text-slate-500 focus:bg-slate-50 focus:text-google-blue">Pending</SelectItem>
                <SelectItem value="CHECKED_IN" className="font-black uppercase text-[10px] tracking-widest text-slate-500 focus:bg-slate-50 focus:text-google-blue">Checked In</SelectItem>
                <SelectItem value="CHECKED_OUT" className="font-black uppercase text-[10px] tracking-widest text-slate-500 focus:bg-slate-50 focus:text-google-blue">Checked Out</SelectItem>
              </SelectContent>
            </Select>
          )}

          {onEventChange && events && (
            <Select value={eventId} onValueChange={onEventChange}>
              <SelectTrigger className="h-14 w-full md:w-[220px] bg-white border-slate-200 font-black uppercase text-[10px] tracking-widest rounded-2xl focus:ring-google-blue/20 shadow-sm transition-all hover:bg-slate-50">
                <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-google-yellow opacity-70" />
                    <SelectValue placeholder="All Events" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 rounded-2xl shadow-premium">
                <SelectItem value="ALL" className="font-black uppercase text-[10px] tracking-widest text-slate-500 focus:bg-slate-50 focus:text-google-blue">All Events</SelectItem>
                {events.map(event => (
                  <SelectItem key={event._id} value={event._id} className="font-black uppercase text-[10px] tracking-widest text-slate-500 focus:bg-slate-50 focus:text-google-blue">{event.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-3 flex-wrap px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Synchronized Filters:</span>
          {search && (
            <Badge className="bg-google-blue/5 text-google-blue border-google-blue/10 font-black uppercase text-[9px] px-3 py-1 gap-2 rounded-lg">
              Search: {search}
              <button title="Clear search" onClick={() => onSearchChange("")} className="hover:text-google-red transition-colors"><X className="h-3 w-3" /></button>
            </Badge>
          )}
          {status && status !== 'ALL' && (
            <Badge className="bg-google-green/5 text-google-green border-google-green/10 font-black uppercase text-[9px] px-3 py-1 gap-2 rounded-lg">
              Status: {status}
              <button title="Clear status" onClick={() => onStatusChange?.("ALL")} className="hover:text-google-red transition-colors"><X className="h-3 w-3" /></button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-google-red hover:bg-google-red/5 px-3 rounded-lg">
            Purge Filters
          </Button>
        </div>
      )}
    </div>
  );
}
