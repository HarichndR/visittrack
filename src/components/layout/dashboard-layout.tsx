"use client";

import { Sidebar } from "./sidebar";
import { TopNavbar } from "./top-navbar";
import { StaticNavbar } from "../static/navbar";
import { useAuth } from "@/store/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
  isPublic = false,
  allowedRoles,
}: {
  children: React.ReactNode;
  isPublic?: boolean;
  allowedRoles?: string[];
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensuring we only set hydrated once to avoid cascading renders
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!user && !isPublic) {
        router.push("/login");
      } else if (user?.mustChangePassword && window.location.pathname !== '/setup-password') {
        router.push("/setup-password");
      } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
        router.push("/dashboard");
      }
    }
  }, [user, router, isHydrated, isPublic, allowedRoles]);

  if (!isHydrated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
           <div className="h-12 w-12 border-4 border-google-blue border-t-transparent rounded-full animate-spin" />
           <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Loading Configuration...</p>
        </div>
      </div>
    );
  }

  if (!user && !isPublic) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {user && <Sidebar />}
      <main className="flex-1 flex flex-col overflow-hidden">
        {user ? (
          <>
            <TopNavbar />
            <div className="flex-1 overflow-y-auto p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <StaticNavbar />
            <div className="pt-24 p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
