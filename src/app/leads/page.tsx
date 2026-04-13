"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Users,
  Search,
  Download,
  Filter,
  UserCheck,
  Star,
  Target,
  BarChart2,
  MoreVertical,
  Mail,
  Phone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface Lead {
  _id: string;
  visitorId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    organizationName: string;
  };
  visitorSnapshot?: {
    name: string;
    email: string;
    phone: string;
    profession?: string;
    interests?: string[];
  };
  capturedBy?: {
    _id: string;
    name: string;
  };
  rating: number;
  status: 'COLD' | 'WARM' | 'HOT';
  notes: string;
  createdAt: string;
}

export default function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: leads, isLoading } = useQuery<Lead[]>({
    queryKey: ['my-leads'],
    queryFn: async () => {
      const response = await api.get('/leads');
      return response.data.data;
    },
  });

  const filteredLeads = leads?.filter(lead => {
    const searchLow = searchTerm.toLowerCase();
    const nameMatch = lead.visitorSnapshot?.name?.toLowerCase().includes(searchLow) || 
                     lead.visitorId?.name?.toLowerCase().includes(searchLow);
    const professionMatch = lead.visitorSnapshot?.profession?.toLowerCase().includes(searchLow);
    return nameMatch || professionMatch;
  });

  // Analytics logic
  const topScanner = leads?.reduce((acc: any, lead) => {
    const scannerName = lead.capturedBy?.name || "Booth Owner";
    acc[scannerName] = (acc[scannerName] || 0) + 1;
    return acc;
  }, {});
  
  const bestStaff = topScanner ? Object.entries(topScanner).sort((a: any, b: any) => b[1] - a[1])[0] : null;

  const stats = [
    { label: "Total Captured", value: leads?.length || 0, icon: Target, color: "text-google-blue", bg: "bg-google-blue/10" },
    { label: "Top Performer", value: bestStaff ? `${bestStaff[1]} Leads` : "0", icon: BarChart2, color: "text-google-red", bg: "bg-google-red/10", sub: bestStaff ? bestStaff[0] : "N/A" },
    { label: "Nurture Status", value: "100%", icon: UserCheck, color: "text-google-green", bg: "bg-google-green/10", sub: "Automated Deliveries" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Exhibitor Leads</h1>
            <p className="text-sm text-slate-500 pl-0.5">Real-time lead management & tracking</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl border-2 border-slate-200 font-medium text-sm h-10 px-5">
              <Download className="mr-2 h-4 w-4 text-google-green" />
              Export CSV
            </Button>
            <Button className="rounded-xl bg-google-blue hover:bg-google-blue/90 text-white font-medium text-sm h-10 px-6">
              Analytics
            </Button>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-premium group overflow-hidden">
              <CardContent className="p-8 flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 leading-none mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold tracking-tighter text-slate-900 leading-none">{stat.value}</p>
                  {stat.sub && <p className="text-xs text-google-blue mt-1">{stat.sub}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
          <CardHeader className="p-10 pb-6 bg-slate-50/50 border-b border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-900">Captured Leads</CardTitle>
                <CardDescription className="text-sm text-slate-400">{filteredLeads?.length || 0} contacts found</CardDescription>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or profession..."
                    className="pl-12 h-10 bg-white border-2 border-slate-200 rounded-xl text-sm focus:ring-google-blue/20"
                    value={searchTerm || ""}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="h-12 w-12 p-0 border-slate-200 rounded-xl">
                  <Filter className="h-4 w-4 text-slate-400" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-10 space-y-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl bg-slate-50" />)}
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow className="border-b border-slate-100/50">
                    <TableHead className="px-8 py-4 text-xs font-bold text-slate-500">Visitor</TableHead>
                    <TableHead className="py-4 text-xs font-bold text-slate-500">Profile</TableHead>
                    <TableHead className="py-4 text-xs font-bold text-slate-500 text-center">Contact</TableHead>
                    <TableHead className="py-4 text-xs font-bold text-slate-500 text-center">Rating</TableHead>
                    <TableHead className="py-4 text-xs font-bold text-slate-500 text-center">Status</TableHead>
                    <TableHead className="py-4 text-xs font-bold text-slate-500 text-center">Date</TableHead>
                    <TableHead className="px-8 py-4 text-xs font-bold text-slate-500 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads?.map((lead) => (
                    <TableRow key={lead._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-google-blue/5 border border-google-blue/10 flex items-center justify-center font-bold text-google-blue mb-1">
                            {(lead.visitorSnapshot?.name || lead.visitorId?.name || "V").charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-900">{lead.visitorSnapshot?.name || lead.visitorId?.name}</p>
                            <p className="text-xs text-slate-400">
                              {lead.visitorId?.organizationName || "Independent"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-6">
                         <div className="space-y-1.5">
                            <p className="text-xs font-bold text-slate-700">{lead.visitorSnapshot?.profession || "Member"}</p>
                            <div className="flex flex-wrap gap-1">
                               {lead.visitorSnapshot?.interests?.slice(0, 2).map(interest => (
                                 <Badge key={interest} variant="outline" className="text-[8px] px-1.5 py-0 rounded-md border-slate-100 text-slate-400 font-bold uppercase">
                                   {interest}
                                 </Badge>
                               ))}
                            </div>
                         </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-400" title={lead.visitorSnapshot?.email || lead.visitorId?.email}><Mail className="h-3.5 w-3.5" /></div>
                          <div className="p-2 rounded-lg bg-slate-100 text-slate-400" title={lead.visitorSnapshot?.phone || lead.visitorId?.phone}><Phone className="h-3.5 w-3.5" /></div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${i < lead.rating ? 'text-google-yellow fill-google-yellow' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`
                          rounded-lg font-bold uppercase text-[9px] px-3 py-1 h-auto border-none shadow-sm
                          ${lead.status === 'HOT' ? 'bg-google-red/10 text-google-red shadow-google-red/5' :
                            lead.status === 'WARM' ? 'bg-google-yellow/10 text-google-yellow shadow-google-yellow/5' :
                              'bg-google-blue/10 text-google-blue shadow-google-blue/5'}
                        `}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </TableCell>
                      <TableCell className="px-10 text-right">
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-slate-100">
                          <MoreVertical className="h-4 w-4 text-slate-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {!isLoading && filteredLeads?.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <div className="p-8 bg-slate-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto border border-slate-100">
                  <Users className="h-10 w-10 text-slate-200" />
                </div>
                <p className="text-sm text-slate-400">No leads captured yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
