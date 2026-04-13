"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Building2, 
  Globe, 
  CheckCircle2, 
  XCircle,
  Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface OrganizerRequest {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  name?: string;
  email?: string;
  businessName: string;
  website: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function OrganizerRequestsPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['organizer-requests'],
    queryFn: async () => {
      const response = await api.get('/users/organizer-requests');
      return response.data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await api.post(`/users/approve-organizer/${requestId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer-requests'] });
      toast.success("Organizer approved successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve organizer");
    }
  });

  return (
    <DashboardLayout allowedRoles={['ADMIN']}>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase italic">Review Requests</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Approve or reject organizer applications</p>
          </div>
        </header>

        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-[2.5rem] bg-slate-50" />
            ))}
          </div>
        ) : !requests || requests.length === 0 ? (
          <Card className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-20 flex flex-col items-center justify-center space-y-6">
            <div className="p-8 bg-slate-50 rounded-full">
              <Clock className="h-12 w-12 text-slate-200" />
            </div>
            <p className="text-xl font-bold uppercase italic tracking-tighter text-slate-400">No pending requests</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {requests.map((request: OrganizerRequest) => (
              <Card key={request._id} className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-premium overflow-hidden hover:border-google-blue/30 transition-all">
                <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                  <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Building2 className="h-8 w-8 text-google-blue" />
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tighter text-slate-900">{request.businessName}</h3>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                          Applied by: <span className="text-slate-600">{request.userId?.name || request.name}</span>
                          <span className="opacity-20">|</span>
                          {request.userId?.email || request.email}
                          {!request.userId && (
                             <Badge variant="outline" className="ml-2 border-google-blue/20 text-google-blue text-[8px] font-black h-4 px-2">PUBLIC REQUEST</Badge>
                          )}
                        </div>
                      </div>
                      <Badge className={`uppercase text-[10px] font-bold px-4 py-1.5 rounded-xl border-none ${
                        request.status === 'PENDING' ? 'bg-google-yellow/10 text-google-yellow' :
                        request.status === 'APPROVED' ? 'bg-google-green/10 text-google-green' : 'bg-google-red/10 text-google-red'
                      }`}>
                        {request.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                           <Globe className="h-3 w-3" /> Business Website
                         </p>
                         <p className="text-sm font-medium text-google-blue underline decoration-2 underline-offset-4">{request.website || 'No website provided'}</p>
                      </div>
                      <div className="space-y-2">
                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                           <ShieldCheck className="h-3 w-3" /> Application Date
                         </p>
                         <p className="text-sm font-medium text-slate-600">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                       <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-3 block">Proposal Details</p>
                       <p className="text-sm text-slate-600 leading-relaxed font-medium">{request.description}</p>
                    </div>

                    {request.status === 'PENDING' && (
                      <div className="flex gap-4 pt-4 border-t border-slate-50">
                        <Button 
                          onClick={() => approveMutation.mutate(request._id)}
                          className="bg-google-green text-white hover:bg-google-green/90 font-bold px-8 rounded-xl h-12 text-xs uppercase tracking-widest transition-all shadow-lg shadow-google-green/10"
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Approve Organizer
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-slate-200 text-slate-400 font-bold px-8 rounded-xl h-12 text-xs uppercase tracking-widest hover:text-google-red hover:border-google-red/20 hover:bg-google-red/5"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Dismiss Request
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
