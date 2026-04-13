"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  Activity,
  Zap,
  Globe,
  ArrowUpRight,
  Target,
  Monitor,
  ShieldCheck,
  Heart,
  Star
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/store/use-auth";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Printer, QrCode as QrIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardStats {
  summary: {
    totalVisitors?: number;
    checkedInVisitors?: number;
    pendingClearance?: number;
    confirmedBookings?: number;
    activeExhibitors?: number;
    occupancyRate?: number;
    totalBookings?: number;
    savedEventsCount?: number;
    latestBooking?: any;
    totalOrganizers?: number;
    pendingRequests?: number;
    activeEvents?: number;
    platformHealth?: string;
    // Exhibitor specific
    totalLeads?: number;
    hotLeads?: number;
    averageRating?: string;
    leadHealth?: string;
    chapterMembers?: number;
    totalRevenue?: number;
  };
  trends: { _id: string; count: number }[];
  ticketDistribution?: { name: string; value: number }[];
  requestDistribution?: { _id: string; count: number }[];
  efficiency?: { name: string; value: number }[];
}

const COLORS = ['#4285F4', '#34A853', '#FBBC05', '#EA4335', '#9C27B0', '#00BCD4'];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'VISITOR') {
      router.replace('/events');
    }
  }, [user, router]);

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    enabled: user?.role !== 'VISITOR',
    queryFn: async () => {
      const response = await api.get('/dashboard/stats');
      return response.data.data;
    },
  });

  const getStatsCards = () => {
    if (user?.role === 'ADMIN') {
      return [
        {
          title: "Pending Approvals",
          value: stats?.summary?.pendingRequests ?? 0,
          icon: ShieldCheck,
          color: "bg-google-yellow",
          textColor: "text-google-yellow",
          trend: "ACTION NEEDED",
          label: "Organizer requests"
        },
        {
          title: "Active Organizers",
          value: stats?.summary?.totalOrganizers ?? 0,
          icon: Users,
          color: "bg-google-blue",
          textColor: "text-google-blue",
          trend: "STABLE",
          label: "Total accounts"
        },
        {
          title: "Global Events",
          value: stats?.summary?.activeEvents ?? 0,
          icon: Building2,
          color: "bg-google-green",
          textColor: "text-google-green",
          trend: "ACTIVE",
          label: "Running exhibitions"
        },
        {
          title: "Platform Health",
          value: stats?.summary?.platformHealth ?? "ONLINE",
          icon: Activity,
          color: "bg-google-red",
          textColor: "text-google-red",
          trend: "SECURE",
          label: "System Status"
        }
      ];
    }

    if (user?.role === 'EXHIBITOR') {
      return [
        {
          title: "Captured Leads",
          value: stats?.summary?.totalLeads ?? 0,
          icon: Users,
          color: "bg-google-blue",
          textColor: "text-google-blue",
          trend: "LIVE",
          label: "Enriched contacts"
        },
        {
          title: "High Intent (Hot)",
          value: stats?.summary?.hotLeads ?? 0,
          icon: Zap,
          color: "bg-google-red",
          textColor: "text-google-red",
          trend: "PRIORITY",
          label: "Immediate follow-up"
        },
        {
          title: "Enrichment Quality",
          value: stats?.summary?.averageRating ?? "0.0",
          icon: Star,
          color: "bg-google-yellow",
          textColor: "text-google-yellow",
          trend: "AVG SCALE",
          label: "Feedback score"
        },
        {
          title: "System Status",
          value: stats?.summary?.leadHealth ?? "ACTIVE",
          icon: Activity,
          color: "bg-google-green",
          textColor: "text-google-green",
          trend: "SYNCED",
          label: "Network Health"
        }
      ];
    }

    // Default Organizer/Staff Stats
    return [
        {
          title: "Projected Revenue",
          value: `$${(stats?.summary?.totalRevenue ?? 0).toLocaleString()}`,
          icon: TrendingUp,
          color: "bg-google-blue",
          textColor: "text-google-blue",
          trend: "FINANCIAL",
          label: "Total pool value"
        },
        {
          title: "Authorized Access",
          value: (stats?.summary?.confirmedBookings ?? 0).toLocaleString(),
          icon: ShieldCheck,
          color: "bg-google-yellow",
          textColor: "text-google-yellow",
          trend: "VERIFIED",
          label: "Ready for entry"
        },
        {
          title: "Live Attendance",
          value: (stats?.summary?.checkedInVisitors ?? 0).toLocaleString(),
          icon: UserCheck,
          color: "bg-google-green",
          textColor: "text-google-green",
          trend: `${stats?.summary?.occupancyRate?.toFixed(1) ?? 0}%`,
          label: "Venue Occupancy"
        },
        {
          title: "Community Reach",
          value: (stats?.summary?.chapterMembers ?? 0).toLocaleString(),
          icon: Globe,
          color: "bg-google-red",
          textColor: "text-google-red",
          trend: "ENGAGEMENT",
          label: "Followers count"
        },
      ];
  };

  const EmptyChartState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-30">
      <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
        <Zap className="h-8 w-8 text-slate-300" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{message}</p>
    </div>
  );

  const statsCards = getStatsCards();

  const renderAdminCharts = () => (
    <div className="grid gap-8 lg:grid-cols-2 mt-8">
      {/* Request Distribution Pie Chart */}
      <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
        <CardHeader className="p-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-google-yellow/10 rounded-xl">
              <Zap className="h-5 w-5 text-google-yellow" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-tighter text-slate-900">Request Distribution</CardTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Onboarding Status Overview</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          {!stats?.requestDistribution || stats.requestDistribution.length === 0 ? (
            <EmptyChartState message="No Onboarding Activity Detected" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={(stats?.requestDistribution || []).map(r => ({ name: r._id, value: r.count }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.requestDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: 'var(--shadow-premium)' }}
                  itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Organizer Growth Bar Chart */}
      <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
        <CardHeader className="p-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-google-blue/10 rounded-xl">
              <Users className="h-5 w-5 text-google-blue" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-tighter text-slate-900">Platform Intensity</CardTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">New Entities per day</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats?.trends || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="_id" axisLine={false} tickLine={false} fontSize={10} fontWeight="900" stroke="#cbd5e1" />
              <YAxis axisLine={false} tickLine={false} fontSize={10} fontWeight="900" stroke="#cbd5e1" />
              <Tooltip 
                 cursor={{fill: '#f8fafc'}}
                 contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: 'var(--shadow-premium)' }}
              />
              <Bar dataKey="count" fill="#4285F4" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrganizerCharts = () => (
    <div className="grid gap-8 lg:grid-cols-2 mt-8">
      {/* Ticket Distribution Pie Chart */}
      <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
        <CardHeader className="p-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-google-green/10 rounded-xl">
              <Target className="h-5 w-5 text-google-green" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-tighter text-slate-900">Tier Distribution</CardTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Visitor Category Analytics</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px]">
          {!stats?.ticketDistribution || stats.ticketDistribution.length === 0 ? (
            <EmptyChartState message="No Registration Data Identified" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.ticketDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.ticketDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: 'var(--shadow-premium)' }}
                  itemStyle={{ fontWeight: '900', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Capital Flow Bar Chart */}
      <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden border-b-8 border-b-google-blue">
        <CardHeader className="p-8 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-google-blue/10 rounded-xl">
              <TrendingUp className="h-5 w-5 text-google-blue" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold uppercase tracking-tighter text-slate-900">Capital Flow</CardTitle>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue performance overview</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] p-8">
           <div className="flex flex-col h-full">
              <div className="flex-1 flex items-end gap-4 pb-4">
                 {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-t-xl relative group"
                    >
                       <div className="absolute inset-0 bg-google-blue opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                    </motion.div>
                 ))}
              </div>
              <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                 <span>Mon</span>
                 <span>Tue</span>
                 <span>Wed</span>
                 <span>Thu</span>
                 <span>Fri</span>
                 <span>Sat</span>
                 <span>Sun</span>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderExhibitorCharts = () => (
    <div className="grid gap-8 lg:grid-cols-1 mt-8">
      <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden border-l-8 border-l-google-red">
        <CardHeader className="p-10 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-google-red/10 rounded-2xl">
                <TrendingUp className="h-6 w-6 text-google-red" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold uppercase tracking-tighter text-slate-900">Leads Acquisition Velocity</CardTitle>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Live platform analytics</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-10 pt-4">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trends ?? []}>
                <defs>
                  <linearGradient id="colorLeadCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA4335" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#EA4335" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="_id" 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#cbd5e1" 
                  fontSize={10} 
                  fontWeight="900" 
                  tickLine={false} 
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ stroke: '#EA4335', strokeWidth: 1, strokeDasharray: '4 4' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-solid">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-google-red" />
                             <p className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                               {payload[0].value} <span className="text-[8px] font-bold tracking-widest ml-1 opacity-40">Captures</span>
                             </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#EA4335" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorLeadCount)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-10 pb-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tighter text-slate-900 uppercase">
              {user?.role === 'ADMIN' ? "System Overview" : user?.role === 'EXHIBITOR' ? "Lead Hub" : "Hub Overview"}
            </h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-0.5">
              Welcome back, {user?.name} <span className="mx-2 opacity-20">|</span> Real-time Analytics Dashboard
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 italic">System Stable</span>
          </div>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, index) => (
            <Card key={index} className="bg-white border border-slate-200/60 rounded-[2rem] shadow-premium hover:shadow-xl transition-all group overflow-hidden border-b-4 border-b-transparent hover:border-b-google-blue/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {card.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${card.color} bg-opacity-10 transition-transform group-hover:scale-110`}>
                  <card.icon className={`h-4 w-4 ${card.textColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-24 bg-slate-100 rounded-lg" />
                ) : (
                  <div className="space-y-1">
                    <div className="text-3xl font-bold tracking-tighter text-slate-900 uppercase">{card.value}</div>
                    <div className="flex items-center text-[10px] font-black uppercase tracking-widest pt-1">
                      <span className={`${card.textColor} mr-2 flex items-center`}>
                        <ArrowUpRight className="h-3 w-3 mr-0.5" />
                        {card.trend}
                      </span>
                      <span className="text-slate-300">{card.label}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {user?.role === 'EXHIBITOR' ? (
           renderExhibitorCharts()
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {user?.role !== 'ADMIN' && (
              <div className="lg:col-span-4 space-y-8">
                <Card className="bg-slate-900 border-none rounded-[3rem] p-10 shadow-premium relative overflow-hidden group">
                  <div className="absolute -bottom-10 -right-10 h-48 w-48 bg-google-blue/10 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-google-blue" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-google-blue">Quick Action</span>
                    </div>
                    <h3 className="text-2xl font-bold uppercase tracking-tighter text-white leading-tight">
                      Platform <br/> Overview
                    </h3>
                    <p className="text-slate-400 text-sm font-bold leading-relaxed lowercase italic tracking-tight">
                      manage your exhibitions, stall mapping, and bulk registrations from the unified control center.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button asChild className="w-full h-12 bg-white text-slate-900 font-black uppercase italic tracking-widest text-[10px] rounded-xl hover:bg-slate-100 transition-all shadow-xl shadow-black/20">
                        <Link href="/events">View All Events</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full h-12 border-white/20 bg-white/5 text-white font-black uppercase italic tracking-widest text-[10px] rounded-xl hover:bg-white/10 transition-all">
                        <Link href="/visitors">Visitor Registry</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* System Activity Chart for Admin/Organizer */}
            <Card className={cn(
              "bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden border-l-8 border-l-google-blue",
              user?.role === 'ADMIN' ? "lg:col-span-12" : "lg:col-span-8"
            )}>
              <CardHeader className="p-10 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-google-blue/10 rounded-2xl">
                      <TrendingUp className="h-6 w-6 text-google-blue" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold uppercase tracking-tighter text-slate-900">
                        {user?.role === 'ADMIN' ? "Platform Growth" : "Attendance Analytics"}
                      </CardTitle>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-0.5">
                        {user?.role === 'ADMIN' ? "New Events Activation" : "Real-time Traffic Metrics"}
                      </p>
                    </div>
                  </div>

                </div>
              </CardHeader>
              <CardContent className="p-10 pt-4">
                <div className="h-[400px] w-full mt-6">
                  {isLoading ? (
                    <Skeleton className="h-full w-full rounded-[2rem] bg-slate-50" />
                  ) : !stats?.trends || stats.trends.length === 0 ? (
                    <EmptyChartState message="No Temporal Activity Recorded" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.trends}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4285F4" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                          dataKey="_id"
                          stroke="#cbd5e1"
                          fontSize={10}
                          fontWeight="900"
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="#cbd5e1"
                          fontSize={10}
                          fontWeight="900"
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                        />
                        <Tooltip
                          cursor={{ stroke: '#4285F4', strokeWidth: 1, strokeDasharray: '4 4' }}
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white border-2 border-slate-800 rounded-2xl p-4 shadow-solid">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
                                  <div className="flex items-center gap-2">
                                     <div className="h-2 w-2 rounded-full bg-google-blue" />
                                     <p className="text-xl font-black tracking-tighter text-slate-900 uppercase">
                                       {payload[0].value} <span className="text-[8px] font-bold tracking-widest ml-1 opacity-40">Active</span>
                                     </p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#4285F4"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorCount)"
                          animationDuration={2000}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Additional Distribution Charts */}
        {!isLoading && user?.role !== 'EXHIBITOR' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {user?.role === 'ADMIN' ? renderAdminCharts() : renderOrganizerCharts()}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
