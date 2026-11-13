"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();

  // Login page doesn't need sidebar
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh-light">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") {
      window.location.href = "/admin";
    }
    return null;
  }

  return (
    <div className="flex min-h-screen bg-mesh-light">
      <AdminSidebar />
      <div className="flex-1 p-6 lg:p-10 overflow-auto">{children}</div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
