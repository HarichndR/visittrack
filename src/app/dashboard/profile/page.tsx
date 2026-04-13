"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/store/use-auth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Briefcase, Heart, CheckCircle2 } from "lucide-react";
import api from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/common/image-upload";

const INTEREST_OPTIONS = [
  "Technology", "Business", "Marketing", "Design", 
  "Healthcare", "Finance", "Education", "Engineering"
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profession, setProfession] = useState(user?.profession || "");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfession(user.profession || "");
      setSelectedInterests(user.interests || []);
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await api.patch('/users/profile', {
        profession,
        interests: selectedInterests,
        avatarUrl
      });
      
      updateUser(response.data.data);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            My <span className="text-google-blue">Profile</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage your professional information and networking interests.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1 border-none shadow-premium rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
              <div className="flex flex-col items-center text-center gap-6">
                <ImageUpload 
                  value={avatarUrl}
                  onChange={setAvatarUrl}
                  onRemove={() => setAvatarUrl("")}
                  aspectRatio="square"
                  className="w-32"
                />
                <div>
                  <CardTitle className="text-2xl font-bold text-slate-900">{user?.name}</CardTitle>
                  <CardDescription className="text-google-blue font-bold uppercase tracking-widest text-[10px] mt-1">
                    {user?.role} Account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</Label>
                <p className="text-sm font-bold text-slate-700">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Status</Label>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-3 py-1 rounded-full">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-premium rounded-[2.5rem] bg-white">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-google-red" />
                  Professional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="profession" className="text-sm font-bold text-slate-700">What is your current profession?</Label>
                  <Input 
                    id="profession"
                    placeholder="e.g. Software Architect, Marketing Manager"
                    value={profession || ""}
                    onChange={(e) => setProfession(e.target.value)}
                    className="h-14 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-medium"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-premium rounded-[2.5rem] bg-white">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <Heart className="h-5 w-5 text-google-yellow" />
                  Interests & Networking
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Select areas you are interested in. This helps exhibitors understand your needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                <div className="flex flex-wrap gap-3">
                  {INTEREST_OPTIONS.map((interest) => {
                    const isSelected = selectedInterests.includes(interest);
                    return (
                      <button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        className={cn(
                          "px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 border-2",
                          isSelected 
                            ? "bg-google-blue/5 border-google-blue text-google-blue shadow-lg shadow-google-blue/10 scale-105" 
                            : "bg-slate-50 border-transparent text-slate-400 hover:border-slate-200"
                        )}
                      >
                        {interest}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:-translate-y-1 transition-all"
                  >
                    {isSaving ? "Saving Updates..." : "Save Profile Information"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

