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
  Plus, 
  Layout, 
  Loader2, 
  Trash2, 
  Edit3,
  Globe,
  ArrowLeft
} from "lucide-react";
import { FormBuilder } from "@/components/forms/form-builder";
import { toast } from "sonner";
import { useAuth } from "@/store/use-auth";
import Link from "next/link";

export default function FormTemplatesPage() {
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { data: templates, isLoading } = useQuery({
    queryKey: ['form-templates'],
    queryFn: async () => {
      const response = await api.get('/form-templates');
      return response.data.data;
    }
  });

  const saveTemplateMutation = useMutation({
    mutationFn: async (steps: any) => {
      const payload = {
        name: editingTemplate?.name || "New Template",
        description: editingTemplate?.description || "Reusable registration form structure",
        steps
      };
      
      if (editingTemplate?._id) {
        return api.patch(`/form-templates/${editingTemplate._id}`, payload);
      } else {
        return api.post('/form-templates', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-templates'] });
      setShowBuilder(false);
      setEditingTemplate(null);
      toast.success("Template Saved", {
        description: "The registration template is now available globally."
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save template");
    }
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/form-templates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-templates'] });
      toast.success("Template Deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete template");
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
                onClick={() => { setShowBuilder(false); setEditingTemplate(null); }}
                className="h-12 w-12 rounded-xl border border-slate-100 bg-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase leading-none italic">
                  {editingTemplate ? "Refine Template" : "New Template Architecture"}
                </h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Design global registration standards</p>
              </div>
            </div>
          </header>

          <FormBuilder 
            initialSteps={editingTemplate?.steps}
            isSaving={saveTemplateMutation.isPending}
            onSave={(steps) => saveTemplateMutation.mutate(steps)}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase leading-none italic">Form Templates</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Global registration structures & blueprints</p>
          </div>
          {isAdmin && (
            <Button 
              onClick={() => { setEditingTemplate(null); setShowBuilder(true); }}
              className="h-12 bg-slate-950 hover:bg-slate-900 text-white font-bold uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-2xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Architect Template
            </Button>
          )}
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 animate-pulse">
             <Loader2 className="h-10 w-10 text-slate-200 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {templates?.map((template: any) => (
              <Card key={template._id} className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium hover:shadow-xl transition-all group overflow-hidden border-t-8 border-t-google-blue">
                <CardHeader className="p-10 pb-6 border-b border-slate-50 relative">
                  <div className="absolute top-8 right-8 h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Globe className="h-5 w-5 text-slate-300" />
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tighter text-slate-900 uppercase italic leading-none group-hover:text-google-blue transition-colors">{template.name}</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{template.steps?.length || 0} Phases Configured</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                  <p className="text-xs text-slate-500 font-medium leading-relaxed italic opacity-80 h-10 overflow-hidden">{template.description || "Official registration blueprint for platform events."}</p>
                  
                  <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Architecture Summary</p>
                     <div className="space-y-3">
                        {template.steps?.slice(0, 3).map((step: any, idx: number) => (
                           <div key={idx} className="flex items-center gap-3">
                              <div className="h-5 w-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[8px] font-black text-slate-900">{idx + 1}</div>
                              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight truncate">{step.title}</span>
                           </div>
                        ))}
                        {template.steps?.length > 3 && <p className="text-[8px] font-black text-slate-300 pl-8 uppercase italic">+{template.steps.length - 3} additional phases</p>}
                     </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 bg-slate-50/20 border-t border-slate-50 flex gap-3">
                   {isAdmin ? (
                     <>
                        <Button 
                          onClick={() => { setEditingTemplate(template); setShowBuilder(true); }}
                          className="flex-1 h-12 bg-white border border-slate-200 text-slate-900 hover:border-google-blue/30 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all"
                        >
                          <Edit3 className="mr-2 h-3.5 w-3.5" /> Refine Architecture
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteTemplateMutation.mutate(template._id)}
                          className="h-12 w-12 rounded-xl text-slate-300 hover:bg-google-red/5 hover:text-google-red"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                     </>
                   ) : (
                      <Button className="w-full h-12 bg-google-blue text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg shadow-google-blue/20">
                         Clone for Event
                      </Button>
                   )}
                </CardFooter>
              </Card>
            ))}
            
            {isAdmin && templates?.length === 0 && (
              <div className="col-span-full h-96 border-2 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center justify-center space-y-6 opacity-40">
                 <div className="p-8 bg-slate-50 rounded-full">
                    <Layout className="h-12 w-12 text-slate-300" />
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-[0.4em]">Listening for Global Blueprints...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
