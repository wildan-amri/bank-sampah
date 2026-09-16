"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Recycle,
  History,
  Gift,
  ArrowLeftRight,
  UserCircle,
  LogOut,
  Sparkles,
} from "lucide-react";
import { logout } from "@/lib/auth";
import toast from "react-hot-toast";

const menus = [
  {
    name: "Dashboard",
    href: "/nasabah/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Kategori Sampah",
    href: "/nasabah/kategori",
    icon: Recycle,
  },
  {
    name: "Setor Sampah",
    href: "/nasabah/setor",
    icon: History,
  },
  {
    name: "Katalog Hadiah",
    href: "/nasabah/hadiah",
    icon: Gift,
  },
  {
    name: "Penukaran Poin",
    href: "/nasabah/penukaran",
    icon: ArrowLeftRight,
  },
  {
    name: "Profil Saya",
    href: "/nasabah/profile",
    icon: UserCircle,
  },
];

export default function NasabahSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar.");
    router.push("/auth/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-emerald-500/30">
          <Recycle size={20} />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">
            Bank Sampah
          </h1>
          <p className="text-[11px] font-medium text-emerald-600">Panel Nasabah</p>
        </div>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {menus.map((menu) => {
          const Icon = menu.icon;
          const active =
            pathname === menu.href ||
            (menu.href !== "/nasabah/dashboard" && pathname.startsWith(menu.href));

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                active
                  ? "bg-emerald-50 text-emerald-700 shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} className={active ? "text-emerald-600" : "text-slate-400"} />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
        >
          <LogOut size={18} />
          <span>Keluar Akun</span>
        </button>
      </div>
    </aside>
  );
}