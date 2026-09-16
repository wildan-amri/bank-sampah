"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserCircle, LogOut, Shield, User } from "lucide-react";
import { getUser, getRole, logout } from "@/lib/auth";
import toast from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("Pengguna");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const user = getUser();
    const storedRole = getRole();

    if (storedRole === "NASABAH") {
      setUsername(user?.nasabah?.namaNasabah || user?.username || "Nasabah");
    } else if (storedRole === "ADMIN") {
      setUsername(user?.adminBank?.namaPengelola || user?.adminBank?.namaUnit || user?.username || "Admin");
    } else {
      setUsername(user?.username || "Pengguna");
    }

    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar.");
    router.push("/auth/login");
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <h2 className="font-bold text-slate-800 text-base sm:text-lg tracking-tight">
          Bank Sampah <span className="text-emerald-600">Digital</span>
        </h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold text-sm border border-emerald-200">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {username}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {role === "ADMIN" ? (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                  <Shield size={10} /> Admin Unit
                </span>
              ) : (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  <User size={10} /> Nasabah
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Keluar"
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}