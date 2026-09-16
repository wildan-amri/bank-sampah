"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NasabahSidebar from "@/components/layout/NasabahSidebar";
import Navbar from "@/components/layout/Navbar";
import { getToken, getRole, getAppKey } from "@/lib/auth";

export default function NasabahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const appKey = getAppKey();
    const token = getToken();
    const role = getRole();

    if (!appKey) {
      router.push("/");
      return;
    }

    if (!token) {
      router.push("/auth/login");
      return;
    }

    if (role !== "NASABAH") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
        Memeriksa hak akses nasabah...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <NasabahSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}