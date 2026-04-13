"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Settings2,
  CheckCircle2,
  Layout,
  Type,
  List,
  CheckSquare,
  Hash,
  Mail,
  ChevronRight,
  ChevronLeft,
  Loader2
} from "lucide-react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";

interface Field {
  id: string;
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
  id: string;
  title: string;
  description: string;
  fields: Field[];
}

interface FormBuilderProps {
  initialSteps?: Step[];
  onSave: (steps: Step[]) => void;
  isSaving?: boolean;
}

export function FormBuilder({ initialSteps = [], onSave, isSaving }: FormBuilderProps) {
  const [steps, setSteps] = useState<Step[]>(initialSteps.length ? initialSteps : [
    { id: 'step-1', title: 'Basic Information', description: 'Primary details for registration', fields: [] }
  ]);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const addStep = () => {
    const newStep: Step = {
      id: `step-${crypto.randomUUID()}`,
      title: 'New Step',
      description: 'Step detailed description',
      fields: []
    };
    setSteps([...steps, newStep]);
    setActiveStepIndex(steps.length);
  };

  const removeStep = (index: number) => {
    if (steps.length === 1) return;
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    setSteps(newSteps);
    setActiveStepIndex(Math.max(0, activeStepIndex - 1));
  };

  const addField = (type: Field['type']) => {
    const newSteps = [...steps];
    const newField: Field = {
      id: `field-${crypto.randomUUID()}`,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      type,
      required: false,
      options: type === 'select' ? ['Option 1'] : undefined,
      placeholder: `Enter ${type}...`
    };
    newSteps[activeStepIndex].fields.push(newField);
    setSteps(newSteps);
  };

  const updateField = (fieldId: string, updates: Partial<Field>) => {
    const newSteps = [...steps];
    const step = newSteps[activeStepIndex];
    const fieldIndex = step.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex > -1) {
      step.fields[fieldIndex] = { ...step.fields[fieldIndex], ...updates };
      setSteps(newSteps);
    }
  };

  const removeField = (fieldId: string) => {
    const newSteps = [...steps];
    newSteps[activeStepIndex].fields = newSteps[activeStepIndex].fields.filter(f => f.id !== fieldId);
    setSteps(newSteps);
  };

  const activeStep = steps[activeStepIndex];

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Sidebar: Steps Navigation & Field Adders */}
      <div className="w-full lg:w-80 space-y-8">
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Form Structure</p>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                  activeStepIndex === idx 
                    ? "bg-google-blue border-google-blue text-white shadow-lg shadow-google-blue/20" 
                    : "bg-white border-slate-100 text-slate-600 hover:border-google-blue/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                    activeStepIndex === idx ? "bg-white/20" : "bg-slate-100"
                  )}>
                    {idx + 1}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[120px]">{step.title}</span>
                </div>
                {activeStepIndex === idx && steps.length > 1 && (
                  <Trash2 
                    className="h-3.5 w-3.5 text-white/60 hover:text-white transition-colors" 
                    onClick={(e) => { e.stopPropagation(); removeStep(idx); }}
                  />
                )}
              </button>
            ))}
            <Button 
              variant="outline" 
              onClick={addStep}
              className="w-full h-12 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-google-blue hover:border-google-blue/30"
            >
              <Plus className="mr-2 h-3 w-3" /> Add New Step
            </Button>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Available Elements</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: 'text', icon: Type, label: 'Short Text' },
              { type: 'textarea', icon: Layout, label: 'Long Text' },
              { type: 'number', icon: Hash, label: 'Number' },
              { type: 'email', icon: Mail, label: 'Email' },
              { type: 'select', icon: List, label: 'Dropdown' },
              { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => addField(item.type as Field['type'])}
                className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl hover:border-google-blue/30 hover:shadow-sm transition-all group"
              >
                <item.icon className="h-5 w-5 text-slate-400 group-hover:text-google-blue mb-2" />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="flex-1 space-y-8 w-full">
        <Card className="bg-white border border-slate-200/60 rounded-[3rem] shadow-premium overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
            <div className="space-y-1">
              <Input 
                value={activeStep?.title || ""}
                onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[activeStepIndex].title = e.target.value;
                  setSteps(newSteps);
                }}
                className="text-2xl font-bold tracking-tighter border-none bg-transparent h-auto p-0 focus-visible:ring-0 uppercase italic text-slate-900"
              />
              <Input 
                value={activeStep?.description || ""}
                onChange={(e) => {
                  const newSteps = [...steps];
                  newSteps[activeStepIndex].description = e.target.value;
                  setSteps(newSteps);
                }}
                className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-none bg-transparent h-auto p-0 focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-google-green/10 flex items-center justify-center text-google-green">
                <Settings2 className="h-5 w-5" />
              </div>
            </div>
          </div>

          <CardContent className="p-10 min-h-[400px]">
            {activeStep.fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-slate-50 rounded-[2.5rem] opacity-30 space-y-4">
                 <Layout className="h-12 w-12" />
                 <p className="text-[10px] font-black uppercase tracking-[0.4em]">Empty State: Add Fields from Sidebar</p>
              </div>
            ) : (
              <Reorder.Group 
                axis="y" 
                values={activeStep.fields} 
                onReorder={(newFields) => {
                  const newSteps = [...steps];
                  newSteps[activeStepIndex].fields = newFields;
                  setSteps(newSteps);
                }}
                className="space-y-4"
              >
                {activeStep.fields.map((field) => (
                  <Reorder.Item 
                    key={field.id} 
                    value={field}
                    className="group bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:border-google-blue/20 transition-all cursor-default"
                  >
                    <div className="flex items-start gap-6">
                      <div className="mt-1 flex flex-col gap-2 items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                        <GripVertical className="h-4 w-4 text-slate-300" />
                      </div>
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-6">
                          <div className="flex-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Field Label</label>
                            <Input 
                              value={field.label || ""}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              className="h-12 px-6 rounded-xl bg-slate-50 border-slate-100 font-bold uppercase tracking-tight"
                            />
                          </div>
                          <div className="w-32">
                             <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Required</label>
                             <button
                                onClick={() => updateField(field.id, { required: !field.required })}
                                className={cn(
                                  "w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all font-black text-[9px] tracking-widest border",
                                  field.required 
                                    ? "bg-google-red/5 border-google-red/20 text-google-red" 
                                    : "bg-slate-50 border-slate-100 text-slate-400"
                                )}
                             >
                               {field.required ? 'YES' : 'NO'}
                             </button>
                          </div>
                        </div>

                        {field.type === 'select' && (
                          <div className="space-y-3 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Options Configuration</p>
                             <div className="flex flex-wrap gap-2">
                               {field.options?.map((opt, oIdx) => (
                                 <div key={oIdx} className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                                   <input 
                                     value={opt || ""}
                                     onChange={(e) => {
                                       const newOpts = [...(field.options || [])];
                                       newOpts[oIdx] = e.target.value;
                                       updateField(field.id, { options: newOpts });
                                     }}
                                     className="text-xs font-bold uppercase outline-none w-24"
                                   />
                                   <Trash2 
                                      className="h-3 w-3 text-slate-300 hover:text-google-red cursor-pointer" 
                                      onClick={() => {
                                        const newOpts = (field.options || []).filter((_, i) => i !== oIdx);
                                        updateField(field.id, { options: newOpts });
                                      }}
                                   />
                                 </div>
                               ))}
                               <Button 
                                  variant="ghost" 
                                  className="h-9 px-4 rounded-lg border border-dashed border-slate-300 text-[10px] font-black uppercase tracking-widest"
                                  onClick={() => updateField(field.id, { options: [...(field.options || []), 'New Option'] })}
                               >
                                 <Plus className="h-3 w-3 mr-2" /> Add
                               </Button>
                             </div>
                          </div>
                        )}

                        {/* Conditional Logic UI */}
                        <div className="space-y-4 p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                           <div className="flex items-center justify-between">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Visibility Logic (Adaptive Flow)</p>
                              <Button 
                                variant="ghost" 
                                className="h-6 text-[8px] font-bold uppercase text-google-blue"
                                onClick={() => {
                                  if (field.logic?.showIf) {
                                    updateField(field.id, { logic: undefined });
                                  } else {
                                    updateField(field.id, { logic: { showIf: { field: '', value: '' } } });
                                  }
                                }}
                              >
                                {field.logic?.showIf ? 'Remove Logic' : '+ Add showIf Rule'}
                              </Button>
                           </div>
                           
                           {field.logic?.showIf && (
                             <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                               <div>
                                 <label className="text-[8px] font-bold uppercase text-slate-400 mb-1 block">Target Field ID/Key</label>
                                 <Input 
                                   placeholder="e.g. step-0-field-1"
                                   value={field.logic.showIf.field || ""}
                                   onChange={(e) => updateField(field.id, { 
                                     logic: { ...field.logic, showIf: { ...field.logic!.showIf!, field: e.target.value } } 
                                   })}
                                   className="h-10 bg-white border-slate-200 rounded-lg text-[10px] font-bold"
                                 />
                               </div>
                               <div>
                                 <label className="text-[8px] font-bold uppercase text-slate-400 mb-1 block">Expected Value</label>
                                 <Input 
                                   placeholder="e.g. YES"
                                   value={field.logic.showIf.value || ""}
                                   onChange={(e) => updateField(field.id, { 
                                     logic: { ...field.logic, showIf: { ...field.logic!.showIf!, value: e.target.value } } 
                                   })}
                                   className="h-10 bg-white border-slate-200 rounded-lg text-[10px] font-bold"
                                 />
                               </div>
                             </div>
                           )}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-google-red/5 hover:text-google-red"
                        onClick={() => removeField(field.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex justify-between items-center p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-premium">
          <div className="flex gap-4">
            <Button
               variant="ghost"
               onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
               disabled={activeStepIndex === 0}
               className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Step
            </Button>
            <Button
               variant="ghost"
               onClick={() => setActiveStepIndex(Math.min(steps.length - 1, activeStepIndex + 1))}
               disabled={activeStepIndex === steps.length - 1}
               className="h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest disabled:opacity-30"
            >
              Next Step <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Button 
            onClick={() => onSave(steps)}
            disabled={isSaving}
            className="h-14 px-10 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
            Confirm Form Architecture
          </Button>
        </div>
      </div>
    </div>
  );
}
