"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Timer, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  email: string;
  interceptedOtp?: string; // OTP returned in dev mode
}

export function OtpVerificationModal({ 
  isOpen, 
  onClose, 
  onVerify, 
  email,
  interceptedOtp 
}: OtpVerificationModalProps) {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, timeLeft]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      await onVerify(otp);
      toast.success('OTP Verified successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-3xl bg-white">
        <div className="bg-google-blue h-2" />
        <div className="p-8">
          <DialogHeader className="mb-8">
            <div className="h-16 w-16 bg-google-blue/10 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-8 w-8 text-google-blue" />
            </div>
            <DialogTitle className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
              Verification Required
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-lg pt-2">
              We've sent a 6-digit code to <span className="text-slate-900 font-black">{email}</span>.
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence>
            {interceptedOtp && timeLeft > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-3xl p-6 mb-8 border border-white/10 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div className="h-2 w-2 rounded-full bg-google-green animate-pulse" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Development Intercept</p>
                <div className="flex items-center justify-between">
                  <span className="text-4xl font-black text-white tracking-[0.3em] font-mono">{interceptedOtp}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-google-blue uppercase tracking-widest leading-none mb-1">Expires in</span>
                    <div className="flex items-center gap-1.5 text-white font-black text-xl">
                      <Timer className="h-4 w-4" />
                      {timeLeft}s
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: 20, ease: "linear" }}
                    className="h-full bg-google-blue"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            <div className="relative">
              <Input
                value={otp || ""}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="h-20 text-center text-3xl font-black tracking-[0.5em] rounded-3xl border-2 border-slate-100 focus:border-google-blue focus:ring-4 focus:ring-google-blue/10 transition-all bg-slate-50"
                maxLength={6}
              />
            </div>

            <Button 
              onClick={handleVerify}
              disabled={isVerifying || otp.length < 6}
              className="w-full h-16 rounded-2xl bg-google-blue hover:bg-google-blue/90 text-white font-black uppercase italic tracking-widest text-sm transition-all group shadow-xl shadow-google-blue/20"
            >
              {isVerifying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>Verify & Launch <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </div>
        </div>
        
        <DialogFooter className="bg-slate-50 p-6 flex items-center justify-center border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Secure Verification Powered by VisiTrack
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
