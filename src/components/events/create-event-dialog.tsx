"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Zap, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageUpload } from "../common/image-upload";
import { Event } from "@/types";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onSubmit: (data: Partial<Event>) => void;
  eventData: Partial<Event>;
  setEventData: (data: Partial<Event>) => void;
}

export function CreateEventDialog({ 
  open, 
  onOpenChange, 
  isPending, 
  onSubmit, 
  eventData, 
  setEventData 
}: CreateEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border border-slate-100 rounded-[3rem] p-12 shadow-premium max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="bg-google-blue/10 w-16 h-16 rounded-[2rem] flex items-center justify-center text-google-blue mx-auto mb-2">
            <Plus className="h-8 w-8" />
          </div>
          <DialogTitle className="text-3xl font-bold uppercase tracking-tighter text-center leading-none">Create Event</DialogTitle>
          <DialogDescription className="text-center text-slate-400 font-medium uppercase tracking-widest text-[10px]">Configure new event details</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(eventData); }} className="space-y-8 mt-10">
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Event Name</label>
                 <input 
                    required
                    value={eventData.name}
                    onChange={e => setEventData({...eventData, name: e.target.value})}
                    placeholder="Grand Tech Conference 2026"
                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-google-blue/20 outline-none font-bold uppercase tracking-tight"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Location</label>
                 <input 
                    required
                    value={eventData.location}
                    onChange={e => setEventData({...eventData, location: e.target.value})}
                    placeholder="Convention Center, Hall A"
                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-google-blue/20 outline-none font-bold uppercase tracking-tight"
                 />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                 <input 
                    required
                    type="datetime-local"
                    value={eventData.startDate}
                    onChange={e => setEventData({...eventData, startDate: e.target.value})}
                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-google-blue/20 outline-none font-bold"
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">End Date</label>
                 <input 
                    required
                    type="datetime-local"
                    value={eventData.endDate}
                    onChange={e => setEventData({...eventData, endDate: e.target.value})}
                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-google-blue/20 outline-none font-bold"
                 />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Description</label>
               <textarea 
                  required
                  value={eventData.description}
                  onChange={e => setEventData({...eventData, description: e.target.value})}
                  placeholder="Tell participants what to expect from the event..."
                  className="w-full h-24 px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-google-blue/20 outline-none font-medium text-sm resize-none"
               />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                 <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Host Name</label>
                 <input 
                    value={eventData.host}
                    onChange={e => setEventData({...eventData, host: e.target.value})}
                    placeholder="Conference Organizing Committee"
                    className="w-full h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-google-blue/20 outline-none font-bold uppercase tracking-tight"
                 />
              </div>
            <div className="space-y-4">
               <ImageUpload 
                  label="Event Banner"
                  description="High-resolution primary visualization (21:9 recommended)"
                  value={eventData.banner}
                  onChange={(url) => setEventData({...eventData, banner: url})}
                  onRemove={() => setEventData({...eventData, banner: ""})}
                  aspectRatio="banner"
               />
            </div>
          </div>

            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between group transition-all hover:border-google-blue/20">
               <div className="space-y-1">
                  <div className="flex items-center gap-2">
                     <Zap className="h-4 w-4 text-google-yellow" />
                     <p className="text-[11px] font-bold uppercase tracking-tighter text-slate-900">Immediate Approval</p>
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Automatically confirm all registrations</p>
               </div>
               <button 
                  type="button"
                  onClick={() => setEventData({...eventData, autoApproval: !eventData.autoApproval})}
                  className={cn(
                    "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none",
                    eventData.autoApproval ? "bg-google-green" : "bg-slate-200"
                  )}
               >
                  <span className={cn(
                    "inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300",
                    eventData.autoApproval ? "translate-x-7" : "translate-x-1"
                  )} />
               </button>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3 mt-10">
            <Button 
                type="submit"
                disabled={isPending}
                className="w-full h-16 bg-google-blue hover:bg-google-blue/90 text-white font-bold uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-google-blue/20"
            >
              {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : "Publish Event"}
            </Button>
            <Button 
                type="button"
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="w-full h-12 font-black uppercase tracking-widest text-[9px] text-slate-400"
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
