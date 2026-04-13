"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  Loader2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Field {
  label: string;
  type: 'text' | 'number' | 'email' | 'select' | 'checkbox' | 'textarea';
  required: boolean;
  options?: string[];
  placeholder?: string;
  logic?: {
    showIf?: {
      field: string;
      value: string;
    }
  }
}

interface Step {
  title: string;
  description: string;
  fields: Field[];
}

interface DynamicFormProps {
  steps: Step[];
  onSubmit: (data: Record<string, string | number | boolean>) => void;
  isSubmitting?: boolean;
}

export function DynamicForm({ steps, onSubmit, isSubmitting }: DynamicFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (stepIdx: number) => {
    const step = steps[stepIdx];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    step.fields.forEach((field, fIdx) => {
      const value = formData[`step-${stepIdx}-field-${fIdx}`];
      if (field.required && !value && value !== 0) {
        newErrors[`step-${stepIdx}-field-${fIdx}`] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onSubmit(formData);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (fieldKey: string, value: string | number | boolean | null) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: value as string | number | boolean }));
    if (errors[fieldKey]) {
      const newErrors = { ...errors };
      delete newErrors[fieldKey];
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar */}
      {steps.length > 1 && (
        <div className="flex gap-2">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                idx <= currentStep ? "bg-google-blue" : "bg-slate-100"
              )}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tighter text-slate-900 uppercase italic">
              {steps[currentStep].title}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="space-y-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            {steps[currentStep].fields.map((field, fIdx) => {
              const fieldKey = `step-${currentStep}-field-${fIdx}`;
              
              // Conditional Logic Check
              if (field.logic?.showIf) {
                const targetKey = field.logic.showIf.field;
                const targetValue = field.logic.showIf.value;
                const currentVal = formData[targetKey];
                
                if (currentVal !== targetValue) {
                  return null;
                }
              }

              return (
                <div key={fIdx} className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                    {field.label} {field.required && <span className="text-google-red">*</span>}
                  </Label>
                  
                  {field.type === 'textarea' ? (
                    <Textarea 
                      placeholder={field.placeholder}
                      value={String(formData[fieldKey] || "")}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      className="bg-white border-slate-200 rounded-2xl min-h-[100px] shadow-sm focus:ring-google-blue/20"
                    />
                  ) : field.type === 'select' ? (
                    <Select 
                      onValueChange={(val) => handleInputChange(fieldKey, val)}
                      value={String(formData[fieldKey] || "")}
                    >
                      <SelectTrigger className="h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-google-blue/20 px-6 font-bold uppercase transition-all">
                        <SelectValue placeholder="Select option..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                        {field.options?.map((opt, oIdx) => (
                          <SelectItem key={oIdx} value={opt} className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-3">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center space-x-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <Checkbox 
                        id={fieldKey}
                        checked={formData[fieldKey] === true}
                        onCheckedChange={(val) => handleInputChange(fieldKey, val)}
                        className="rounded-md border-slate-300"
                      />
                      <Label htmlFor={fieldKey} className="text-xs font-bold text-slate-600 uppercase cursor-pointer">
                        Confirm Selection
                      </Label>
                    </div>
                  ) : (
                    <Input 
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.type === 'number' ? (formData[fieldKey] as number) : String(formData[fieldKey] || "")}
                      onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                      className="h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:ring-google-blue/20 px-6 font-bold uppercase transition-all"
                    />
                  )}
                  
                  {errors[fieldKey] && (
                    <p className="text-[9px] font-black uppercase tracking-widest text-google-red ml-1">
                      {errors[fieldKey]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
          className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-900 transition-all disabled:opacity-30"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isSubmitting}
          className="h-14 px-10 bg-google-blue hover:bg-google-blue/90 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-google-blue/20 transition-all hover:scale-105 active:scale-95"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : currentStep < steps.length - 1 ? (
            <>Next Phase <ChevronRight className="ml-2 h-4 w-4" /></>
          ) : (
            <><CheckCircle2 className="h-4 w-4 mr-2" /> Final Registration</>
          )}
        </Button>
      </div>
    </div>
  );
}
