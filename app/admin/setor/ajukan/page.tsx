"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminAjukanSetorRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/setor");
  }, [router]);

  return null;
}
