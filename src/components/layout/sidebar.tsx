"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  QrCode,
  BarChart3,
  UserCircle,
  LogOut,
  Zap,
  ShieldCheck,
  Compass
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { Button } from "@/components/ui/button";

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
  permissions?: string[];
  color?: string;
};

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'ORGANIZER', 'STAFF', 'EXHIBITOR'], color: 'text-google-blue' },
  { name: 'Event Calendar', href: '/events', icon: Calendar, roles: ['ORGANIZER', 'EXHIBITOR', 'VISITOR'], color: 'text-google-red' },
  { name: 'Discover Chapters', href: '/chapters', icon: Compass, roles: ['VISITOR', 'ORGANIZER'], color: 'text-google-blue' },
  { name: 'My Tickets', href: '/my-events', icon: Calendar, roles: ['VISITOR'], color: 'text-google-blue' },
  { name: 'Visitor Registry', href: '/visitors', icon: Users, roles: ['ORGANIZER', 'STAFF'], permissions: ['MANAGE_VISITORS'], color: 'text-google-green' },
  { name: 'Floor Plan', href: '/events/stalls', icon: Building2, roles: ['ORGANIZER'], color: 'text-google-yellow' },
  { name: 'Exhibitor Index', href: '/exhibitors', icon: Building2, roles: ['ORGANIZER'], color: 'text-google-yellow' },
  { name: 'Platform Reports', href: '/reports', icon: BarChart3, roles: ['ORGANIZER'], color: 'text-google-blue' },
  { name: 'Access Requests', href: '/admin/organizer-requests', icon: ShieldCheck, roles: ['ADMIN'], color: 'text-google-yellow' },
  { name: 'Exhibitor Leads', href: '/leads', icon: Users, roles: ['EXHIBITOR'], color: 'text-google-green' },
  { name: 'Manage My Booth', href: '/exhibitor/booth', icon: Building2, roles: ['EXHIBITOR', 'ORGANIZER'], color: 'text-google-yellow' },
  { name: 'Lead Capture Scanner', href: '/leads/scan', icon: QrCode, roles: ['EXHIBITOR'], color: 'text-google-red' },
  { name: 'Entry', href: '/scanner', icon: ShieldCheck, roles: ['ORGANIZER', 'STAFF', 'EXHIBITOR'], permissions: ['CHECK_IN_VISITORS'], color: 'text-google-red' },
  { name: 'My Profile', href: '/dashboard/profile', icon: UserCircle, roles: ['ADMIN', 'ORGANIZER', 'STAFF', 'EXHIBITOR', 'VISITOR'], color: 'text-google-blue' },
  { name: 'Form Templates ', href: '/admin/form-templates', icon: LayoutDashboard, roles: ['ADMIN'], color: 'text-google-blue' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const filteredNavigation = navigation.filter(item => {
    if (!user?.role) return false;

    // Check role inclusion
    const hasRole = item.roles.includes(user.role);

    // Check permission inclusion
    const hasPermission = item.permissions?.some(p => user.permissions?.includes(p));

    // Allow if they have the role OR the specific permission
    return hasRole || hasPermission;
  });

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r-2 border-slate-200">
      <div className="flex h-24 items-center px-8">
        <div className="flex items-center gap-3 group">
          <div className="bg-google-blue p-2 rounded-xl shadow-lg shadow-google-blue/20 group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900 uppercase">
            Visi<span className="text-google-blue">Track</span>
          </span>
        </div>
      </div>

      <div className="px-4 mb-6">
        <nav className="flex-1 space-y-1.5 pt-4">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:bg-white/60 hover:text-slate-900"
                )}
              >
                <div className="flex items-center">
                  <item.icon className={cn(
                    "mr-4 h-5 w-5 transition-colors",
                    isActive ? item.color : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  <span className="tracking-tight">
                    {item.href === '/exhibitor/booth' && (user?.role === 'ORGANIZER' || user?.role === 'STAFF') 
                      ? 'Stall Operations' 
                      : item.name}
                  </span>
                </div>
                {isActive && (
                  <div className={cn("w-1.5 h-1.5 rounded-full", item.color?.replace('text-', 'bg-'))} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200/60 shadow-premium group transition-all hover:border-google-blue/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
                {user?.avatarUrl ? (
                  <Image 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    fill 
                    className="object-cover"
                  />
                ) : (
                  <UserCircle className="h-8 w-8 text-slate-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-4 border-white rounded-full" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate leading-tight">{user?.name || 'Auth User'}</p>
              <p className="text-xs font-semibold text-google-blue">{user?.role || 'Guest'}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full h-10 justify-center font-medium text-sm text-slate-500 hover:text-google-red hover:bg-google-red/5 rounded-xl transition-all"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>


    </div>
  );
}
