"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Store, Loader2, CheckCircle2 } from "lucide-react";

import { Event } from "@/types";

interface StallRequestModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => void;
  isPending: boolean;
  success: boolean;
}

export function StallRequestModal({
  event,
  isOpen,
  onClose,
  onSubmit,
  isPending,
  success
}: StallRequestModalProps) {
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(notes);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white border-2 border-slate-900 rounded-[2.5rem] p-0 overflow-hidden shadow-solid animate-in zoom-in-95 duration-300">
        {success ? (
          <div className="p-12 text-center space-y-6">
            <div className="h-20 w-20 bg-google-green/10 rounded-full flex items-center justify-center mx-auto border-2 border-google-green/20">
              <CheckCircle2 className="h-10 w-10 text-google-green" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Request Sent</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-4">The organizer will review your request and assign a stall ID shortly.</p>
            </div>
            <Button 
              onClick={onClose}
              className="w-full h-14 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl transition-all hover:bg-black"
            >
              Continue Exploring
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-8 space-y-8">
              <DialogHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-google-blue/10 rounded-xl flex items-center justify-center border-2 border-google-blue/20">
                    <Store className="h-5 w-5 text-google-blue" />
                  </div>
                  <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                    Stall Request
                  </DialogTitle>
                </div>
                <DialogDescription className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
                  Requesting space at <span className="text-google-blue">{event?.name}</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                   <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Additional Notes (Optional)</Label>
                   <Textarea 
                      id="notes"
                      placeholder="e.g. Prefer corner location, need extra power outlets, or special requirements..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[120px] rounded-2xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-google-blue transition-all font-medium text-sm p-5"
                   />
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black">?</div>
                   <p className="text-[9px] font-bold text-slate-500 uppercase leading-snug tracking-tight italic">
                      Platform admins will automatically receive your company profile along with this request.
                   </p>
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 bg-slate-50 border-t border-slate-100">
               <div className="flex gap-4 w-full">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={onClose}
                    className="flex-1 h-12 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="flex-1 h-12 bg-google-blue hover:bg-google-blue/90 text-white font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl shadow-google-blue/20"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Submit Request"
                    )}
                  </Button>
               </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
