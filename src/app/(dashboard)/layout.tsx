// src/app/(dashboard)/layout.tsx

"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { SidebarProvider, useSidebar } from "@/shared/context/SidebarContext";

import AppHeader from "@/shared/components/layout/AppHeader";
import AppSidebar from "@/shared/components/layout/AppSidebar";
import Backdrop from "@/shared/components/layout/Backdrop";

function DashboardContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      <AppSidebar />
      <Backdrop />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}
      >
        <AppHeader />

        <main className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.replace("/signin");
    }
  }, [hasHydrated, token, router]);

  if (!hasHydrated) {
    return null;
  }

  if (!token) {
    return null;
  }

  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}