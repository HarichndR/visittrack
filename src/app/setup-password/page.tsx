"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Zap, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { useAuth } from "@/store/use-auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SetupPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (!user.mustChangePassword) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/auth/setup-password', { password });
      updateUser(res.data.data);
      toast.success("Security configuration updated", {
        description: "Your account is now fully active."
      });
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      toast.error("Configuration failed", {
        description: err.response?.data?.message || "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Visual Identity Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 pointer-events-none">
            <ShieldCheck className="h-96 w-96 text-slate-900" />
        </div>
        
        <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4 group">
                <div className="bg-google-blue p-3 rounded-2xl shadow-xl shadow-google-blue/20">
                    <Zap className="h-8 w-8 text-white" />
                </div>
                <span className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
                    Visi<span className="text-google-blue">Track</span>
                </span>
            </div>
            
            <div className="space-y-4">
                <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.9] text-slate-900">
                    Secure<br />Account<br /><span className="text-google-blue">Activation.</span>
                </h1>
                <p className="text-xl font-bold text-slate-400 max-w-lg leading-relaxed lowercase italic tracking-tight border-l-4 border-google-blue pl-6">
                    As an authorized team member, please set your secure access credentials to initialize your workstation.
                </p>
            </div>
        </div>
      </div>

      {/* Activation Portal Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-google-red/10 rounded-xl flex items-center justify-center mb-4">
                <ShieldAlert className="h-6 w-6 text-google-red" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Setup password</h2>
            <p className="text-sm text-slate-500 pl-0.5">Initial password configuration required</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-8 bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-solid">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <Lock className="h-4 w-4 text-google-blue" />
                    New Password
                </label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password || ""}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-blue/20 px-4"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-google-green" />
                    Confirm Password
                </label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={confirmPassword || ""}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-blue/20 px-4"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-solid active:scale-95 transition-all text-center"
              >
                {isLoading ? "Saving..." : (
                  <div className="flex items-center gap-3 justify-center">
                    Set password
                  </div>
                )}
              </Button>

              <button 
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mt-2"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="pt-6">
              <p className="text-center text-xs text-slate-400">
                End-to-End Encrypted
              </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
