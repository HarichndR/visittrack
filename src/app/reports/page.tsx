"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Download,
  FilePieChart,
  FileText,
  TrendingUp,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    },
  });

  const reportModules = [
    {
      title: "Visitor Traffic",
      description: "Analysis of check-in velocity and peak hour distributions for active events.",
      icon: Users,
      color: "text-google-blue",
      bg: "bg-google-blue/5"
    },
    {
      title: "Partner Engagement",
      description: "Exhibitor performance, stall occupancy metrics and satisfaction indices.",
      icon: Layers,
      color: "text-google-green",
      bg: "bg-google-green/5"
    },
    {
      title: "Attendee Demographics",
      description: "Overview of visitor origins and interests to optimize future events.",
      icon: Globe,
      color: "text-google-yellow",
      bg: "bg-google-yellow/5"
    },
    {
      title: "Check-in History",
      description: "Comprehensive log of entry/exit timestamps and session status.",
      icon: ShieldCheck,
      color: "text-google-red",
      bg: "bg-google-red/5"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">Analytics Hub</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">Comprehensive performance metrics and event reports</p>
          </div>
          <div className="flex items-center gap-3">
            <Button className="h-12 bg-google-blue hover:bg-google-blue/90 text-white font-black uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-xl shadow-google-blue/20 transition-all active:scale-95">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </header>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Primary Analytics Card */}
          <Card className="lg:col-span-8 bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden border-l-[12px] border-l-google-blue">
            <CardHeader className="p-12 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-google-blue/10 rounded-2xl shadow-xl shadow-google-blue/5">
                    <TrendingUp className="h-8 w-8 text-google-blue" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Attendance Trends</CardTitle>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Daily visitor volume summary</p>
                  </div>
                </div>
                <Badge variant="outline" className="h-fit rounded-xl border-slate-200 text-slate-400 font-black uppercase text-[10px] px-5 py-2 h-auto">Active Analysis</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-12 pt-8">
              <div className="h-[450px] w-full mt-4">
                {isLoading ? (
                  <Skeleton className="h-full w-full rounded-[2.5rem] bg-slate-50" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.trends ?? []}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4285F4" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="_id"
                        stroke="#cbd5e1"
                        fontSize={10}
                        fontWeight="900"
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(val: string) => val.split('-').slice(1).join('/')}
                      />
                      <YAxis
                        stroke="#cbd5e1"
                        fontSize={10}
                        fontWeight="900"
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.5rem', boxShadow: 'var(--shadow-premium)', padding: '1.5rem' }}
                        itemStyle={{ color: '#4285F4', fontWeight: '900', fontSize: '16px', textTransform: 'uppercase' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: '900', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#4285F4"
                        strokeWidth={5}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Side Distribution Card */}
          <Card className="lg:col-span-4 bg-slate-900 border-none rounded-[3rem] shadow-2xl p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700">
              <FilePieChart className="h-64 w-64 text-white" />
            </div>
            <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-google-yellow" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-google-yellow">Distribution Model</span>
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white leading-tight">Occupancy Metrics</h3>
              </div>

              <div className="h-[300px] w-full relative">
                {isLoading ? (
                  <Skeleton className="h-full w-full rounded-full bg-white/5" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Checked In', value: stats?.summary?.checkedInVisitors || 10 },
                          { name: 'Pending', value: (stats?.summary?.totalVisitors || 50) - (stats?.summary?.checkedInVisitors || 10) }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={10}
                        dataKey="value"
                      >
                        <Cell fill="#4285F4" />
                        <Cell fill="rgba(255,255,255,0.05)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-4xl font-black italic tracking-tighter text-white">
                    {stats?.summary?.occupancyRate.toFixed(0) || 0}%
                  </p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Rate</p>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/5 pt-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-google-blue" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Verified Entrance</span>
                  </div>
                  <span className="text-lg font-black text-white italic">{stats?.summary?.checkedInVisitors || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-white/5" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Awaiting Registry</span>
                  </div>
                  <span className="text-lg font-black text-white italic">{(stats?.summary?.totalVisitors || 0) - (stats?.summary?.checkedInVisitors || 0)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Report Extraction Modules */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reportModules.map((module, i) => (
            <Card key={i} className="bg-white border border-slate-200/60 rounded-[2.5rem] shadow-premium hover:shadow-2xl transition-all group overflow-hidden border-b-8 border-b-transparent hover:border-b-google-blue">
              <CardContent className="p-10 space-y-6">
                <div className={`p-5 rounded-2xl ${module.bg} ${module.color} w-fit transition-transform group-hover:scale-110 shadow-lg`}>
                  <module.icon className="h-8 w-8" />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">{module.title}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight leading-relaxed opacity-70">{module.description}</p>
                </div>
                <Button variant="outline" className="w-full h-12 border-slate-200 text-slate-900 font-black uppercase italic tracking-widest text-[9px] rounded-xl group/btn hover:bg-slate-50">
                  Export Report
                  <FileText className="ml-2 h-3.5 w-3.5 group-hover/btn:scale-110 transition-transform text-google-blue" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Integrity Summary */}
        <Card className="bg-white border-none shadow-premium rounded-[4rem] p-16 relative overflow-hidden group">
          <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-2xl text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Sparkles className="h-6 w-6 text-google-yellow" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-google-yellow">Executive Summary</span>
              </div>
              <h3 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Unified Insights</h3>
              <p className="text-lg font-bold text-slate-400 leading-relaxed italic lowercase tracking-tight border-l-8 border-google-blue pl-8">
                automatically comparing visitor activity with historical trends to produce reliable engagement insights for every session.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto">
              <Button size="lg" className="h-16 px-12 bg-google-blue hover:bg-google-blue/90 text-white font-black text-lg uppercase italic tracking-tighter rounded-2xl shadow-2xl shadow-google-blue/20 transition-all hover:scale-105 active:scale-95">
                Generate Summary Report
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
