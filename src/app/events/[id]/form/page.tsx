"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Plus, 
  ClipboardCheck, 
  Loader2,
  Settings2,
  Trash2,
  Zap
} from "lucide-react";
import { FormBuilder } from "@/components/forms/form-builder";
import { toast } from "sonner";
import { useAuth } from "@/store/use-auth";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function EventFormManagementPage() {
  const { id: eventId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  // Fetch Event Details
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await api.get(`/events/${eventId}`);
      return response.data.data;
    }
  });

  // Fetch Event Form
  const { data: eventForm, isLoading: isFormLoading } = useQuery({
    queryKey: ['event-form', eventId],
    queryFn: async () => {
      const response = await api.get(`/forms/event/${eventId}`);
      return response.data.data;
    }
  });

  // Fetch Global Templates
  const { data: templates } = useQuery({
    queryKey: ['form-templates'],
    queryFn: async () => {
      const response = await api.get('/form-templates');
      return response.data.data;
    }
  });

  const saveFormMutation = useMutation({
    mutationFn: async (steps: any) => {
      const payload = {
        eventId,
        title: `${event?.name} Registration`,
        steps
      };
      
      if (eventForm?._id) {
        return api.patch(`/forms/${eventForm._id}`, payload);
      } else {
        return api.post('/forms', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-form', eventId] });
      setShowBuilder(false);
      toast.success("Registration Form Updated", {
        description: "Participants will now see this form when registering."
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update registration form");
    }
  });

  const deleteFormMutation = useMutation({
    mutationFn: async () => api.delete(`/forms/${eventForm._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event-form', eventId] });
      toast.success("Form Removed");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove form");
    }
  });

  if (showBuilder) {
    return (
      <DashboardLayout>
        <div className="space-y-10 pb-20">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowBuilder(false)}
                className="h-12 w-12 rounded-xl border border-slate-100 bg-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase leading-none italic">
                  Customizing Form
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Defining registration flow for {event?.name}</p>
              </div>
            </div>
          </header>

          <FormBuilder 
            initialSteps={eventForm?.steps || selectedTemplate?.steps || []}
            isSaving={saveFormMutation.isPending}
            onSave={(steps) => saveFormMutation.mutate(steps)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="h-12 w-12 rounded-xl border border-slate-100 bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase leading-none italic">Form Management</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Configuration for {event?.name}</p>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Active Form Status */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
               <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div className="space-y-1">
                     <CardTitle className="text-2xl font-bold tracking-tighter uppercase text-slate-900 italic">Current Configuration</CardTitle>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active registration questionnaire</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={cn(
                       "h-3 w-3 rounded-full animate-pulse",
                       eventForm ? "bg-google-green" : "bg-slate-200"
                     )} />
                     <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {eventForm ? 'Form Active' : 'No Custom Form'}
                     </span>
                  </div>
               </CardHeader>
               <CardContent className="p-10">
                  {isFormLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-slate-200" /></div>
                  ) : eventForm ? (
                    <div className="space-y-8">
                       <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                          <div className="h-20 w-20 bg-google-blue/10 rounded-full flex items-center justify-center text-google-blue">
                             <ClipboardCheck className="h-10 w-10" />
                          </div>
                          <div>
                             <h4 className="text-xl font-bold uppercase tracking-tighter text-slate-900">Custom Form Deployed</h4>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{eventForm.steps?.length} Phases Configured</p>
                          </div>
                       </div>
                       
                       <div className="flex gap-4">
                          <Button 
                             onClick={() => setShowBuilder(true)}
                             className="flex-1 h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
                          >
                             <Settings2 className="mr-2 h-4 w-4" /> Modify Form structure
                          </Button>
                          <Button 
                             variant="ghost"
                             onClick={() => deleteFormMutation.mutate()}
                             className="h-14 w-14 bg-google-red/5 border border-google-red/10 text-google-red rounded-2xl hover:bg-google-red/10"
                          >
                             <Trash2 className="h-5 w-5" />
                          </Button>
                       </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                       <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 italic font-black text-slate-200 text-4xl">?</div>
                       <div className="space-y-2">
                          <p className="text-xl font-bold uppercase tracking-tighter text-slate-400">Default Flow Enabled</p>
                          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest max-w-[280px]">Visitors will only provide standard name, email, and phone contact details.</p>
                       </div>
                    </div>
                  )}
               </CardContent>
            </Card>
          </div>

          {/* Templates Selector */}
          <div className="space-y-8">
             <div className="space-y-1 px-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Starting Blueprints</h4>
                <p className="text-xs font-bold text-slate-600">Clone a global standard to begin</p>
             </div>
             
             <div className="space-y-4">
                {templates?.map((template: any) => (
                  <Card key={template._id} className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:border-google-blue/30 transition-all cursor-pointer group shadow-sm hover:shadow-md" onClick={() => { setSelectedTemplate(template); setShowBuilder(true); }}>
                     <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-google-blue transition-colors">
                           <Zap className="h-5 w-5" />
                        </div>
                        <Plus className="h-4 w-4 text-slate-200 group-hover:text-google-blue" />
                     </div>
                     <h5 className="text-sm font-black uppercase italic tracking-tight text-slate-900 group-hover:text-google-blue transition-colors">{template.name}</h5>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{template.steps?.length} Phases</p>
                  </Card>
                ))}
                
                {templates?.length === 0 && (
                   <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center py-20 italic">No templates available</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
