"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Zap, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type FieldType = 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';

export interface FormFieldSchema {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[] | string[];
  description?: string;
}

export interface FormStep {
  title: string;
  description?: string;
  fields: FormFieldSchema[];
}

interface DynamicFormProps {
  steps?: FormStep[];
  fields?: FormFieldSchema[];
  onSubmit: (data: Record<string, unknown>) => void;
  title?: string;
  description?: string;
  submitLabel?: string;
  isLoading?: boolean;
}

export function DynamicForm({
  steps,
  fields: flatFields,
  onSubmit,
  title,
  description,
  submitLabel = "Complete Registration",
  isLoading = false
}: DynamicFormProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const activeSteps: FormStep[] =
    steps ||
    (flatFields
      ? [{ title: title || "Registration", description, fields: flatFields }]
      : []);

  const isMultiStep = activeSteps.length > 1;

  const allFields = activeSteps.flatMap((s) => s.fields);
  const shape: Record<string, z.ZodTypeAny> = {};

  allFields.forEach((field) => {
    let validator: z.ZodTypeAny = z.string();

    if (field.type === "number") validator = z.number();
    if (field.type === "email") validator = z.string().email();
    if (field.type === "checkbox") validator = z.boolean();

    if (field.required) {
      if (field.type === "checkbox") {
        validator = (validator as z.ZodBoolean).refine((val) => val === true, {
          message: `${field.label} is required`,
        });
      } else {
        validator = (validator as z.ZodString).min(1, {
          message: `${field.label} is required`,
        });
      }
    } else {
      validator = validator.optional();
    }

    shape[field.name] = validator;
  });

  const schema = z.object(shape);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: allFields.reduce((acc, field) => {
      acc[field.name] =
        field.type === "checkbox" ? false : "";
      return acc;
    }, {} as Record<string, string | boolean | number>),
  });

  const nextStep = async () => {
    const stepFields = activeSteps[currentStep].fields.map((f) => f.name);

    const result = await form.trigger(stepFields);

    if (result) {
      setCurrentStep((prev) =>
        Math.min(prev + 1, activeSteps.length - 1)
      );
    } else {
      toast.error("Please resolve the errors in this step first.");
    }
  };

  const prevStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 0));

  const isLastStep = currentStep === activeSteps.length - 1;

  return (
    <div className="bg-[#0A0F1E] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto w-full">

      {isMultiStep && (
        <div className="mb-12">
          <div className="flex justify-between mb-4">
            {activeSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                <div className={`
                  w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2
                  ${idx <= currentStep ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "bg-white/5 border-white/5 text-slate-500"}
                  ${idx < currentStep ? "bg-green-600 border-green-600" : ""}
                `}>
                  {idx < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-black italic">
                      {idx + 1}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] uppercase font-black tracking-widest hidden md:block ${idx <= currentStep ? "text-white" : "text-slate-600"}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
              className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            />
          </div>
        </div>
      )}

      <div className="mb-10 text-center space-y-3">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">
          {activeSteps[currentStep].title}
        </h2>
        {activeSteps[currentStep].description && (
          <p className="text-slate-500 font-medium lowercase italic tracking-tight">
            {activeSteps[currentStep].description}
          </p>
        )}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            onSubmit(data as Record<string, unknown>)
          )}
          className="space-y-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
              {activeSteps[currentStep].fields.map((field) => (
                <FormField
                  key={field.name}
                  control={form.control}
                  name={field.name}
                  render={({ field: formField }) => (
                    <FormItem className={field.type === "checkbox" ? "flex flex-row items-start space-x-3 space-y-0 rounded-2xl border border-white/5 bg-white/5 p-6 group transition-colors hover:border-indigo-500/20" : ""}>

                      {field.type !== "checkbox" && (
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </FormLabel>
                      )}

                      <FormControl>
                        {field.type === "select" ? (
                          <Select
                            onValueChange={formField.onChange}
                            defaultValue={formField.value as string}
                          >
                            <SelectTrigger className="h-14 bg-white/5 border-white/5 focus:border-indigo-500/50 rounded-2xl font-bold italic tracking-tight lowercase">
                              <SelectValue placeholder={field.placeholder || "Select option"} />
                            </SelectTrigger>
                            <SelectContent className="bg-[#020617] border-white/5 rounded-2xl">
                              {(Array.isArray(field.options)
                                ? field.options
                                : []
                              ).map((opt) => {
                                const val =
                                  typeof opt === "string"
                                    ? opt
                                    : opt.value;
                                const lbl =
                                  typeof opt === "string"
                                    ? opt
                                    : opt.label;

                                return (
                                  <SelectItem key={val} value={val}>
                                    {lbl}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        ) : field.type === "checkbox" ? (
                          <>
                            <Checkbox
                              checked={Boolean(formField.value)}
                              onCheckedChange={formField.onChange}
                            />
                            <div className="space-y-1 leading-none pt-1">
                              <FormLabel className="text-sm font-black uppercase italic tracking-tighter cursor-pointer">
                                {field.label}
                              </FormLabel>
                              {field.description && (
                                <FormDescription className="text-[10px] text-slate-500 lowercase leading-relaxed">
                                  {field.description}
                                </FormDescription>
                              )}
                            </div>
                          </>
                        ) : field.type === "textarea" ? (
                          <textarea
                            {...formField}
                            value={formField.value as string}
                            placeholder={field.placeholder}
                          />
                        ) : (
                          <Input
                            type={field.type}
                            {...formField}
                            value={formField.value as string | number}
                          />
                        )}
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="pt-8 flex gap-4">
            {isMultiStep && currentStep > 0 && (
              <Button type="button" onClick={prevStep}>
                <ChevronLeft className="mr-2 h-5 w-5" />
                Previous
              </Button>
            )}

            {!isLastStep ? (
              <Button type="button" onClick={nextStep}>
                Continue
                <ChevronRight className="h-6 w-6" />
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    {submitLabel}
                    <Zap className="h-6 w-6" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}