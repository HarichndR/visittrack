"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  QrCode,
  UserPlus,
  FileDown,
  Printer,
  Users,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  Loader2,
  Zap
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { format } from "date-fns";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { FilterBar } from "@/components/common/filter-bar";
import { PaginationControl } from "@/components/common/pagination-control";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";

interface VisitorRecord {
  _id: string;
  name: string;
  email: string;
  organizationName?: string;
  eventId?: { name?: string };
  status?: string;
  score?: 'HOT' | 'WARM' | 'COLD';
  checkInTime?: string;
  checkOutTime?: string;
  v_id?: string;
}

export default function VisitorsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [eventId, setEventId] = useState("ALL");

  const debouncedSearch = useDebounce(search, 500);
  const { page, limit, goToPage } = usePagination(1, 10);

  const { data: eventsData } = useQuery({
    queryKey: ['events-list-simple'],
    queryFn: async () => {
      const response = await api.get('/events?limit=100');
      return response.data.data.results;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['visitors', debouncedSearch, status, eventId, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(status !== 'ALL' && { status }),
        ...(eventId !== 'ALL' && { eventId }),
      });
      const response = await api.get(`/visitors?${params.toString()}`);
      return response.data.data;
    },
  });

  const visitors = (data?.results as VisitorRecord[]) || [];
  const totalPages = (data?.totalPages as number) || 0;
  const totalResults = (data?.totalResults as number) || 0;

  const queryClient = useQueryClient();

  const checkInMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/visitors/${id}/check-in`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Identity Verified", {
        description: "Visitor has been checked into the event area."
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error("Process Halted", {
        description: error.response?.data?.message || "Check-in failed."
      });
    }
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/visitors/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success("Booking Authorized", {
        description: "The registration request has been confirmed."
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error("Authorization Failed", {
        description: error.response?.data?.message || "Approval process error."
      });
    }
  });

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'CHECKED_IN':
        return <Badge className="bg-google-green/10 text-google-green border-none font-bold uppercase text-[9px] px-3 py-1">Checked In</Badge>;
      case 'CHECKED_OUT':
        return <Badge className="bg-slate-100 text-slate-400 border-none font-bold uppercase text-[9px] px-3 py-1">Checked Out</Badge>;
      case 'PENDING':
        return <Badge className="bg-google-yellow/10 text-google-yellow border-none font-bold uppercase text-[9px] px-3 py-1">Pending Approval</Badge>;
      case 'CONFIRMED':
        return <Badge className="bg-google-blue/10 text-google-blue border-none font-bold uppercase text-[9px] px-3 py-1">Confirmed</Badge>;
      default:
        return <Badge className="bg-google-blue/10 text-google-blue border-none font-bold uppercase text-[9px] px-3 py-1">Authorized</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Visitor Registry</h1>
            <p className="text-sm text-slate-500 pl-0.5">Manage attendee records and digital passes</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-10 border-2 border-slate-200 rounded-xl font-medium text-sm px-5">
                  <FileDown className="mr-2 h-4 w-4 text-google-blue" />
                  Bulk Intake
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-[3rem] shadow-premium">
                <DialogHeader className="pt-6">
                  <DialogTitle className="text-2xl font-bold uppercase text-center tracking-tight text-slate-900">Import Data</DialogTitle>
                </DialogHeader>
                <div className="p-8 space-y-8">
                  <div
                    className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center space-y-4 hover:border-google-blue/50 bg-slate-50/50 transition-all cursor-pointer group"
                    onClick={() => document.getElementById('bulk-upload')?.click()}
                  >
                    <div className="bg-google-blue/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl shadow-google-blue/5">
                      <FileDown className="h-10 w-10 text-google-blue" />
                    </div>
                    <div>
                      <p className="text-xl font-bold uppercase tracking-tight text-slate-900">Upload CSV</p>
                      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mt-1">Import participant data from spreadsheet</p>
                    </div>
                    <input type="file" className="hidden" accept=".csv" id="bulk-upload" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('file', file);
                      if (eventId !== 'ALL') formData.append('eventId', eventId);

                      const promise = api.post('/visitors/bulk', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                      });

                      toast.promise(promise, {
                          loading: 'Processing identity batch...',
                          success: () => {
                              queryClient.invalidateQueries({ queryKey: ['visitors'] });
                              queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
                              return 'Batch intake synchronized successfully.';
                          },
                          error: 'Operational failure: batch processing interrupted.'
                      });
                    }} />
                  </div>
                  <Card className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-google-blue mb-3">Upload Instructions</p>
                    <ul className="text-xs text-slate-500 space-y-2 font-bold uppercase italic opacity-70">
                      <li className="flex items-center gap-2"><ArrowRightLeft className="h-3 w-3" /> Headers: name, email, phone, company</li>
                      <li className="flex items-center gap-2"><ArrowRightLeft className="h-3 w-3" /> Size Limit: 5MB per partition</li>
                      <li className="flex items-center gap-2"><ArrowRightLeft className="h-3 w-3" /> Duplicate filtering enabled</li>
                    </ul>
                  </Card>
                </div>
              </DialogContent>
            </Dialog>

            <Button className="h-10 bg-google-blue hover:bg-google-blue/90 text-white font-medium text-sm px-6 rounded-xl">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Visitor
            </Button>
          </div>
        </header>

        <Card className="bg-white border-2 border-slate-200 rounded-[2rem] overflow-hidden">
          <CardHeader className="p-10 pb-6 border-b border-slate-100">
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              status={status}
              onStatusChange={setStatus}
              eventId={eventId}
              onEventChange={setEventId}
              events={eventsData}
              placeholder="Search visitors..."
            />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 h-16">
                <TableRow className="border-b border-slate-100/50 hover:bg-transparent">
                  <TableHead className="px-8 py-4 text-xs font-bold text-slate-500">Visitor</TableHead>
                  <TableHead className="py-4 text-xs font-bold text-slate-500">Event</TableHead>
                  <TableHead className="py-4 text-xs font-bold text-slate-500 text-center">Status</TableHead>
                  <TableHead className="py-4 text-xs font-bold text-slate-500 text-center">Lead Score</TableHead>
                  <TableHead className="py-4 text-xs font-bold text-slate-500">Check-in</TableHead>
                  <TableHead className="px-8 py-4 text-xs font-bold text-slate-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="h-24 border-b border-slate-50">
                      <TableCell className="px-10"><Skeleton className="h-12 w-64 rounded-xl bg-slate-50" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32 rounded-lg bg-slate-50" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-8 w-24 rounded-full mx-auto bg-slate-50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-48 rounded-lg bg-slate-50" /></TableCell>
                      <TableCell className="px-10"><Skeleton className="h-10 w-10 ml-auto rounded-xl bg-slate-50" /></TableCell>
                    </TableRow>
                  ))
                ) : visitors.length === 0 ? (
                  <TableRow className="h-64 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center">
                      <div className="flex flex-col items-center justify-center space-y-4 py-20 opacity-30">
                        <Users className="h-16 w-16" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">No Participant Records Synced</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  visitors.map((visitor) => (
                    <TableRow key={visitor._id} className="h-24 border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                      <TableCell className="px-10">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-google-blue/5 border border-google-blue/10 flex items-center justify-center font-black text-google-blue italic text-lg shadow-sm">
                            {visitor?.name?.charAt(0) || "V"}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900 leading-none mb-1">{visitor?.name || "Anonymous"}</p>
                            <p className="text-xs text-slate-400">{visitor.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-white border border-slate-200 text-slate-500 font-bold uppercase text-[9px] px-3 py-1 rounded-lg">
                          {visitor.eventId?.name || 'Local Instance'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{getStatusBadge(visitor.status)}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`font-bold uppercase text-[9px] px-3 py-1 tracking-widest border-none ${
                          visitor.score === 'HOT' ? 'bg-google-red/10 text-google-red' :
                          visitor.score === 'WARM' ? 'bg-google-yellow/10 text-google-yellow' :
                          'bg-google-blue/10 text-google-blue'
                        }`}>
                          {visitor.score || 'COLD'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {visitor.checkInTime ? (
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase">
                              <Clock className="h-3 w-3 text-google-green" />
                              <span>In: {format(new Date(visitor.checkInTime), 'MMM d, h:mm a')}</span>
                            </div>
                            {visitor.checkOutTime && (
                              <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase pl-5">
                                <span>Out: {format(new Date(visitor.checkOutTime), 'MMM d, h:mm a')}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-widest">Awaiting Check-in</span>
                        )}
                      </TableCell>
                      <TableCell className="px-10 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {visitor.status === 'PENDING' && (
                            <Button 
                              size="sm"
                              onClick={() => approveMutation.mutate(visitor._id)}
                              disabled={approveMutation.isPending}
                              className="h-8 px-3 bg-google-blue hover:bg-google-blue/90 text-white font-medium text-xs rounded-lg"
                            >
                              {approveMutation.isPending && approveMutation.variables === visitor._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Zap className="h-3 w-3 mr-2 text-google-yellow" />
                              )}
                              Approve Booking
                            </Button>
                          )}
                          {!visitor.checkInTime && visitor.status !== 'PENDING' && (
                            <Button 
                              size="sm"
                              onClick={() => checkInMutation.mutate(visitor._id)}
                              disabled={checkInMutation.isPending}
                              className="h-8 px-3 bg-google-green hover:bg-google-green/90 text-white font-medium text-xs rounded-lg"
                            >
                              {checkInMutation.isPending && checkInMutation.variables === visitor._id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 mr-2" />
                              )}
                              Quick Check-in
                            </Button>
                          )}
                          <Button asChild variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-google-blue/5 hover:text-google-blue">
                            <Link href={`/visitors/${visitor._id}/print`}>
                              <Printer className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" className="h-10 w-10 p-0 border-slate-200 rounded-xl hover:bg-slate-50 hover:text-google-blue transition-all">
                                <QrCode className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-white border border-slate-200 rounded-[3rem] shadow-premium">
                              <DialogHeader className="pt-6">
                                <DialogTitle className="text-2xl font-bold uppercase text-center tracking-tight text-slate-900">Digital Pass</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center justify-center p-10 space-y-10">
                                <div className="text-center space-y-1">
                                  <h3 className="text-3xl font-bold uppercase text-slate-900">{visitor.name}</h3>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{visitor.email}</p>
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 transform transition-transform hover:rotate-3">
                                  <Image
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${visitor.v_id}`}
                                    alt="Access QR"
                                    width={180}
                                    height={180}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="text-center space-y-3">
                                  <div className="flex items-center gap-2 bg-google-green/10 text-google-green px-4 py-1.5 rounded-full border border-google-green/20">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Pass Active</span>
                                  </div>
                                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">{visitor._id.slice(-12).toUpperCase()}</p>
                                </div>
                                <Button className="w-full h-12 bg-google-blue hover:bg-google-blue/90 text-white font-medium text-sm rounded-xl">
                                  Download Security Pass
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                  ))}
              </TableBody>
            </Table>
            <div className="p-8 border-t border-slate-50 bg-slate-50/20">
              <PaginationControl
                page={page}
                totalPages={totalPages}
                onPageChange={goToPage}
                totalResults={totalResults}
                limit={limit}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
