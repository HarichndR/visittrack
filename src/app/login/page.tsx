"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, ShieldCheck, Zap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { useAuth } from "@/store/use-auth";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { OtpVerificationModal } from "@/components/auth/otp-verification-modal";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [interceptedOtp, setInterceptedOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      // useAuth.login doesn't return user directly, but it updates the store
      const user = useAuth.getState().user;
      if (user?.mustChangePassword) {
        router.push('/setup-password');
      } else {
        toast.success(`Welcome back, ${user?.name || 'User'}!`);
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { email });
      setInterceptedOtp(res.data.data.otp || "");
      setShowOtpModal(true);
      toast.success("Security code sent successfully", {
        description: `Check ${email} for your 6-digit access code.`
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otpValue: string) => {
    try {
      const res = await api.post('/auth/login-otp', { email, otp: otpValue });
      const { user, tokens } = res.data.data;
      useAuth.getState().setAuth(user, tokens);

      toast.success("Login successful");

      if (user.mustChangePassword) {
        router.push('/setup-password');
      } else {
        router.push('/dashboard');
      }
      setShowOtpModal(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      <OtpVerificationModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        email={email}
        interceptedOtp={interceptedOtp}
      />

      {/* Visual Identity Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 pointer-events-none">
          <Zap className="h-96 w-96 text-slate-900" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-google-blue/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-40 w-64 h-64 bg-google-red/5 rounded-full blur-3xl" />

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
              Global<br />Identification<br /><span className="text-google-blue">Control.</span>
            </h1>
            <p className="text-xl font-bold text-slate-400 max-w-lg leading-relaxed lowercase italic tracking-tight border-l-4 border-google-blue pl-6">
              Sign in to manage your event and access your dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Auth Portal Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12"
        >
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-google-blue/10 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-google-blue" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h2>
            <p className="text-sm text-slate-500 pl-0.5">Enter your email and password to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8 bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-premium relative">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-google-blue" />
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  required
                  value={email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-blue/20 px-4"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 ml-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-google-red" />
                    Password
                  </div>
                  <Link href="#" className="text-google-blue hover:underline transition-all">Forgot password?</Link>
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
            </div>

            <div className="flex flex-col gap-5">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-solid active:scale-95 transition-all outline-none ring-0"
              >
                {isLoading ? "Signing in..." : (
                  <div className="flex items-center gap-3">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </div>
                )}
              </Button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs font-medium text-slate-400 uppercase">or</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all outline-none"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-google-blue" />
                    Sign in with OTP
                  </div>
                )}
              </Button>
            </div>

            <p className="text-center text-xs text-slate-400">
              End-to-End Encrypted
            </p>
          </form>

          <div className="text-center space-y-4">
            <p className="text-sm font-medium text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-google-blue hover:text-google-blue/80 font-bold hover:underline transition-all">
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
