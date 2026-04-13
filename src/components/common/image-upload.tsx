"use client";

import { useState, useRef } from "react";
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Loader2, 
  CheckCircle2,
  AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/services/api";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  description?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner";
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  label,
  description,
  className,
  aspectRatio = "video"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("Image size must be less than 5MB.");
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const url = response.data.data.url;
      onChange(url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const ratioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[21/9]"
  };

  return (
    <div className={cn("space-y-4", className)}>
      {(label || description) && (
        <div className="space-y-1">
          {label && <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>}
          {description && <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest ml-1">{description}</p>}
        </div>
      )}

      <div 
        className={cn(
          "relative group overflow-hidden border-2 border-dashed rounded-[2.5rem] transition-all duration-500",
          ratioClasses[aspectRatio],
          value ? "border-google-blue/20 bg-slate-50" : "border-slate-100 bg-slate-50/50 hover:border-google-blue/30 hover:bg-slate-50",
          error && "border-google-red/20 bg-google-red/[0.02]"
        )}
      >
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full h-full"
            >
              <Image 
                src={value} 
                alt="Upload preview" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 bg-white text-slate-900 rounded-xl hover:scale-110 transition-transform shadow-xl"
                  title="Change Image"
                >
                  <Upload className="h-5 w-5" />
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="p-3 bg-google-red text-white rounded-xl hover:scale-110 transition-transform shadow-xl"
                    title="Remove Image"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="placeholder"
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400 group-hover:text-google-blue transition-colors"
            >
              <div className="p-5 bg-white rounded-3xl shadow-premium group-hover:shadow-google-blue/10 transition-all group-hover:scale-110 border border-slate-100">
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <ImageIcon className="h-8 w-8" />
                )}
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-widest">
                  {isUploading ? "Uploading Identity..." : "Select Visual Asset"}
                </p>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-40 mt-1 italic">
                  PNG, JPG or WebP • Max 5MB
                </p>
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {isUploading && (
           <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center p-8">
              <div className="w-full max-w-[200px] space-y-3">
                 <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-google-blue"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                 </div>
                 <p className="text-[8px] font-black uppercase tracking-[0.2em] text-google-blue text-center">Syncing with CloudNode...</p>
              </div>
           </div>
        )}

        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-google-red/10 border border-google-red/20 backdrop-blur-md p-3 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
            <AlertCircle className="h-4 w-4 text-google-red shrink-0" />
            <p className="text-[9px] font-black uppercase tracking-tight text-google-red">{error}</p>
          </div>
        )}
      </div>

      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}
