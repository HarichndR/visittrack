"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Building2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  organizationName: z.string().min(2, "Organization/Business Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  website: z.string().optional(),
  description: z.string().optional(),
  role: z.enum(["VISITOR", "EXHIBITOR", "ORGANIZER"]),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [step, setStep] = useState(0); // Start at role selection
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      organizationName: "",
      phone: "",
      website: "",
      description: "",
      role: "VISITOR",
    },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      if (data.role === 'ORGANIZER') {
        await api.post("/users/public-organizer-request", {
          name: data.name,
          email: data.email,
          businessName: data.organizationName,
          website: data.website,
          description: data.description || `Organic request from ${data.organizationName}`,
          phone: data.phone
        });
        toast.success("Application submitted successfully");
      } else {
        await api.post("/auth/register", data);
        toast.success("Account created successfully");
      }
      setStep(3);
    } catch (err: unknown) {
      type ErrorLike = { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        typeof err === "object" && err !== null && "response" in err
          ? ((err as ErrorLike).response?.data?.message ?? (err as ErrorLike).message)
          : err instanceof Error
            ? err.message
            : "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    if (step === 0) {
      if (form.watch('role') === 'ORGANIZER') {
        setStep(4); // Dedicated Organizer Request Step
      } else {
        setStep(1);
      }
      return;
    }
    const fields = step === 1 ? ["name", "email", "password"] : (step === 2 ? ["organizationName", "phone"] : ["name", "email", "organizationName", "phone", "description"]);
    const isValid = await form.trigger(fields as (keyof RegisterValues)[]);
    if (isValid) setStep(step + 1);
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Visual Identity Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center p-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-[0.03] rotate-12 pointer-events-none">
          <Zap className="h-96 w-96 text-slate-900" />
        </div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-google-green/5 rounded-full blur-3xl" />
        <div className="absolute -top-20 right-40 w-64 h-64 bg-google-yellow/5 rounded-full blur-3xl" />

        <div className="relative z-10 space-y-10 focus:outline-none">
          <div className="flex items-center gap-4 group">
            <div className="bg-google-green p-3 rounded-2xl shadow-xl shadow-google-green/20">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
              Visi<span className="text-google-green">Track</span>
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-7xl font-black uppercase italic tracking-tighter leading-[0.9] text-slate-900">
              Launch<br />Your Next<br /><span className="text-google-green">Event.</span>
            </h1>
            <p className="text-xl font-bold text-slate-400 max-w-lg leading-relaxed lowercase italic tracking-tight border-l-4 border-google-green pl-6">
              build your event operations hub with streamlined registration, attendee management, and real-time analytics.
            </p>
          </div>


        </div>
      </div>

      {/* Auth Portal Section */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-10"
        >
          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 bg-google-green/10 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6 text-google-green" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create account</h2>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    step === s ? "w-10 bg-google-green" : "w-2 bg-slate-100"
                  )}
                />
              ))}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white p-10 rounded-[3rem] border border-slate-200/60 shadow-premium relative">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold tracking-tight text-slate-900 text-center uppercase">I am joining as...</h3>
                      <div className="grid gap-4">
                        {[
                          { id: 'VISITOR', title: 'Visitor', desc: 'Attend events & network', icon: User, color: 'text-google-blue', bg: 'bg-google-blue/10' },
                          { id: 'EXHIBITOR', title: 'Exhibitor', desc: 'Showcase your brand', icon: Store, color: 'text-google-yellow', bg: 'bg-google-yellow/10' },
                          { id: 'ORGANIZER', title: 'Organizer', desc: 'Manage event operations', icon: Building2, color: 'text-google-green', bg: 'bg-google-green/10' },
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              form.setValue('role', r.id as any);
                              nextStep();
                            }}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group",
                              form.watch('role') === r.id 
                                ? "border-slate-800 bg-slate-50 shadow-lg" 
                                : "border-slate-100 hover:border-slate-200"
                            )}
                          >
                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shrink-0", r.bg)}>
                              <r.icon className={cn("h-6 w-6", r.color)} />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">{r.title}</p>
                              <p className="text-[10px] font-medium text-slate-400">{r.desc}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                            <User className="h-4 w-4 text-google-blue" /> Full Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John Doe" className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-green/20 px-4" />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-google-red" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                            <Mail className="h-4 w-4 text-google-green" /> Email
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="email" placeholder="email@example.com" className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-green/20 px-4" />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-google-red" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                            <Lock className="h-4 w-4 text-google-red" /> Password
                          </FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="••••••••" className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-green/20 px-4" />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-google-red" />
                        </FormItem>
                      )}
                    />
                    <Button type="button" onClick={nextStep} className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-solid group">
                      Next <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="organizationName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-google-blue" /> Organization Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Acme Corp" className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-green/20 px-4" />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-google-red" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-google-green" /> Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+1 123-456-7890" className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-green/20 px-4" />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-google-red" />
                        </FormItem>
                      )}
                    />

                    {form.watch('role') === 'ORGANIZER' && (
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-bold text-slate-700 ml-1 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-google-yellow" /> Tell us about your events
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the scale and type of events you manage..." className="h-12 bg-slate-50 border-2 border-slate-200 text-left font-medium text-sm rounded-xl focus:ring-google-green/20 px-4" />
                            </FormControl>
                            <FormMessage className="text-xs font-bold text-google-red" />
                          </FormItem>
                        )}
                      />
                    )}
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(1)} className="h-12 flex-1 border-2 border-slate-200 rounded-xl font-bold text-sm text-slate-700">
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                      </Button>
                      <Button type="submit" disabled={isLoading} className="h-12 flex-[2] bg-google-green hover:bg-google-green/90 text-white font-bold text-sm rounded-xl shadow-solid active:scale-95 transition-all">
                        {isLoading ? "Creating..." : "Create account"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="bg-google-green/5 p-4 rounded-2xl border border-google-green/10 flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-google-green" />
                        <p className="text-[10px] font-bold text-google-green uppercase tracking-widest">Organizer Application Portal</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase text-slate-400">Representative Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Full Name" className="h-11 bg-slate-50 border-slate-200 rounded-xl font-bold text-xs" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase text-slate-400">Work Email</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="email@company.com" className="h-11 bg-slate-50 border-slate-200 rounded-xl font-bold text-xs" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Business Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Official Company Name" className="h-11 bg-slate-50 border-slate-200 rounded-xl font-bold text-xs" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase text-slate-400">Phone</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Contact Number" className="h-11 bg-slate-50 border-slate-200 rounded-xl font-bold text-xs" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-black uppercase text-slate-400">Website</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://..." className="h-11 bg-slate-50 border-slate-200 rounded-xl font-bold text-xs" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Brief Proposal</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Describe the scale and type of events you manage..." className="h-20 bg-slate-50 border-slate-200 rounded-xl font-bold text-xs align-top pt-2" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button type="button" variant="outline" onClick={() => setStep(0)} className="h-12 flex-1 rounded-xl font-bold text-xs">
                        Back
                      </Button>
                      <Button type="submit" disabled={isLoading} className="h-12 flex-[2] bg-google-green text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-google-green/10">
                        {isLoading ? "Submitting Application..." : "Submit Application"}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-10 text-center py-6"
                  >
                    <div className="flex justify-center">
                      <div className="h-24 w-24 bg-google-green/10 rounded-full flex items-center justify-center border border-google-green/20 shadow-2xl shadow-google-green/5">
                        <CheckCircle2 className="h-12 w-12 text-google-green" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
                        {form.watch('role') === 'ORGANIZER' ? "Request Received" : "Account created"}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 text-center mx-auto max-w-[280px]">
                        {form.watch('role') === 'ORGANIZER' 
                          ? "Our administrators will review your application and contact you via email once approved."
                          : "Your account has been successfully created."}
                      </p>
                    </div>
                    <Button onClick={() => router.push("/login")} className="w-full h-12 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-xl shadow-solid">
                      Go to Dashboard
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>

          {step < 3 && (
            <div className="text-center">
              <p className="text-sm font-medium text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-google-green hover:text-google-green/80 font-bold hover:underline transition-all group"
                >
                  Sign in <ArrowRight className="inline-block h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
