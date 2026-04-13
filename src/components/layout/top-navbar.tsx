"use client";

import { useAuth } from "@/store/use-auth";
import { 
  Bell, 
  Search, 
  UserCircle,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function TopNavbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b-2 border-slate-200 sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-google-blue transition-colors" />
          <Input 
            placeholder="Search events, exhibitors, or visitors..." 
            className="w-full h-11 pl-12 bg-slate-50 border-slate-100 rounded-xl font-medium text-sm focus:ring-google-blue/20 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="h-11 w-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-google-blue hover:bg-google-blue/5 transition-all relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-3 right-3 h-2 w-2 bg-google-red rounded-full border-2 border-white" />
        </button>

        <div className="h-10 w-px bg-slate-200" />

        <div className="flex items-center gap-4 pl-2 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 group-hover:text-google-blue transition-colors">{user?.name}</p>
            <p className="text-xs font-semibold text-google-blue/70">{user?.role}</p>
          </div>
          <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-google-blue/30 group-hover:shadow-lg group-hover:shadow-google-blue/10 relative">
            {user?.avatarUrl ? (
              <Image 
                src={user.avatarUrl} 
                alt={user.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <UserCircle className="h-7 w-7 text-slate-400" />
            )}
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-google-blue transition-transform group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
}
