"use client";

import { usePathname } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav = pathname !== "/login" && pathname !== "/" && pathname !== "/market";

  return (
    <>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,185,129,0.08),_transparent_50%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(251,191,36,0.05),_transparent_50%)] pointer-events-none z-0" />
      <main className="relative z-10 min-h-screen pb-20">
        {children}
      </main>
      {showBottomNav && <BottomNavigation />}
    </>
  );
}
