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
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Ticket as TicketIcon, 
  Loader2, 
  CheckCircle2,
  ListTodo
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { DynamicForm } from "@/components/forms/dynamic-form";
import { cn } from "@/lib/utils";
import { User, Event } from "@/types";

interface RegistrationModalProps {
  event: Event | null;
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (metadata?: Record<string, string | number | boolean>) => void;
  isPending: boolean;
  success: boolean;
  onSuccessClose: () => void;
}

export function RegistrationModal({
  event,
  user,
  isOpen,
  onClose,
  onRegister,
  isPending,
  success,
  onSuccessClose
}: RegistrationModalProps) {
  const { data: formData, isLoading: isFormLoading } = useQuery({
    queryKey: ['event-form', event?._id],
    queryFn: async () => {
      const response = await api.get(`/forms/event/${event?._id}`);
      return response.data.data;
    },
    enabled: !!event?._id && isOpen
  });

  if (success) {
    return (
      <Dialog open={success} onOpenChange={onSuccessClose}>
        <DialogContent className="max-w-md bg-white border border-slate-100 rounded-[3rem] p-12 text-center shadow-[0_40px_120px_-40px_rgba(34,197,94,0.3)]">
          <div className="space-y-8">
            <div className="h-24 w-24 bg-google-green/10 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="h-12 w-12 text-google-green" />
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold uppercase tracking-tighter text-slate-900">Registered</h2>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Entry Pass Generated</p>
            </div>
            
            <p className="text-sm font-bold text-slate-500 italic opacity-80 leading-relaxed max-w-[280px] mx-auto">
              Your registration for {event?.name} is confirmed. Access your pass anytime from your dashboard.
            </p>

            <div className="flex flex-col gap-3">
              <Button asChild className="h-14 bg-slate-950 text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-2xl">
                <Link href="/my-events">View My Tickets</Link>
              </Button>
              <Button variant="ghost" onClick={onSuccessClose} className="h-12 font-black uppercase text-[9px] tracking-widest text-slate-400">
                Back to Events
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const hasForm = formData && formData.steps && formData.steps.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "bg-white border border-slate-100 rounded-[3rem] p-10 shadow-premium transition-all duration-500",
        hasForm ? "max-w-2xl" : "max-w-md"
      )}>
        <DialogHeader className="space-y-4">
          <div className="bg-google-blue/10 w-16 h-16 rounded-[2rem] flex items-center justify-center text-google-blue mx-auto mb-2">
            {hasForm ? <ListTodo className="h-8 w-8" /> : <TicketIcon className="h-8 w-8" />}
          </div>
          <DialogTitle className="text-3xl font-bold uppercase tracking-tighter text-center leading-none">
            {hasForm ? "Complete Registration" : "Confirm Entry"}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400 font-medium uppercase tracking-widest text-[10px]">
             {hasForm ? "Please provide additional details for" : "Confirming registration for"}{" "}
            <span className="text-google-blue">{event?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {isFormLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <Loader2 className="h-8 w-8 text-slate-200 animate-spin" />
          </div>
        ) : hasForm ? (
          <div className="mt-8">
             <DynamicForm 
                steps={formData.steps}
                isSubmitting={isPending}
                onSubmit={(data) => onRegister(data)}
             />
          </div>
        ) : (
          <>
            <Card className="bg-slate-50 border border-slate-100 rounded-2xl p-6 my-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Name</span>
                  <span className="text-slate-900">{user?.name}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Email</span>
                  <span className="text-slate-900">{user?.email}</span>
                </div>
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Status</span>
                  <Badge className="bg-google-blue/10 text-google-blue font-black border-none text-[8px] px-2 py-0.5">OPEN</Badge>
                </div>
              </div>
            </Card>

            <DialogFooter className="flex-col sm:flex-col gap-3">
              <Button 
                  onClick={() => onRegister()}
                  disabled={isPending}
                  className="w-full h-14 bg-google-blue hover:bg-google-blue/90 text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-google-blue/10"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Registration"}
              </Button>
              <Button 
                  variant="ghost" 
                  onClick={onClose}
                  className="w-full h-12 font-black uppercase tracking-widest text-[9px] text-slate-400"
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
