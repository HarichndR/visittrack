"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  ShieldCheck,
  Zap,
  MoreVertical
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePagination } from "@/hooks/use-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { PaginationControl } from "@/components/common/pagination-control";

interface ExhibitorRecord {
  _id: string;
  name: string;
  email: string;
  company: string;
  logoUrl?: string;
  stallNumber: string;
  status: string;
  eventId?: { name?: string };
}

export default function ExhibitorsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const { page, limit, goToPage } = usePagination(1, 10);

  const { data, isLoading } = useQuery({
    queryKey: ['exhibitors', debouncedSearch, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(debouncedSearch && { search: debouncedSearch }),
      });
      const response = await api.get(`/exhibitors?${params.toString()}`);
      return response.data.data;
    },
  });

  const exhibitors = (data?.results as ExhibitorRecord[]) || [];
  const totalPages = (data?.totalPages as number) || 0;
  const totalResults = (data?.totalResults as number) || 0;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-google-green/10 text-google-green border-none font-black uppercase text-[9px] px-3 py-1">Active</Badge>;
      case 'INACTIVE':
        return <Badge className="bg-google-red/10 text-google-red border-none font-black uppercase text-[9px] px-3 py-1">Inactive</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-400 border-none font-black uppercase text-[9px] px-3 py-1">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase italic">Exhibitor List</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Manage exhibiting partners and stall assignments</p>
          </div>
          <div className="flex gap-3">
             <Button className="h-12 bg-google-blue hover:bg-google-blue/90 text-white font-black uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-xl shadow-google-blue/20">
              <Plus className="mr-2 h-4 w-4" />
              Onboard Exhibitor
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { label: "Active Partners", val: totalResults, icon: Building2, color: "text-google-blue" },
             { label: "Occupied Stalls", val: "94%", icon: LayoutGrid, color: "text-google-green" },
             { label: "Trust Score", val: "Verified", icon: ShieldCheck, color: "text-google-yellow" }
           ].map((stat, i) => (
             <Card key={i} className="bg-white border border-slate-200/60 rounded-[2rem] shadow-premium p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{stat.val}</p>
                  </div>
                </div>
             </Card>
           ))}
        </div>

        <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
          <CardHeader className="p-10 pb-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="relative w-full max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search partner list..." 
                  className="w-full h-16 pl-16 pr-8 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-300 font-bold focus:ring-2 focus:ring-google-blue/20 transition-all outline-none"
                />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 h-16">
                <TableRow className="border-b border-slate-100/50 hover:bg-transparent">
                  <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Stall Number</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Event</TableHead>
                  <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</TableHead>
                  <TableHead className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className="h-24 border-b border-slate-50">
                      <TableCell className="px-10"><Skeleton className="h-12 w-64 rounded-xl bg-slate-50" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24 rounded-lg bg-slate-50" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-32 rounded-lg bg-slate-50" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-24 rounded-full mx-auto bg-slate-50" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-10 ml-auto rounded-xl bg-slate-50" /></TableCell>
                    </TableRow>
                  ))
                ) : exhibitors.length === 0 ? (
                  <TableRow className="h-64 hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center">
                      <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <Building2 className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">No Exhibitors Found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  exhibitors.map((exhibitor) => (
                    <TableRow key={exhibitor._id} className="h-24 border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                      <TableCell className="px-10">
                         <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-google-yellow/5 border border-google-yellow/10 flex items-center justify-center font-black text-google-yellow italic text-lg shadow-sm relative overflow-hidden">
                              {exhibitor.logoUrl ? (
                                <Image 
                                  src={exhibitor.logoUrl} 
                                  alt={exhibitor.company} 
                                  fill 
                                  className="object-cover"
                                />
                              ) : (
                                exhibitor.company.charAt(0)
                              )}
                          </div>
                            <div>
                                <p className="font-black text-base text-slate-900 uppercase italic tracking-tight leading-none mb-1">{exhibitor.company}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{exhibitor.email}</p>
                            </div>
                         </div>
                      </TableCell>
                      <TableCell>
                         <Badge className="bg-slate-900 text-white border-none font-black uppercase text-[10px] px-3 py-1 rounded-lg">
                           STALL {exhibitor.stallNumber}
                         </Badge>
                      </TableCell>
                      <TableCell>
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{exhibitor.eventId?.name || 'Unassigned Session'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(exhibitor.status)}
                      </TableCell>
                      <TableCell className="px-10 text-right">
                         <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-google-blue/5 hover:text-google-blue">
                             <MoreVertical className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
