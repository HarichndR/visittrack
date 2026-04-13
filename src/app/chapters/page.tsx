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
    Compass, 
    Globe, 
    Heart, 
    Calendar,
    ArrowRight,
    Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useAuth } from "@/store/use-auth";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Organization {
    _id: string;
    name: string;
    bio: string;
    logoUrl?: string;
    website?: string;
    followers: string[];
}

export default function ChaptersPage() {
    const { user } = useAuth();
    const { data: organizations, isLoading, refetch } = useQuery<Organization[]>({
        queryKey: ['organizations'],
        queryFn: async () => {
            const response = await api.get('/organizations');
            return response.data.data;
        },
    });

    const handleJoinChapter = async (orgId: string) => {
        try {
            const response = await api.post(`/organizations/${orgId}/follow`);
            refetch();
            toast.success(response.data.message || "Successfully joined chapter");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to join chapter");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-20 font-sans">
                {/* ... existing header ... */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-google-blue p-2 rounded-xl shadow-lg shadow-google-blue/10">
                                <Compass className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-google-blue italic">Global Chapter Network</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                            Discover <span className="text-google-blue">Chapters</span>
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Join professional communities and stay notified of upcoming events</p>
                    </div>
                </header>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-80 w-full rounded-[3rem] bg-slate-50" />)}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {organizations?.map((org, index) => (
                            <motion.div
                                key={org._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium group overflow-hidden hover:border-google-blue/30 transition-all duration-500">
                                    <div className="p-8 pb-0">
                                        <div className="flex justify-between items-start">
                                            <div className="h-20 w-20 rounded-[2.2rem] bg-slate-50 border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-110 transition-transform">
                                                {org.logoUrl ? (
                                                    <img src={org.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                                                ) : (
                                                    <Globe className="h-10 w-10 text-slate-200" />
                                                )}
                                            </div>
                                            <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 hover:bg-google-red/5 hover:text-google-red">
                                                <Heart className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardHeader className="p-8 pt-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-google-blue/10 text-google-blue border-none font-black px-3 py-1 rounded-lg uppercase text-[8px] tracking-widest">
                                                Verified Organization
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                                            {org.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs font-medium text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                                            {org.bio || "Professional event organization hosting industry-leading summits and community meetups."}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 pt-0 space-y-6">
                                        <div className="flex items-center justify-between py-4 border-t border-slate-50">
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Community</span>
                                                    <span className="text-sm font-black text-slate-900">{org.followers?.length || 0} Members</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Events</span>
                                                <span className="text-sm font-black text-slate-900 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Active
                                                </span>
                                            </div>
                                        </div>
                                        {org.followers?.includes(user?._id || '') ? (
                                            <Button 
                                                onClick={() => handleJoinChapter(org._id)}
                                                variant="outline"
                                                className="w-full h-14 border-google-blue text-google-blue font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all group flex items-center justify-center gap-3"
                                            >
                                                Following Chapter
                                                <ShieldCheck className="h-4 w-4" />
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={() => handleJoinChapter(org._id)}
                                                className="w-full h-14 bg-slate-900 hover:bg-google-blue text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-black/5 transition-all group flex items-center justify-center gap-3"
                                            >
                                                Join Chapter
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-center py-10">
                    <div className="flex items-center gap-4 px-8 py-5 bg-white rounded-[2rem] border border-slate-200/60 shadow-premium opacity-50">
                        <Zap className="h-4 w-4 text-google-yellow" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                            Automatic alerts enabled for chapter event launches.
                        </span>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
